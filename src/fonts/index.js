// src/fonts/index.js
// Lokal ausgelieferte Schriften der Designs. Früher kamen sie von Google Fonts; jetzt liegen die
// Dateien im Projekt, und es geht beim Seitenaufruf keine Anfrage mehr an Google.
//
// fontFaces() erzeugt die @font-face-Regeln für eine Familie – mit genau den Schnitten, die das
// jeweilige Design bisher bei Google angefordert hat. Der Browser lädt eine Datei erst, wenn ein
// Text sie wirklich braucht (Schnitt und Zeichensatz), nicht schon durch die Regel.
import { FONT_DATA } from './fontData';

/** Zusammenhängende Gewichte zu Bereichen fassen: [300,400,500,700] → [[300,500],[700,700]] */
export function weightRuns(weights) {
  const ws = [...new Set(weights)].sort((a, b) => a - b); const runs = [];
  for (const w of ws) { const last = runs[runs.length - 1]; if (last && w - last[1] === 100) last[1] = w; else runs.push([w, w]); }
  return runs;
}

const rule = (family, style, weight, url, range) =>
  `@font-face { font-family: '${family}'; font-style: ${style}; font-weight: ${weight}; font-display: swap; src: url(${url}) format('woff2'); unicode-range: ${range}; }`;

/**
 * @param {string} family    Name der Familie, wie er im CSS steht (z. B. 'Cormorant Garamond')
 * @param {number[]} weights aufrechte Schnitte
 * @param {number[]} italics kursive Schnitte
 * @returns {string} CSS mit den @font-face-Regeln
 */
export function fontFaces(family, weights = [], italics = []) {
  const f = FONT_DATA[family];
  if (!f) throw new Error(`Schrift „${family}" liegt nicht in src/fonts`);
  const out = [];
  const add = (style, list) => {
    if (!list.length) return;
    if (!f[style]) throw new Error(`Schrift „${family}" liegt nicht als ${style} vor`);
    if (f.variable) {
      // Eine Datei deckt alle Gewichte ab. Die Regel nennt nur die angeforderten – so verhält sich
      // ein nicht angefordertes Gewicht wie bisher (der Browser nimmt das nächstliegende).
      for (const [a, b] of weightRuns(list)) {
        if (a < f.weights[0] || b > f.weights[1]) throw new Error(`Schrift „${family}" hat kein Gewicht ${a}–${b}`);
        for (const [url, range] of f[style]) out.push(rule(family, style, a === b ? a : `${a} ${b}`, url, range));
      }
    } else {
      for (const w of [...new Set(list)].sort((a, b) => a - b)) {
        if (!f[style][w]) throw new Error(`Schrift „${family}" liegt nicht im Gewicht ${w} vor`);
        for (const [url, range] of f[style][w]) out.push(rule(family, style, w, url, range));
      }
    }
  };
  add('normal', weights); add('italic', italics);
  return out.join('\n');
}

/** Mehrere Familien auf einmal: [['Inter', [400, 700]], ['Playfair Display', [400], [400]]] */
export const fontFaceCss = (specs) => specs.map(([family, weights, italics]) => fontFaces(family, weights, italics)).join('\n');
