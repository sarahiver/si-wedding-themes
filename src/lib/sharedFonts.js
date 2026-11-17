// src/lib/sharedFonts.js
// Gemeinsame Schriften der Themes (Google Fonts). Früher stand dieser Verweis in public/index.html und
// wurde damit auf jeder Seite geladen – auch bei Cassis, das eigene Schriftdateien mitbringt.
// Jetzt lädt ihn die Anwendung erst, wenn feststeht, dass ein Theme ihn braucht.
// Die Adresse ist unverändert die aus der früheren Startdatei.
export const SHARED_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Great+Vibes&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Grotesk:wght@400;500;600;700&display=swap';

// Themes, die ausschließlich eigene Schriftdateien verwenden
const SELF_HOSTED = ['cassis'];
export const needsSharedFonts = (theme) => !SELF_HOSTED.includes(theme);

export function loadSharedFonts() {
  if (typeof document === 'undefined' || document.querySelector('link[data-si-fonts]')) return;
  const add = (attrs) => { const l = document.createElement('link'); Object.entries(attrs).forEach(([k, v]) => l.setAttribute(k, v)); document.head.appendChild(l); };
  add({ rel: 'preconnect', href: 'https://fonts.googleapis.com' });
  add({ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' });
  add({ rel: 'stylesheet', href: SHARED_FONTS_URL, 'data-si-fonts': '' });
}
