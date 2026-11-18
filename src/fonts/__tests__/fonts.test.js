import fs from 'fs';
import path from 'path';
import { fontFaces, fontFaceCss, weightRuns } from '../index';
import { FONT_DATA } from '../fontData';

const SRC = path.join(__dirname, '..', '..');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === '__tests__' ? [] : walk(path.join(dir, e.name))) : [path.join(dir, e.name)]));

describe('Lokale Schriften', () => {
  test('Gewichte werden zu zusammenhängenden Bereichen gefasst', () => {
    expect(weightRuns([400, 300, 500, 700, 800, 300])).toEqual([[300, 500], [700, 800]]);
    expect(weightRuns([400])).toEqual([[400, 400]]);
    expect(weightRuns([400, 600])).toEqual([[400, 400], [600, 600]]);
  });

  test('variable Schrift: eine Regel je Bereich und Zeichensatz, nur die angeforderten Gewichte', () => {
    const css = fontFaces('DM Sans', [400, 500, 700, 800]);
    const rules = css.split('\n');
    expect(rules).toHaveLength(2 * FONT_DATA['DM Sans'].normal.length);
    expect(css).toContain('font-weight: 400 500;'); expect(css).toContain('font-weight: 700 800;'); expect(css).not.toContain('font-weight: 600');
    rules.forEach((r) => expect(r).toMatch(/^@font-face \{ font-family: 'DM Sans'; font-style: normal; font-weight: [\d ]+; font-display: swap; src: url\([^)]+\.woff2\) format\('woff2'\); unicode-range: U\+[0-9A-F,U+\-]+; \}$/));
  });

  test('kursiv und statische Schriften', () => {
    expect(fontFaces('Playfair Display', [400], [400, 500])).toContain("font-style: italic; font-weight: 400 500;");
    const lato = fontFaces('Lato', [300, 400, 700]);
    for (const w of [300, 400, 700]) expect(lato).toContain(`font-weight: ${w};`);
  });

  test('unbekannte Familie, fehlender Stil oder fehlendes Gewicht fallen sofort auf', () => {
    expect(() => fontFaces('Comic Sans', [400])).toThrow();
    expect(() => fontFaces('Inter', [], [400])).toThrow();
    expect(() => fontFaces('Lato', [500])).toThrow();
    expect(() => fontFaces('Playfair Display', [300])).toThrow();
  });

  test('jede Datei aus der Tabelle liegt vor, jede vorliegende Datei wird verwendet, jede Familie hat eine Lizenz', () => {
    const table = fs.readFileSync(path.join(__dirname, '..', 'fontData.js'), 'utf8');
    const imported = [...table.matchAll(/from '\.\/files\/([^']+)'/g)].map((m) => m[1]).sort();
    const present = fs.readdirSync(path.join(__dirname, '..', 'files')).sort();
    expect(imported).toEqual(present);
    expect(fs.readdirSync(path.join(__dirname, '..', 'licenses')).length).toBe(Object.keys(FONT_DATA).length);
  });

  test('im Quelltext der Designs steht kein Verweis auf Google Fonts', () => {
    const hits = walk(SRC).filter((f) => /\.(js|css)$/.test(f) && /fonts\.(googleapis|gstatic)\.com/.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(SRC, f));
    // Ausnahme: das Upload-Fenster von Cloudinary im Verwaltungsbereich lädt seine Schrift selbst
    expect(hits).toEqual(['hooks/useCloudinaryUpload.js']);
    expect(fs.readFileSync(path.join(SRC, '..', 'public', 'index.html'), 'utf8')).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  });

  test('die Schriften aller Designs lassen sich auflösen', () => {
    for (const t of ['classic', 'botanical', 'editorial', 'parallax', 'summer', 'contemporary', 'luxe', 'video']) {
      const src = fs.readFileSync(path.join(SRC, 'themes', t, 'GlobalStyles.js'), 'utf8');
      const m = /const FONTS = fontFaceCss\((\[.*\])\);?\n/.exec(src); expect(m).not.toBeNull();
      // eslint-disable-next-line no-eval
      const spec = eval(m[1]); expect(fontFaceCss(spec).length).toBeGreaterThan(200);
    }
  });
});
