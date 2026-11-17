// src/components/shared/gateThemes.js
// Gemeinsame Grundlage für die beiden Seiten, die vor der eigentlichen Hochzeitsseite stehen:
// die Passwort-Abfrage für Gäste und die Seite „Hier entsteht eine neue Hochzeitswebsite"
// (Status Entwurf / in Bearbeitung). Beide zeigen sich im Aussehen des gewählten Themes.
// Die Schriften kommen aus den GlobalStyles des Themes bzw. der gemeinsamen Startseite –
// hier wird nichts nachgeladen.
import { projectLanguages } from '../../lib/i18n';

// bg: Fläche · fg: Schrift · soft: Nebentext · accent: Linie und Akzent · card: Fläche der Karte (falls vorhanden)
// head/body: Schriften · headCss: Auszeichnung der Namen
export const GATE_THEMES = {
  botanical: { bg: 'linear-gradient(180deg, #040804 0%, #0a1f0a 100%)', fg: 'rgba(255,255,255,0.92)', soft: 'rgba(255,255,255,0.6)', accent: 'rgba(255,255,255,0.35)', head: "'Cormorant Garamond', serif", body: "'Montserrat', sans-serif", headCss: 'font-style: italic; font-weight: 300;' },
  editorial: { bg: '#FAFAFA', fg: '#0A0A0A', soft: '#555555', accent: '#C41E3A', head: "'Oswald', sans-serif", body: "'Source Serif 4', Georgia, serif", headCss: 'font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 0.95;' },
  contemporary: { bg: '#FAFAFA', fg: '#0D0D0D', soft: '#555555', accent: '#FF6B6B', head: "'Space Grotesk', sans-serif", body: "'Space Grotesk', sans-serif", headCss: 'font-weight: 700; letter-spacing: -0.03em;' },
  luxe: { bg: 'linear-gradient(180deg, #0A0A0A 0%, #1a1a1a 100%)', fg: '#F8F6F3', soft: 'rgba(255,255,255,0.6)', accent: '#C9A962', head: "'Cormorant', 'Cormorant Garamond', serif", body: "'Outfit', sans-serif", headCss: 'font-style: italic; font-weight: 300; color: #C9A962;' },
  neon: { bg: '#0a0a0f', fg: '#ffffff', soft: 'rgba(255,255,255,0.6)', accent: '#00ffff', head: "'Space Grotesk', sans-serif", body: "'Space Grotesk', sans-serif", headCss: 'font-weight: 700; text-shadow: 0 0 24px rgba(0,255,255,0.45);' },
  video: { bg: '#0D0D0D', fg: '#ffffff', soft: '#9a9a9a', accent: '#6B8CAE', head: "'Manrope', sans-serif", body: "'Inter', sans-serif", headCss: 'font-weight: 300; letter-spacing: -0.02em;' },
  classic: { bg: '#FDFCFA', fg: '#1A1A1A', soft: '#555555', accent: '#1A1A1A', head: "'Cormorant Garamond', Georgia, serif", body: "'Josefin Sans', sans-serif", headCss: 'font-weight: 300;' },
  summer: { bg: '#FAF6F0', fg: '#2C2416', soft: '#6B5744', accent: '#C1392B', head: "'Playfair Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif", headCss: 'font-style: italic; font-weight: 400;' },
  parallax: { bg: '#000000', fg: '#ffffff', soft: 'rgba(255,255,255,0.65)', accent: '#ffffff', head: "'DM Sans', sans-serif", body: "'DM Sans', sans-serif", headCss: 'font-weight: 800; letter-spacing: -0.04em; line-height: 0.95;' },
  cassis: { bg: '#9A9FAD', fg: '#33353F', soft: '#5D5C66', accent: '#33353F', card: '#F8F6F6', head: "'Cassis Serif', 'Cormorant Garamond', Garamond, serif", body: "'Cassis Sans', 'Lato', 'Gill Sans', sans-serif", headCss: 'font-style: italic; font-weight: 400;' },
};
export const gateTheme = (name) => GATE_THEMES[name] || GATE_THEMES.botanical;

