// src/themes/cassis/shared.js
// Gemeinsame Bausteine des Themes. Alle Regeln sind über die Klasse
// `.cassis` bzw. eigene Komponenten gekapselt – nichts wirkt auf andere Themes.
import styled, { css } from 'styled-components';

export const C = {
  blue: '#8A91A3',        // Flächen (leicht dunkler als im Entwurf, damit weiße Schrift lesbar bleibt)
  blueDeep: '#6E7586',    // dunkle Knöpfe, weiße Schrift ≥ 4,5:1
  blueLight: '#B8BDC7',   // helle Flächen und Knöpfe
  paper: '#F0EDED',       // fast Weiß mit leichtem Rosé
  ink: '#2F3442',         // Schrift auf hellen Flächen
  inkSoft: '#565C6C',     // Nebentext auf hellen Flächen (≥ 4,5:1)
  white: '#FFFFFF',
  line: 'rgba(47,52,66,0.22)',
};
export const FONT = "'Jost', 'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif";
export const SCRIPT = "'Pinyon Script', 'Snell Roundhand', 'Apple Chancery', cursive";

const tones = {
  blue: css`background:${C.blue};color:${C.white};`,
  light: css`background:${C.blueLight};color:${C.ink};`,
  paper: css`background:${C.paper};color:${C.ink};`,
};

export const Section = styled.section`
  ${(p) => tones[p.$tone || 'paper']}
  position: relative; overflow: hidden;
  padding: clamp(3.5rem, 12vw, 6.5rem) 1.5rem;
  font-family: ${FONT}; font-weight: 300; font-size: 1.0625rem; line-height: 1.6;
`;
export const Inner = styled.div`position: relative; max-width: 34rem; margin: 0 auto; @media (min-width: 900px) { max-width: 40rem; }`;
export const Title = styled.h2`
  margin: 0 0 1.5rem; font-family: ${FONT}; font-weight: 300; font-size: clamp(2rem, 8.5vw, 3rem); line-height: 1.1; letter-spacing: 0.005em;
  text-align: ${(p) => p.$align || 'right'};
`;
export const Lead = styled.p`margin: 0 0 1.5rem; text-align: ${(p) => p.$align || 'right'}; white-space: pre-line;`;
// Große, blasse Schreibschrift im Hintergrund („Yes", „Kids")
export const Watermark = styled.span`
  position: absolute; pointer-events: none; user-select: none; font-family: ${SCRIPT}; line-height: 1; white-space: nowrap;
  font-size: clamp(9rem, 46vw, 17rem); color: ${(p) => p.$color || 'rgba(255,255,255,0.16)'};
  left: ${(p) => p.$left || '-0.05em'}; top: ${(p) => p.$top || '0.05em'};
`;
export const Button = styled.a`
  display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 100%; min-height: 3.5rem; padding: 0.75rem 1.25rem;
  border: none; border-radius: 0; cursor: pointer; text-decoration: none; text-align: center;
  font-family: ${FONT}; font-weight: 300; font-size: 1.25rem; letter-spacing: 0.01em;
  background: ${(p) => (p.$dark ? C.blueDeep : C.blueLight)}; color: ${(p) => (p.$dark ? C.white : C.ink)};
  transition: filter 0.2s ease;
  &:hover { filter: brightness(0.95); }
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
  &[disabled], &[aria-disabled='true'] { opacity: 0.6; cursor: default; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
// Sanftes Einblenden; ohne Bewegung, wenn das Gerät das wünscht
export const fadeIn = css`
  @media (prefers-reduced-motion: no-preference) {
    animation: cassisFade 0.9s ease both;
    @keyframes cassisFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  }
`;
