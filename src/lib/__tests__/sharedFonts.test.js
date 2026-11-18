import { loadSharedFonts, needsSharedFonts, SHARED_FONTS } from '../sharedFonts';

describe('Gemeinsame Schriften', () => {
  beforeEach(() => { document.head.innerHTML = ''; });

  test('Cassis braucht sie nicht, alle anderen Themes schon', () => {
    expect(needsSharedFonts('cassis')).toBe(false);
    for (const t of ['botanical', 'editorial', 'contemporary', 'luxe', 'neon', 'video', 'classic', 'parallax', 'summer', undefined]) expect(needsSharedFonts(t)).toBe(true);
  });

  test('ohne Aufruf steht nichts im Dokument', () => {
    expect(document.head.children.length).toBe(0);
  });

  test('die Schriften werden genau einmal eingebunden, auch bei mehreren Aufrufen – ohne Verweis nach außen', () => {
    loadSharedFonts(); loadSharedFonts(); loadSharedFonts();
    const styles = document.head.querySelectorAll('style[data-si-fonts]');
    expect(styles.length).toBe(1);
    expect(document.head.querySelectorAll('link').length).toBe(0);
    expect(styles[0].textContent).not.toMatch(/https?:\/\//);
    expect(styles[0].textContent).toMatch(/@font-face/);
  });

  test('enthält die bisherigen Schriftfamilien mit ihren Schnitten', () => {
    loadSharedFonts(); const css = document.head.querySelector('style[data-si-fonts]').textContent;
    for (const f of ['Cormorant Garamond', 'Great Vibes', 'Inter', 'Josefin Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Space Grotesk']) expect(css).toContain(`font-family: '${f}'`);
    expect(SHARED_FONTS.map((s) => s[0])).not.toContain('Instrument Serif');
    expect(css).toMatch(/font-family: 'Inter'; font-style: normal; font-weight: 300 700;/);
    expect(css).toMatch(/font-family: 'Cormorant Garamond'; font-style: italic; font-weight: 300 500;/);
    expect(css).toMatch(/font-family: 'Lato'; font-style: normal; font-weight: 700;/);
    expect(css).not.toMatch(/font-family: 'Inter'; font-style: italic/);
  });
});
