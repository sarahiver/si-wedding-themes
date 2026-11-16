// Neue Prüfungen: RSVP-Regeln, Mandantentrennung, Idempotenz und Bestätigungsmail
// für Projekte mit Regeln (features.rsvp). Aufruf: node api-rules.js <label>
const fs = require('fs'); const { pid } = require('./fixtures');
const label = process.argv[2] || 'run'; const BASE = 'http://localhost:4310'; let ipN = 0;
const C = pid(70), B = pid(60), L = pid(71), A = pid(7);
const call = async (action, params, token, ip) => { const r = await fetch(BASE + '/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip || `10.3.${Math.floor(++ipN / 250)}.${ipN % 250}`, ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify({ action, params }) }); return { status: r.status, body: await r.json().catch(() => null) }; };
const dump = async () => (await fetch(BASE + '/__test/db')).json();
const outbox = async () => (await (await fetch(BASE + '/__test/outbox')).json());
const post = (p, b) => fetch(BASE + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });
const results = []; const t = (group, name, pass, info = '') => { results.push({ group, name, pass: !!pass, info: String(info).slice(0, 200) }); console.log(`${pass ? 'ok  ' : 'FAIL'} [${group}] ${name}${pass ? '' : ' :: ' + String(info).slice(0, 180)}`); };
let n = 0; const rsvp = (o = {}) => ({ name: 'Regel Gast', email: `regel-${++n}@example.test`, persons: 1, attending: true, dietary: '', allergies: '', message: '', guests: [], custom_answer: '', language: 'de', ...o });
const g0 = (row) => { const g = typeof row.guests === 'string' ? JSON.parse(row.guests) : row.guests; return g && g[0] && g[0].health_consent_at; };
const rows = async (project) => ((await dump()).rsvp_responses || []).filter(x => x.project_id === project);
const send = (data, project = C) => call('submitRSVP', { projectId: project, rsvpData: data });
const rejects = async (group, name, data, code) => { const before = (await rows(C)).length; const r = await send(data); const after = (await rows(C)).length;
  t(group, name, r.status === 400 && r.body.error && r.body.error.code === code && after === before, `${r.status} ${JSON.stringify(r.body && r.body.error)} gespeichert:${after - before}`); };
(async () => {
  await post('/__test/reset');
  // ---------- Öffentliche Projektdaten ----------
  let r = await call('getProjectBySlugOrDomain', { slugOrDomain: 'base-cassis' });
  t('Projekt', 'Funktionen des Projekts werden ausgeliefert (Sprachen, RSVP-Regeln)', r.body.data.features && r.body.data.features.rsvp.max_persons === 8 && r.body.data.features.i18n.languages.length === 4, JSON.stringify(r.body.data.features));
  r = await call('getProjectBySlugOrDomain', { slugOrDomain: 'base-classic' });
  t('Projekt', 'Altprojekt ohne Spalte features bleibt unverändert lesbar', r.status === 200 && r.body.data.theme === 'classic' && r.body.data.features === undefined);

  // ---------- Personengrenze ----------
  r = await send(rsvp({ persons: 1 })); t('Grenze', 'eine Person wird angenommen', r.status === 200 && r.body.data.persons === 1, r.status);
  r = await send(rsvp({ persons: 8 })); t('Grenze', 'acht Personen werden angenommen', r.status === 200 && r.body.data.persons === 8, r.status);
  await rejects('Grenze', 'neun Personen werden abgelehnt', rsvp({ persons: 9 }), 'persons_max');
  await rejects('Grenze', 'null Personen werden abgelehnt', rsvp({ persons: 0 }), 'persons_min');
  await rejects('Grenze', 'negative Personenzahl wird abgelehnt', rsvp({ persons: -3 }), 'persons_min');
  await rejects('Grenze', 'Kommazahl wird abgelehnt', rsvp({ persons: 2.5 }), 'persons_invalid');
  await rejects('Grenze', 'Text statt Zahl wird abgelehnt', rsvp({ persons: '8' }), 'persons_invalid');
  await rejects('Grenze', 'riesige Zahl wird abgelehnt', rsvp({ persons: 999 }), 'persons_max');
  await rejects('Grenze', 'mehr Gästezeilen als Personen werden abgelehnt', rsvp({ persons: 2, guests: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] }), 'guests_count');

  // ---------- Pflichtangaben ----------
  await rejects('Eingaben', 'leerer Name wird abgelehnt', rsvp({ name: '   ' }), 'name_required');
  await rejects('Eingaben', 'ungültige E-Mail wird abgelehnt', rsvp({ email: 'kein-at-zeichen' }), 'email_invalid');
  await rejects('Eingaben', 'fehlende E-Mail wird abgelehnt', rsvp({ email: '' }), 'email_required');
  await rejects('Eingaben', 'fehlende Zu-/Absage wird abgelehnt', rsvp({ attending: undefined }), 'attending_invalid');
  await rejects('Eingaben', 'Gästeliste als Text wird abgelehnt', rsvp({ guests: 'x' }), 'guests_invalid');
  r = await send(rsvp({ email: '  GROSS@Example.TEST ', name: '  Anna  ', attending: 'yes' }));
  t('Eingaben', 'Name und E-Mail werden bereinigt, „yes" als Zusage verstanden', r.status === 200 && r.body.data.email === 'gross@example.test' && r.body.data.name === 'Anna' && r.body.data.attending === true, JSON.stringify(r.body.data));
  r = await send(rsvp({ id: 'x', project_id: B, status: 'vip', dedupe_key: 'frei', created_at: '2000-01-01' }));
  const inj = (await rows(C)).slice(-1)[0];
  t('Eingaben', 'eingeschleuste Felder werden verworfen', inj.project_id === C && inj.id !== 'x' && !('status' in inj) && inj.dedupe_key === inj.email && !inj.created_at.startsWith('2000'), JSON.stringify(Object.keys(inj)));
  r = await send(rsvp({ message: '<script>alert(1)</script> Çok güzel – déjà vu ✓ 😀' }));
  t('Eingaben', 'Sonderzeichen bleiben unverändert erhalten', r.body.data.message === '<script>alert(1)</script> Çok güzel – déjà vu ✓ 😀');

  // ---------- Kinderalter ----------
  r = await send(rsvp({ persons: 4, guests: [{ name: 'Mama' }, { name: 'Papa' }, { name: 'Kind 1', is_child: true, age: 3 }, { name: 'Kind 2', is_child: true, age: 11 }] }));
  const kids = r.body.data && r.body.data.guests.filter(g => g.is_child);
  t('Kinder', 'mehrere Kinder mit unterschiedlichem Alter werden je Kind gespeichert', r.status === 200 && kids.length === 2 && kids[0].age === 3 && kids[1].age === 11 && kids[1].name === 'Kind 2', JSON.stringify(r.body.data && r.body.data.guests));
  r = await send(rsvp({ persons: 2, guests: [{ name: 'A' }, { name: 'B', is_child: true, age: 0 }] })); t('Kinder', 'Alter 0 wird angenommen', r.status === 200);
  r = await send(rsvp({ persons: 2, guests: [{ name: 'A' }, { name: 'B', is_child: true, age: 17 }] })); t('Kinder', 'Alter 17 wird angenommen', r.status === 200);
  await rejects('Kinder', 'Alter 18 wird abgelehnt', rsvp({ persons: 2, guests: [{ name: 'A' }, { name: 'B', is_child: true, age: 18 }] }), 'child_age_range');
  await rejects('Kinder', 'negatives Alter wird abgelehnt', rsvp({ persons: 2, guests: [{ name: 'A' }, { name: 'B', is_child: true, age: -1 }] }), 'child_age_range');
  await rejects('Kinder', 'Kind ohne Altersangabe wird abgelehnt', rsvp({ persons: 2, guests: [{ name: 'A' }, { name: 'B', is_child: true }] }), 'child_age_required');
  await rejects('Kinder', 'Alter als Text wird abgelehnt', rsvp({ persons: 2, guests: [{ name: 'A' }, { name: 'B', is_child: true, age: 'fünf' }] }), 'child_age_required');
  r = await send(rsvp({ persons: 2, guests: [{ name: 'A' }, { name: 'B', age: 44 }] }));
  t('Kinder', 'Altersangabe bei Erwachsenen wird nicht gespeichert', r.status === 200 && !('age' in r.body.data.guests[1]));

  // ---------- Sprache ----------
  for (const lang of ['en', 'tr', 'de', 'fr']) { r = await send(rsvp({ language: lang })); t('Sprache', `Sprache ${lang} wird gespeichert`, r.status === 200 && r.body.data.language === lang, r.body.data && r.body.data.language); }
  r = await send(rsvp({ language: 'fr-FR' })); t('Sprache', 'regionale Variante fr-FR wird zu fr', r.body.data.language === 'fr');
  r = await send(rsvp({ language: 'xx' })); t('Sprache', 'ungültige Sprache fällt auf Englisch zurück', r.body.data.language === 'en');
  r = await send(rsvp({ language: undefined })); t('Sprache', 'fehlende Sprache fällt auf Englisch zurück', r.body.data.language === 'en');
  r = await send(rsvp({ language: { $ne: 1 } })); t('Sprache', 'manipulierter Sprachwert fällt auf Englisch zurück', r.body.data.language === 'en');

  // ---------- Doppelte, wiederholte und gleichzeitige Anfragen ----------
  await post('/__test/reset');
  const one = rsvp({ email: 'einmal@example.test' });
  r = await send(one); t('Idempotenz', 'erste Antwort wird gespeichert und bestätigt', r.status === 200 && r.body.mail === 'sent', JSON.stringify(r.body.mail));
  r = await send(one); t('Idempotenz', 'wiederholte Anfrage wird als Doppel abgelehnt (409)', r.status === 409 && r.body.error.code === 'duplicate', r.status);
  r = await send({ ...one, email: ' EINMAL@example.test ' }); t('Idempotenz', 'andere Schreibweise derselben E-Mail gilt als Doppel', r.status === 409, r.status);
  t('Idempotenz', 'nach Wiederholungen genau eine gespeicherte Antwort', (await rows(C)).filter(x => x.email === 'einmal@example.test').length === 1);
  let ob = await outbox(); t('Idempotenz', 'nach Wiederholungen genau eine Bestätigungsmail', ob.outbox.filter(m => m.body.to[0].email === 'einmal@example.test').length === 1, ob.outbox.length);
  const par = rsvp({ email: 'parallel@example.test' });
  const rs = await Promise.all(Array.from({ length: 12 }, () => send(par)));
  const okN = rs.filter(x => x.status === 200).length; const dupN = rs.filter(x => x.status === 409).length;
  t('Idempotenz', 'zwölf gleichzeitige Anfragen: genau eine wird gespeichert', okN === 1 && dupN === 11 && (await rows(C)).filter(x => x.email === 'parallel@example.test').length === 1, `ok=${okN} doppelt=${dupN}`);
  ob = await outbox(); t('Idempotenz', 'zwölf gleichzeitige Anfragen: genau eine Bestätigungsmail', ob.outbox.filter(m => m.body.to[0].email === 'parallel@example.test').length === 1);
  r = await send(rsvp({ email: 'einmal@example.test' }), L); t('Idempotenz', 'dieselbe E-Mail in einem anderen Projekt ist erlaubt', r.status === 200, r.status);

  // ---------- Fehlerfälle ----------
  await post('/__test/fail', { table: 'rsvp_responses', method: 'POST', status: 500 });
  const flaky = rsvp({ email: 'netz@example.test' });
  r = await send(flaky); const mailsBefore = (await outbox()).outbox.length;
  t('Fehler', 'Datenbankfehler: Fehler gemeldet, nichts gespeichert, keine Mail', r.status >= 500 && (await rows(C)).filter(x => x.email === 'netz@example.test').length === 0, r.status);
  r = await send(flaky); t('Fehler', 'erneuter Versuch nach dem Fehler gelingt genau einmal', r.status === 200 && (await rows(C)).filter(x => x.email === 'netz@example.test').length === 1 && (await outbox()).outbox.length === mailsBefore + 1, r.status);
  await post('/__test/mailfail', { times: 1, status: 500 });
  r = await send(rsvp({ email: 'mailfehler@example.test' }));
  t('Fehler', 'Brevo-Fehler: Antwort bleibt gespeichert und gilt als Erfolg', r.status === 200 && r.body.mail === 'failed' && (await rows(C)).filter(x => x.email === 'mailfehler@example.test').length === 1, `${r.status} ${r.body && r.body.mail}`);
  await post('/__test/mailfail', { times: 1, throw: true });
  r = await send(rsvp({ email: 'mailnetz@example.test' }));
  t('Fehler', 'Netzwerkfehler beim Mailversand: Antwort bleibt gespeichert', r.status === 200 && r.body.mail === 'failed' && (await rows(C)).filter(x => x.email === 'mailnetz@example.test').length === 1, `${r.status} ${r.body && r.body.mail}`);
  r = await send(rsvp({ email: 'mailfehler@example.test' })); t('Fehler', 'nach Mailfehler löst eine Wiederholung keine zweite Antwort aus', r.status === 409);

  // ---------- Bestätigungsmail ----------
  await post('/__test/reset');
  const subj = {};
  for (const lang of ['en', 'tr', 'de', 'fr']) { await send(rsvp({ email: `mail-${lang}@example.test`, name: 'Zoë Çelik', language: lang, persons: 3, guests: [{ name: 'Zoë' }, { name: 'B' }, { name: 'K', is_child: true, age: 4 }] })); }
  ob = await outbox();
  for (const lang of ['en', 'tr', 'de', 'fr']) { const m = ob.outbox.find(x => x.body.to[0].email === `mail-${lang}@example.test`); subj[lang] = m && m.body.subject;
    t('Mail', `Bestätigung auf ${lang}: Sprache, Empfänger und Sonderzeichen stimmen`, m && m.body.tags.includes(`lang-${lang}`) && m.body.htmlContent.includes(`lang="${lang}"`) && m.body.htmlContent.includes('Zoë Çelik') && m.body.htmlContent.includes('>3<') && />4</.test(m.body.htmlContent) && m.body.sender.email === 'wedding@sarahiver.de', m && m.body.subject); }
  t('Mail', 'vier unterschiedliche Betreffzeilen', new Set(Object.values(subj)).size === 4, JSON.stringify(subj));
  await send(rsvp({ email: 'mail-xx@example.test', language: 'es' })); ob = await outbox();
  t('Mail', 'unbekannte Sprache: Bestätigung auf Englisch', ob.outbox.find(x => x.body.to[0].email === 'mail-xx@example.test').body.tags.includes('lang-en'));
  await send(rsvp({ email: 'absage@example.test', attending: false, language: 'de' })); ob = await outbox();
  const no = ob.outbox.find(x => x.body.to[0].email === 'absage@example.test'); t('Mail', 'Absage erhält eine eigene Bestätigung ohne Personenzahl', no && /Rückmeldung/.test(no.body.subject) && !/Personen</.test(no.body.htmlContent), no && no.body.subject);
  const before = (await outbox()).outbox.length; await send(rsvp({ email: 'alt@example.test' }), A); await send(rsvp({ email: 'alt2@example.test' }), L);
  t('Mail', 'Altprojekte verschicken keine Bestätigung an Gäste', (await outbox()).outbox.length === before);
  t('Mail', 'kein Aufruf an echte Server', (await outbox()).blocked.length === 0);

  // ---------- Altprojekte bleiben wie sie sind ----------
  r = await send(rsvp({ persons: 9, language: 'tr', guests: [{ name: 'x', is_child: true }] }), A); const legacy = (await rows(A)).slice(-1)[0];
  t('Altprojekt', 'Projekt ohne Regeln nimmt Antworten wie bisher an', r.status === 200 && legacy.persons === 9);
  t('Altprojekt', 'Altprojekt bekommt keine neuen Spalten geschrieben', !('language' in legacy) && !('dedupe_key' in legacy), JSON.stringify(Object.keys(legacy)));
  r = await send(rsvp({ persons: 9 }), L); t('Altprojekt', 'leere features-Spalte gilt als Altprojekt', r.status === 200 && !('dedupe_key' in (await rows(L)).slice(-1)[0]));

  // ---------- Mandantentrennung mit den neuen Angaben ----------
  await post('/__test/reset');
  await send(rsvp({ email: 'familie@example.test', persons: 3, language: 'tr', guests: [{ name: 'A' }, { name: 'B' }, { name: 'Kind', is_child: true, age: 6 }] }));
  const tokC = (await call('verifyAdminPassword', { slug: 'base-cassis', password: 'admin-test' })).body.token;
  const tokB = (await call('verifyAdminPassword', { slug: 'tenant-b', password: 'admin-b' })).body.token;
  r = await call('getRSVPResponses', { projectId: C }, tokC); const mine = r.body.data.find(x => x.email === 'familie@example.test');
  t('Mandanten', 'eigenes Paar sieht Kinderalter und Sprache', mine && mine.language === 'tr' && mine.guests[2].age === 6);
  r = await call('getRSVPResponses', { projectId: C }, tokB); t('Mandanten', 'fremdes Paar kann Kinderalter und Sprache nicht lesen', r.status === 403 || r.status === 401, r.status);
  r = await call('getRSVPResponses', { projectId: C }); t('Mandanten', 'ohne Anmeldung keine Antworten', r.status === 401, r.status);
  r = await call('getRSVPResponses', { projectId: B, id: mine.id }, tokB); t('Mandanten', 'fremdes Paar erhält auch mit bekannter Kennung nichts', !JSON.stringify(r.body).includes('familie@example.test'));
  r = await call('updateRSVPResponse', { projectId: B, id: mine.id, updates: { name: 'GEHACKT', email: 'x@example.test', persons: 1, attending: false } }, tokB);
  t('Mandanten', 'fremdes Paar kann die Antwort nicht ändern', (await rows(C)).find(x => x.id === mine.id).name === 'Regel Gast');
  r = await call('deleteRSVPResponse', { projectId: B, id: mine.id }, tokB); t('Mandanten', 'fremdes Paar kann die Antwort nicht löschen', !!(await rows(C)).find(x => x.id === mine.id));
  r = await call('updateProjectContent', { projectId: C, component: 'childcare', contentData: { title: 'GEHACKT', i18n: { tr: { title: 'x' } } } }, tokB);
  t('Mandanten', 'fremdes Paar kann keine (Sprach-)Inhalte überschreiben', (r.status === 403 || r.status === 401) && !((await dump()).project_content || []).some(x => x.project_id === C), r.status);
  r = await call('updateProject', { projectId: C, updates: { features: { rsvp: { max_persons: 50 } } } }, tokC);
  t('Mandanten', 'Paar kann die eigenen RSVP-Regeln nicht selbst ändern', (await dump()).projects.find(p => p.id === C).features.rsvp.max_persons === 8, r.status);

  // ---------- Änderung vorhandener Antworten ----------
  r = await call('updateRSVPResponse', { projectId: C, id: mine.id, updates: { name: 'Familie Neu', email: 'familie@example.test', persons: 4, attending: true, dietary: 'vegan', allergies: '', message: '', custom_answer: '' } }, tokC);
  let cur = (await rows(C)).find(x => x.id === mine.id);
  t('Änderung', 'Paar ändert die Antwort; Kinderalter und Sprache bleiben erhalten', r.status === 200 && cur.name === 'Familie Neu' && cur.persons === 4 && cur.language === 'tr' && cur.guests[2].age === 6 && cur.project_id === C, JSON.stringify(cur));
  r = await call('updateRSVPResponse', { projectId: C, id: mine.id, updates: { name: 'Familie Neu', email: 'familie@example.test', persons: 9, attending: true } }, tokC);
  t('Änderung', 'Änderung über die Personengrenze wird abgelehnt', r.status === 400 && (await rows(C)).find(x => x.id === mine.id).persons === 4, r.status);
  await send(rsvp({ email: 'zweite@example.test' }));
  r = await call('updateRSVPResponse', { projectId: C, id: mine.id, updates: { name: 'Familie Neu', email: 'zweite@example.test', persons: 4, attending: true } }, tokC);
  t('Änderung', 'Änderung auf eine bereits vergebene E-Mail wird abgelehnt', r.status === 409 && (await rows(C)).find(x => x.id === mine.id).email === 'familie@example.test', r.status);
  r = await call('updateRSVPResponse', { projectId: C, id: mine.id, updates: { name: 'Familie Neu', email: 'familie@example.test', persons: 4, attending: true, dietary: 'vegan' } }, tokC);
  t('Änderung', 'erneutes Speichern derselben Antwort bleibt möglich', r.status === 200, r.status);
  t('Änderung', 'Änderungen lösen keine weitere Bestätigungsmail aus', (await outbox()).outbox.filter(m => m.body.to[0].email === 'familie@example.test').length === 1);

  // ---- E-Mail-Prüfung im Server (unabhängig vom Browser) ----
  for (const [bad, why] of [['   ', 'nur Leerzeichen'], ['anna@example', 'ohne Endung'], ['anna@@example.test', 'zwei @'], ['an na@example.test', 'Leerzeichen'], ['anna@example..test', 'doppelter Punkt'], ['anna.@example.test', 'Punkt vor @'], ['@example.test', 'ohne Namen'], ['anna@example.t', 'Endung zu kurz']]) {
    await rejects('E-Mail', `ungültige Adresse wird nicht gespeichert (${why})`, rsvp({ email: bad }), bad.trim() ? 'email_invalid' : 'email_required');
  }
  for (const good of ['ayşe.yılmaz@örnek.com.tr', 'jörg+hochzeit@straße.example', "o'neil@ex-ample.co.uk"]) {
    r = await send(rsvp({ email: `  ${good.replace(/[a-hj-z]/g, (ch) => ch.toUpperCase())}  ` })); // nur einfache Buchstaben groß, damit die Schreibweise eindeutig zurückführbar ist
    t('E-Mail', `gültige internationale Adresse wird angenommen und bereinigt (${good})`, r.status === 200 && r.body.data.email === good.toLowerCase(), r.status + ' ' + JSON.stringify(r.body).slice(0, 120));
  }
  r = await send(rsvp({ email: ' Ayşe.Yılmaz@Örnek.com.TR' }));
  t('E-Mail', 'Doppelantwortschutz greift auch nach der Bereinigung', r.status === 409, r.status);
  let mailsBefore2 = (await outbox()).outbox.length;
  r = await send(rsvp({ email: 'kaputt@' }));
  t('E-Mail', 'ungültige Adresse löst keine Bestätigungsmail aus', r.status === 400 && (await outbox()).outbox.length === mailsBefore2, r.status);
  r = await send(rsvp({ email: 'bestaetigung@example.test' }));
  t('E-Mail', 'gültige Adresse löst genau eine Bestätigungsmail an diese Adresse aus', r.status === 200 && r.body.mail === 'sent' && (await outbox()).outbox.filter((m) => m.body.to[0].email === 'bestaetigung@example.test').length === 1, JSON.stringify(r.body).slice(0, 100));

  // ---- Ernährung und Allergien je Person ----
  const fam = rsvp({ name: 'Dana Diät', email: 'diaet@example.test', persons: 3, guests: [{ name: 'Dana Diät', diet: 'vegan' }, { name: 'Eli', diet: 'other', diet_note: 'kein Fisch', allergies: 'Nüsse, Laktose' }, { name: 'Fee', is_child: true, age: 4, diet: 'vegetarian' }] });
  await rejects('Ernährung', 'Allergie-Angaben ohne Einwilligung werden nicht gespeichert', fam, 'consent_required');
  await rejects('Ernährung', 'Einwilligung muss ausdrücklich wahr sein (Text „true" genügt nicht)', { ...fam, health_consent: 'true' }, 'consent_required');
  r = await send({ ...fam, health_consent: true });
  let row = (await rows(C)).find((x) => x.email === 'diaet@example.test'); let g = row ? (typeof row.guests === 'string' ? JSON.parse(row.guests) : row.guests) : [];
  t('Ernährung', 'mit Einwilligung gespeichert: drei Personen mit eigenen Angaben', r.status === 200 && g.length === 3 && g[0].diet === 'vegan' && g[1].diet === 'other' && g[1].diet_note === 'kein Fisch' && g[1].allergies === 'Nüsse, Laktose' && g[2].diet === 'vegetarian', JSON.stringify(g));
  t('Ernährung', 'Kinderalter bleibt bei der richtigen Person', g[2] && g[2].is_child === true && g[2].age === 4 && !g[0].is_child && !g[1].is_child);
  t('Ernährung', 'Zeitpunkt der Einwilligung wird im Server festgehalten', g[0] && /^\d{4}-\d\d-\d\dT/.test(g[0].health_consent_at || '') && Math.abs(Date.now() - Date.parse(g[0].health_consent_at)) < 60000, g[0] && g[0].health_consent_at);
  t('Ernährung', 'Felder der Antwort zeigen die Angaben der anmeldenden Person (Dashboard-Tabelle)', row.dietary === 'Vegan' && row.allergies === '' && g[1].dietary === 'Sonstiges: kein Fisch', row.dietary + '|' + row.allergies);
  const mailD = (await outbox()).outbox.find((m) => m.body.to[0].email === 'diaet@example.test');
  t('Ernährung', 'Bestätigungsmail enthält keine Ernährungs- oder Allergieangaben', mailD && !/Nüsse|Laktose|Vegan|kein Fisch|Vegetarisch/i.test(mailD.body.htmlContent));
  r = await send(rsvp({ email: 'nurwahl@example.test', persons: 2, guests: [{ name: 'A', diet: 'vegetarian' }, { name: 'B', diet: 'none' }] }));
  t('Ernährung', 'reine Auswahl (vegetarisch/vegan) braucht keine Einwilligung', r.status === 200 && r.body.data.guests[0].dietary === 'Vegetarisch' && !r.body.data.guests[0].health_consent_at, r.status);
  await rejects('Ernährung', 'unbekannte Ernährungsweise wird abgelehnt', rsvp({ email: 'x1@example.test', guests: [{ name: 'A', diet: 'fleisch' }] }), 'diet_invalid');
  const eight = Array.from({ length: 8 }, (_, i) => ({ name: `Person ${i + 1}`, diet: ['none', 'vegetarian', 'vegan', 'other'][i % 4], allergies: i === 6 ? 'Gluten' : '' }));
  r = await send(rsvp({ email: 'acht-diaet@example.test', persons: 8, health_consent: true, guests: eight }));
  g = r.body.data ? r.body.data.guests : [];
  t('Ernährung', 'acht Personen mit je eigenen Angaben', r.status === 200 && g.length === 8 && g[6].allergies === 'Gluten' && g.filter((x) => x.diet === 'vegan').length === 2, r.status);
  await rejects('Ernährung', 'neun Personen bleiben abgelehnt', rsvp({ email: 'neun-diaet@example.test', persons: 9, guests: [...eight, { name: 'P9' }] }), 'persons_max');
  r = await send(rsvp({ email: 'absage-diaet@example.test', attending: false, guests: [{ name: 'Nein', diet: 'vegan', allergies: 'Nüsse' }] }));
  row = (await rows(C)).find((x) => x.email === 'absage-diaet@example.test');
  t('Ernährung', 'Absage speichert keine Ernährungs- und Allergieangaben', r.status === 200 && row.dietary === '' && row.allergies === '' && !/vegan|Nüsse/i.test(JSON.stringify(row.guests)), JSON.stringify(row.guests));
  r = await send(rsvp({ email: 'altform@example.test', persons: 2, dietary: 'vegetarisch', allergies: 'Laktose', guests: [{ name: 'A' }, { name: 'B' }] }));
  t('Ernährung', 'ältere Form (ein Text für die ganze Anmeldung) wird weiter angenommen', r.status === 200 && r.body.data.dietary === 'vegetarisch' && r.body.data.allergies === 'Laktose', r.status);
  const famRow = (await rows(C)).find((x) => x.email === 'diaet@example.test');
  r = await call('updateRSVPResponse', { projectId: C, id: famRow.id, updates: { name: 'Dana Diät', email: 'diaet@example.test', persons: 3, attending: true, dietary: 'Vegan', allergies: '', message: 'geändert' } }, tokC);
  const famAfter = (await rows(C)).find((x) => x.id === famRow.id); const gA = typeof famAfter.guests === 'string' ? JSON.parse(famAfter.guests) : famAfter.guests;
  t('Ernährung', 'Bearbeiten im Dashboard lässt Angaben je Person und Einwilligung unverändert', r.status === 200 && famAfter.message === 'geändert' && gA[1].allergies === 'Nüsse, Laktose' && gA[0].health_consent_at === g0(famRow), r.status);
  r = await call('getRSVPResponses', { projectId: C }, tokB); t('Ernährung', 'fremdes Paar kann die Angaben nicht lesen', r.status === 401 || r.status === 403, r.status);
  r = await call('getRSVPResponses', { projectId: C }); t('Ernährung', 'ohne Anmeldung sind die Angaben nicht lesbar', r.status === 401, r.status);
  r = await send(rsvp({ email: 'legacy-diaet@example.test', guests: [{ name: 'A', diet: 'fleisch', allergies: 'Nüsse' }] }), A);
  t('Ernährung', 'Altprojekt ohne Regeln bleibt unverändert (keine neue Prüfung)', r.status === 200, r.status);

  fs.writeFileSync(`results/api-rules-${label}.json`, JSON.stringify(results, null, 1));
  console.log(`\n${results.filter(x => x.pass).length} von ${results.length} bestanden`);
})().catch(e => { console.error('ABBRUCH', e); process.exit(1); });
