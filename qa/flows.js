// Vorschau/Passwort und Dashboard-Speichern. Aufruf: node flows.js <label>
const { chromium } = require('playwright'); const fs = require('fs'); const { THEMES, pid } = require('./fixtures');
const label = process.argv[2] || 'run'; const BASE = 'http://localhost:4310'; const PH = fs.readFileSync(__dirname + '/placeholder.jpg');
const api = async (action, params, token) => { const r = await fetch(BASE + '/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify({ action, params }) }); return { status: r.status, body: await r.json().catch(() => null) }; };
const dbDump = async () => (await fetch(BASE + '/__test/db')).json();
let ipN = 10; const results = []; const ok = (name, pass, info = '') => { results.push({ name, pass: !!pass, info: String(info).slice(0, 160) }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (pass ? '' : ' :: ' + String(info).slice(0, 200))); };
async function newPage(browser, vp = { width: 1280, height: 900 }) {
  ipN += 1; const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce', locale: 'de-DE', extraHTTPHeaders: { 'x-forwarded-for': `10.0.0.${ipN}` } }); const page = await ctx.newPage();
  await page.route(u => !u.href.startsWith(BASE), rt => (rt.request().resourceType() === 'image' ? rt.fulfill({ status: 200, contentType: 'image/jpeg', headers: { 'access-control-allow-origin': '*' }, body: PH }) : rt.abort()));
  const calls = []; page.on('request', q => { if (q.url().endsWith('/api/db')) { try { calls.push(JSON.parse(q.postData())); } catch {} } });
  return { ctx, page, calls };
}
(async () => {
  await fetch(BASE + '/__test/reset', { method: 'POST' }); const browser = await chromium.launch();
  // ---------- Vorschau / Coming Soon ----------
  { const { ctx, page, calls } = await newPage(browser);
    await page.goto(BASE + '/base-draft', { waitUntil: 'load' }); await page.waitForTimeout(3000);
    const txt = await page.evaluate(() => document.body.innerText);
    ok('Entwurf zeigt Coming Soon statt Inhalt', /coming soon|bald|demnächst|in kürze/i.test(txt) && !/Zusage/.test(txt), txt.slice(0, 120));
    ok('Entwurf: Browser fragt keine Inhalte ab', !calls.some(c => c.action === 'getProjectContent'), calls.map(c => c.action).join(','));
    await ctx.close(); }
  let r = await api('getProjectContent', { projectId: pid(50) });
  ok('API: Inhalte eines Entwurfs bleiben gesperrt', r.body && r.body.locked === true && Object.keys(r.body.data || {}).length === 0, JSON.stringify(r.body));
  r = await api('submitRSVP', { projectId: pid(50), rsvpData: { name: 'x', email: 'x@example.test', attending: true } });
  ok('API: RSVP an Entwurf wird abgelehnt (423)', r.status === 423, r.status);
  r = await api('verifyPreviewPassword', { slug: 'base-draft', password: 'falsch' }); ok('API: falsches Vorschau-Passwort abgelehnt', r.body && r.body.success === false && !r.body.token, JSON.stringify(r.body));
  r = await api('verifyPreviewPassword', { slug: 'base-draft', password: 'preview-test' }); const prev = r.body && r.body.token;
  ok('API: richtiges Vorschau-Passwort liefert Zugang', !!prev);
  r = await api('getProjectBySlugOrDomain', { slugOrDomain: 'base-draft' }, prev); ok('API: Vorschau-Zugang öffnet den Entwurf', r.body && r.body.access && r.body.access.locked === false, JSON.stringify(r.body && r.body.access));
  // ---------- Passwortseite ----------
  { const { ctx, page, calls } = await newPage(browser, { width: 390, height: 844 });
    await page.goto(BASE + '/base-locked', { waitUntil: 'load' });
    const pw = page.locator('input[type="password"]').first(); await pw.waitFor({ timeout: 20000 });
    ok('Passwortseite erscheint', true);
    const box = await pw.boundingBox(); ok('Passwortfeld passt in die Handybreite', box && box.x >= 0 && box.x + box.width <= 390, JSON.stringify(box));
    await pw.fill('falsch'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
    ok('Falsches Gäste-Passwort öffnet nichts', await pw.count() === 1);
    await pw.fill('gast-test'); await page.keyboard.press('Enter'); await page.waitForTimeout(4000);
    const txt = await page.evaluate(() => document.body.innerText);
    ok('Richtiges Gäste-Passwort zeigt die Seite ohne Neuladen', await page.locator('input[type="password"]').count() === 0 && txt.length > 800, txt.length);
    ok('Nach dem Passwort werden die Inhalte geladen', calls.filter(c => c.action === 'getProjectContent').length >= 1);
    await ctx.close(); }
  // ---------- Dashboard je Theme ----------
  for (const theme of THEMES) {
    const { ctx, page, calls } = await newPage(browser); const slug = `base-${theme}`; const title = `Baseline ${theme}`;
    // Parallax hat im Countdown-Editor kein Textfeld – dort wird der Ablauf-Editor geprüft
    const [navRe, comp] = theme === 'parallax' ? [/Ablauf/, 'timeline'] : [/Countdown/, 'countdown'];
    try {
      await page.goto(`${BASE}/${slug}/admin`, { waitUntil: 'load' });
      const pw = page.locator('input[type="password"]').first(); await pw.waitFor({ timeout: 25000 });
      await pw.fill('admin-test'); await page.keyboard.press('Enter');
      const nav = page.locator('aside button, nav button').filter({ hasText: navRe }).first(); await nav.waitFor({ timeout: 20000 });
      const navItems = (await page.locator('aside button').allTextContents()).map(t => t.replace(/[^\p{L}\p{N}:& -]/gu, '').trim()).filter(Boolean);
      await nav.click(); const input = page.locator('main input[type="text"], main input:not([type])').first(); await input.waitFor({ timeout: 10000 });
      await input.fill(title);
      await Promise.all([
        page.waitForResponse(x => x.url().endsWith('/api/db') && (x.request().postData() || '').includes('updateProjectContent'), { timeout: 12000 }),
        page.locator('main button').filter({ hasText: /Speichern/ }).first().click(),
      ]);
      await page.waitForTimeout(800);
      const save = calls.find(c => c.action === 'updateProjectContent');
      const row = ((await dbDump()).project_content || []).find(x => x.project_id === pid(THEMES.indexOf(theme) + 1) && x.component === comp);
      ok(`Dashboard ${theme}: Anmeldung und Menü (${navItems.length} Einträge)`, navItems.length >= 8, navItems.join('|'));
      ok(`Dashboard ${theme}: Speichern legt Inhalt im richtigen Projekt ab`, save && save.params.component === comp && row && row.content.title === title, JSON.stringify(row || save));
      await page.reload({ waitUntil: 'load' }); const nav2 = page.locator('aside button, nav button').filter({ hasText: navRe }).first(); await nav2.waitFor({ timeout: 20000 }); await nav2.click();
      const v = await page.locator('main input[type="text"], main input:not([type])').first().inputValue();
      ok(`Dashboard ${theme}: Wert bleibt nach Neuladen erhalten`, v === title, v);
      // RSVP-Antworten des Paares: eigene sichtbar, fremde nicht
      const rsvpNav = page.locator('aside button').filter({ hasText: /RSVP/ }).first(); await rsvpNav.click(); await page.waitForTimeout(1200);
      const body = await page.evaluate(() => document.body.innerText);
      ok(`Dashboard ${theme}: fremde RSVP-Antwort ist nicht sichtbar`, !/Fremder Gast/.test(body));
      fs.mkdirSync(`results/nav-${label}`, { recursive: true }); fs.writeFileSync(`results/nav-${label}/${theme}.json`, JSON.stringify(navItems));
    } catch (e) { ok(`Dashboard ${theme}: Ablauf`, false, String(e.message).split('\n')[0]); }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(`results/flows-${label}.json`, JSON.stringify(results, null, 1));
  console.log(`\n${results.filter(x => x.pass).length} von ${results.length} bestanden`);
})();
