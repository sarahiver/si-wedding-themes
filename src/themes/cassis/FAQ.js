// src/themes/cassis/FAQ.js – Fragen und Antworten zum Aufklappen
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, Section, Inner, Aside, Body, Title, DESK } from './shared';

// Öffnet und schließt ruhig: Wo der Browser es kann, wächst die Antwort in der Höhe;
// überall sonst erscheint sie ohne Sprung in der Bedienung.
const Item = styled.details`
  border-top: 1px solid ${C.line}; interpolate-size: allow-keywords;
  &::details-content { block-size: 0; overflow: hidden; opacity: 0; transition: block-size 0.32s ease, opacity 0.32s ease, content-visibility 0.32s allow-discrete; }
  &[open]::details-content { block-size: auto; opacity: 1; }
  @media (prefers-reduced-motion: reduce) { &::details-content { transition: none; } }
  &:last-child { border-bottom: 1px solid ${C.line}; }
  summary {
    list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 1.5rem; align-items: baseline;
    min-height: 3.5rem; box-sizing: border-box; padding: 1.1rem 0; font-family: ${FONT}; font-weight: 300; font-size: 1.25rem; line-height: 1.35; overflow-wrap: anywhere;
    transition: color 0.2s ease;
  }
  summary:hover { color: ${C.inkSoft}; }
  ${DESK} { summary { padding: 1.6rem 0; font-size: clamp(1.4375rem, 1.75vw, 2rem); } }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: '+'; flex: none; font-weight: 300; font-size: 1.2em; line-height: 1; color: ${C.inkSoft}; transition: transform 0.25s ease; }
  &[open] summary::after { transform: rotate(45deg); }
  summary:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
  p { margin: 0 0 1.5rem; max-width: 34em; white-space: pre-line; color: ${C.inkSoft}; overflow-wrap: anywhere; }
`;

function FAQ() {
  const { t } = useLanguage();
  const f = useLocalizedContent('faq');
  const items = (Array.isArray(f.questions) ? f.questions : []).filter((q) => q && q.question);
  if (!items.length) return null;
  return (
    <Section id="faq" $tone="pearl">
      <Inner>
        <Aside><Title>{f.title || t(STRINGS, 'faq')}</Title></Aside>
        <Body>
          {items.map((q, i) => (<Item key={i}><summary>{q.question}</summary><p>{q.answer}</p></Item>))}
        </Body>
      </Inner>
    </Section>
  );
}
export default FAQ;
