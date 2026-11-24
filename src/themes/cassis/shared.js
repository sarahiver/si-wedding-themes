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
  lineMist: 'rgba(51,53,63,0.34)', // Haarlinie auf Blaugrau
};
// Schriftrollen (freie Entsprechungen der Schriften aus der Einladung):
// 1. SCRIPT (Mrs Saint Delafield, statt Amsterdam Handwriting): die Namen, solange keine Grafik
//    des Schriftzugs hochgeladen ist.
// 2. HEADING (Pinyon Script, statt Edwardian Script ITC): Bereichsüberschriften und die Frage der Antwortkarte.
// 3. SERIF (Cormorant Garamond): Uhrzeiten, Zahlen, Zwischenüberschriften, Eingaben der Antwortkarte;
//    kursiv für kurze Begleitsätze – Schreibschrift wäre hier schwer lesbar.
// 4. FONT (Cabin, statt Humanst521 Lt BT): Fließtext, Navigation, Knöpfe, Beschriftungen, Hinweise.
// Eigene Familiennamen: So greift sicher die Datei aus dem Projekt und nicht eine
// gleichnamige Schrift, die die gemeinsame Startseite aller Themes von Google lädt.
export const FONT = "'Cassis Sans', 'Cabin', 'Gill Sans', 'Gill Sans MT', 'Segoe UI', sans-serif";
export const SERIF = "'Cassis Serif', 'Cormorant Garamond', 'Garamond', 'Times New Roman', serif";
export const HEADING = "'Cassis Script', 'Pinyon Script', 'Snell Roundhand', 'Apple Chancery', cursive";
export const SCRIPT = "'Cassis Hand', 'Mrs Saint Delafield', 'Snell Roundhand', 'Apple Chancery', 'Segoe Script', cursive";

const tones = {
  shell: css`background:${C.shell};color:${C.ink};`,
  pearl: css`background:${C.pearl};color:${C.ink};`,
  mist: css`background:${C.mist};color:${C.ink};`,
};

// Das zwölfspaltige Raster gilt ab 700 px Breite (Tablet hochkant) – und im Querformat schon ab 640 px:
// ein Handy quer ist breit genug für zwei Spalten, aber zu niedrig für gestapelte Flächen.
export const DESK_Q = '(min-width: 700px), (min-width: 640px) and (orientation: landscape)';
export const DESK = `@media ${DESK_Q}`;
// Startbild als Doppelseite (Papier links, Foto rechts): wie oben, im Querformat ab 480 px
export const SPREAD_Q = '(min-width: 900px), (min-width: 480px) and (orientation: landscape)';
export const SPREAD = `@media ${SPREAD_Q}`;
// Stehende Bilder brauchen Höhe: darunter (Handy quer, sehr niedrige Fenster) läuft alles im normalen Fluss
export const TALL = '@media (min-height: 34rem)';
// Niedrige Fenster: stehende Überschriften neben stehenden Bildern würden sich überlagern
export const LOW = '@media (max-height: 39.99rem)';
// Höhe der fixierten Kopfzeile – Sprungziele halten diesen Abstand
export const HEADER = '4rem';
// Seitenrand und Spaltenabstand des Rasters
export const G = 'clamp(1.25rem, 4.2vw, 4rem)';
// Kurzer Begleitsatz in kursiver Serife
export const italic = css`font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: 1.25rem; line-height: 1.5; ${DESK} { font-size: clamp(1.25rem, 1.5vw, 1.5rem); }`;

// Jeder Abschnitt liegt über den stehenden Bildern (Startbild, zweites Foto):
// die Bilder bleiben am oberen Rand stehen, die Abschnitte ziehen darüber.
export const Section = styled.section`
  ${(p) => tones[p.$tone || 'shell']}
  position: relative; z-index: 1; scroll-margin-top: calc(${HEADER} - 2px);
  padding: clamp(4rem, 8vw, 9rem) ${G};
  font-family: ${FONT}; font-weight: 400; font-size: 1.0625rem; line-height: 1.65; font-variant-numeric: lining-nums;
  ${DESK} { font-size: clamp(1.0625rem, 1.2vw, 1.375rem); }
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
export const reveal = css`
  &[data-reveal='armed'] { opacity: 0; transform: translateY(18px); }
  &[data-reveal='in'] { opacity: 1; transform: none; transition: opacity 0.7s ease, transform 0.7s ease; }
  @media print { opacity: 1 !important; transform: none !important; }
`;

// Zwölf Spalten ab Tablet; auf dem Handy steht alles untereinander.
const Grid = styled.div`
  ${DESK} { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G}; align-items: start; }
  ${reveal}
`;
export function Inner({ children, ...rest }) {
  const ref = useReveal();
  return <Grid ref={ref} {...rest}>{children}</Grid>;
}
// Überschrift links: bleibt auf großen Flächen stehen, während der Inhalt rechts vorbeizieht
export const Aside = styled.div`min-width: 0; margin-bottom: 2.5rem; ${DESK} { grid-column: 1 / 6; margin-bottom: 0; position: sticky; top: 6rem; }`;
export const Body = styled.div`min-width: 0; ${DESK} { grid-column: 6 / 13; }`;
export const Title = styled.h2`
  margin: 0; font-family: ${HEADING}; font-weight: 400; font-size: clamp(3rem, 7.6vw, 8.5rem); line-height: 1.1; letter-spacing: 0;
  overflow-wrap: anywhere; hyphens: auto;
  /* Lange Wörter (z. B. „Trauzeug:innen") bekommen in schmalen Spalten eine kleinere Stufe */
  ${(p) => p.$small && css`font-size: clamp(2.5rem, 4.6vw, 5rem); line-height: 1.15;`}
`;
export const Lead = styled.p`margin: 1.25rem 0 0; white-space: pre-line; overflow-wrap: anywhere; ${italic} color: ${(p) => (p.$onMist ? C.ink : C.inkSoft)}; ${DESK} { max-width: 20em; }`;
// Über die ganze Breite des Rasters
export const Full = styled.div`min-width: 0; ${DESK} { grid-column: 1 / -1; }`;
// Textaktion: Verweis als unterstrichener Text, kein Knopf
export const textLink = css`
  color: ${C.ink}; min-height: 2.75rem; display: inline-flex; align-items: center; overflow-wrap: anywhere;
  text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.35em; text-decoration-color: currentColor; transition: opacity 0.2s ease;
  &:hover { opacity: 0.62; }
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; opacity: 1; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
export const Text = styled.p`margin: 0 0 1.25rem; white-space: pre-line; overflow-wrap: anywhere;`;

// Zwei Knopfarten: gefüllt (Hauptaktion) und mit Linie (Nebenaktion)
export const Button = styled.a`
  display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-height: 3.5rem; padding: 0.75rem 2.25rem;
  border: 1px solid ${(p) => (p.$solid ? C.deep : C.ink)}; border-radius: 0; cursor: pointer; text-decoration: none; text-align: center;
  font-family: ${FONT}; font-style: normal; font-weight: 400; font-size: 1.0625rem; letter-spacing: 0.03em; line-height: 1.2;
  background: ${(p) => (p.$solid ? C.deep : 'transparent')}; color: ${(p) => (p.$solid ? C.white : C.ink)};
  width: ${(p) => (p.$block ? '100%' : 'auto')};
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
  &:hover { background: ${C.ink}; color: ${C.white}; }
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
  &[disabled], &[aria-disabled='true'] { opacity: 0.55; cursor: default; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
