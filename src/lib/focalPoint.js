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
//   { "desktop": { "x": 50, "y": 30, "zoom": 1 },
//     "mobile":  { "x": 65, "y": 20, "zoom": 1.4 } }
//
// x/y = der Punkt, der im Ausschnitt mittig bleibt (Prozent).
// zoom = wie eng der Ausschnitt ist. 1 = das Bild füllt die Fläche gerade
//        aus (entspricht background-size: cover), 2 = doppelt so nah dran.
// Fehlt ein Wert, gilt Mitte und zoom 1 — also exakt das bisherige
// Verhalten, damit Bestandsprojekte unverändert aussehen.

export const CENTER = { x: 50, y: 50, zoom: 1 };
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

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
  const zoom = typeof p.zoom === 'number' ? p.zoom : 1;
  return {
    x: Math.min(Math.max(p.x, 0), 100),
    y: Math.min(Math.max(p.y, 0), 100),
    zoom: Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM),
  };
}

export const toCss = (point) =>
  `${(point || CENTER).x}% ${(point || CENTER).y}%`;

// Zoom wird zu background-size bzw. zu einer Skalierung des Bildes.
// 'cover' bleibt die Basis, der Zoom multipliziert sie.
export const toSize = (point) => {
  const z = (point || CENTER).zoom || 1;
  return z <= 1 ? 'cover' : `${z * 100}%`;
};

/**
 * Fertige CSS-Werte für beide Breakpoints.
 * @returns {{desktop:string, mobile:string, desktopSize:string, mobileSize:string}}
 */
export function focalCss(raw) {
  const { desktop, mobile } = parseFocal(raw);
  const m = mobile || desktop;
  return {
    desktop: toCss(desktop),
    mobile: toCss(m),
    desktopSize: toSize(desktop),
    mobileSize: toSize(m),
  };
}

// ─────────────────────────────────────────────────────────────
// Fertige CSS-Blöcke für styled-components.
// Einbau pro Stelle: Prop $focal={focalCss(...)} übergeben und im
// Styled-Block ${p => bgFocalCss(p.$focal)} bzw. imgFocalCss(p.$focal)
// NACH background/object-fit einfügen, damit es die Mitte überschreibt.
// Ohne $focal entsteht kein CSS — Bestandsprojekte sehen aus wie vorher.
// ─────────────────────────────────────────────────────────────

export const FOCAL_BREAKPOINT = 768;

/**
 * focalCss() für die Mobile-Seite ausschalten, wenn dort ein eigenes
 * Mobile-Bild läuft — der Fokuspunkt gehört zum Desktop-Bild.
 */
export function focalCssDesktopOnly(raw) {
  const f = focalCss(raw);
  return { ...f, mobile: '50% 50%', mobileSize: 'cover' };
}

/** Für Elemente mit background-image. */
export function bgFocalCss(f) {
  if (!f) return '';
  return `
    background-position: ${f.desktop};
    background-size: ${f.desktopSize};
    @media (max-width: ${FOCAL_BREAKPOINT}px) {
      background-position: ${f.mobile};
      background-size: ${f.mobileSize};
    }
  `;
}

// Zoom bei <img>/<video> mit object-fit: cover — Skalierung um den Fokuspunkt
function zoomOf(size) {
  if (!size || size === 'cover') return 1;
  const n = parseFloat(size);
  return Number.isFinite(n) ? n / 100 : 1;
}

function imgBlock(position, size, withTransform) {
  const z = zoomOf(size);
  return `
    object-position: ${position};
    ${withTransform ? `transform: scale(${z}); transform-origin: ${position};` : ''}
  `;
}

/**
 * Für <img>/<video> mit object-fit: cover.
 * transform wird nur gesetzt, wenn irgendwo gezoomt ist — sonst bleiben
 * bestehende Transforms (Parallax, Ladeanimation) unberührt.
 */
export function imgFocalCss(f) {
  if (!f) return '';
  const anyZoom = zoomOf(f.desktopSize) > 1 || zoomOf(f.mobileSize) > 1;
  return `
    ${imgBlock(f.desktop, f.desktopSize, anyZoom)}
    @media (max-width: ${FOCAL_BREAKPOINT}px) {
      ${imgBlock(f.mobile, f.mobileSize, anyZoom)}
    }
  `;
}
