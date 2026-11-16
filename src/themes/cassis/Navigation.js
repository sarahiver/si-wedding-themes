// src/themes/cassis/Navigation.js – Kopfzeile über dem Startfoto: Schriftzug links, Sprachwahl rechts
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent, LANGUAGE_LABELS, LANGUAGE_NAMES } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SCRIPT } from './shared';

const Bar = styled.div`
  position: absolute; z-index: 5; top: 0; left: 0; right: 0; box-sizing: border-box;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
  padding: clamp(0.9rem, 3vw, 1.75rem) clamp(1.25rem, 4vw, 3rem); color: ${C.white}; font-family: ${FONT};
`;
const Mark = styled.a`
  display: block; flex: none; color: ${C.white}; text-decoration: none; line-height: 1;
  img { display: block; height: clamp(3.5rem, 10vw, 4.75rem); width: auto; filter: drop-shadow(0 1px 8px rgba(51,53,63,0.45)); }
  span { font-family: ${SCRIPT}; font-size: clamp(1.75rem, 6vw, 2.25rem); }
  &:focus-visible { outline: 2px solid ${C.white}; outline-offset: 4px; }
`;
const Langs = styled.nav`display: flex; gap: 0.1rem; margin-right: -0.5rem;`;
const Lang = styled.button`
  position: relative; min-width: 2.75rem; min-height: 2.75rem; padding: 0 0.5rem; border: none; background: transparent; cursor: pointer;
  font-family: ${FONT}; font-size: 0.9375rem; letter-spacing: 0.08em; font-weight: 400; color: ${C.white}; opacity: ${(p) => (p.$on ? 1 : 0.78)};
  text-shadow: 0 0 12px rgba(51,53,63,0.45);
  &::after { content: ''; position: absolute; left: 0.5rem; right: 0.5rem; bottom: 0.55rem; height: 1px; background: ${C.white}; opacity: ${(p) => (p.$on ? 1 : 0)}; }
  &:hover { opacity: 1; }
  &:focus-visible { outline: 2px solid ${C.white}; outline-offset: -2px; }
`;

function Navigation() {
  const { project, coupleNames } = useWedding();
  const { enabled, lang, languages, setLang, t } = useLanguage();
  const hero = useLocalizedContent('hero');
  const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
  const label = names.length ? names.join(' ') : (coupleNames || '');
  return (
    <Bar>
      <Mark href="#top" aria-label={label}>
        {hero.name_image ? <img src={hero.name_image} alt="" /> : <span aria-hidden="true">{label}</span>}
      </Mark>
      {enabled && languages.length > 1 && (
        <Langs aria-label={t(STRINGS, 'language')}>
          {languages.map((l) => (
            <Lang key={l} type="button" lang={l} $on={l === lang} aria-pressed={l === lang} aria-label={LANGUAGE_NAMES[l]} onClick={() => setLang(l)}>
              {LANGUAGE_LABELS[l]}
            </Lang>
          ))}
        </Langs>
      )}
    </Bar>
  );
}
export default Navigation;
