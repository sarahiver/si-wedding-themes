// src/themes/cassis/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';
import { C, FONT } from './shared';
import lato300 from './fonts/lato-latin-300-normal.woff2';
import lato300x from './fonts/lato-latin-ext-300-normal.woff2';
import lato400 from './fonts/lato-latin-400-normal.woff2';
import lato400x from './fonts/lato-latin-ext-400-normal.woff2';
import cg400 from './fonts/cormorant-garamond-latin-400-normal.woff2';
import cg400x from './fonts/cormorant-garamond-latin-ext-400-normal.woff2';
import cg500 from './fonts/cormorant-garamond-latin-500-normal.woff2';
import cg500x from './fonts/cormorant-garamond-latin-ext-500-normal.woff2';

// Die Schriften liegen im Projekt (SIL Open Font License, siehe fonts/LICENSE-*.txt).
// Lato heißt hier „Cassis Sans", Cormorant Garamond „Cassis Serif". Das Theme selbst lädt
// nichts von fremden Servern. (Die gemeinsame index.html aller Themes bindet weiterhin
// Google Fonts ein – das lässt sich nur dort und für alle Themes zusammen ändern.)
// Zwei Dateien je Schnitt: Grundzeichen und Erweiterung (u. a. türkische Zeichen);
// der Browser lädt die Erweiterung nur, wenn solche Zeichen auf der Seite stehen.
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const face = (family, weight, file, range) => `
  @font-face { font-family: '${family}'; font-style: normal; font-weight: ${weight}; font-display: swap; src: url(${file}) format('woff2'); unicode-range: ${range}; }`;

const GlobalStyles = createGlobalStyle`
  ${face('Cassis Sans', 300, lato300, LATIN)}${face('Cassis Sans', 300, lato300x, LATIN_EXT)}
  ${face('Cassis Sans', 400, lato400, LATIN)}${face('Cassis Sans', 400, lato400x, LATIN_EXT)}
  ${face('Cassis Serif', 400, cg400, LATIN)}${face('Cassis Serif', 400, cg400x, LATIN_EXT)}
  ${face('Cassis Serif', 500, cg500, LATIN)}${face('Cassis Serif', 500, cg500x, LATIN_EXT)}
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body { margin: 0; background: ${C.shell}; color: ${C.ink}; font-family: ${FONT}; -webkit-font-smoothing: antialiased; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
`;

export default GlobalStyles;
