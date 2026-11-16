// Screenshots aller Themes. Aufruf: node shots.js <label> [theme,...]
const { chromium } = require('playwright'); const fs = require('fs'); const { THEMES } = require('./fixtures');
const PH = fs.readFileSync(__dirname + '/placeholder.jpg');
const label = process.argv[2] || 'run'; const only = process.argv[3] ? process.argv[3].split(',') : THEMES;
const BASE = 'http://localhost:4310'; const VPS = { mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
(async () => {
  fs.mkdirSync(`shots/${label}`, { recursive: true });
  const browser = await chromium.launch(); const report = [];
  for (const theme of only) for (const [vp, size] of Object.entries(VPS)) {
    const ctx = await browser.newContext({ viewport: size, reducedMotion: 'reduce', deviceScaleFactor: 1, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
    const page = await ctx.newPage(); const errors = [];
    await page.clock.setFixedTime(new Date('2026-11-16T10:00:00Z'));
    // Fremde Server sperren: Bilder und Schriften von außen würden das Ergebnis vom Netz abhängig machen
    await page.route(u => !u.href.startsWith(BASE), r => {
      // Bilder von außen durch ein graues Platzhalterbild ersetzen, alles andere sperren
      if (r.request().resourceType() === 'image' || /\.(jpe?g|png|webp)(\?|$)|images\.unsplash|res\.cloudinary\.com\/[^/]+\/image/.test(r.request().url())) return r.fulfill({ status: 200, contentType: 'image/jpeg', headers: { 'access-control-allow-origin': '*' }, body: PH });
      return r.abort();
    });
    page.on('pageerror', e => errors.push('pageerror: ' + String(e.message).slice(0, 160)));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push('console: ' + m.text().slice(0, 160)); });
    let status = 'ok'; const T0 = Date.now();
    try {
      await page.goto(`${BASE}/base-${theme}`, { waitUntil: 'load', timeout: 45000 });
      await page.waitForFunction(() => document.body.innerText.length > 100, null, { timeout: 20000 });
      await page.waitForTimeout(2500);
      // Demo-/Cookie-Einblendungen gibt es hier nicht; einmal ganz nach unten, damit Nachlade-Bereiche erscheinen
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < Math.min(h, 40000); y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(40); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `shots/${label}/${theme}-${vp}.png`, fullPage: true, animations: 'disabled' });
    } catch (e) { status = 'FEHLER: ' + String(e.message).slice(0, 140); }
    const info = await Promise.race([page.evaluate(() => ({ h: document.documentElement.scrollHeight, sections: document.querySelectorAll('section').length, text: document.body.innerText.length })), new Promise(r => setTimeout(() => r({}), 5000))]).catch(() => ({}));
    report.push({ theme, vp, status, ...info, errors: [...new Set(errors)].slice(0, 5) });
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(`shots/${label}/report.json`, JSON.stringify(report, null, 1));
  for (const r of report) console.log(`${r.theme.padEnd(13)} ${r.vp.padEnd(8)} ${r.status} h=${r.h} sections=${r.sections} text=${r.text} errors=${r.errors.length}${r.errors.length ? ' | ' + r.errors[0] : ''}`);
})();
