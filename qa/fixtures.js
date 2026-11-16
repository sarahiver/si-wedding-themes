// Testprojekte. Reine Kunstdaten – keine echten Kunden.
const THEMES = ['botanical', 'editorial', 'contemporary', 'luxe', 'neon', 'video', 'classic', 'parallax', 'summer'];
const pid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
function project(n, slug, theme, extra = {}) {
  return { id: pid(n), slug, theme, status: 'live', couple_names: 'Mia & Noah', partner1_name: 'Mia', partner2_name: 'Noah',
    wedding_date: '2027-06-12', location: 'Testschloss', hashtag: '#mianoah', component_order: null, active_components: [],
    component_config: {}, custom_styles: {}, custom_domain: null, favicon_emoji: null, has_std: true, has_archive: true,
    package: 'all_in', addons: [], password_protected: false, client_email: 'paar@example.test', admin_email: 'paar@example.test',
    client_name: 'Mia Test', _admin_pw: 'admin-test', _preview_pw: 'preview-test', _guest_pw: 'gast-test', ...extra };
}
function seedAll(fake) {
  const rows = THEMES.map((t, i) => project(i + 1, `base-${t}`, t));
  rows.push(project(50, 'base-draft', 'editorial', { status: 'draft' }));
  rows.push(project(51, 'base-locked', 'classic', { password_protected: true }));
  rows.push(project(60, 'tenant-b', 'classic', { couple_names: 'Zoe & Finn', partner1_name: 'Zoe', partner2_name: 'Finn', admin_email: 'anderes-paar@example.test', _admin_pw: 'admin-b' }));
  // Neues Theme mit eingeschalteten Zusatzfunktionen
  rows.push(project(70, 'base-cassis', 'cassis', { couple_names: 'Lena & Tom', partner1_name: 'Lena', partner2_name: 'Tom', wedding_date: '2027-05-15', location: 'Château Test',
    component_order: ['hero', 'countdown', 'timeline', 'directions', 'childcare', 'rsvp', 'witnesses', 'faq'],
    active_components: ['hero', 'countdown', 'timeline', 'directions', 'childcare', 'rsvp', 'witnesses', 'faq'],
    features: { i18n: { languages: ['en', 'tr', 'de', 'fr'], default: 'en' }, rsvp: { max_persons: 8, child_ages: true, confirmation_mail: true } } }));
  // Altprojekt-Gegenprobe: Spalte features vorhanden, aber leer
  rows.push(project(71, 'legacy-empty-features', 'classic', { features: {} }));
  fake.seed('projects', rows);
  fake.seed('rsvp_responses', [{ project_id: pid(60), name: 'Fremder Gast', email: 'fremd@example.test', persons: 2, attending: true, dietary: '', allergies: '', message: 'privat', guests: null, custom_answer: '' }]);
  fake.seed('project_content', [{ project_id: pid(60), component: 'rsvp', content: { title: 'Zusage Projekt B' } }]);
}
const SA = { email: 'admin@example.test', password: 'superadmin-test' };
function seedSuperAdmin(fake) {
  const hash = require('crypto').createHash('sha256').update(SA.password).digest('hex');
  fake.seed('superadmins', [{ email: SA.email, password: hash }]);
}
module.exports = { THEMES, pid, seedAll, seedSuperAdmin, SA };
