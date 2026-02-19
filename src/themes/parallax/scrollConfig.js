// src/themes/parallax/scrollConfig.js
// Single source of truth for scroll page layout
// Text zones (white divs) alternate with image zones

export const PAGES = 9   // total ScrollControls pages

// ── TEXT zones (white overlays in HTML layer) ──
export const HERO_TXT     = [0,   0.5]   // Names + Date
export const LS_TXT       = [1.5, 0.4]   // "Love Story" → modal
export const CD_TXT       = [3.5, 0.5]   // Countdown + Tagesablauf/Dresscode/Infos/RSVP
export const GAL_TXT      = [4.8, 0.3]   // "Galerie" → modal
export const DETAILS_TXT  = [7.5, 0.5]   // Geschenke/Gästebuch/Musikwünsche/etc.
export const FOOTER       = [8.2, 0.5]   // Credits/Footer

// ── IMAGE zones (Three.js canvas) ──
export const HERO_IMG  = [0.5, 1.0]   // Hero images
export const LS_IMG    = [1.9, 1.6]   // Love story images
export const CD_IMG    = [4.0, 0.8]   // Countdown image
export const GAL_IMG   = [5.1, 2.4]   // Gallery images

// Legacy aliases for backward compat during migration
export const HERO      = HERO_IMG
export const LOVESTORY = LS_IMG
export const COUNTDOWN = CD_IMG
export const GALLERY   = GAL_IMG

// Convert absolute page position to 0-1 range for data.range()
export function r(start, len) {
  return [start / PAGES, len / PAGES]
}
