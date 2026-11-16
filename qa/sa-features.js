// SuperAdmin: Zusatzfunktionen je Projekt und RSVP-Übersicht (nur lesen). Aufruf: node sa-features.js <label>
const { chromium } = require('playwright'); const fs = require('fs'); const { pid, SA } = require('./fixtures');
const label = process.argv[2] || 'run'; const BASE = 'http://localhost:4320';
const results = []; const ok = (name, pass, info = '') => { results.push({ name, pass: !!pass, info: String(info).slice(0, 220) }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (pass ? '' : ' :: ' + String(info).slice(0, 240))); };
const dump = async () => (await fetch(BASE + '/__test/db')).json();
const proj = async (n) => (await dump()).projects.find((p) => p.id === pid(n));
(async () => {
  await fetch(BASE + '/__test/reset', { method: 'POST' });
  await fetch(BASE + '/__test/seed', { method: 'POST', body: JSON.stringify({ table: 'rsvp_responses', rows: [
    { project_id: pid(70), name: 'Familie Kaya', email: 'kaya@example.test', persons: 4, attending: true, language: 'tr', guests: [{ name: 'A' }, { name: 'B' }, { name: 'C', is_child: true, age: 7 }, { name: 'D', is_child: true, age: 0 }] },
    { project_id: pid(70), name: 'Jean Dupont', email: 'jean@example.test', persons: 1, attending: false, language: 'fr', guests: null },
    { project_id: pid(70), name: 'Mia Sommer', email: 'mia@example.test', persons: 2, attending: true, language: 'de', guests: '[{"name":"Mia"},{"name":"Tim"}]' }] }) });
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' }); const page = await ctx.newPage();
  await page.route((u) => !u.href.startsWith(BASE), (rt) => rt.abort());
  const errors = []; const writes = [];
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 140)));
  page.on('dialog', (d) => d.accept());
  page.on('request', (q) => { if (q.url().endsWith('/api/db')) { try { const b = JSON.parse(q.postData()); if (b.action !== 'select') writes.push(b); } catch {} } });
  await page.goto(BASE + '/login', { waitUntil: 'load' });
  await page.locator('input[type="email"], input[name="email"]').first().fill(SA.email); await page.locator('input[type="password"]').first().fill(SA.password); await page.keyboard.press('Enter');
  await page.waitForURL((u) => !/login/.test(u.pathname), { timeout: 15000 });
  const openSection = async (n) => { await page.goto(`${BASE}/projects/${pid(n)}`, { waitUntil: 'load' }); const h = page.getByText('Sprachen & RSVP', { exact: false }).first(); await h.waitFor({ timeout: 15000 }); await h.click(); await page.locator('[data-testid="features-panel"]').waitFor({ timeout: 8000 }); await page.waitForTimeout(800); };
  const step = async (name, fn) => { try { await fn(); } catch (e) { ok(name, false, String(e.message).split('\n')[0]); } };

  await step('Cassis-Projekt', async () => {
    await openSection(70);
    const p = page.locator('[data-testid="features-panel"]');
    ok('Zusatzfunktionen: gespeicherte Einstellung wird angezeigt (4 Sprachen, 8 Personen)', await p.locator('input[type="checkbox"]:checked').count() === 7 && await p.locator('input[type="number"]').inputValue() === '8');
    const o = await page.locator('[data-testid="rsvp-overview"]').innerText();
    ok('RSVP-Übersicht: Antworten, Zusagen, Absagen, Personen, Kinder', /3\s*ANTWORTEN/i.test(o) && /2\s*ZUSAGEN/i.test(o) && /1\s*ABSAGEN/i.test(o) && /6\s*PERSONEN/i.test(o) && /2\s*KINDER/i.test(o), o.replace(/\s+/g, ' ').slice(0, 200));
    ok('RSVP-Übersicht: Alter der Kinder (inkl. 0) und Sprachen', /Alter der Kinder: 0, 7/.test(o) && /Türkisch 1/.test(o) && /Französisch 1/.test(o) && /Deutsch 1/.test(o), o.replace(/\s+/g, ' ').slice(0, 300));
    ok('RSVP-Übersicht ist rein lesend (keine Eingabefelder, keine Knöpfe)', await page.locator('[data-testid="rsvp-overview"]').locator('input, button, select, textarea').count() === 0);
    // Ändern: Türkisch abwählen, Obergrenze 6
    await p.locator('label', { hasText: 'Türkisch' }).locator('input').uncheck(); await p.locator('input[type="number"]').fill('6');
    writes.length = 0;
    await Promise.all([page.waitForResponse((x) => x.url().endsWith('/api/db') && (x.request().postData() || '').includes('"update"')), p.getByText('Zusatzfunktionen speichern').click()]); await page.waitForTimeout(800);
    const f = (await proj(70)).features;
    ok('Speichern schreibt nur die Spalte features dieses Projekts', writes.length === 1 && writes[0].table === 'projects' && Object.keys(writes[0].data).join() === 'features' && JSON.stringify(writes[0].filters).includes(pid(70)), JSON.stringify(writes).slice(0, 200));
    ok('Gespeichert: Sprachen en, de, fr und höchstens 6 Personen', f.i18n.languages.join() === 'en,de,fr' && f.rsvp.max_persons === 6 && f.rsvp.child_ages === true && f.rsvp.confirmation_mail === true, JSON.stringify(f));
    writes.length = 0;
    await Promise.all([page.waitForResponse((x) => x.url().endsWith('/api/db') && (x.request().postData() || '').includes('"update"')), page.locator('[data-testid="features-panel"]').getByText('Cassis-Vorgaben übernehmen').click()]); await page.waitForTimeout(800);
    const c = await proj(70);
    ok('„Cassis-Vorgaben übernehmen" setzt Sprachen, Regeln und Bereiche', c.features.i18n.languages.length === 4 && c.features.rsvp.max_persons === 8 && c.component_order.join() === 'hero,countdown,timeline,directions,childcare,rsvp,witnesses,faq' && c.active_components.join() === c.component_order.join(), JSON.stringify(c.features));
    const rs = (await dump()).rsvp_responses.filter((x) => x.project_id === pid(70));
    ok('RSVP-Antworten bleiben unverändert', rs.length === 3 && rs.every((x) => x.name && x.email));
  });
  await step('Altprojekt ohne Spalte', async () => {
    await openSection(7); // base-classic: Zeile ohne features (Zustand vor der Migration)
    const p = page.locator('[data-testid="features-panel"]');
    ok('Ohne Spalte features: Hinweis und gesperrtes Formular', await page.locator('[data-testid="features-missing"]').count() === 1 && await p.locator('fieldset').evaluate((el) => el.disabled));
    writes.length = 0; await p.getByText('Zusatzfunktionen speichern').click({ force: true }).catch(() => {}); await page.waitForTimeout(600);
    ok('Ohne Spalte features: es wird nichts an die Datenbank geschickt', writes.length === 0 && !('features' in (await proj(7))), JSON.stringify(writes).slice(0, 120));
    ok('Kein Knopf für Cassis-Vorgaben bei anderem Theme', await p.getByText('Cassis-Vorgaben übernehmen').count() === 0);
  });
  await step('Altprojekt mit leerer Spalte', async () => {
    await openSection(71);
    const p = page.locator('[data-testid="features-panel"]');
    ok('Leere Einstellung: nichts angehakt, Formular bedienbar', await p.locator('input[type="checkbox"]:checked').count() === 0 && !(await p.locator('fieldset').evaluate((el) => el.disabled)));
    writes.length = 0;
    await Promise.all([page.waitForResponse((x) => x.url().endsWith('/api/db') && (x.request().postData() || '').includes('"update"')), p.getByText('Zusatzfunktionen speichern').click()]); await page.waitForTimeout(600);
    ok('Speichern ohne Auswahl lässt die Einstellung leer (Projekt bleibt Altprojekt)', JSON.stringify((await proj(71)).features) === '{}', JSON.stringify((await proj(71)).features));
    // Großer Speichern-Knopf der Seite darf features nicht anfassen
    writes.length = 0; await page.locator('button').filter({ hasText: /^\s*(💾\s*)?(Speichern|Änderungen speichern)\s*$/i }).last().click().catch(() => {}); await page.waitForTimeout(1500);
    const big = writes.find((w) => w.table === 'projects' && w.action === 'update');
    ok('Der bestehende Speichern-Knopf der Seite sendet die Spalte features nicht mit', big ? !('features' in big.data) : false, big ? Object.keys(big.data).length + ' Felder' : 'kein Speichern ausgelöst');
  });
  await step('Themen und Komponenten', async () => {
    await page.goto(`${BASE}/projects/${pid(70)}`, { waitUntil: 'load' }); await page.waitForTimeout(3000);
    const html = await page.content();
    ok('Theme Cassis steht zur Auswahl', /Cassis/.test(html));
    await page.getByText('Komponenten', { exact: true }).first().click().catch(() => {}); await page.waitForTimeout(600);
    ok('Komponentenliste des Cassis-Projekts zeigt Kinderbetreuung', /Kinderbetreuung \(Cassis\)/.test(await page.evaluate(() => document.body.innerText)));
    await page.goto(`${BASE}/projects/${pid(7)}`, { waitUntil: 'load' }); await page.waitForTimeout(3000);
    await page.getByText('Komponenten', { exact: true }).first().click().catch(() => {}); await page.waitForTimeout(600);
    ok('Komponentenliste anderer Projekte bleibt ohne Kinderbetreuung', !/Kinderbetreuung/.test(await page.evaluate(() => document.body.innerText)));
  });
  ok('Keine Fehler im Browser', errors.length === 0, errors[0]);
  await browser.close();
  fs.writeFileSync(`results/sa-features-${label}.json`, JSON.stringify(results, null, 1));
  const fail = results.filter((x) => !x.pass).length; console.log(`\n${results.length - fail}/${results.length} bestanden`);
})().catch((e) => { console.error('ABBRUCH', e); process.exit(1); });
