// Ansichten der Kopfzeile: über dem Foto, nach dem Scrollen, Handy-Menü offen. Aufruf: node nav-view.js <label>
const { chromium } = require('playwright'); const fs = require('fs');
const { seedCassis, routeAssets, BASE } = require('./cassis-seed'); const { routeFonts } = require('./fonts');
const label = process.argv[2] || 'nav';
(async () => {
  await seedCassis(); fs.mkdirSync(`shots/${label}`, { recursive: true }); const browser = await chromium.launch();
  const shot = async (name, vp, fn) => { const ctx = await browser.newContext({ viewport: vp, locale: 'de', deviceScaleFactor: vp.width < 500 ? 2 : 1 }); const page = await ctx.newPage(); await routeFonts(page); await routeAssets(page);
    await page.goto(`${BASE}/lena-tom`, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500); if (fn) await fn(page); await page.waitForTimeout(700); await page.screenshot({ path: `shots/${label}/${name}.png` }); await ctx.close(); };
  await shot('d-top', { width: 1440, height: 900 });
  await shot('w-top', { width: 1920, height: 1080 });
  await shot('d-scrolled', { width: 1440, height: 900 }, (p) => p.evaluate(() => { document.querySelector('#countdown').scrollIntoView(); }));
  await shot('d-timeline', { width: 1440, height: 900 }, (p) => p.locator('header nav a[href="#timeline"]').click());
  await shot('d-rsvp', { width: 1440, height: 900 }, async (p) => { await p.locator('header nav a[href="#rsvp"]').click(); await p.waitForTimeout(900); await p.locator('#rsvp button[aria-pressed]').first().click(); });
  await shot('m-top', { width: 390, height: 844 });
  await shot('m-menu', { width: 390, height: 844 }, (p) => p.locator('header button[aria-controls]').last().click());
  await shot('m-lang', { width: 390, height: 844 }, (p) => p.locator('header button[aria-haspopup]').click());
  await shot('m-rsvp', { width: 390, height: 844 }, async (p) => { await p.evaluate(() => document.querySelector('#rsvp').scrollIntoView()); await p.waitForTimeout(600); await p.locator('#rsvp button[aria-pressed]').first().click(); });
  await shot('t-768', { width: 768, height: 1024 });
  await browser.close();
})();
