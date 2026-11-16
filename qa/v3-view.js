// Ansichten für die Abnahme von V3. Aufruf: node v3-view.js <label>
const { chromium } = require('playwright'); const fs = require('fs');
const { seedCassis, routeAssets, BASE } = require('./cassis-seed');
const label = process.argv[2] || 'v3';
(async () => {
  await seedCassis(); fs.mkdirSync(`shots/${label}`, { recursive: true }); const browser = await chromium.launch();
  const shot = async (name, vp, locale, fn, full) => { const ctx = await browser.newContext({ viewport: vp, locale, deviceScaleFactor: vp.width < 500 ? 2 : 1 }); const page = await ctx.newPage(); await routeAssets(page);
    await page.goto(`${BASE}/lena-tom`, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500); if (fn) await fn(page); await page.waitForTimeout(700);
    // Aufnahme eines ganzen Bereichs: die fixierte Kopfzeile würde sonst mitten im Bild erscheinen
    if (full) await page.addStyleTag({ content: 'header[data-solid]{display:none !important}' });
    if (full) await page.locator(full).screenshot({ path: `shots/${label}/${name}.png` }); else await page.screenshot({ path: `shots/${label}/${name}.png` }); await ctx.close(); };
  const fill = async (p) => { const f = p.locator('#rsvp'); await p.evaluate(() => document.getElementById('rsvp').scrollIntoView()); await p.waitForTimeout(700);
    await f.locator('input[name="name"]').fill('Dana Yılmaz'); await f.locator('input[name="email"]').fill('dana@example.test'); await f.locator('button[aria-pressed]').first().click();
    await f.locator('[role="group"] button').last().click(); await f.locator('[role="group"] button').last().click(); await p.waitForTimeout(300);
    await f.locator('fieldset[data-person="1"] select').selectOption('vegan');
    const b2 = f.locator('fieldset[data-person="2"]'); await b2.locator('input').first().fill('Eli Yılmaz'); await b2.locator('select').selectOption('other'); await b2.locator('input[data-field="diet_note"]').fill('kein Fisch'); await b2.locator('input[data-field="allergies"]').fill('Nüsse, Laktose');
    const b3 = f.locator('fieldset[data-person="3"]'); await b3.locator('input').first().fill('Fee'); await b3.locator('input[type="checkbox"]').check(); await b3.locator('input[type="number"]').fill('4'); await b3.locator('select').selectOption('vegetarian'); };
  for (const [n, vp] of [['390', { width: 390, height: 844 }], ['1440', { width: 1440, height: 900 }], ['1920', { width: 1920, height: 1080 }]]) {
    await shot(`start-${n}`, vp, 'de');
    await shot(`ablauf-${n}`, vp, 'de', async (p) => { await p.evaluate(() => { window.scrollTo(0, document.getElementById('timeline').offsetTop - 64); }); await p.waitForTimeout(1500); });
    await shot(`rsvp-${n}`, vp, 'de', fill, '#rsvp');
  }
  await shot('rsvp-fehler-1440', { width: 1440, height: 900 }, 'de', async (p) => { await fill(p); await p.locator('#rsvp input[name="email"]').fill('dana@example'); await p.locator('#rsvp button[type="submit"]').click(); await p.waitForTimeout(500); await p.evaluate(() => window.scrollTo(0, document.getElementById('rsvp').offsetTop - 64)); });
  await shot('rsvp-einwilligung-390', { width: 390, height: 844 }, 'de', async (p) => { await fill(p); await p.locator('#rsvp button[type="submit"]').click(); await p.waitForTimeout(600); });
  for (const l of ['en', 'fr', 'tr']) await shot(`sprache-${l}-1440`, { width: 1440, height: 900 }, l, async (p) => { await p.evaluate(() => { window.scrollTo(0, document.getElementById('countdown').offsetTop - 64); }); await p.waitForTimeout(1200); });
  for (const l of ['fr', 'tr']) await shot(`rsvp-${l}-390`, { width: 390, height: 844 }, l, fill, '#rsvp');
  await browser.close();
})();
