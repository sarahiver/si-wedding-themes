// API-Tests gegen den echten Servercode (api/db.js, api/notify.js) mit nachgebauter Datenbank.
// Aufruf: node api-tests.js <label>
const fs = require('fs'); const { pid } = require('./fixtures');
const label = process.argv[2] || 'run'; const BASE = 'http://localhost:4310'; let ipN = 100;
const A = pid(7), B = pid(60); // A = base-classic, B = tenant-b
const call = async (action, params, token, ip) => { const r = await fetch(BASE + '/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip || `10.1.0.${++ipN}`, ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify({ action, params }) }); return { status: r.status, body: await r.json().catch(() => null) }; };
const dump = async () => (await fetch(BASE + '/__test/db')).json();
const post = (p, b) => fetch(BASE + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });
const results = []; const t = (group, name, pass, info = '', kind = 'test') => { results.push({ group, name, pass: !!pass, kind, info: String(info).slice(0, 200) }); console.log(`${pass ? 'ok  ' : (kind === 'luecke' ? 'LÜCKE' : 'FAIL')} [${group}] ${name}${pass ? '' : ' :: ' + String(info).slice(0, 160)}`); };
const rsvp = (o = {}) => ({ name: 'Api Gast', email: `api-${Math.random().toString(36).slice(2, 8)}@example.test`, persons: 1, attending: true, dietary: '', allergies: '', message: '', guests: [], custom_answer: '', ...o });
(async () => {
  await post('/__test/reset');
  const tokA = (await call('verifyAdminPassword', { slug: 'base-classic', password: 'admin-test' })).body.token;
  const tokB = (await call('verifyAdminPassword', { slug: 'tenant-b', password: 'admin-b' })).body.token;
  const guestA = (await call('verifyProjectPassword', { slug: 'base-locked', password: 'gast-test' })).body.token;
  t('Anmeldung', 'Admin-Anmeldung liefert Token', !!tokA && !!tokB);
  t('Anmeldung', 'falsches Admin-Passwort liefert kein Token', !(await call('verifyAdminPassword', { slug: 'base-classic', password: 'x' })).body.token);

  // ---- Mandantentrennung ----
  let r = await call('getRSVPResponses', { projectId: A }, tokA); t('Mandanten', 'Paar A liest eigene Antworten', r.status === 200 && Array.isArray(r.body.data));
  r = await call('getRSVPResponses', { projectId: B }, tokA); t('Mandanten', 'Paar A kann Antworten von Projekt B nicht lesen', r.status === 403 || r.status === 401, r.status + ' ' + JSON.stringify(r.body).slice(0, 80));
  r = await call('getRSVPResponses', { projectId: A }); t('Mandanten', 'ohne Token keine Antworten', r.status === 401, r.status);
  r = await call('getRSVPResponses', { projectId: A }, tokA.slice(0, -3) + 'abc'); t('Mandanten', 'gefälschtes Token wird abgelehnt', r.status === 401, r.status);
  r = await call('getRSVPResponses', { projectId: 'base-locked' }, guestA); t('Mandanten', 'Gäste-Token darf keine Antworten lesen', r.status === 401 || r.status === 403, r.status);
  const bRow = (await dump()).rsvp_responses.find(x => x.project_id === B);
  r = await call('updateRSVPResponse', { projectId: A, id: bRow.id, updates: { name: 'GEHACKT', persons: 99 } }, tokA);
  t('Mandanten', 'Paar A kann Antwort von Projekt B nicht ändern', (await dump()).rsvp_responses.find(x => x.id === bRow.id).name === 'Fremder Gast');
  r = await call('deleteRSVPResponse', { projectId: A, id: bRow.id }, tokA);
  t('Mandanten', 'Paar A kann Antwort von Projekt B nicht löschen', !!(await dump()).rsvp_responses.find(x => x.id === bRow.id));
  r = await call('updateProjectContent', { projectId: B, component: 'rsvp', contentData: { title: 'GEHACKT' } }, tokA);
  t('Mandanten', 'Paar A kann Inhalte von Projekt B nicht überschreiben', (r.status === 403 || r.status === 401) && (await dump()).project_content.find(x => x.project_id === B).content.title === 'Zusage Projekt B', r.status);
  r = await call('updateProjectContent', { projectId: A, component: 'rsvp', contentData: { title: 'A eigen' } }, tokA);
  const d1 = await dump(); t('Mandanten', 'Inhalt von A landet nur bei A', d1.project_content.filter(x => x.component === 'rsvp').length === 2 && d1.project_content.find(x => x.project_id === A).content.title === 'A eigen');

  // ---- Öffentliche Projektdaten ----
  r = await call('getProjectBySlugOrDomain', { slugOrDomain: 'base-classic' });
  const leak = Object.keys(r.body.data).filter(k => /email|_pw|password_hash|client_name|admin_/.test(k));
  t('Datenschutz', 'öffentliche Projektdaten enthalten keine Kontakt- oder Passwortfelder', leak.length === 0, leak.join(','));
  r = await call('updateProject', { projectId: A, updates: { status: 'live', theme: 'neon', password_protected: false, location: 'Neu' } }, tokA);
  const pA = (await dump()).projects.find(x => x.id === A); t('Rechte', 'Paar darf nur Ort/Hashtag ändern, nicht Theme oder Status', pA.location === 'Neu' && pA.theme === 'classic', pA.theme);
  r = await call('updateProjectStatus', { projectId: A, status: 'live' }, tokA); t('Rechte', 'Paar kann sich nicht selbst live schalten', r.status === 400, r.status);
  r = await call('updateProjectStatus', { projectId: A, status: 'ready_for_review' }, tokA); t('Rechte', 'Paar kann „Daten fertig" melden', r.status === 200, r.status);
  await post('/__test/reset');

  // ---- RSVP: heutiges Verhalten ----
  const one = rsvp(); r = await call('submitRSVP', { projectId: A, rsvpData: one }); t('RSVP', 'eine Person wird gespeichert', r.status === 200 && r.body.data && r.body.data.project_id === A, r.status);
  r = await call('checkDuplicateRSVP', { projectId: A, email: one.email }); t('RSVP', 'Doppel-Prüfung erkennt vorhandene E-Mail', r.body.exists === true);
  r = await call('checkDuplicateRSVP', { projectId: B, email: one.email }); t('RSVP', 'Doppel-Prüfung ist je Projekt getrennt', r.body.exists === false);
  r = await call('submitRSVP', { projectId: A, rsvpData: rsvp({ project_id: B, id: 'x', status: 'vip' }) });
  const last = (await dump()).rsvp_responses.slice(-1)[0]; t('RSVP', 'eingeschleuste Felder (fremdes Projekt, id) werden verworfen', last.project_id === A && last.id !== 'x' && !('status' in last), JSON.stringify(Object.keys(last)));
  r = await call('submitRSVP', { projectId: '00000000-0000-4000-8000-999999999999', rsvpData: rsvp() }); t('RSVP', 'unbekanntes Projekt wird abgelehnt', r.status === 423, r.status);
  await post('/__test/fail', { table: 'rsvp_responses', method: 'POST', status: 500 });
  r = await call('submitRSVP', { projectId: A, rsvpData: rsvp() }); t('RSVP', 'Datenbankfehler wird als Fehler gemeldet, nicht als Erfolg', r.status >= 400, r.status);
  // Bekannte Lücken im heutigen Stand (werden in Schritt 1 für Projekte mit Regeln geschlossen)
  for (const n of [9, 999, 0, -3]) { r = await call('submitRSVP', { projectId: A, rsvpData: rsvp({ persons: n }) }); const row = (await dump()).rsvp_responses.slice(-1)[0];
    t('RSVP', `Server lehnt unzulässige Personenzahl ${n} ab`, r.status >= 400, `gespeichert als ${row.persons}`, 'luecke'); }
  r = await call('submitRSVP', { projectId: A, rsvpData: one }); t('RSVP', 'Server verhindert zweite Antwort mit derselben E-Mail', r.status >= 400, 'im Nachbau ohne Unique-Regel angenommen; echte Datenbank nicht prüfbar', 'luecke');
  r = await call('submitRSVP', { projectId: A, rsvpData: rsvp({ email: 'kein-at-zeichen', name: '' }) }); t('RSVP', 'Server prüft Name und E-Mail-Format', r.status >= 400, 'ungeprüft gespeichert', 'luecke');
  // Änderung vorhandener Antworten
  const mine = (await dump()).rsvp_responses.find(x => x.email === one.email);
  r = await call('updateRSVPResponse', { projectId: A, id: mine.id, updates: { name: 'Neu', email: one.email, persons: 3, attending: false, dietary: 'vegan', allergies: '', message: 'm', custom_answer: '' } }, tokA);
  const upd = (await dump()).rsvp_responses.find(x => x.id === mine.id); t('RSVP', 'Paar ändert eigene Antwort, Projekt bleibt gleich', upd.name === 'Neu' && upd.persons === 3 && upd.project_id === A);
  t('RSVP', 'Änderung lässt die Gästeliste (guests) unangetastet', JSON.stringify(upd.guests) === JSON.stringify(mine.guests));

  // ---- Rate-Limit ----
  let last429 = 0; for (let i = 0; i < 64; i++) { const x = await call('checkPasswordRequired', { slug: 'base-classic' }, null, '10.9.9.9'); if (x.status === 429) { last429 = i + 1; break; } }
  t('Schutz', 'Rate-Limit greift bei öffentlichen Aufrufen', last429 > 0 && last429 <= 62, 'ab Aufruf ' + last429);

  // ---- Benachrichtigung an das Paar ----
  const n = await fetch(BASE + '/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.2.0.1' }, body: JSON.stringify({ projectId: A, type: 'rsvp', guestName: 'Api Gast', attending: true, persons: 2, toEmail: 'angreifer@example.test', to: 'angreifer@example.test' }) });
  const ob = await (await fetch(BASE + '/__test/outbox')).json(); const m = ob.outbox.slice(-1)[0];
  t('Mail', 'Benachrichtigung geht an die hinterlegte Adresse des Paares', n.status === 200 && m && m.body.to[0].email === 'paar@example.test', n.status + ' ' + JSON.stringify(m && m.body.to));
  t('Mail', 'Empfänger lässt sich nicht über die Anfrage vorgeben', m && !JSON.stringify(m.body.to).includes('angreifer'));
  t('Mail', 'kein Aufruf an echte Server (alles abgefangen)', ob.blocked.length === 0, ob.blocked.join(','));
  fs.writeFileSync(`results/api-${label}.json`, JSON.stringify(results, null, 1));
  const real = results.filter(x => x.kind === 'test'); console.log(`\n${real.filter(x => x.pass).length} von ${real.length} Tests bestanden, ${results.filter(x => x.kind === 'luecke' && !x.pass).length} bekannte Lücken dokumentiert`);
})().catch(e => { console.error('ABBRUCH', e); process.exit(1); });
