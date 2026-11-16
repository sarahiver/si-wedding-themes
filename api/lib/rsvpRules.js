// api/lib/rsvpRules.js
// Projektbezogene RSVP-Regeln (Opt-in über projects.features).
//
// Projekte OHNE features.rsvp verhalten sich exakt wie bisher: Dann liefert
// getRsvpRules() null und der Server prüft nichts zusätzlich.
// Projekte MIT features.rsvp bekommen eine vollständige Prüfung im Server –
// die Prüfung im Browser ist nur Komfort und lässt sich umgehen.
//
// Beispiel features:
//   { "i18n": { "languages": ["en","tr","de","fr"], "default": "en" },
//     "rsvp": { "max_persons": 8, "child_ages": true, "confirmation_mail": true } }

const SUPPORTED_LANGUAGES = ['en', 'tr', 'de', 'fr'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_TEXT = 2000;
const MAX_NAME = 120;

function readFeatures(project) {
  const f = project && project.features;
  return f && typeof f === 'object' && !Array.isArray(f) ? f : {};
}

// Sprachen des Projekts. Ohne Eintrag: einsprachig (leere Liste).
function getLanguages(features) {
  const i18n = features && features.i18n;
  const raw = i18n && Array.isArray(i18n.languages) ? i18n.languages : [];
  const list = [...new Set(raw.filter((l) => SUPPORTED_LANGUAGES.includes(l)))];
  const master = list.includes(i18n && i18n.default) ? i18n.default : (list.includes('en') ? 'en' : list[0] || null);
  return { list, master };
}

function getRsvpRules(features) {
  const r = features && features.rsvp;
  if (!r || typeof r !== 'object' || Array.isArray(r)) return null; // Altprojekt
  const max = Number.isInteger(r.max_persons) && r.max_persons >= 1 && r.max_persons <= 50 ? r.max_persons : 10;
  const langs = getLanguages(features);
  return {
    maxPersons: max,
    childAges: r.child_ages === true,
    confirmationMail: r.confirmation_mail === true,
    languages: langs.list,
    defaultLanguage: langs.master,
  };
}

const fail = (code, field, message) => ({ ok: false, code, field, message });
const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function toBool(v) {
  if (v === true || v === false) return v;
  if (v === 'yes' || v === 'true') return true;   // Theme Summer sendet 'yes'/'no'
  if (v === 'no' || v === 'false') return false;
  return null;
}

// Sprache der Antwort: nur Sprachen des Projekts, sonst die Hauptsprache.
function resolveLanguage(value, rules) {
  if (!rules.languages.length) return null;
  const v = typeof value === 'string' ? value.trim().toLowerCase().split('-')[0] : '';
  return rules.languages.includes(v) ? v : rules.defaultLanguage;
}

/**
 * Prüft und bereinigt eine RSVP-Antwort für ein Projekt mit Regeln.
 * @returns {{ok:true, clean:object} | {ok:false, code:string, field:string, message:string}}
 */
function validateRsvp(input, rules) {
  const d = input && typeof input === 'object' ? input : {};

  const name = text(d.name, MAX_NAME + 1);
  if (!name) return fail('name_required', 'name', 'Name fehlt');
  if (name.length > MAX_NAME) return fail('name_too_long', 'name', 'Name ist zu lang');

  const email = typeof d.email === 'string' ? d.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return fail('email_invalid', 'email', 'E-Mail-Adresse ist ungültig');

  const attending = toBool(d.attending);
  if (attending === null) return fail('attending_invalid', 'attending', 'Zu- oder Absage fehlt');

  const persons = d.persons === undefined || d.persons === null ? 1 : d.persons;
  if (typeof persons !== 'number' || !Number.isInteger(persons)) return fail('persons_invalid', 'persons', 'Personenzahl ist ungültig');
  if (persons < 1) return fail('persons_min', 'persons', 'Mindestens eine Person');
  if (persons > rules.maxPersons) return fail('persons_max', 'persons', `Höchstens ${rules.maxPersons} Personen pro Anmeldung`);

  let guests = [];
  if (d.guests !== undefined && d.guests !== null) {
    if (!Array.isArray(d.guests)) return fail('guests_invalid', 'guests', 'Gästeliste ist ungültig');
    if (d.guests.length > persons) return fail('guests_count', 'guests', 'Mehr Gäste als angemeldete Personen');
    for (let i = 0; i < d.guests.length; i++) {
      const g = d.guests[i];
      if (!g || typeof g !== 'object' || Array.isArray(g)) return fail('guests_invalid', `guests[${i}]`, 'Gast ist ungültig');
      const isChild = g.is_child === true;
      const out = { name: text(g.name, MAX_NAME), dietary: text(g.dietary, 300), allergies: text(g.allergies, 300) };
      if (isChild) {
        out.is_child = true;
        if (rules.childAges) {
          if (typeof g.age !== 'number' || !Number.isInteger(g.age)) return fail('child_age_required', `guests[${i}].age`, 'Alter des Kindes fehlt');
          if (g.age < 0 || g.age > 17) return fail('child_age_range', `guests[${i}].age`, 'Alter des Kindes muss zwischen 0 und 17 liegen');
          out.age = g.age;
        }
      }
      guests.push(out);
    }
  }

  return {
    ok: true,
    clean: {
      name, email, persons, attending,
      dietary: text(d.dietary, MAX_TEXT),
      allergies: text(d.allergies, MAX_TEXT),
      message: text(d.message, MAX_TEXT),
      custom_answer: text(d.custom_answer, MAX_TEXT),
      guests,
      language: resolveLanguage(d.language, rules),
    },
  };
}

// Übersicht der Kinder einer Antwort (für Mail und Anzeige)
function childAgesOf(guests) {
  return (Array.isArray(guests) ? guests : []).filter((g) => g && g.is_child).map((g) => (Number.isInteger(g.age) ? g.age : null));
}

module.exports = { SUPPORTED_LANGUAGES, readFeatures, getLanguages, getRsvpRules, validateRsvp, resolveLanguage, childAgesOf };
