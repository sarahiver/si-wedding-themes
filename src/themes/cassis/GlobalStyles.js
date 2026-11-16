// src/themes/cassis/GlobalStyles.js
import React, { useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { C, FONT } from './shared';

// Schriften: Jost (Fließtext) und Pinyon Script (Zierschrift als Ersatz, falls
// kein eigener Schriftzug als Grafik hochgeladen ist).
// Bewusst als <link> und nicht als @import im Stylesheet: Ein @import in den
// globalen Regeln verhindert, dass zuvor angelegte Bausteine ihre Regeln
// einfügen können.
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap';
const FONT_ID = 'cassis-fonts';

const Rules = createGlobalStyle`
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body { margin: 0; background: ${C.blue}; color: ${C.ink}; font-family: ${FONT}; -webkit-font-smoothing: antialiased; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
`;

function GlobalStyles() {
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(FONT_ID)) return undefined;
    const link = document.createElement('link');
    link.id = FONT_ID; link.rel = 'stylesheet'; link.href = FONT_URL;
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);
  return <Rules />;
}

export default GlobalStyles;
