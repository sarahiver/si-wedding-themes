// RSVP-Durchlauf je Theme gegen den echten API-Code. Aufruf: node rsvp.js <label> [theme,...]
const { chromium } = require('playwright'); const fs = require('fs'); const { THEMES, pid } = require('./fixtures');
const label = process.argv[2] || 'run'; const only = process.argv[3] ? process.argv[3].split(',') : THEMES;
const BASE = 'http://localhost:4310'; const PH = fs.readFileSync(__dirname + '/placeholder.jpg');
const j = async (p, body) => (await fetch(BASE + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })).json();
(async () => {
  await j('/__test/reset'); const browser = await chromium.launch(); const out = [];
  for (const theme of only) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', locale: 'de-DE' });
    const page = await ctx.newPage(); const calls = []; const r = { theme, status: 'ok' };
    await page.route(u => !u.href.startsWith(BASE), rt => (rt.request().resourceType() === 'image' ? rt.fulfill({ status: 200, contentType: 'image/jpeg', headers: { 'access-control-allow-origin': '*' }, body: PH }) : rt.abort()));
    page.on('request', q => { if (q.url().endsWith('/api/db') || q.url().endsWith('/api/notify')) { try { calls.push({ url: q.url().replace(BASE, ''), body: JSON.parse(q.postData() || '{}') }); } catch {} } });
    try {
      await page.goto(`${BASE}/base-${theme}`, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(2500);
      const hasSection = await page.locator('#rsvp').count() > 0;
      if (!hasSection) { // Parallax: Zusage öffnet sich über das Wort RSVP
        r.opened = await page.evaluate(() => { const all = [...document.querySelectorAll('body *')].filter(e => e.textContent.trim().toUpperCase() === 'RSVP'); const el = all[all.length - 1]; if (!el) return document.body.innerText.slice(0, 300); el.click(); return true; });
        await page.waitForTimeout(2000);
      }
      const scope = hasSection ? page.locator('#rsvp').first() : page.locator('body');
      const email = scope.locator('input[type="email"]').first();
      const done = () => calls.some(c => c.body.action === 'submitRSVP');
      const vis = async (loc) => (await loc.count()) > 0 && await loc.first().isVisible().catch(() => false);
      const clickText = async (re) => {
        const btn = scope.locator('button, a').filter({ hasText: re }).filter({ visible: true }).first();
        if (await btn.count() === 0) return null;
        if (await btn.isDisabled().catch(() => false)) return null;
        const t = (await btn.textContent()).trim().slice(0, 40);
        await btn.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
        await btn.click({ timeout: 5000 }); return t;
      };
      r.steps = [];
      // Formular erreichen: manche Themes öffnen die Zusage erst über einen Knopf
      const mail = `gast-${theme}@example.test`;
      for (let i = 0; i < 8 && !done(); i++) {
        if (await vis(email) && !(await email.inputValue())) {
          await email.scrollIntoViewIfNeeded({ timeout: 4000 }).catch(() => {});
          const nameHandle = await email.evaluateHandle((el) => {
            const box = el.closest('form') || el.closest('section') || document.body;
            const inputs = [...box.querySelectorAll('input')].filter(x => ['text', ''].includes(x.getAttribute('type') || ''));
            const before = inputs.filter(x => x.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
            return before[before.length - 1] || inputs[0];
          });
          await nameHandle.asElement().fill('Test Gast'); await email.fill(mail); r.steps.push('name+mail');
        }
        const yes = await clickText(/^\s*(✓\s*)?(ja[, ]|yes|hell yeah|i.?m in|accept)/i); if (yes && !r.steps.includes('ja:' + yes)) r.steps.push('ja:' + yes);
        const sub = scope.locator('button[type="submit"]').filter({ visible: true }).first();
        let t = null;
        if (await sub.count() && !(await sub.isDisabled().catch(() => false))) { t = (await sub.textContent()).trim().slice(0, 40); await sub.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {}); await sub.click({ timeout: 5000 }); }
        else t = await clickText(/weiter|next|continue|absenden|submit|senden/i);
        r.steps.push('klick:' + t);
        await page.waitForTimeout(1300);
      }
      if (!done()) throw new Error('submitRSVP wurde nicht ausgelöst');
      await page.waitForTimeout(1500);
    } catch (e) { r.status = 'FEHLER: ' + String(e.message).split('\n')[0].slice(0, 150); }
    const sub = calls.find(c => c.body.action === 'submitRSVP');
    r.actions = calls.map(c => c.body.action || c.url + ':' + c.body.type).filter(a => !/^getProject|checkPassword/.test(a));
    r.payloadKeys = sub ? Object.keys(sub.body.params.rsvpData).sort() : null;
    r.payload = sub ? sub.body.params.rsvpData : null;
    const db = await (await fetch(BASE + '/__test/db')).json();
    const row = (db.rsvp_responses || []).find(x => x.email === `gast-${theme}@example.test`);
    r.stored = row ? { project_ok: row.project_id === pid(THEMES.indexOf(theme) + 1), persons: row.persons, attending: row.attending, columns: Object.keys(row).sort() } : null;
    r.confirmationVisible = await page.evaluate(() => /dank|thank|erhalten|received|gespeichert|bis bald/i.test(document.body.innerText)).catch(() => null);
    out.push(r); await ctx.close();
  }
  const ob = await (await fetch(BASE + '/__test/outbox')).json();
  await browser.close();
  fs.mkdirSync('results', { recursive: true });
  fs.writeFileSync(`results/rsvp-${label}.json`, JSON.stringify({ themes: out, mails: ob.outbox.map(m => ({ to: m.body.to, subject: m.body.subject })), blocked: ob.blocked }, null, 1));
  for (const r of out) console.log(`${r.theme.padEnd(13)} ${r.status} | gespeichert=${!!r.stored} projekt=${r.stored && r.stored.project_ok} personen=${r.stored && r.stored.persons} zusage=${r.stored && r.stored.attending} dank=${r.confirmationVisible} | ${(r.actions || []).join(',')}`);
  console.log('Mails an Paar:', ob.outbox.length, '| gesperrte Netzaufrufe des Servers:', ob.blocked.length);
})();
