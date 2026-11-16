// Prüfungen für das Cassis-Theme. Aufruf: node cassis.js <label>
const { chromium } = require('playwright'); const fs = require('fs');
const { seedCassis, routeAssets, BASE, PID } = require('./cassis-seed'); const { routeFonts } = require('./fonts'); const { pid } = require('./fixtures');
const label = process.argv[2] || 'run';
const results = []; const ok = (name, pass, info = '') => { results.push({ name, pass: !!pass, info: String(info).slice(0, 200) }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (pass ? '' : ' :: ' + String(info).slice(0, 240))); };
const db = async () => (await fetch(BASE + '/__test/db')).json();
const outbox = async () => (await (await fetch(BASE + '/__test/outbox')).json());
const rsvps = async (p = PID) => ((await db()).rsvp_responses || []).filter((r) => r.project_id === p);
let ipN = 100;
async function open(browser, { vp = { width: 390, height: 844 }, locale = 'de-DE', now = '2026-11-16T10:00:00Z', path = '/lena-tom', wait = true } = {}) {
  ipN += 1;
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce', locale, timezoneId: 'America/New_York', acceptDownloads: true, extraHTTPHeaders: { 'x-forwarded-for': `10.1.0.${ipN}` } });
  const page = await ctx.newPage(); const errors = [];
  if (now) await page.clock.setFixedTime(new Date(now));
  await routeFonts(page); await routeAssets(page);
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text().slice(0, 160)); });
  await page.goto(BASE + path, { waitUntil: 'load' });
  if (wait) { await page.locator('#rsvp').waitFor({ timeout: 25000 }); await page.waitForTimeout(600); }
  return { ctx, page, errors };
}
const text = (page) => page.evaluate(() => document.body.innerText);
async function setLang(page, code) {
  const toggle = page.locator('header button[aria-haspopup]');
  if (await toggle.isVisible()) await toggle.click();
  await page.locator(`nav button[lang="${code}"]`).click(); await page.waitForTimeout(350);
}
async function fillRsvp(page, { name, email, attending = true, persons = 1, guests = [] }) {
  const f = page.locator('#rsvp');
  if (name !== undefined) await f.locator('input[name="name"]').fill(name);
  if (email !== undefined) await f.locator('input[name="email"]').fill(email);
  await f.locator('button[aria-pressed]').nth(attending ? 0 : 1).click();
  if (attending) {
    for (let i = 1; i < persons; i++) { const plus = f.locator('[role="group"] button').last(); if (await plus.isDisabled()) break; await plus.click(); }
    for (let i = 0; i < guests.length; i++) {
      const g = guests[i]; const fs_ = f.locator('fieldset').nth(i); await fs_.waitFor({ timeout: 5000 });
      if (g.name) await fs_.locator('input:not([type="checkbox"]):not([type="number"])').first().fill(g.name);
      if (g.child) { await fs_.locator('input[type="checkbox"]').check(); if (g.age !== undefined) await fs_.locator('input[type="number"]').fill(String(g.age)); }
    }
  }
}
const send = async (page) => { await page.locator('#rsvp button[type="submit"]').click(); await page.waitForTimeout(1500); };

