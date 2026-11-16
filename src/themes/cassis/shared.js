// src/themes/cassis/shared.js
// Designsystem des Themes. Alle Regeln hängen an eigenen Bausteinen –
// nichts davon wirkt auf andere Themes.
import React, { useEffect, useRef } from 'react';
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
// Drei Schriftrollen – mehr nicht:
// 1. Schreibschrift: ausschließlich die Original-Grafik der Namen (Startbild, Kopfzeile, Fußzeile).
//    SCRIPT ist nur der Ersatz aus Systemschriften, solange keine Grafik hochgeladen ist.
// 2. SERIF (Cormorant Garamond): Abschnittsüberschriften und wenige große Akzente.
// 3. FONT (Lato): Fließtext, Uhrzeiten, Formulare, Navigation, Knöpfe, Hinweise.
// Eigene Familiennamen: So greift sicher die Datei aus dem Projekt und nicht eine
// gleichnamige Schrift, die die gemeinsame Startseite aller Themes von Google lädt.
export const FONT = "'Cassis Sans', 'Lato', 'Gill Sans', 'Gill Sans MT', 'Segoe UI', sans-serif";
export const SERIF = "'Cassis Serif', 'Cormorant Garamond', 'Garamond', 'Times New Roman', serif";
export const SCRIPT = "'Snell Roundhand', 'Apple Chancery', 'Segoe Script', cursive";

const tones = {
  shell: css`background:${C.shell};color:${C.ink};`,
  pearl: css`background:${C.pearl};color:${C.ink};`,
  mist: css`background:${C.mist};color:${C.ink};`,
};

// Ab dieser Breite gilt das zweispaltige Raster mit größerer Schrift
export const DESK = '@media (min-width: 900px)';
// Höhe der fixierten Kopfzeile – Sprungziele halten diesen Abstand
export const HEADER = '4rem';

export const Section = styled.section`
  ${(p) => tones[p.$tone || 'shell']}
  position: relative; scroll-margin-top: calc(${HEADER} - 2px);
  padding: clamp(4.5rem, 15vw, 9rem) clamp(1.5rem, 6vw, 4rem);
  font-family: ${FONT}; font-weight: 400; font-size: 1.0625rem; line-height: 1.65;
  /* Auf großen Flächen wächst die Schrift mit der Breite, damit nichts verloren wirkt */
  ${DESK} { padding: clamp(6.5rem, 9vw, 12rem) clamp(3rem, 7vw, 9rem); font-size: clamp(1.1875rem, 1.35vw, 1.625rem); }
`;

// ---- Einblenden beim ersten Erscheinen -------------------------------------
// Inhalte sind ohne JavaScript sichtbar. Erst wenn alles bereitsteht (Beobachter
// vorhanden, Bewegung erlaubt, Element noch außerhalb des Bildes), wird das
// Element „scharf geschaltet" und beim Erscheinen einmal eingeblendet.
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return undefined; // schon zu sehen: nicht verstecken
    el.setAttribute('data-reveal', 'armed');
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { el.setAttribute('data-reveal', 'in'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => { io.disconnect(); el.removeAttribute('data-reveal'); };
  }, []);
  return ref;
}

// Zwei Spalten ab Tablet: Überschrift links, Inhalt rechts. Auf dem Handy untereinander.
const Grid = styled.div`
  max-width: 96rem; margin: 0 auto; display: grid; gap: 2rem;
  ${DESK} { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); column-gap: clamp(3rem, 7vw, 9rem); align-items: start; }
  &[data-reveal='armed'] { opacity: 0; transform: translateY(16px); }
  &[data-reveal='in'] { opacity: 1; transform: none; transition: opacity 0.65s ease, transform 0.65s ease; }
  @media print { opacity: 1 !important; transform: none !important; }
`;
export function Inner({ children, ...rest }) {
  const ref = useReveal();
  return <Grid ref={ref} {...rest}>{children}</Grid>;
}
export const Aside = styled.div`min-width: 0;`;
export const Body = styled.div`min-width: 0; max-width: 36rem; ${DESK} { max-width: 52rem; }`;
export const Title = styled.h2`
  margin: 0; font-family: ${SERIF}; font-weight: 500; font-size: clamp(2.25rem, 8.6vw, 3rem); line-height: 1.08; letter-spacing: 0;
  overflow-wrap: anywhere; hyphens: auto;
  /* Auf großen Flächen trägt der leichtere Schnitt; klein bleibt der kräftigere lesbar */
  ${DESK} { font-weight: 400; font-size: clamp(3rem, 4.5vw, 5.5rem); line-height: 1.04; }
`;
export const Lead = styled.p`margin: 1rem 0 0; white-space: pre-line; overflow-wrap: anywhere; color: ${(p) => (p.$onMist ? C.ink : C.inkSoft)}; ${DESK} { margin-top: 1.5rem; max-width: 28em; }`;
export const Text = styled.p`margin: 0 0 1.25rem; white-space: pre-line; overflow-wrap: anywhere;`;

// Zwei Knopfarten: gefüllt (Hauptaktion) und mit Linie (Nebenaktion)
export const Button = styled.a`
  display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-height: 3.25rem; padding: 0.75rem 1.75rem;
  border: 1px solid ${C.deep}; border-radius: 0; cursor: pointer; text-decoration: none; text-align: center;
  font-family: ${FONT}; font-weight: 400; font-size: 1.0625rem; letter-spacing: 0.03em; line-height: 1.2;
  background: ${(p) => (p.$solid ? C.deep : 'transparent')}; color: ${(p) => (p.$solid ? C.white : C.ink)};
  width: ${(p) => (p.$block ? '100%' : 'auto')};
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
  &:hover { background: ${(p) => (p.$solid ? C.ink : 'rgba(51,53,63,0.08)')}; }
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
  &[disabled], &[aria-disabled='true'] { opacity: 0.55; cursor: default; }
  ${DESK} { min-height: 3.75rem; padding: 0.9rem 2.25rem; font-size: clamp(1.0625rem, 1.1vw, 1.25rem); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
