// Ansicht des Cassis-Themes mit Beispielinhalten. Aufruf: node cassis-view.js <label> [sprache]
const { chromium } = require('playwright'); const fs = require('fs');
const { seedCassis, routeAssets, BASE } = require('./cassis-seed'); const { routeFonts } = require('./fonts');
const label = process.argv[2] || 'view'; const lang = process.argv[3] || 'de';
(async () => {
  await seedCassis(); fs.mkdirSync(`shots/${label}`, { recursive: true });
  const browser = await chromium.launch();
  for (const [vp, size] of Object.entries({ mobile: { width: 390, height: 844 }, small: { width: 320, height: 640 }, desktop: { width: 1440, height: 900 } })) {
    const ctx = await browser.newContext({ viewport: size, reducedMotion: 'reduce', deviceScaleFactor: vp === 'mobile' ? 2 : 1, locale: lang, timezoneId: 'Europe/Berlin' });
    const page = await ctx.newPage(); await page.clock.setFixedTime(new Date('2026-11-16T10:00:00Z')); await routeFonts(page); await routeAssets(page);
    await page.goto(`${BASE}/lena-tom`, { waitUntil: 'networkidle', timeout: 45000 }); await page.waitForTimeout(2500);
    const hh = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < hh; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); } await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
    await page.screenshot({ path: `shots/${label}/cassis-${vp}-${lang}.png`, fullPage: true, animations: 'disabled' });
    console.log(vp, 'ok'); await ctx.close();
  }
  await browser.close();
})();
