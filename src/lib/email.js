// src/lib/email.js
// Plausible E-Mail-Adresse – dieselbe Prüfung wie im Server (api/lib/rsvpRules.js).
// Bewusst nicht streng: internationale Zeichen sind erlaubt, geprüft wird nur die Form.
// Ob das Postfach existiert, lässt sich so nicht feststellen.
export function isPlausibleEmail(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v || v.length > 254 || /\s/.test(v)) return false;
  const at = v.indexOf('@');
  if (at < 1 || at !== v.lastIndexOf('@')) return false;
  const local = v.slice(0, at); const domain = v.slice(at + 1);
  if (local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  const labels = domain.split('.');
  if (labels.length < 2) return false;
  if (labels.some((l) => !l || l.length > 63 || l.startsWith('-') || l.endsWith('-') || /[^\p{L}\p{N}-]/u.test(l))) return false;
  const tld = labels[labels.length - 1];
  return tld.length >= 2 && !/^\d+$/.test(tld);
}
