// src/lib/displayLabels.js
// Gemeinsame Anzeige-Helfer für alle Themes.
//
// Hintergrund: Das Dashboard speichert technische Schlüssel ('ceremony',
// 'party'), zeigt im Auswahlfeld aber deutsche Labels. Bisher übersetzte nur
// das Luxe-Theme zurück — in allen anderen stand im Frontend der Rohwert.

// ── Location-Typen ──────────────────────────────────────────────────────
export const LOCATION_TYPE_LABELS = {
  ceremony: 'Trauung',
  reception: 'Empfang',
  party: 'Feier',
};

// Gibt das deutsche Label zurück. Freitext (z.B. aus Altbeständen oder
// manuell gesetzt) bleibt unverändert stehen.
export const locationTypeLabel = (type) => {
  if (!type) return '';
  const key = String(type).toLowerCase().trim();
  return LOCATION_TYPE_LABELS[key] || type;
};

// ── Countdown-Ziel ──────────────────────────────────────────────────────
// Zählt auf eine Uhrzeit herunter, wenn im Dashboard eine eingetragen ist.
// Ohne Uhrzeit wird auf den Beginn des Tages gerechnet (00:00 Ortszeit) —
// so bleibt die Tagesanzeige korrekt und springt nicht wegen UTC um einen
// Tag, was bei new Date('2027-06-25') passieren würde.
export const getCountdownTarget = (countdownContent = {}, weddingDate = '') => {
  const rawDate = countdownContent.target_date || weddingDate || '';
  if (!rawDate) return null;

  const datePart = String(rawDate).split('T')[0];
  const [y, m, d] = datePart.split('-').map(Number);
  if (!y || !m || !d) return null;

  const timePart = countdownContent.target_time || '';
  const [hh, mm] = String(timePart).split(':').map(Number);

  return new Date(
    y,
    m - 1,
    d,
    Number.isFinite(hh) ? hh : 0,
    Number.isFinite(mm) ? mm : 0,
    0
  );
};
