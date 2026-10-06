// src/lib/focalPoint.js
// Bildausschnitt getrennt für Desktop und Mobile.
//
// Problem: Dasselbe Bild wird je nach Section als 16:9, 4:5 oder Vollbild
// ausgespielt. CSS schneidet dabei immer von der Mitte aus — bei einem Paar
// am linken Bildrand fehlt dann genau das Motiv.
//
// Lösung: Pro Bild ein Fokuspunkt in Prozent. Er wird zu background-position
// bzw. object-position. Kein zweiter Upload, kein Cloudinary-Zuschnitt, und
// er funktioniert auch bei Bildern aus anderen Quellen.
//
// Format in der Datenbank (JSON-Feld neben der Bild-URL):
//   { "desktop": { "x": 50, "y": 30 }, "mobile": { "x": 65, "y": 20 } }
// Fehlt ein Wert, gilt die Mitte — also exakt das bisherige Verhalten.

export const CENTER = { x: 50, y: 50 };

export function parseFocal(raw) {
  if (!raw) return { desktop: CENTER, mobile: null };
  const data = typeof raw === 'string' ? safeParse(raw) : raw;
  if (!data) return { desktop: CENTER, mobile: null };
  return {
    desktop: clampPoint(data.desktop) || CENTER,
    // null heißt ausdrücklich: Mobile übernimmt den Desktop-Wert
    mobile: clampPoint(data.mobile),
  };
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}

function clampPoint(p) {
  if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') return null;
  return {
    x: Math.min(Math.max(p.x, 0), 100),
    y: Math.min(Math.max(p.y, 0), 100),
  };
}

export const toCss = (point) =>
  `${(point || CENTER).x}% ${(point || CENTER).y}%`;

/**
 * Fertige CSS-Werte für beide Breakpoints.
 * @returns {{ desktop: string, mobile: string }}
 */
export function focalCss(raw) {
  const { desktop, mobile } = parseFocal(raw);
  return {
    desktop: toCss(desktop),
    mobile: toCss(mobile || desktop),
  };
}
