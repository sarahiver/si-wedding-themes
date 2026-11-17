// src/themes/cassis/FAQ.js – Fragen und Antworten zum Aufklappen
import React from 'react';
import styled, { css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, SERIF, G, DESK, Section, Inner, Title } from './shared';
import { follows, closingTone, OWN_TITLE } from './helpers';

// Ansprechpersonen und Fragen stehen erst nebeneinander, wenn beide Spalten ihre Überschrift tragen können
export const WIDE = '@media (min-width: 1000px)';

// Öffnet und schließt ruhig: Wo der Browser es kann, wächst die Antwort in der Höhe;
// überall sonst erscheint sie ohne Sprung in der Bedienung.
const Item = styled.details`
  border-top: 1px solid ${(p) => p.$line}; interpolate-size: allow-keywords; transition: border-color 0.3s ease;
  &::details-content { block-size: 0; overflow: hidden; opacity: 0; transition: block-size 0.32s ease, opacity 0.32s ease, content-visibility 0.32s allow-discrete; }
  &[open]::details-content { block-size: auto; opacity: 1; }
  &:last-child { border-bottom: 1px solid ${(p) => p.$line}; }
  /* Die geöffnete Frage bekommt eine kräftigere Linie */
  &[open] { border-top-color: ${C.ink}; }
  summary {
    list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 2rem; align-items: baseline;
    min-height: 3.5rem; box-sizing: border-box; padding: clamp(1.5rem, 2vw, 2rem) 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.625rem, 2.5vw, 2.625rem); line-height: 1.15; overflow-wrap: anywhere;
  }
  summary::-webkit-details-marker { display: none; }
  /* Kreuz aus zwei Haarlinien; beim Öffnen legt sich der senkrechte Strich in den waagerechten */
  summary i { position: relative; flex: none; align-self: center; width: 1.375rem; height: 1.375rem; }
  summary i::before, summary i::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: ${C.ink}; transition: transform 0.32s ease; }
  summary i::after { transform: rotate(90deg); }
  &[open] summary i::after { transform: rotate(0deg); }
  summary:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 4px; }
  p { margin: 0; padding: 0 3.375rem clamp(1.75rem, 2.4vw, 2.5rem) 0; max-width: 36em; white-space: pre-line; line-height: 1.7; color: ${(p) => p.$copy}; overflow-wrap: anywhere; }
  @media (max-width: 479px) { p { padding-right: 0; } }
  @media (prefers-reduced-motion: reduce) { transition: none; &::details-content { transition: none; } summary i::before, summary i::after { transition: none; } }
`;
// Neben den Ansprechpersonen: rechte Spalte. Allein: Überschrift links, Fragen rechts.
const Block = styled.section`
  scroll-margin-top: 5.5rem; min-width: 0;
  h2 { margin-bottom: 2.5rem; }
  ${DESK} { grid-column: 1 / -1; }
  ${WIDE} {
    ${(p) => (p.$joined ? css`grid-column: 7 / 13;` : css`grid-column: 1 / -1; display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G}; align-items: start; h2 { grid-column: 1 / 6; margin-bottom: 0; position: sticky; top: 6rem; } > div { grid-column: 6 / 13; }`)}
  }
`;

function useQuestions() {
  const f = useLocalizedContent('faq', OWN_TITLE);
  return { f, items: (Array.isArray(f.questions) ? f.questions : []).filter((q) => q && q.question) };
}
// Der Block allein – steht neben den Ansprechpersonen oder in einem eigenen Abschnitt
export function FaqBlock({ $joined, $mist }) {
  const { t } = useLanguage();
  const { f, items } = useQuestions();
  if (!items.length) return null;
  return (
    <Block id="faq" $joined={$joined}>
      <Title $small>{f.title || t(STRINGS, 'faq')}</Title>
      <div>
        {items.map((q, i) => (
          <Item key={i} $line={$mist ? C.lineMist : C.line} $copy={$mist ? C.ink : C.inkSoft}>
            <summary><span>{q.question}</span><i aria-hidden="true" /></summary>
            <p>{q.answer}</p>
          </Item>
        ))}
      </div>
    </Block>
  );
}

// Eigener Abschnitt – außer die Fragen stehen direkt hinter den Ansprechpersonen:
// dann teilen sich beide eine Seite (siehe ContactWitnesses.js).
function FAQ() {
  const { project, isComponentActive } = useWedding();
  const { items } = useQuestions();
  const w = useLocalizedContent('witnesses');
  const hasWitnesses = (Array.isArray(w.persons) ? w.persons : []).some((p) => p && p.name);
  if (!items.length) return null;
  if (hasWitnesses && follows(project, isComponentActive, 'witnesses', 'faq')) return null;
  const tone = closingTone(project, isComponentActive, 'faq');
  return <Section $tone={tone}><Inner><FaqBlock $mist={tone === 'mist'} /></Inner></Section>;
}
export default FAQ;
