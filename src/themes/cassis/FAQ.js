// src/themes/cassis/FAQ.js – Fragen und Antworten zum Aufklappen
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, Section, Inner, Aside, Body, Title } from './shared';

const Item = styled.details`
  border-top: 1px solid ${C.line};
  &:last-child { border-bottom: 1px solid ${C.line}; }
  summary {
    list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 1.5rem; align-items: baseline;
    min-height: 3.5rem; box-sizing: border-box; padding: 1.1rem 0; font-family: ${FONT}; font-weight: 300; font-size: 1.25rem; line-height: 1.35; overflow-wrap: anywhere;
  }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: '+'; flex: none; font-weight: 300; font-size: 1.5rem; line-height: 1; color: ${C.inkSoft}; }
  &[open] summary::after { content: '−'; }
  summary:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
  p { margin: 0 0 1.5rem; max-width: 34rem; white-space: pre-line; color: ${C.inkSoft}; overflow-wrap: anywhere; }
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
