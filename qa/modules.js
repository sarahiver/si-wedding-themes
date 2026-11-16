// Stellvertretende Funktionsprüfungen: Gästebuch, Musikwünsche, Foto-Upload, Geschenke.
// Aufruf: node modules.js <label>
const { chromium } = require('playwright'); const fs = require('fs'); const { pid } = require('./fixtures');
const label = process.argv[2] || 'run'; const BASE = 'http://localhost:4310'; let ipN = 0; const PH = fs.readFileSync(__dirname + '/placeholder.jpg');
const A = pid(7), B = pid(60), DRAFT = pid(50);
const call = async (action, params, token) => { const r = await fetch(BASE + '/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.3.0.${++ipN}`, ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify({ action, params }) }); return { status: r.status, body: await r.json().catch(() => null) }; };
const dump = async () => (await fetch(BASE + '/__test/db')).json();
const results = []; const ok = (group, name, pass, info = '') => { results.push({ group, name, pass: !!pass, info: String(info).slice(0, 200) }); console.log(`${pass ? 'ok  ' : 'FAIL'} [${group}] ${name}${pass ? '' : ' :: ' + String(info).slice(0, 220)}`); };
(async () => {
  await fetch(BASE + '/__test/reset', { method: 'POST' });
  const tokA = (await call('verifyAdminPassword', { slug: 'base-classic', password: 'admin-test' })).body.token;
  const tokB = (await call('verifyAdminPassword', { slug: 'tenant-b', password: 'admin-b' })).body.token;
  let r;

  // ---- Gästebuch ----
  r = await call('submitGuestbookEntry', { projectId: A, entryData: { name: 'Gast Eins', message: 'Alles Liebe!' } }); const gb = r.body.data;
  ok('Gästebuch', 'Eintrag wird gespeichert, zunächst nicht freigegeben', r.status === 200 && gb && gb.approved === false && gb.project_id === A, JSON.stringify(r.body).slice(0, 150));
  r = await call('getGuestbookEntries', { projectId: A }); ok('Gästebuch', 'nicht freigegebener Eintrag ist für Gäste unsichtbar', r.body.data.length === 0, r.body.data.length);
  r = await call('approveGuestbookEntry', { projectId: B, entryId: gb.id, approved: true }, tokB); ok('Gästebuch', 'fremdes Paar kann den Eintrag nicht freigeben', (await dump()).guestbook_entries.find((x) => x.id === gb.id).approved === false);
  r = await call('approveGuestbookEntry', { projectId: A, entryId: gb.id, approved: true }); ok('Gästebuch', 'Freigabe ohne Anmeldung wird abgelehnt', r.status === 401, r.status);
  r = await call('approveGuestbookEntry', { projectId: A, entryId: gb.id, approved: true }, tokA); ok('Gästebuch', 'Paar gibt den Eintrag frei', r.body.data && r.body.data.approved === true);
  r = await call('getGuestbookEntries', { projectId: A }); ok('Gästebuch', 'freigegebener Eintrag erscheint für Gäste', r.body.data.length === 1 && r.body.data[0].message === 'Alles Liebe!');
  r = await call('getGuestbookEntries', { projectId: B }); ok('Gästebuch', 'Eintrag erscheint nicht in einem anderen Projekt', r.body.data.length === 0);
  r = await call('deleteGuestbookEntry', { projectId: B, entryId: gb.id }, tokB); ok('Gästebuch', 'fremdes Paar kann den Eintrag nicht löschen', !!(await dump()).guestbook_entries.find((x) => x.id === gb.id));
  r = await call('deleteGuestbookEntry', { projectId: A, entryId: gb.id }, tokA); ok('Gästebuch', 'Paar löscht den Eintrag', !(await dump()).guestbook_entries.find((x) => x.id === gb.id));
  r = await call('submitGuestbookEntry', { projectId: DRAFT, entryData: { name: 'x', message: 'y' } }); ok('Gästebuch', 'Eintrag in ein Entwurfsprojekt wird abgelehnt (423)', r.status === 423, r.status);

  // ---- Musikwünsche ----
  r = await call('submitMusicWish', { projectId: A, wishData: { name: 'Gast Zwei', artist: 'ABBA', songTitle: 'Dancing Queen' } }); const mw = r.body.data;
  ok('Musikwünsche', 'Wunsch wird gespeichert (Titel und Interpret)', r.status === 200 && mw && mw.song_title === 'Dancing Queen' && mw.artist === 'ABBA', JSON.stringify(r.body).slice(0, 150));
  r = await call('getMusicWishes', { projectId: A }); ok('Musikwünsche', 'Wunsch erscheint in der Liste des Projekts', r.body.data.length === 1);
  r = await call('getMusicWishes', { projectId: B }); ok('Musikwünsche', 'Wunsch erscheint nicht in einem anderen Projekt', r.body.data.length === 0);
  r = await call('deleteMusicWish', { projectId: B, wishId: mw.id }, tokB); ok('Musikwünsche', 'fremdes Paar kann den Wunsch nicht löschen', (await dump()).music_wishes.length === 1);
  r = await call('deleteMusicWish', { projectId: A, wishId: mw.id }); ok('Musikwünsche', 'Löschen ohne Anmeldung wird abgelehnt', r.status === 401, r.status);
  r = await call('deleteMusicWish', { projectId: A, wishId: mw.id }, tokA); ok('Musikwünsche', 'Paar löscht den Wunsch', (await dump()).music_wishes.length === 0);
  r = await call('submitMusicWish', { projectId: DRAFT, wishData: { name: 'x', songTitle: 'y' } }); ok('Musikwünsche', 'Wunsch an ein Entwurfsprojekt wird abgelehnt (423)', r.status === 423, r.status);

  // ---- Foto-Upload (Eintrag nach dem Hochladen; das Hochladen selbst läuft über Cloudinary) ----
  r = await call('submitPhotoUpload', { projectId: A, photoData: { uploadedBy: 'Gast Drei', cloudinaryUrl: 'https://res.cloudinary.com/test/image/upload/a.jpg', cloudinaryPublicId: 'a' } }); const ph = r.body.data;
  ok('Foto-Upload', 'Foto-Eintrag wird gespeichert, zunächst nicht freigegeben', r.status === 200 && ph && ph.approved === false && ph.uploaded_by === 'Gast Drei', JSON.stringify(r.body).slice(0, 150));
  r = await call('getPhotoUploads', { projectId: A }); ok('Foto-Upload', 'nicht freigegebenes Foto ist für Gäste unsichtbar', r.body.data.length === 0);
  r = await call('approvePhotoUpload', { projectId: B, photoId: ph.id }, tokB); ok('Foto-Upload', 'fremdes Paar kann das Foto nicht freigeben', (await dump()).photo_uploads.find((x) => x.id === ph.id).approved === false);
  r = await call('approvePhotoUpload', { projectId: A, photoId: ph.id }, tokA); ok('Foto-Upload', 'Paar gibt das Foto frei', r.body.data && r.body.data.approved === true);
  r = await call('getPhotoUploads', { projectId: A }); ok('Foto-Upload', 'freigegebenes Foto erscheint für Gäste', r.body.data.length === 1);
  r = await call('getPhotoUploads', { projectId: B }); ok('Foto-Upload', 'Foto erscheint nicht in einem anderen Projekt', r.body.data.length === 0);
  r = await call('deletePhotoUpload', { projectId: B, photoId: ph.id }, tokB); ok('Foto-Upload', 'fremdes Paar kann das Foto nicht löschen', (await dump()).photo_uploads.length === 1);
  r = await call('deletePhotoUpload', { projectId: A, photoId: ph.id }, tokA); ok('Foto-Upload', 'Paar löscht das Foto', (await dump()).photo_uploads.length === 0);

  // ---- Geschenke ----
  r = await call('reserveGift', { projectId: A, itemId: 'gift-1', reservedBy: 'Gast Vier', reserverEmail: 'vier@example.test' }); const gr = r.body.data;
  ok('Geschenke', 'Reservierung wird gespeichert', r.status === 200 && gr && gr.item_id === 'gift-1' && gr.reserved_by === 'Gast Vier', JSON.stringify(r.body).slice(0, 150));
  r = await call('getGiftReservations', { projectId: A }); ok('Geschenke', 'Reservierung erscheint im Projekt', r.body.data.length === 1);
  r = await call('getGiftReservations', { projectId: B }); ok('Geschenke', 'Reservierung erscheint nicht in einem anderen Projekt', r.body.data.length === 0);
  r = await call('unreserveGiftByItemId', { projectId: B, itemId: 'gift-1' }, tokB); ok('Geschenke', 'fremdes Paar kann die Reservierung nicht aufheben', (await dump()).gift_reservations.length === 1);
  r = await call('deleteGiftReservation', { projectId: A, reservationId: gr.id }); ok('Geschenke', 'Aufheben ohne Anmeldung wird abgelehnt', r.status === 401, r.status);
  r = await call('unreserveGiftByItemId', { projectId: A, itemId: 'gift-1' }, tokA); ok('Geschenke', 'Paar hebt die Reservierung auf', (await dump()).gift_reservations.length === 0);
  r = await call('reserveGift', { projectId: DRAFT, itemId: 'g', reservedBy: 'x' }); ok('Geschenke', 'Reservierung in einem Entwurfsprojekt wird abgelehnt (423)', r.status === 423, r.status);

  // ---- Im Browser: Gästebuch und Musikwunsch auf einer bestehenden Seite (Classic) ----
  const browser = await chromium.launch();
  for (const [group, id, fill, table, check] of [
    ['Gästebuch', 'guestbook', { name: 'Browser Gast', text: 'Viel Glück euch beiden!' }, 'guestbook_entries', (x) => x.message === 'Viel Glück euch beiden!'],
    ['Musikwünsche', 'musicwishes', { name: 'Browser Gast', text: 'Mr. Brightside' }, 'music_wishes', (x) => /Brightside/.test(x.song_title + x.artist)],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', locale: 'de-DE', extraHTTPHeaders: { 'x-forwarded-for': `10.3.1.${++ipN}` } }); const page = await ctx.newPage();
    await page.route((u) => !u.href.startsWith(BASE), (rt) => (rt.request().resourceType() === 'image' ? rt.fulfill({ status: 200, contentType: 'image/jpeg', body: PH }) : rt.abort()));
    try {
      await page.goto(BASE + '/base-classic', { waitUntil: 'load' }); const sec = page.locator('#' + id).first(); await sec.waitFor({ timeout: 25000 }); await sec.scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
      const inputs = sec.locator('input[type="text"], input:not([type])'); const n = await inputs.count();
      await inputs.first().fill(fill.name);
      if (await sec.locator('textarea').count()) await sec.locator('textarea').first().fill(fill.text); else for (let i = 1; i < n; i++) await inputs.nth(i).fill(fill.text);
      await sec.locator('button[type="submit"], form button').last().click(); await page.waitForTimeout(2000);
      const rows = ((await dump())[table] || []).filter((x) => x.project_id === A);
      ok(group, 'Formular auf der Seite (Classic, Handybreite) speichert den Eintrag im richtigen Projekt', rows.length === 1 && check(rows[0]), JSON.stringify(rows).slice(0, 200));
    } catch (e) { ok(group, 'Formular auf der Seite (Classic, Handybreite)', false, String(e.message).split('\n')[0]); }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(`results/modules-${label}.json`, JSON.stringify(results, null, 1));
  const fail = results.filter((x) => !x.pass).length; console.log(`\n${results.length - fail}/${results.length} bestanden`);
})().catch((e) => { console.error('ABBRUCH', e); process.exit(1); });
