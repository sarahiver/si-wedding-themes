// src/themes/parallax/scrollConfig.js
// Single source of truth for scroll page layout
// Each section occupies a range of pages

export const PAGES = 8   // total ScrollControls pages

// Section page ranges [start, length]
export const HERO       = [0,   1.2]   // pages 0 → 1.2
export const LOVESTORY  = [1.2, 2.5]   // pages 1.2 → 3.7
export const COUNTDOWN  = [3.7, 1.3]   // pages 3.7 → 5.0
export const GALLERY    = [5.0, 3.0]   // pages 5.0 → 8.0

// Convert absolute page position to 0-1 range for data.range()
export function r(start, len) {
  return [start / PAGES, len / PAGES]
}
