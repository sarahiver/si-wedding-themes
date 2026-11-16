// src/themes/cassis/shared.js
// Designsystem des Themes. Alle Regeln hängen an eigenen Bausteinen –
// nichts davon wirkt auf andere Themes.
import styled, { css } from 'styled-components';

// Farben aus den Originaleinladungen (gemessen an der gelieferten Datei):
// Blaugrau #9A9FAD, Papier #F0ECED, helles Grau #C7C5CC, Druckgrau #747178.
// Die Schriftfarben sind daraus abgedunkelt, damit Text lesbar bleibt.
export const C = {
  mist: '#9A9FAD',      // Blaugrau der Einladung – Flächen
  shell: '#F0ECED',     // Papier der Einladung – Grundfläche
  pearl: '#F8F6F6',     // hellste Fläche
  haze: '#C7C5CC',      // helles Grau der Einladung – Linien, ruhige Flächen
  slate: '#747178',     // Druckgrau der Einladung – nur für große Schrift
  ink: '#33353F',       // Schrift (auf Papier 11:1, auf Blaugrau 4,6:1)
  inkSoft: '#5D5C66',   // Nebentext auf Papier (5,7:1) – nicht auf Blaugrau
  deep: '#3F424F',      // dunkle Fläche: Knöpfe, Fußzeile (Weiß darauf 10:1)
  white: '#FFFFFF',
  line: 'rgba(51,53,63,0.2)',
};
// Fließtext: Lato – eine humanistische Grotesk in der Art der Druckschrift
// der Einladung (Humanist 521). Die Schreibschrift der Namen kommt als
// Original-Grafik; SCRIPT ist nur der Ersatz, solange keine Grafik hochgeladen ist.
export const FONT = "'Lato', 'Gill Sans', 'Gill Sans MT', 'Segoe UI', sans-serif";
export const SCRIPT = "'Pinyon Script', 'Snell Roundhand', 'Apple Chancery', cursive";

const tones = {
  shell: css`background:${C.shell};color:${C.ink};`,
  pearl: css`background:${C.pearl};color:${C.ink};`,
  mist: css`background:${C.mist};color:${C.ink};`,
};

export const Section = styled.section`
  ${(p) => tones[p.$tone || 'shell']}
  position: relative;
  padding: clamp(4.5rem, 15vw, 9rem) clamp(1.5rem, 6vw, 4rem);
  font-family: ${FONT}; font-weight: 400; font-size: 1.0625rem; line-height: 1.65;
`;
// Zwei Spalten ab Tablet: Überschrift links, Inhalt rechts. Auf dem Handy untereinander.
export const Inner = styled.div`
  max-width: 68rem; margin: 0 auto; display: grid; gap: 2rem;
  @media (min-width: 900px) { grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); column-gap: clamp(3rem, 7vw, 7rem); align-items: start; }
`;
export const Aside = styled.div`min-width: 0;`;
export const Body = styled.div`min-width: 0; max-width: 36rem;`;
export const Title = styled.h2`
  margin: 0; font-family: ${FONT}; font-weight: 300; font-size: clamp(1.875rem, 6.5vw, 2.5rem); line-height: 1.15; letter-spacing: 0.01em;
  overflow-wrap: anywhere; hyphens: auto;
`;
export const Lead = styled.p`margin: 1rem 0 0; white-space: pre-line; overflow-wrap: anywhere; color: ${(p) => (p.$onMist ? C.ink : C.inkSoft)};`;
export const Text = styled.p`margin: 0 0 1.25rem; white-space: pre-line; overflow-wrap: anywhere;`;

// Zwei Knopfarten: gefüllt (Hauptaktion) und mit Linie (Nebenaktion)
export const Button = styled.a`
  display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-height: 3.25rem; padding: 0.75rem 1.75rem;
  border: 1px solid ${C.deep}; border-radius: 0; cursor: pointer; text-decoration: none; text-align: center;
  font-family: ${FONT}; font-weight: 400; font-size: 1.0625rem; letter-spacing: 0.03em; line-height: 1.2;
  background: ${(p) => (p.$solid ? C.deep : 'transparent')}; color: ${(p) => (p.$solid ? C.white : C.ink)};
  width: ${(p) => (p.$block ? '100%' : 'auto')};
  transition: background-color 0.2s ease, color 0.2s ease;
  &:hover { background: ${(p) => (p.$solid ? C.ink : 'rgba(51,53,63,0.08)')}; }
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
  &[disabled], &[aria-disabled='true'] { opacity: 0.55; cursor: default; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
