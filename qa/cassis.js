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
  for (const [n, vp] of Object.entries({ '320': { width: 320, height: 640 }, '390': { width: 390, height: 844 }, '768': { width: 768, height: 1024 }, '1440': { width: 1440, height: 900 } })) {
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
    ok(`Breite ${n}: Bereiche in der richtigen Reihenfolge`, info.ids.join(',') === 'countdown,timeline,directions,childcare,rsvp,witnesses,faq', info.ids.join(','));
    ok(`Breite ${n}: Schriftzug-Grafik geladen und vollständig im Bild`, info.lettering > 0 && info.letteringBox[0] >= 0 && info.letteringBox[1] <= vp.width, JSON.stringify(info.letteringBox));
    ok(`Breite ${n}: Startfoto geladen`, info.hero > 0);
    ok(`Breite ${n}: keine Fehler in der Browser-Konsole`, errors.length === 0, errors[0]);
    if (n === '390') ok('Tippflächen mindestens 40 px hoch', info.small.length === 0, info.small.join(' | '));
    await ctx.close();
  }
  { const { ctx, page } = await open(browser);
    const t = await text(page);
    ok('Keine Galerie, keine fremden Bereiche', !/Galerie|Gallery|Gästebuch|Guestbook|Musik/i.test(t));
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

  // ---------- 2. Sprachen ----------
  for (const [locale, want, phrase] of [['tr-TR', 'tr', 'Evleniyoruz'], ['fr-FR', 'fr', 'Nous nous marions'], ['de-AT', 'de', 'Wir heiraten'], ['en-GB', 'en', 'We are getting married'], ['es-ES', 'en', 'We are getting married']]) {
    const { ctx, page } = await open(browser, { locale });
    const lang = await page.evaluate(() => document.documentElement.lang); const t = await text(page);
    const pressed = await page.locator('nav button[aria-pressed="true"]').getAttribute('lang');
    ok(`Gerätesprache ${locale} → ${want}`, lang === want && pressed === want && t.includes(phrase), `${lang}/${pressed}`);
    await ctx.close();
  }
  { const { ctx, page } = await open(browser, { locale: 'en-US' });
    ok('Sprachleiste zeigt ENG, TR, DE, FR', (await page.locator('nav button').allTextContents()).join(',') === 'ENG,TR,DE,FR');
    ok('Hauptsprache: Titel des Ablaufs aus dem Inhalt', (await text(page)).includes('Timeline'));
    await page.locator('nav button[lang="de"]').click(); await page.waitForTimeout(300);
    let t = await text(page);
    ok('Umschalten auf Deutsch ohne Neuladen: feste Texte und übersetzter Inhalt', t.includes('Wir heiraten') && t.includes('Ablauf') && !t.includes('Timeline') && (await page.evaluate(() => document.documentElement.lang)) === 'de');
    ok('Nicht übersetzter Inhalt fällt auf Englisch zurück', t.includes('Getting there') && t.includes('Childcare'));
    await page.reload({ waitUntil: 'load' }); await page.locator('#rsvp').waitFor(); await page.waitForTimeout(500);
    ok('Gewählte Sprache bleibt nach dem Neuladen', (await page.evaluate(() => document.documentElement.lang)) === 'de');
    await page.locator('nav button[lang="tr"]').click(); await page.waitForTimeout(300); t = await text(page);
    ok('Türkisch: feste Texte türkisch, fehlende Übersetzung englisch', t.includes('Evleniyoruz') && t.includes('Timeline') && !t.includes('Wir heiraten'));
    ok('Türkisch: Datum in türkischer Schreibweise', /15 Mayıs 2027/.test(t), t.slice(0, 200));
    await page.locator('nav button[lang="fr"]').click(); await page.waitForTimeout(300); t = await text(page);
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
    ok('Dashboard Cassis: Anmeldung, Menü enthält Kinderbetreuung', nav.some((n) => /Kinderbetreuung/.test(n)), nav.join('|'));
    ok('Dashboard Cassis: keine Einträge für abgewählte Bereiche (Galerie, Gästebuch, Musik)', !nav.some((n) => /Galerie|Gästebuch|Musik|Geschenke|Love/.test(n)), nav.join('|'));
    await page.locator('aside button').filter({ hasText: /Kinderbetreuung/ }).first().click();
    const area = page.locator('main textarea').first(); await area.waitFor({ timeout: 8000 }); await area.fill('Betreuung von 15 bis 22 Uhr im Gartenhaus.');
    await Promise.all([page.waitForResponse((x) => x.url().endsWith('/api/db') && (x.request().postData() || '').includes('updateProjectContent')), page.locator('main button').filter({ hasText: /Speichern/ }).first().click()]);
    await page.waitForTimeout(600);
    const row = ((await db()).project_content || []).find((x) => x.project_id === PID && x.component === 'childcare');
    ok('Dashboard Cassis: Kinderbetreuung speichern landet im richtigen Projekt', row && row.content.description === 'Betreuung von 15 bis 22 Uhr im Gartenhaus.', JSON.stringify(row));
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
