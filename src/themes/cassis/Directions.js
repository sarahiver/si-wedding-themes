// src/themes/cassis/Directions.js – Anfahrt
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, Section, Inner, Title, Lead } from './shared';

const Options = styled.dl`margin: 0; display: grid; gap: 1.5rem;`;
const Term = styled.dt`font-size: 0.875rem; letter-spacing: 0.22em; text-transform: uppercase; color: ${C.inkSoft}; text-align: right;`;
const Desc = styled.dd`margin: 0.25rem 0 0; text-align: right; white-space: pre-line; overflow-wrap: anywhere;`;

function Directions() {
  const { t } = useLanguage();
  const d = useLocalizedContent('directions');
  const items = (Array.isArray(d.items) ? d.items : (Array.isArray(d.options) ? d.options : [])).filter((x) => x && (x.title || x.description));
  if (!d.description && !items.length) return null;
  return (
    <Section id="directions" $tone="paper">
      <Inner>
        <Title>{d.title || t(STRINGS, 'directions')}</Title>
        {d.description && <Lead>{d.description}</Lead>}
        {items.length > 0 && (
          <Options>
            {items.map((x, i) => (<div key={i}><Term>{x.title}</Term><Desc>{x.description}</Desc></div>))}
          </Options>
        )}
      </Inner>
    </Section>
  );
}
export default Directions;
