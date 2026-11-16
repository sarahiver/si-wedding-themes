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