// Texte beider Seiten. Einsprachige Projekte sind deutsch (wie bisher);
// mehrsprachige zeigen die Sprache des Geräts, sofern das Projekt sie anbietet.
export const GATE_TEXT = {
  de: { protected: 'Diese Hochzeitsseite ist passwortgeschützt.', enter: 'Bitte gib das Passwort ein, das ihr von uns erhalten habt.', password: 'Passwort', placeholder: 'Passwort eingeben...', submit: 'Eintreten', checking: 'Prüfe...', empty: 'Bitte Passwort eingeben', wrong: 'Falsches Passwort', failed: 'Ein Fehler ist aufgetreten', fallbackTitle: 'Private Hochzeit', soonLead: 'Hier entsteht eine neue Hochzeitswebsite für', soonLeadPlain: 'Hier entsteht eine neue Hochzeitswebsite.', soonNote: 'In Kürze online' },
  en: { protected: 'This wedding website is password-protected.', enter: 'Please enter the password you received from us.', password: 'Password', placeholder: 'Enter password...', submit: 'Enter', checking: 'Checking...', empty: 'Please enter the password', wrong: 'Wrong password', failed: 'Something went wrong', fallbackTitle: 'Private wedding', soonLead: 'A new wedding website is being created for', soonLeadPlain: 'A new wedding website is being created here.', soonNote: 'Online soon' },
  fr: { protected: 'Ce site de mariage est protégé par un mot de passe.', enter: 'Veuillez saisir le mot de passe que nous vous avons communiqué.', password: 'Mot de passe', placeholder: 'Saisir le mot de passe...', submit: 'Entrer', checking: 'Vérification...', empty: 'Veuillez saisir le mot de passe', wrong: 'Mot de passe incorrect', failed: 'Une erreur est survenue', fallbackTitle: 'Mariage privé', soonLead: 'Un nouveau site de mariage est en préparation pour', soonLeadPlain: 'Un nouveau site de mariage est en préparation.', soonNote: 'Bientôt en ligne' },
  tr: { protected: 'Bu düğün sitesi şifre ile korunmaktadır.', enter: 'Lütfen size ilettiğimiz şifreyi girin.', password: 'Şifre', placeholder: 'Şifreyi girin...', submit: 'Giriş', checking: 'Kontrol ediliyor...', empty: 'Lütfen şifreyi girin', wrong: 'Şifre yanlış', failed: 'Bir hata oluştu', fallbackTitle: 'Özel düğün', soonLead: 'Yeni bir düğün sitesi hazırlanıyor:', soonLeadPlain: 'Burada yeni bir düğün sitesi hazırlanıyor.', soonNote: 'Çok yakında yayında' },
};

/** Sprache der Vorseiten: Deutsch, außer das Projekt ist mehrsprachig und bietet die Sprache des Geräts an. */
export function gateLanguage(project, wanted) {
  const { languages, master } = projectLanguages(project);
  if (languages.length === 1) return GATE_TEXT[languages[0]] ? languages[0] : 'de';
  if (languages.length < 2) return 'de';
  // Zuerst die Sprache, die auf der Seite schon einmal gewählt wurde
  if (!wanted && project && project.slug) { try { const st = localStorage.getItem(`si_lang_${project.slug}`); if (st && languages.includes(st) && GATE_TEXT[st]) return st; } catch { /* Speicher gesperrt */ } }
  const prefs = wanted || (typeof navigator !== 'undefined' ? (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) : []);
  for (const p of prefs) {
    const code = String(p || '').toLowerCase().split('-')[0];
    if (languages.includes(code) && GATE_TEXT[code]) return code;
  }
  return GATE_TEXT[master] ? master : 'de';
}

const LOCALES = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR', tr: 'tr-TR' };
/** Datum der Hochzeit in der Sprache der Vorseite, z. B. „15. Mai 2027". Leer, wenn kein Datum vorliegt. */
export function gateDate(iso, lang) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return '';
  return new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.de, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)));
}