(async () => {
  const browser = await chromium.launch();
  await seedCassis();

  // ---------- 1. Aufbau und Darstellung ----------
  for (const [n, vp] of Object.entries({ '320': { width: 320, height: 640 }, '375': { width: 375, height: 667 }, '390': { width: 390, height: 844 }, '768': { width: 768, height: 1024 }, '1024': { width: 1024, height: 768 }, '1440': { width: 1440, height: 900 }, '1920': { width: 1920, height: 1080 } })) {
    const { ctx, page, errors } = await open(browser, { vp });
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      ids: [...document.querySelectorAll('section[id]')].map((s) => s.id),
      lettering: (() => { const i = document.querySelector('h1 img'); return i ? i.naturalWidth : 0; })(),
      letteringBox: (() => { const i = document.querySelector('h1 img'); const b = i && i.getBoundingClientRect(); return b ? [Math.round(b.left), Math.round(b.right)] : null; })(),
      hero: (() => { const i = document.querySelector('header img.bg'); return i ? i.naturalWidth : 0; })(),
      small: [...document.querySelectorAll('#rsvp button, nav button, a[href]')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height < 40; }).map((e) => e.textContent.trim().slice(0, 20) + ':' + Math.round(e.getBoundingClientRect().height)),
    }));
    ok(`Breite ${n}: kein seitliches Scrollen`, info.overflow <= 0, info.overflow);
    ok(`Breite ${n}: Bereiche in der richtigen Reihenfolge`, info.ids.join(',') === 'timeline,countdown,rsvp,directions,faq,witnesses', info.ids.join(','));
    ok(`Breite ${n}: Schriftzug-Grafik geladen und vollständig im Bild`, info.lettering > 0 && info.letteringBox[0] >= 0 && info.letteringBox[1] <= vp.width, JSON.stringify(info.letteringBox));
    ok(`Breite ${n}: Startfoto geladen`, info.hero > 0);
    ok(`Breite ${n}: keine Fehler in der Browser-Konsole`, errors.length === 0, errors[0]);
    if (n === '390') ok('Tippflächen mindestens 40 px hoch', info.small.length === 0, info.small.join(' | '));
    const head = await page.evaluate(() => {
      const vis = (e) => { const c = getComputedStyle(e); const b = e.getBoundingClientRect(); return c.visibility !== 'hidden' && c.display !== 'none' && b.width > 0 && b.top < 80; };
      const els = [...document.querySelectorAll('body > div header a, body > div header button, header[data-solid] a, header[data-solid] button')].filter(vis).map((e) => e.getBoundingClientRect());
      let overlap = 0; for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) { const a = els[i], b = els[j]; if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) overlap++; }
      return { count: els.length, overlap, right: Math.max(...els.map((b) => b.right)), vw: window.innerWidth };
    });
    ok(`Breite ${n}: Kopfzeile ohne Überlappung und ohne Überstand`, head.count >= 3 && head.overlap === 0 && head.right <= head.vw, JSON.stringify(head));
    await ctx.close();
  }
  { const { ctx, page } = await open(browser);
    const t = await text(page);
    ok('Keine Galerie, keine fremden Bereiche', !/Galerie|Gallery|Gästebuch|Guestbook|Musik/i.test(t));
    ok('Kinderbetreuung erscheint nicht mehr, auch wenn sie im Projekt noch gespeichert ist', !/Childcare|Kinderbetreuung|Alter Inhalt/.test(t) && await page.locator('#childcare').count() === 0);
    const lay = await page.evaluate(() => {
      const y = (sel) => { const e = document.querySelector(sel); return e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : null; };
      const srcs = [...document.querySelectorAll('img')].map((i) => i.getAttribute('src'));
      const count = (name) => srcs.filter((x) => x && x.includes(name)).length;
      const mark = document.querySelector('a[href="#top"] img'); const mb = mark ? mark.getBoundingClientRect() : null;
      return { timeline: y('#timeline'), photo: y('[data-cassis-photo]'), countdown: y('#countdown'), heroPhoto: count('hero.jpg'), secondPhoto: count('ablauf.jpg'), castle: count('schloss.svg'),
        mark: mb ? [Math.round(mb.left), Math.round(mb.top), Math.round(mb.height)] : null, vw: window.innerWidth };
    });
    ok('Zweites Foto steht als eigener Abschnitt zwischen Ablauf und Countdown', lay.timeline < lay.photo && lay.photo < lay.countdown, JSON.stringify(lay));
    ok('Beide Fotos je genau einmal, Schloss-Illustration genau einmal', lay.heroPhoto === 1 && lay.secondPhoto === 1 && lay.castle === 1, JSON.stringify(lay));
    ok('Schriftzug oben links in der Kopfzeile', lay.mark && lay.mark[0] < lay.vw / 3 && lay.mark[1] < 60 && lay.mark[2] >= 44, JSON.stringify(lay.mark));
    const hero = await page.evaluate(() => { const h = document.querySelector('header#top').getBoundingClientRect(); const n = document.querySelector('h1').getBoundingClientRect(); const f = document.querySelector('header#top time'); return { h: Math.round(h.height), vh: window.innerHeight, namesInside: n.top > 0 && n.bottom < h.bottom, date: f ? f.textContent : '' }; });
    ok('Startfoto füllt den Bildschirm; Namen und Datum stehen darauf', hero.h >= hero.vh - 2 && hero.namesInside && /15\. Mai 2027/.test(hero.date), JSON.stringify(hero));
    ok('Ablauf: alle sieben Programmpunkte', ['Grande entrée', 'Cérémonie', "Vin d'honneur", 'Dîner', 'Pièce montée', 'Ouverture du bal', 'Soirée dansante'].every((x) => t.includes(x)));
    ok('Datum und Ort im Kopf', /15\. Mai 2027/.test(t) && /Château de Cassis/.test(t) && /13260 Cassis/.test(t));
    const a11y = await page.evaluate(() => ({
      unlabeled: [...document.querySelectorAll('input, textarea, select')].filter((e) => !(e.labels && e.labels.length) && !e.getAttribute('aria-label')).length,
      unnamedButtons: [...document.querySelectorAll('button, a[href]')].filter((e) => !(e.textContent.trim() || e.getAttribute('aria-label'))).length,
      h1: document.querySelectorAll('h1').length, h1name: document.querySelector('h1')?.getAttribute('aria-label'), imgNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    }));
    ok('Zugänglichkeit: jedes Feld beschriftet, jeder Knopf benannt', a11y.unlabeled === 0 && a11y.unnamedButtons === 0, JSON.stringify(a11y));
    ok('Zugänglichkeit: eine Hauptüberschrift mit den Namen, Bilder mit Alternativtext', a11y.h1 === 1 && a11y.h1name === 'Lena Tom' && a11y.imgNoAlt === 0, JSON.stringify(a11y));
    const route = await page.locator('a', { hasText: 'Route' }).first().evaluate((a) => ({ href: a.href, target: a.target, rel: a.rel }));
    ok('Route öffnet Google Maps mit der Adresse in neuem Tab', /google\.com\/maps/.test(route.href) && /Cassis/.test(decodeURIComponent(route.href)) && route.target === '_blank' && /noopener/.test(route.rel), JSON.stringify(route));
    await page.locator('footer a, footer button').filter({ hasText: 'Nach oben' }).click(); await page.waitForTimeout(500);
    ok('„Nach oben" führt an den Seitenanfang', await page.evaluate(() => window.scrollY) < 5);
    await ctx.close(); }

  // ---------- 1b. Navigation ----------
  { const { ctx, page } = await open(browser, { vp: { width: 1440, height: 900 } });
    const links = await page.locator('header[data-solid] nav a').evaluateAll((a) => a.map((x) => [x.textContent, x.getAttribute('href')]));
    ok('Navigation (Desktop): sechs Menüpunkte in der Reihenfolge der Seite', links.map((l) => l[1]).join() === '#timeline,#countdown,#rsvp,#directions,#faq,#witnesses' && links[0][0] === 'Ablauf' && links[5][0] === 'Trauzeug:innen', JSON.stringify(links));
    ok('Navigation (Desktop): kein Aufklappmenü, Sprachen direkt sichtbar', !(await page.locator('header button[aria-controls][aria-label="Menü"]').isVisible()) && await page.locator('nav button[lang="fr"]').isVisible());
    ok('Kopfzeile über dem Foto durchsichtig', await page.locator('header[data-solid]').getAttribute('data-solid') === 'false');
    for (const id of ['timeline', 'countdown', 'rsvp', 'directions', 'faq', 'witnesses']) {
      await page.locator(`header[data-solid] nav a[href="#${id}"]`).click(); await page.waitForTimeout(500);
      const top = await page.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().top), id);
      ok(`Menüpunkt führt zum Bereich „${id}", direkt unter die Kopfzeile`, top >= 40 && top <= 70, top);
    }
    ok('Kopfzeile nach dem Scrollen hinterlegt und weiter oben fixiert', await page.locator('header[data-solid]').getAttribute('data-solid') === 'true' && (await page.locator('header[data-solid]').boundingBox()).y === 0);
    const contrast = await page.locator('header[data-solid] nav a').first().evaluate((a) => getComputedStyle(a).color);
    ok('Hinterlegte Kopfzeile: dunkle Schrift auf hellem Grund', contrast === 'rgb(51, 53, 63)', contrast);
    await setLang(page, 'fr'); const fr = await page.locator('header[data-solid] nav a').allTextContents();
    ok('Menü folgt der Sprache (Französisch)', fr.join() === 'Programme,Compte à rebours,RSVP,Accès,FAQ,Témoins', fr.join());
    await setLang(page, 'tr'); const tr = await page.locator('header[data-solid] nav a').allTextContents();
    ok('Menü folgt der Sprache (Türkisch)', tr.join() === 'Program,Geri sayım,LCV,Ulaşım,SSS,Şahitler', tr.join());
    await setLang(page, 'en'); const en = await page.locator('header[data-solid] nav a').allTextContents();
    ok('Menü folgt der Sprache (Englisch)', en.join() === 'Schedule,Countdown,RSVP,Getting there,FAQ,Witnesses', en.join());
    // Tastatur: vom Seitenanfang aus erreicht Tab Schriftzug, Menü und Sprachen in dieser Reihenfolge
    await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement && document.activeElement.blur(); }); await page.waitForTimeout(300);
    await page.locator('header[data-solid] a[href="#top"]').focus(); const order = ['#top']; for (let i = 0; i < 10; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => { const e = document.activeElement; return e.getAttribute('href') || e.getAttribute('lang') || e.tagName; })); }
    ok('Tastatur: Schriftzug, sechs Menüpunkte, vier Sprachen der Reihe nach', order.join() === '#top,#timeline,#countdown,#rsvp,#directions,#faq,#witnesses,en,tr,de,fr', order.join());
    const focus = await page.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return c.outlineStyle + ' ' + c.outlineWidth; });
    ok('Tastatur: sichtbarer Fokusrahmen', /solid/.test(focus) && !/ 0px/.test(focus), focus);
    await ctx.close(); }
  { const { ctx, page } = await open(browser, { vp: { width: 390, height: 844 } });
    const burger = page.locator('header button[aria-controls]').last(); const menu = page.locator('header[data-solid] nav').first();
    ok('Navigation (Handy): Menü zunächst geschlossen', await burger.getAttribute('aria-expanded') === 'false' && !(await menu.locator('a').first().isVisible()));
    ok('Navigation (Handy): Knopf benannt und mit dem Menü verknüpft', await burger.getAttribute('aria-label') === 'Menü' && await burger.getAttribute('aria-controls') === await menu.getAttribute('id'));
    const bb = await burger.boundingBox(); const lb = await page.locator('header button[aria-haspopup]').boundingBox();
    ok('Navigation (Handy): Tippflächen mindestens 44 × 44 px', bb.width >= 44 && bb.height >= 44 && lb.width >= 44 && lb.height >= 44, JSON.stringify([bb, lb]));
    await burger.click(); await page.waitForTimeout(400);
    ok('Menü öffnet: Zustand gemeldet, Punkte sichtbar, erster Punkt im Fokus', await burger.getAttribute('aria-expanded') === 'true' && await menu.locator('a').nth(5).isVisible() && await page.evaluate(() => document.activeElement.getAttribute('href')) === '#timeline');
    ok('Offenes Menü: Seite dahinter scrollt nicht', await page.evaluate(() => document.documentElement.style.overflow) === 'hidden');
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    ok('Escape schließt das Menü, Fokus zurück am Knopf, Seite scrollt wieder', await burger.getAttribute('aria-expanded') === 'false' && !(await menu.locator('a').first().isVisible()) && await page.evaluate(() => document.activeElement.getAttribute('aria-controls') !== null && document.documentElement.style.overflow !== 'hidden'));
    await burger.click(); await page.waitForTimeout(300); await menu.locator('a[href="#rsvp"]').click(); await page.waitForTimeout(600);
    const top = await page.evaluate(() => Math.round(document.getElementById('rsvp').getBoundingClientRect().top));
    ok('Auswahl eines Punkts schließt das Menü und führt zum Bereich', await burger.getAttribute('aria-expanded') === 'false' && top >= 40 && top <= 70, top);
    const lt = page.locator('header button[aria-haspopup]'); await lt.click(); await page.waitForTimeout(300);
    ok('Sprachliste (Handy): öffnet, Zustand gemeldet', await lt.getAttribute('aria-expanded') === 'true' && await page.locator('nav button[lang="tr"]').isVisible());
    await burger.click(); await page.waitForTimeout(300);
    ok('Menü und Sprachliste sind nie gleichzeitig offen', await lt.getAttribute('aria-expanded') === 'false' && await burger.getAttribute('aria-expanded') === 'true');
    await page.keyboard.press('Escape'); await lt.click(); await page.locator('nav button[lang="tr"]').click(); await page.waitForTimeout(400);
    ok('Sprachwahl (Handy): wechselt die Sprache und schließt die Liste', (await lt.innerText()).trim() === 'TR' && await lt.getAttribute('aria-expanded') === 'false' && (await page.evaluate(() => document.documentElement.lang)) === 'tr');
    await ctx.close(); }
  { // Nur vorhandene Bereiche im Menü: Projekt ohne Inhalte für Ablauf, Anfahrt, FAQ, Trauzeug:innen
    const { ctx, page } = await open(browser, { vp: { width: 1440, height: 900 }, path: '/base-cassis' });
    const links = await page.locator('header[data-solid] nav a').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
    ok('Menü zeigt nur Bereiche, die auf der Seite stehen', links.join() === '#countdown,#rsvp', links.join());
    await ctx.close(); }

  // ---------- 1c. Bewegung ----------
  { ipN += 1; const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE', extraHTTPHeaders: { 'x-forwarded-for': `10.1.0.${ipN}` } }); const page = await ctx.newPage(); await routeFonts(page); await routeAssets(page);
    await page.goto(BASE + '/lena-tom', { waitUntil: 'load' }); await page.locator('#rsvp').waitFor(); await page.waitForTimeout(2600);
    const st = () => page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].map((e) => e.getAttribute('data-reveal')));
    const before = await st();
    ok('Einblenden: Bereiche unterhalb des Bildschirms warten, nichts oberhalb ist versteckt', before.length >= 5 && before.filter((x) => x === 'armed').length >= 4, before.join());
    const heroOpacity = await page.evaluate(() => [getComputedStyle(document.querySelector('h1')).opacity, getComputedStyle(document.querySelector('header#top img.bg')).opacity].join());
    ok('Startbild: nach der Eingangsbewegung vollständig sichtbar', heroOpacity === '1,1', heroOpacity);
    const h = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y <= h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(90); } await page.waitForTimeout(1400);
    const after = await st(); const hidden = await page.evaluate(() => [...document.querySelectorAll('section *, figure img')].filter((e) => e.getBoundingClientRect().height > 0 && getComputedStyle(e).opacity === '0' && !e.closest('details:not([open])')).length);
    ok('Einblenden: nach einmaligem Durchscrollen ist alles sichtbar und bleibt es', after.every((x) => x === 'in') && hidden === 0, after.join() + ' / versteckt: ' + hidden);
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500); await page.evaluate(() => document.getElementById('faq').scrollIntoView()); await page.waitForTimeout(500);
    ok('Kein erneutes Ausblenden beim Zurückscrollen', (await st()).every((x) => x === 'in'));
    const line = await page.evaluate(() => { const li = document.querySelector('#timeline li'); return getComputedStyle(li, '::before').transform; });
    ok('Linie des Ablaufs steht nach dem Aufbau vollständig', line === 'none' || line === 'matrix(1, 0, 0, 1, 0, 0)', line);
    const f = page.locator('#faq details').first(); await f.locator('summary').click(); await page.waitForTimeout(600);
    ok('FAQ öffnet und zeigt die Antwort', await f.evaluate((d) => d.open) && await f.locator('p').isVisible());
    await f.locator('summary').click(); await page.waitForTimeout(600); ok('FAQ schließt wieder', !(await f.evaluate((d) => d.open)));
    await ctx.close(); }
  { // Bewegung reduziert: nichts wird versteckt, keine Eingangsbewegung
    const { ctx, page } = await open(browser, { vp: { width: 1440, height: 900 } });
    const r = await page.evaluate(() => ({ armed: document.querySelectorAll('[data-reveal]').length, anim: getComputedStyle(document.querySelector('h1')).animationName, hidden: [...document.querySelectorAll('section *')].filter((e) => getComputedStyle(e).opacity === '0' && !e.closest('details:not([open])')).length }));
    ok('Reduzierte Bewegung: keine Eingangsbewegung, nichts versteckt', r.armed === 0 && r.anim === 'none' && r.hidden === 0, JSON.stringify(r));
    await ctx.close(); }
  { // Ohne Beobachter im Browser: Inhalte bleiben sichtbar
    ipN += 1; const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE', extraHTTPHeaders: { 'x-forwarded-for': `10.1.0.${ipN}` } }); const page = await ctx.newPage(); await routeFonts(page); await routeAssets(page);
    await page.addInitScript(() => { delete window.IntersectionObserver; });
    await page.goto(BASE + '/lena-tom', { waitUntil: 'load' }); await page.locator('#rsvp').waitFor(); await page.waitForTimeout(2200);
    const r = await page.evaluate(() => ({ io: typeof IntersectionObserver, armed: document.querySelectorAll('[data-reveal]').length, hidden: [...document.querySelectorAll('section *')].filter((e) => getComputedStyle(e).opacity === '0' && !e.closest('details:not([open])')).length }));
    ok('Ohne IntersectionObserver: alle Inhalte sichtbar', r.io === 'undefined' && r.armed === 0 && r.hidden === 0, JSON.stringify(r));
    await ctx.close(); }
  { const { ctx, page } = await open(browser, { vp: { width: 1440, height: 900 } });
    const m = await page.evaluate(() => { const px = (sel) => { const e = document.querySelector(sel); return e ? parseFloat(getComputedStyle(e).fontSize) : 0; }; const w = (sel) => { const e = document.querySelector(sel); return e ? Math.round(e.getBoundingClientRect().width) : 0; };
      return { title: px('#timeline h2'), item: px('#timeline li'), body: px('#directions address'), day: px('#countdown [data-wedding-day]'), count: px('#countdown strong'), sheet: w('#countdown [role="img"]'), form: w('#rsvp form'), input: document.querySelector('#rsvp input').getBoundingClientRect().height, photo: w('[data-cassis-photo] img'), photoH: Math.round(document.querySelector('[data-cassis-photo] img').getBoundingClientRect().height), mark: w('h1 img') }; });
    ok('Desktop 1440: große Schrift (Überschrift ≥ 48, Ablauf ≥ 28, Fließtext ≥ 19 px)', m.title >= 48 && m.item >= 28 && m.body >= 19, JSON.stringify(m));
    ok('Desktop 1440: Kalenderblatt ≥ 600 px breit, Tageszahl ≥ 180 px hoch gesetzt', m.sheet >= 600 && m.count >= 180 && m.day >= 26, JSON.stringify(m));
    ok('Desktop 1440: Formular ≥ 600 px breit, Felder ≥ 60 px hoch', m.form >= 600 && m.input >= 60, JSON.stringify(m));
    ok('Desktop 1440: zweites Foto über die ganze Breite und höher als der Bildschirm', m.photo >= 1420 && m.photoH >= 900, JSON.stringify(m));
    ok('Desktop 1440: Schriftzug im Startbild ≥ 560 px breit', m.mark >= 560, m.mark);
    await ctx.close(); }

  // ---------- 2. Sprachen ----------
  for (const [locale, want, phrase] of [['tr-TR', 'tr', 'Takvime ekle'], ['fr-FR', 'fr', 'Ajouter au calendrier'], ['de-AT', 'de', 'Im Kalender speichern'], ['en-GB', 'en', 'Save to calendar'], ['es-ES', 'en', 'Save to calendar']]) {
    const { ctx, page } = await open(browser, { locale });
    const lang = await page.evaluate(() => document.documentElement.lang); const t = await text(page);
    const pressed = await page.locator('nav button[aria-pressed="true"]').getAttribute('lang');
    ok(`Gerätesprache ${locale} → ${want}`, lang === want && pressed === want && t.includes(phrase), `${lang}/${pressed}`);
    await ctx.close();
  }
  { const { ctx, page } = await open(browser, { locale: 'en-US' });
    ok('Sprachleiste zeigt ENG, TR, DE, FR', (await page.locator('nav button').allTextContents()).join(',') === 'ENG,TR,DE,FR');
    ok('Hauptsprache: Titel des Ablaufs aus dem Inhalt', (await text(page)).includes('Timeline'));
    await setLang(page, 'de');
    let t = await text(page);
    ok('Umschalten auf Deutsch ohne Neuladen: feste Texte und übersetzter Inhalt', t.includes('Im Kalender speichern') && t.includes('Ablauf') && !t.includes('Timeline') && (await page.evaluate(() => document.documentElement.lang)) === 'de');
    ok('Nicht übersetzter Inhalt fällt auf Englisch zurück', t.includes('Getting there') && t.includes('Witnesses'));
    await page.reload({ waitUntil: 'load' }); await page.locator('#rsvp').waitFor(); await page.waitForTimeout(500);
    ok('Gewählte Sprache bleibt nach dem Neuladen', (await page.evaluate(() => document.documentElement.lang)) === 'de');
    await setLang(page, 'tr'); t = await text(page);
    ok('Türkisch: feste Texte türkisch, fehlende Übersetzung englisch', t.includes('Takvime ekle') && t.includes('Timeline') && !t.includes('Im Kalender speichern'));
    ok('Türkisch: Datum in türkischer Schreibweise', /15 Mayıs 2027/.test(t), t.slice(0, 200));
    await setLang(page, 'fr'); t = await text(page);
    ok('Französisch: übersetzter Titel und Datum', t.includes('Programme') && /15 mai 2027/.test(t));
    await ctx.close(); }

  // ---------- 3. Countdown und Kalender ----------
  { const { ctx, page } = await open(browser);
    const t = await page.locator('#countdown').innerText();
    ok('Countdown: Kalenderblatt Mai 2027, 180 Tage (Gerät in New York, Ziel in Paris)', /Mai 2027/.test(t) && /\b180\b/.test(t), t.replace(/\s+/g, ' ').slice(0, 160));
    const marked = await page.locator('#countdown [data-wedding-day]').allTextContents();
    ok('Countdown: genau der 15. ist markiert', marked.join(',').trim() === '15', marked.join(','));
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), page.locator('button, a').filter({ hasText: 'Im Kalender speichern' }).first().click()]);
    const ics = fs.readFileSync(await dl.path(), 'utf8');
    ok('Kalenderdatei: 15.05.2027 15:00–02:00 Uhr Pariser Zeit', ics.includes('DTSTART:20270515T130000Z') && ics.includes('DTEND:20270516T000000Z'), ics.match(/DT(START|END).*/g));
    ok('Kalenderdatei: Titel, Ort und Dateiname', /SUMMARY:Wir heiraten: Lena Tom/.test(ics) && /LOCATION:Château de Cassis/.test(ics) && dl.suggestedFilename() === 'lena-tom.ics', dl.suggestedFilename());
    await ctx.close(); }
  { await fetch(BASE + '/__test/seed', { method: 'POST', body: JSON.stringify({ table: 'project_content', rows: [{ project_id: pid(73), component: 'countdown', content: { target_date: '2027-05-15', target_time: '15:00', end_time: '04:00' } }] }) });
  }
  { const { ctx, page } = await open(browser, { now: '2027-05-15T12:00:00Z' });
    const t = await page.locator('#countdown').innerText();
    ok('Countdown am Hochzeitstag vor Beginn: 0 Tage, keine negativen Werte', !/-\d/.test(t), t.replace(/\s+/g, ' ').slice(-80));
    await ctx.close(); }
  { const { ctx, page } = await open(browser, { now: '2027-06-01T10:00:00Z' });
    const t = await page.locator('#countdown').innerText();
    ok('Countdown nach der Hochzeit: Abschlusstext statt Zahlen, nichts Negatives', /Wir haben Ja gesagt/i.test(t) && !/-\d/.test(t), t.replace(/\s+/g, ' ').slice(-80));
    await ctx.close(); }

  // ---------- 4. RSVP im Browser ----------
  { const { ctx, page } = await open(browser, { locale: 'tr-TR' });
    await fillRsvp(page, { name: 'Ayşe Yılmaz', email: 'ayse@example.test', persons: 3, guests: [{ name: 'Mehmet Yılmaz' }, { name: 'Elif', child: true, age: 5 }] });
    await send(page);
    const rows = await rsvps(); const r = rows.find((x) => x.email === 'ayse@example.test'); const g = r ? (typeof r.guests === 'string' ? JSON.parse(r.guests) : r.guests) : [];
    ok('Zusage mit 3 Personen und Kind wird gespeichert', r && r.attending === true && r.persons === 3 && g.length === 3, JSON.stringify(r));
    ok('Alter des Kindes steht bei der richtigen Person', g[2] && g[2].name === 'Elif' && g[2].is_child === true && g[2].age === 5 && !g[1].is_child, JSON.stringify(g));
    ok('Sprache der Antwort gespeichert (tr)', r && r.language === 'tr');
    ok('Danke-Text erscheint in der Sprache des Gasts', /Teşekkür/.test(await page.locator('#rsvp').innerText()), (await page.locator('#rsvp').innerText()).slice(0, 100));
    const ob = await outbox(); const mail = ob.outbox.find((m) => JSON.stringify(m).includes('ayse@example.test'));
    ok('Genau eine Bestätigungsmail, auf Türkisch, nur im Testpostfach', ob.outbox.filter((m) => JSON.stringify(m).includes('ayse@example.test')).length === 1 && mail && (mail.body.tags || []).includes('lang-tr'), JSON.stringify(mail && mail.body.tags));
    await ctx.close(); }
  { const { ctx, page } = await open(browser);
    await fillRsvp(page, { name: 'Große Familie', email: 'gross@example.test', persons: 12 });
    const f = page.locator('#rsvp'); const count = await f.locator('output').innerText(); const plusOff = await f.locator('[role="group"] button').last().isDisabled();
    ok('Mehr als 8 Personen lassen sich nicht einstellen', count === '8' && plusOff, count);
    ok('Hinweis nennt die Obergrenze', /8/.test(await f.innerText()) && /höchstens|bis zu|maximal/i.test(await f.innerText()));
    ok('Bei 8 Personen: sieben weitere Namensfelder', await f.locator('fieldset').count() === 7);
    await send(page);
    const r = (await rsvps()).find((x) => x.email === 'gross@example.test');
    ok('Anmeldung mit 8 Personen wird angenommen', r && r.persons === 8, JSON.stringify(r));
    await ctx.close(); }
  { const { ctx, page } = await open(browser);
    await fillRsvp(page, { name: 'Ohne Alter', email: 'ohnealter@example.test', persons: 2, guests: [{ name: 'Kind', child: true }] });
    await send(page);
    ok('Kind ohne Alter: verständliche Meldung, nichts gespeichert', /Alter/.test(await page.locator('#rsvp [role="alert"]').innerText().catch(() => '')) && !(await rsvps()).some((x) => x.email === 'ohnealter@example.test'));
    await page.locator('#rsvp fieldset input[type="number"]').fill('0'); await send(page);
    const r = (await rsvps()).find((x) => x.email === 'ohnealter@example.test'); const g = r ? (typeof r.guests === 'string' ? JSON.parse(r.guests) : r.guests) : [];
    ok('Alter 0 (Baby) wird angenommen und gespeichert', r && g[1] && g[1].age === 0, JSON.stringify(g));
    await ctx.close(); }
  { const { ctx, page } = await open(browser);
    await fillRsvp(page, { name: 'Zweimal', email: 'AYSE@example.test ', persons: 1 }); await send(page);
    const msg = await page.locator('#rsvp [role="alert"]').innerText().catch(() => '');
    ok('Zweite Antwort mit derselben E-Mail (andere Schreibweise): Hinweis, kein zweiter Eintrag', /bereits/.test(msg) && (await rsvps()).filter((x) => String(x.email).toLowerCase().trim() === 'ayse@example.test').length === 1, msg);
    ok('Abgelehnte Doppelantwort löst keine zweite Mail aus', (await outbox()).outbox.filter((m) => JSON.stringify(m).toLowerCase().includes('ayse@example.test')).length === 1);
    await ctx.close(); }
  { const { ctx, page } = await open(browser);
    await fillRsvp(page, { name: 'Kaputt', email: 'keine-adresse', persons: 1 }); await send(page);
    ok('Ungültige E-Mail: Meldung, nichts gespeichert', (await page.locator('#rsvp [role="alert"]').count()) === 1 && !(await rsvps()).some((x) => x.name === 'Kaputt'));
    await page.locator('#rsvp input[name="name"]').fill(''); await page.locator('#rsvp input[name="email"]').fill('k@example.test'); await send(page);
    ok('Fehlender Name: Meldung, nichts gespeichert', /Name/.test(await page.locator('#rsvp [role="alert"]').innerText().catch(() => '')) && !(await rsvps()).some((x) => x.email === 'k@example.test'));
    await ctx.close(); }
  { const { ctx, page } = await open(browser, { locale: 'fr-FR' });
    await fillRsvp(page, { name: 'Luc Martin', email: 'luc@example.test', attending: false });
    ok('Absage: keine Personen- und Kinderfelder', await page.locator('#rsvp fieldset').count() === 0 && await page.locator('#rsvp output').count() === 0);
    // Doppelklick auf „Senden"
    const b = page.locator('#rsvp button[type="submit"]'); await b.evaluate((el) => { el.click(); el.click(); }); await page.waitForTimeout(1800);
    const rows = (await rsvps()).filter((x) => x.email === 'luc@example.test');
    ok('Absage gespeichert, Doppelklick erzeugt nur einen Eintrag', rows.length === 1 && rows[0].attending === false && rows[0].language === 'fr', JSON.stringify(rows));
    ok('Absage: eine Bestätigung auf Französisch', (await outbox()).outbox.filter((m) => JSON.stringify(m).includes('luc@example.test') && (m.body.tags || []).includes('lang-fr')).length === 1);
    await ctx.close(); }
  { // Mailversand fällt aus: Antwort bleibt gespeichert, Gast sieht Erfolg
    await fetch(BASE + '/__test/mailfail', { method: 'POST', body: JSON.stringify({ times: 5, status: 500 }) });
    const { ctx, page } = await open(browser);
    await fillRsvp(page, { name: 'Mail Kaputt', email: 'mailkaputt@example.test' }); await send(page);
    ok('Mailfehler: Antwort bleibt gespeichert und der Gast sieht die Bestätigung', (await rsvps()).some((x) => x.email === 'mailkaputt@example.test') && /Danke/.test(await page.locator('#rsvp').innerText()));
    await fetch(BASE + '/__test/mailfail', { method: 'POST', body: JSON.stringify({ times: 0 }) });
    await ctx.close(); }
  { // Netzfehler beim Senden: Meldung, Eingaben bleiben, zweiter Versuch gelingt genau einmal
    const { ctx, page } = await open(browser);
    await fillRsvp(page, { name: 'Netz Weg', email: 'netz@example.test' });
    let block = true; await page.route('**/api/db', (r) => ((r.request().postData() || '').includes('submitRSVP') && block ? r.abort() : r.continue()));
    await send(page);
    ok('Netzfehler: Meldung und Eingaben bleiben erhalten', (await page.locator('#rsvp [role="alert"]').count()) === 1 && (await page.locator('#rsvp input[name="name"]').inputValue()) === 'Netz Weg');
    block = false; await send(page);
    ok('Zweiter Versuch nach Netzfehler: genau ein Eintrag', (await rsvps()).filter((x) => x.email === 'netz@example.test').length === 1);
    await ctx.close(); }

  // ---------- 5. Passwortseite und Entwurf ----------
  { const { ctx, page } = await open(browser, { path: '/cassis-locked', wait: false });
    const pw = page.locator('input[type="password"]').first(); await pw.waitFor({ timeout: 20000 });
    const box = await pw.boundingBox();
    ok('Cassis mit Gäste-Passwort: Passwortseite erscheint, Feld passt aufs Handy', box.x >= 0 && box.x + box.width <= 390 && !/Cérémonie/.test(await text(page)));
    await pw.fill('gast-test'); await page.keyboard.press('Enter'); await page.locator('#rsvp').waitFor({ timeout: 20000 });
    ok('Nach dem Passwort erscheint die Cassis-Seite', /Lena|Wir heiraten/.test(await text(page)) && await page.locator('#countdown').count() === 1);
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), page.locator('button, a').filter({ hasText: 'Im Kalender speichern' }).first().click()]);
    ok('Endzeit aus dem Dashboard steuert die Kalenderdatei (04:00 Uhr)', fs.readFileSync(await dl.path(), 'utf8').includes('DTEND:20270516T020000Z'));
    await ctx.close(); }
  { const { ctx, page } = await open(browser, { path: '/cassis-draft', wait: false }); await page.waitForTimeout(3000);
    const t = await text(page);
    ok('Cassis im Entwurf: Coming Soon, keine Inhalte, kein Formular', /coming soon|bald|demnächst|in kürze/i.test(t) && await page.locator('#rsvp').count() === 0, t.slice(0, 100));
    await ctx.close(); }

  // ---------- 6. Kundendashboard ----------
  { ipN += 1; const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE', acceptDownloads: true, extraHTTPHeaders: { 'x-forwarded-for': `10.1.0.${ipN}` } }); const page = await ctx.newPage(); await routeAssets(page);
    const errors = []; page.on('pageerror', (e) => errors.push(e.message.slice(0, 160)));
    await page.goto(`${BASE}/lena-tom/admin`, { waitUntil: 'load' });
    const pw = page.locator('input[type="password"]').first(); await pw.waitFor({ timeout: 25000 }); await pw.fill('admin-test'); await page.keyboard.press('Enter');
    await page.locator('aside button').filter({ hasText: /RSVP/ }).first().waitFor({ timeout: 20000 });
    const nav = (await page.locator('aside button').allTextContents()).map((t) => t.replace(/[^\p{L}\p{N}:& -]/gu, '').trim()).filter(Boolean);
    ok('Dashboard Cassis: Anmeldung, Menü ohne Kinderbetreuung', nav.some((n) => /Ablauf/.test(n)) && !nav.some((n) => /Kinderbetreuung/.test(n)), nav.join('|'));
    ok('Dashboard Cassis: keine Einträge für abgewählte Bereiche (Galerie, Gästebuch, Musik)', !nav.some((n) => /Galerie|Gästebuch|Musik|Geschenke|Love/.test(n)), nav.join('|'));
    await page.locator('aside button').filter({ hasText: /Anfahrt/ }).first().click();
    const area = page.locator('main textarea').first(); await area.waitFor({ timeout: 8000 }); await area.fill('Shuttle ab Cassis Hafen um 14:15 Uhr.');
    await Promise.all([page.waitForResponse((x) => x.url().endsWith('/api/db') && (x.request().postData() || '').includes('updateProjectContent')), page.locator('main button').filter({ hasText: /Speichern/ }).first().click()]);
    await page.waitForTimeout(600);
    const d0 = await db(); const row = (d0.project_content || []).find((x) => x.project_id === PID && x.component === 'directions'); const kept = (d0.project_content || []).find((x) => x.project_id === PID && x.component === 'childcare');
    ok('Dashboard Cassis: Anfahrt speichern landet im richtigen Projekt', row && /Shuttle ab Cassis/.test(JSON.stringify(row.content)), JSON.stringify(row).slice(0, 160));
    ok('Gespeicherte Kinderbetreuungs-Daten bleiben erhalten (nichts gelöscht)', kept && /Alter Inhalt/.test(kept.content.description));
    await page.locator('aside button').filter({ hasText: /Hero/ }).first().click(); await page.waitForTimeout(800);
    ok('Dashboard Cassis: Hero-Editor bietet den Schriftzug als Grafik', /Schriftzug/i.test(await page.locator('main').innerText()));
    await page.locator('aside button').filter({ hasText: /Countdown/ }).first().click(); await page.waitForTimeout(800);
    ok('Dashboard Cassis: Countdown-Editor bietet die Endzeit', /Ende – Uhrzeit/i.test(await page.locator('main').innerText()));
    await page.locator('aside button').filter({ hasText: /RSVP/ }).first().click(); await page.locator('[data-testid="rsvp-extras"]').waitFor({ timeout: 8000 });
    const ex = await page.locator('[data-testid="rsvp-extras"]').innerText();
    ok('Dashboard Cassis: Übersicht Kinder und Sprachen mit Alter', /Kinder/.test(ex) && /5 Jahre/.test(ex) && /0 Jahre/.test(ex) && /Türkisch 1/.test(ex), ex.replace(/\s+/g, ' ').slice(0, 200));
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), page.locator('[data-testid="rsvp-extras"] button').click()]);
    const csv = fs.readFileSync(await dl.path(), 'utf8');
    ok('Dashboard Cassis: Export enthält Kind, Alter und Sprache', /"Elif";"ja";"5";"Türkisch"/.test(csv), csv.split('\n').slice(0, 4).join(' / '));
    ok('Dashboard Cassis: keine Fehler', errors.length === 0, errors[0]);
    await ctx.close(); }
  { ipN += 1; const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE', extraHTTPHeaders: { 'x-forwarded-for': `10.1.0.${ipN}` } }); const page = await ctx.newPage();
    await page.goto(`${BASE}/base-classic/admin`, { waitUntil: 'load' });
    const pw = page.locator('input[type="password"]').first(); await pw.waitFor({ timeout: 25000 }); await pw.fill('admin-test'); await page.keyboard.press('Enter');
    await page.locator('aside button').filter({ hasText: /RSVP/ }).first().waitFor({ timeout: 20000 });
    const nav = (await page.locator('aside button').allTextContents()).join('|');
    await page.locator('aside button').filter({ hasText: /RSVP/ }).first().click(); await page.waitForTimeout(1200);
    ok('Altprojekt (Classic): kein Menüpunkt Kinderbetreuung, keine Zusatzübersicht', !/Kinderbetreuung/.test(nav) && await page.locator('[data-testid="rsvp-extras"]').count() === 0);
    await page.locator('aside button').filter({ hasText: /Hero/ }).first().click(); await page.waitForTimeout(800);
    ok('Altprojekt (Classic): Hero-Editor ohne Schriftzug-Feld', !/Schriftzug als Grafik/i.test(await page.locator('main').innerText()));
    await ctx.close(); }

  await browser.close();
  fs.writeFileSync(`results/cassis-${label}.json`, JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass).length; console.log(`\n${results.length - fail}/${results.length} bestanden`);
})().catch((e) => { console.error('ABBRUCH', e); process.exit(1); });
