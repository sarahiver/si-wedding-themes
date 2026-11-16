// SuperAdmin-Abläufe gegen den echten API-Code mit nachgebauter Datenbank. Aufruf: node sa.js <label>
const { chromium } = require('playwright'); const fs = require('fs'); const { pid, SA, THEMES } = require('./fixtures');
const label = process.argv[2] || 'run'; const BASE = 'http://localhost:4320';
const results = []; const ok = (name, pass, info = '') => { results.push({ name, pass: !!pass, info: String(info).slice(0, 220) }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (pass ? '' : ' :: ' + String(info).slice(0, 220))); };
const dump = async () => (await fetch(BASE + '/__test/db')).json();
(async () => {
  await fetch(BASE + '/__test/reset', { method: 'POST' });
  await fetch(BASE + '/__test/seed', { method: 'POST', body: JSON.stringify({ table: 'rsvp_responses', rows: [
    { project_id: pid(7), name: 'Anna Beispiel', email: 'anna@example.test', persons: 3, attending: true, dietary: 'vegetarisch', allergies: '', message: '', guests: [{ name: 'Anna Beispiel' }, { name: 'Ben Beispiel' }, { name: 'Kind Beispiel' }], custom_answer: '' },
    { project_id: pid(7), name: 'Carl Absage', email: 'carl@example.test', persons: 1, attending: false, dietary: '', allergies: '', message: '', guests: null, custom_answer: '' }] }) });
  let r = await fetch(BASE + '/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'select', table: 'projects' }) });
  ok('API: ohne Anmeldung kein Zugriff', r.status === 401, r.status);
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' }); const page = await ctx.newPage();
  await page.route(u => !u.href.startsWith(BASE), rt => rt.abort());
  const errors = []; const calls = [];
  page.on('pageerror', e => errors.push(String(e.message).slice(0, 140)));
  page.on('request', q => { if (q.url().endsWith('/api/db')) { try { calls.push(JSON.parse(q.postData())); } catch {} } });
  const step = async (name, fn) => { try { await fn(); } catch (e) { ok(name, false, String(e.message).split('\n')[0]); } };
  await step('Anmeldung', async () => {
    await page.goto(BASE + '/login', { waitUntil: 'load' });
    await page.locator('input[type="email"], input[name="email"]').first().fill(SA.email);
    await page.locator('input[type="password"]').first().fill('falsch'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
    ok('Anmeldung: falsches Passwort bleibt auf der Login-Seite', /login/.test(page.url()));
    await page.locator('input[type="password"]').first().fill(SA.password); await page.keyboard.press('Enter');
    await page.waitForURL(u => !/login/.test(u.pathname), { timeout: 15000 });
    ok('Anmeldung: richtiges Passwort öffnet das Dashboard', true);
  });
  const tok = await page.evaluate(() => localStorage.getItem('si_admin_token'));
  r = await fetch(BASE + '/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok }, body: JSON.stringify({ action: 'select', table: 'geheim' }) });
  ok('API: nicht freigegebene Tabelle wird abgelehnt', r.status === 403, r.status);
  await step('Projektliste', async () => {
    await page.goto(BASE + '/projects', { waitUntil: 'load' }); await page.waitForTimeout(3000);
    const txt = await page.evaluate(() => document.body.innerText);
    ok('Projektliste zeigt alle Testprojekte (14, zehn je Seite)', /ALLE\s*\(14\)/i.test(txt) && (txt.match(/ÖFFNEN/gi) || []).length === 10, (txt.match(/ÖFFNEN/gi) || []).length);
  });
  await step('Neues Projekt', async () => {
    await page.goto(BASE + '/projects/new', { waitUntil: 'load' }); await page.waitForTimeout(2500);
    const html = await page.content(); const txt = await page.evaluate(() => document.body.innerText);
    const names = ['Botanical', 'Editorial', 'Contemporary', 'Luxe', 'Neon', 'Video', 'Classic', 'Parallax', 'Summer'];
    const present = names.filter(n => html.includes(n));
    ok('Neues Projekt: alle neun Themes wählbar', present.length === 9, 'gefunden: ' + present.join(','));
    fs.mkdirSync('results', { recursive: true }); fs.writeFileSync(`results/sa-new-${label}.txt`, txt);
  });
  await step('Projektdetail', async () => {
    await page.goto(`${BASE}/projects/${pid(7)}`, { waitUntil: 'load' }); await page.waitForTimeout(3500);
    let txt = await page.evaluate(() => document.body.innerText);
    ok('Projektdetail lädt das richtige Projekt', /Mia/.test(txt) && /base-classic/.test(await page.content()), txt.slice(0, 120));
    const tabs = (await page.locator('button, [role="tab"], a').allTextContents()).map(t => t.trim()).filter(t => t && t.length < 28);
    fs.writeFileSync(`results/sa-detail-buttons-${label}.json`, JSON.stringify([...new Set(tabs)]));
    // Feststellung der Baseline: Die Projektdetailseite hat heute KEINE RSVP-Ansicht.
    // Gewollte Änderung in Schritt 1 (Ausgangsbasis: keine RSVP-Ansicht): schlanke Übersicht, nur lesen.
    ok('Projektdetail zeigt die RSVP-Übersicht des eigenen Projekts (neu, gewollt)', /Anna Beispiel/.test(txt) && /Carl Absage/.test(txt));
    ok('Projektdetail zeigt keine Antworten anderer Projekte', !/Fremder Gast/.test(txt));
    fs.writeFileSync(`results/sa-detail-${label}.txt`, txt);
  });
  await step('Speichern', async () => {
    const before = (await dump()).projects.find(p => p.id === pid(7)); calls.length = 0;
    await page.goto(`${BASE}/projects/${pid(7)}`, { waitUntil: 'load' }); await page.waitForTimeout(3000);
    const save = page.locator('button').filter({ hasText: /^\s*(💾\s*)?Speichern/ }).first();
    await save.scrollIntoViewIfNeeded(); await save.click(); await page.waitForTimeout(2500);
    const upd = calls.find(c => c.action === 'update' && c.table === 'projects');
    const after = (await dump()).projects.find(p => p.id === pid(7));
    ok('Speichern sendet eine Projektänderung', !!upd, calls.map(c => c.action + ':' + c.table).join(','));
    const changed = Object.keys(before).filter(k => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
    ok('Speichern ohne Eingabe lässt Theme, Adresse und Status unverändert', after.theme === before.theme && after.slug === before.slug && after.status === before.status, changed.join(','));
    fs.writeFileSync(`results/sa-save-${label}.json`, JSON.stringify({ sentKeys: upd ? Object.keys(upd.data).sort() : null, changed }, null, 1));
    const others = (await dump()).projects.filter(p => p.id !== pid(7)); ok('Speichern verändert kein anderes Projekt', others.every(p => p.couple_names && p.theme), '');
  });
  ok('Keine Laufzeitfehler im SuperAdmin', errors.length === 0, [...new Set(errors)].slice(0, 3).join(' | '));
  await browser.close();
  fs.writeFileSync(`results/sa-${label}.json`, JSON.stringify(results, null, 1));
  console.log(`\n${results.filter(x => x.pass).length} von ${results.length} bestanden`);
  const b = await (await fetch(BASE + '/__test/outbox')).json(); console.log('gesperrte Netzaufrufe des Servers:', b.blocked.length, b.blocked.slice(0, 3).join(' '));
})();
