// src/themes/cassis/FAQ.js – Fragen und Antworten
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, Section, Inner, Title } from './shared';

const Item = styled.details`
  border-top: 1px solid ${C.line};
  &:last-child { border-bottom: 1px solid ${C.line}; }
  summary {
    list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 1rem; align-items: center;
    min-height: 3.5rem; padding: 0.6rem 0; font-family: ${FONT}; font-size: 1.25rem; line-height: 1.3; overflow-wrap: anywhere;
  }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: '+'; flex: none; font-size: 1.75rem; line-height: 1; color: ${C.inkSoft}; }
  &[open] summary::after { content: '−'; }
  summary:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
  p { margin: 0 0 1.25rem; white-space: pre-line; color: ${C.inkSoft}; overflow-wrap: anywhere; }
`;

function FAQ() {
  const { t } = useLanguage();
  const f = useLocalizedContent('faq');
  const items = (Array.isArray(f.questions) ? f.questions : []).filter((q) => q && q.question);
  if (!items.length) return null;
  return (
    <Section id="faq" $tone="paper">
      <Inner>
        <Title $align="left">{f.title || t(STRINGS, 'faq')}</Title>
        {items.map((q, i) => (<Item key={i}><summary>{q.question}</summary><p>{q.answer}</p></Item>))}
      </Inner>
    </Section>
  );
}
export default FAQ;
