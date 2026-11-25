// Beispielprojekt „lena-tom" für Ansicht und Tests des Cassis-Themes (nur im Testspeicher).
const fs = require('fs'); const path = require('path'); const { pid } = require('./fixtures');
const BASE = 'http://localhost:4310'; const A = path.join(__dirname, '../../assets');
const ASSETS = { 'hero.jpg': ['paarfoto-2.jpg', 'image/jpeg'], 'ablauf.jpg': ['paarfoto-1.jpg', 'image/jpeg'], 'schriftzug.svg': ['schriftzug-lena-tom-weiss.svg', 'image/svg+xml'], 'schloss.svg': ['schloss.svg', 'image/svg+xml'] };
const U = (n) => `https://assets.test/${n}`; const PID = pid(72);
const CONTENT = {
  hero: { background_image: U('hero.jpg'), name_image: U('schriftzug.svg') },
  countdown: { target_date: '2027-05-15', target_time: '15:00' },
  timeline: { title: 'Timeline', image: U('ablauf.jpg'), events: [
    { time: '15:00', title: 'Grande entrée' }, { time: '15:15', title: 'Cérémonie' }, { time: '16:00', title: "Vin d'honneur" }, { time: '18:00', title: 'Dîner' },
    { time: '20:30', title: 'Pièce montée' }, { time: '21:00', title: 'Ouverture du bal' }, { time: '21:15', title: 'Soirée dansante' }],
    i18n: { de: { title: 'Ablauf' }, fr: { title: 'Programme' } } },
  directions: { title: 'Getting there', address: 'Traverse du Château\n13260 Cassis\nFrance', image: U('schloss.svg'), description: '[Placeholder] Travel notes to follow.' },
  childcare: { title: 'Childcare', description: 'Alter Inhalt, bleibt gespeichert, wird nicht mehr angezeigt.' },
  rsvp: { title: 'RSVP', description: '[Placeholder] Please let us know whether you can join us.', ask_dietary: true, ask_allergies: true },
  witnesses: { title: 'Witnesses', persons: [{ name: '[Placeholder] Name', role: 'Maid of honour', phone: '+49 000 0000000' }, { name: '[Placeholder] Name', role: 'Best man', email: 'name@example.test' }] },
  accommodations: { title: 'Hotels', description: '[Placeholder] A few places nearby.', hotels: [1, 2, 3, 4].map((n) => ({
    name: `[Placeholder] Hôtel ${n}`, distance: `${n * 2} km`, address: 'Rue du Port\n13260 Cassis', price_range: 'ab 120 € / Nacht', booking_code: n === 1 ? 'LENATOM27' : '',
    image: U('ablauf.jpg'), booking_url: 'https://example.test/book', maps_url: 'https://example.test/map' })) },
  faq: { title: 'FAQ', questions: [{ question: '[Placeholder] Is there a dress code?', answer: '[Placeholder] Answer follows.' }, { question: '[Placeholder] Where can we stay?', answer: '[Placeholder] Answer follows.' }] },
};
const post = (p, b) => fetch(BASE + p, { method: 'POST', body: b ? JSON.stringify(b) : undefined });
async function seedCassis() {
  await post('/__test/reset');
  const db = await (await fetch(BASE + '/__test/db')).json();
  const p = db.projects.find((x) => x.slug === 'base-cassis');
  // 'childcare' steht absichtlich mit in der Liste: ältere Projekte haben den Bereich noch gespeichert, das Theme zeigt ihn nicht mehr.
  const ORDER = ['hero', 'timeline', 'countdown', 'rsvp', 'directions', 'faq', 'witnesses', 'childcare'];
  // Nur für die Ansicht der Hotels (CASSIS_HOTELS=1): die Prüfungen laufen mit der gewohnten Reihenfolge
  if (process.env.CASSIS_HOTELS) ORDER.splice(5, 0, 'accommodations');
  const mk = (n, slug, extra) => ({ ...p, id: pid(n), slug, component_order: ORDER, active_components: ORDER, couple_names: 'Lena Tom', partner1_name: 'Lena', partner2_name: 'Tom', location: 'Château de Cassis', hashtag: '', ...extra });
  await post('/__test/seed', { table: 'projects', rows: [mk(72, 'lena-tom'), mk(73, 'cassis-locked', { password_protected: true }), mk(74, 'cassis-draft', { status: 'draft' })] });
  await post('/__test/seed', { table: 'project_content', rows: Object.entries(CONTENT).map(([component, content]) => ({ project_id: PID, component, content })) });
}
async function routeAssets(page) {
  await page.route((u) => u.hostname === 'assets.test', (r) => { const f = ASSETS[path.basename(new URL(r.request().url()).pathname)]; if (!f) return r.abort();
    // Die Kundengrafiken liegen bewusst nicht im (öffentlichen) Repository. Fehlen sie, dient ein Platzhalterbild.
    const file = path.join(A, f[0]); const has = fs.existsSync(file);
    return r.fulfill({ status: 200, contentType: has ? f[1] : 'image/jpeg', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(has ? file : path.join(__dirname, 'placeholder.jpg')) }); });
}
module.exports = { seedCassis, routeAssets, BASE, PID, CONTENT };
