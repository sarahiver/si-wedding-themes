// src/themes/cassis/Navigation.js – Sprachwahl ganz oben
import React from 'react';
import styled from 'styled-components';
import { useLanguage, LANGUAGE_LABELS, LANGUAGE_NAMES } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT } from './shared';

const Bar = styled.nav`
  background: ${C.blueLight}; display: flex; justify-content: center; gap: 0.25rem; padding: 0.5rem 1rem; min-height: 3.5rem; box-sizing: border-box;
`;
const Lang = styled.button`
  min-width: 3.25rem; min-height: 2.75rem; padding: 0 0.5rem; border: none; background: transparent; cursor: pointer;
  font-family: ${FONT}; font-size: 1.125rem; letter-spacing: 0.04em; font-weight: ${(p) => (p.$on ? 500 : 300)};
  color: ${C.ink}; border-bottom: 1px solid ${(p) => (p.$on ? C.ink : 'transparent')};
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
`;

function Navigation() {
  const { enabled, lang, languages, setLang, t } = useLanguage();
  if (!enabled || languages.length < 2) return null;
  return (
    <Bar aria-label={t(STRINGS, 'language')}>
      {languages.map((l) => (
        <Lang key={l} type="button" lang={l} $on={l === lang} aria-pressed={l === lang} aria-label={LANGUAGE_NAMES[l]} onClick={() => setLang(l)}>
          {LANGUAGE_LABELS[l]}
        </Lang>
      ))}
    </Bar>
  );
}
export default Navigation;
