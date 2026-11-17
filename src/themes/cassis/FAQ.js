// src/themes/cassis/FAQ.js – Fragen und Antworten zum Aufklappen
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, SERIF, Section, Inner, Title, DESK } from './shared';
import { follows } from './helpers';

// Öffnet und schließt ruhig: Wo der Browser es kann, wächst die Antwort in der Höhe;
// überall sonst erscheint sie ohne Sprung in der Bedienung.
const Item = styled.details`
  border-top: 1px solid ${C.haze}; interpolate-size: allow-keywords;
  &::details-content { block-size: 0; overflow: hidden; opacity: 0; transition: block-size 0.32s ease, opacity 0.32s ease, content-visibility 0.32s allow-discrete; }
  &[open]::details-content { block-size: auto; opacity: 1; }
  @media (prefers-reduced-motion: reduce) { &::details-content { transition: none; } }
  &:last-child { border-bottom: 1px solid ${C.haze}; }
  summary {
    list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 2rem; align-items: baseline;
    min-height: 3.5rem; box-sizing: border-box; padding: 1.5rem 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.5rem, 2.2vw, 2.25rem); line-height: 1.2; overflow-wrap: anywhere;
  }
  summary::-webkit-details-marker { display: none; }
  /* Feines Kreuz aus zwei Haarlinien; geöffnet bleibt nur der Strich */
  summary::after { content: ''; flex: none; align-self: center; width: 1.125rem; height: 1.125rem; transition: transform 0.3s ease, opacity 0.3s ease;
    background: linear-gradient(${C.ink}, ${C.ink}) center / 100% 1px no-repeat, linear-gradient(${C.ink}, ${C.ink}) center / 1px 100% no-repeat; opacity: 0.7; }
  &[open] summary::after { background: linear-gradient(${C.ink}, ${C.ink}) center / 100% 1px no-repeat; opacity: 1; }
  summary:hover::after { opacity: 1; }
  @media (prefers-reduced-motion: reduce) { summary::after { transition: none; } }
  summary:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
  p { margin: 0; padding: 0 2.5rem 2rem 0; max-width: 34em; white-space: pre-line; line-height: 1.7; color: ${C.inkSoft}; overflow-wrap: anywhere; }
`;
const Block = styled.section`scroll-margin-top: 5.5rem; min-width: 0; h2 { margin-bottom: 2.5rem; } ${DESK} { grid-column: 6 / 13; }`;

function useQuestions() {
  const f = useLocalizedContent('faq');
  return { f, items: (Array.isArray(f.questions) ? f.questions : []).filter((q) => q && q.question) };
}
// Der Block allein – steht neben den Trauzeug:innen oder in einem eigenen Abschnitt
export function FaqBlock() {
  const { t } = useLanguage();
  const { f, items } = useQuestions();
  if (!items.length) return null;
  return (
    <Block id="faq">
      <Title $small>{f.title || t(STRINGS, 'faq')}</Title>
      {items.map((q, i) => (<Item key={i}><summary>{q.question}</summary><p>{q.answer}</p></Item>))}
    </Block>
  );
}

// Eigener Abschnitt – außer die Fragen stehen direkt hinter den Trauzeug:innen:
// dann teilen sich beide eine Seite (siehe ContactWitnesses.js).
function FAQ() {
  const { project, isComponentActive } = useWedding();
  const { items } = useQuestions();
  const w = useLocalizedContent('witnesses');
  const hasWitnesses = (Array.isArray(w.persons) ? w.persons : []).some((p) => p && p.name);
  if (!items.length) return null;
  if (hasWitnesses && follows(project, isComponentActive, 'witnesses', 'faq')) return null;
  return <Section $tone="pearl"><Inner><FaqBlock /></Inner></Section>;
}
export default FAQ;
