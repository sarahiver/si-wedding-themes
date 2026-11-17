import { loadSharedFonts, needsSharedFonts, SHARED_FONTS_URL } from '../sharedFonts';

describe('Gemeinsame Schriften', () => {
  beforeEach(() => { document.head.innerHTML = ''; });

  test('Cassis braucht sie nicht, alle anderen Themes schon', () => {
    expect(needsSharedFonts('cassis')).toBe(false);
    for (const t of ['botanical', 'editorial', 'contemporary', 'luxe', 'neon', 'video', 'classic', 'parallax', 'summer', undefined]) expect(needsSharedFonts(t)).toBe(true);
  });

  test('ohne Aufruf steht kein Verweis auf Google im Dokument', () => {
    expect(document.head.querySelectorAll('link').length).toBe(0);
  });

  test('der Verweis wird genau einmal gesetzt, auch bei mehreren Aufrufen', () => {
    loadSharedFonts(); loadSharedFonts(); loadSharedFonts();
    const sheets = document.head.querySelectorAll('link[rel="stylesheet"]');
    expect(sheets.length).toBe(1);
    expect(sheets[0].getAttribute('href')).toBe(SHARED_FONTS_URL);
    expect(document.head.querySelectorAll('link[rel="preconnect"]').length).toBe(2);
  });

  test('die Adresse enthält die bisherigen Schriftfamilien', () => {
    for (const f of ['Cormorant+Garamond', 'Great+Vibes', 'Instrument+Serif', 'Inter', 'Josefin+Sans', 'Lato', 'Montserrat', 'Playfair+Display', 'Space+Grotesk']) expect(SHARED_FONTS_URL).toContain(f);
  });
});
