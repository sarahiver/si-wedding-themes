// src/themes/cassis/helpers.js – kleine Hilfen, die mehrere Bereiche brauchen
import { LOCALES } from './strings';

/** Datum ausgeschrieben in der Sprache der Seite, z. B. „15. Mai 2027". */
export function formatWeddingDate(iso, lang) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return '';
  return new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.en, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)));
}

/** Link zur Routenplanung aus den Angaben der Anfahrt; leer, wenn nichts hinterlegt ist. */
export function mapsLink(directions, location) {
  const d = directions || {};
  if (d.maps_url) return d.maps_url;
  if (d.lat && d.lng) return `https://www.google.com/maps?q=${d.lat},${d.lng}`;
  if (d.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location || ''} ${d.address}`.trim())}`;
  return '';
}

/** Wochentag und Datum, z. B. „Samstag, 15. Mai 2027". */
export function formatWeddingDay(iso, lang) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return '';
  return new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.en, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)));
}

// Reihenfolge der Seite, falls im Projekt keine hinterlegt ist
export const DEFAULT_ORDER = ['hero', 'countdown', 'timeline', 'directions', 'rsvp', 'accommodations', 'dresscode', 'witnesses', 'faq'];
const SHOWN = new Set(DEFAULT_ORDER);
/**
 * Steht Bereich `second` auf der Seite direkt hinter `first`? Dann teilen sich beide eine Fläche
 * (Anfahrt und Antwortkarte, Trauzeug:innen und Fragen). Gezählt werden nur Bereiche,
 * die das Theme kennt und die im Projekt eingeschaltet sind.
 */
function shownOrder(project, isComponentActive) {
  const saved = project && Array.isArray(project.component_order) && project.component_order.length ? project.component_order : DEFAULT_ORDER;
  return saved.filter((id) => SHOWN.has(id) && (id === 'hero' || typeof isComponentActive !== 'function' || isComponentActive(id)));
}
export function follows(project, isComponentActive, first, second) {
  const order = shownOrder(project, isComponentActive);
  const i = order.indexOf(first);
  return i >= 0 && order[i + 1] === second;
}
/** Bereich, der auf der Seite direkt vor `id` steht (leer, wenn `id` fehlt oder vorn steht). */
export function previous(project, isComponentActive, id) {
  const order = shownOrder(project, isComponentActive);
  const i = order.indexOf(id);
  return i > 0 ? order[i - 1] : '';
}
/**
 * Ton der Fläche für Ansprechpersonen und Fragen: Blaugrau als ruhiger Übergang zur dunklen Fußzeile –
 * außer direkt davor liegt schon eine blaugraue Fläche (Anfahrt, Antwortkarte, der jeweils andere Bereich).
 */
export function closingTone(project, isComponentActive, id) {
  return ['directions', 'rsvp', 'witnesses', 'faq'].includes(previous(project, isComponentActive, id)) ? 'pearl' : 'mist';
}
