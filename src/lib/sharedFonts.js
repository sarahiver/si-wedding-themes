// src/lib/sharedFonts.js
// Gemeinsame Schriften der Designs. Früher lud ein Verweis auf Google Fonts sie nach; jetzt liegen
// die Dateien im Projekt (src/fonts) und die Seite stellt keine Anfrage mehr an Google.
// Familien und Schnitte sind dieselben wie im früheren Verweis. „Instrument Serif" ist entfallen:
// Die Schrift wurde geladen, aber von keinem Design verwendet.
// Die Anwendung bindet sie erst ein, wenn feststeht, dass ein Design sie braucht – Cassis bringt
// eigene Schriftdateien mit.
import { fontFaceCss } from '../fonts';

// [Familie, aufrechte Schnitte, kursive Schnitte]
export const SHARED_FONTS = [
  ['Cormorant Garamond', [300, 400, 500, 600], [300, 400, 500]],
  ['Great Vibes', [400]],
  ['Inter', [300, 400, 500, 600, 700]],
  ['Josefin Sans', [300, 400, 500, 600, 700]],
  ['Lato', [300, 400, 700]],
  ['Montserrat', [300, 400, 500, 600, 700]],
  ['Playfair Display', [400, 500, 600, 700], [400, 500]],
  ['Space Grotesk', [400, 500, 600, 700]],
];

// Designs, die ausschließlich eigene Schriftdateien verwenden
const SELF_HOSTED = ['cassis'];
export const needsSharedFonts = (theme) => !SELF_HOSTED.includes(theme);

export function loadSharedFonts() {
  if (typeof document === 'undefined' || document.querySelector('style[data-si-fonts]')) return;
  const style = document.createElement('style');
  style.setAttribute('data-si-fonts', '');
  style.textContent = fontFaceCss(SHARED_FONTS);
  document.head.appendChild(style);
}
