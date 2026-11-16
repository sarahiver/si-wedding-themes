// src/themes/cassis/Footer.js
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SCRIPT } from './shared';

const Wrap = styled.footer`
  background: ${C.paper}; color: ${C.inkSoft}; font-family: ${FONT}; font-weight: 300; text-align: center; padding: 3rem 1.5rem 2.5rem;
  .names { margin: 0 0 0.5rem; font-family: ${SCRIPT}; font-size: clamp(2.5rem, 12vw, 3.5rem); line-height: 1; color: ${C.ink}; }
  .tag { margin: 0 0 1.5rem; }
  a, button { color: ${C.inkSoft}; font-family: ${FONT}; font-size: 1.0625rem; background: none; border: none; cursor: pointer; text-decoration: underline; text-underline-offset: 0.2em; min-height: 2.75rem; padding: 0 0.6rem; display: inline-flex; align-items: center; }
  a:focus-visible, button:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
  .legal { margin-top: 0.5rem; font-size: 0.9375rem; }
`;

function Footer() {
  const { coupleNames, project } = useWedding();
  const { t } = useLanguage();
  const f = useLocalizedContent('footer');
  const toTop = () => {
    const calm = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <Wrap>
      <p className="names">{f.names || coupleNames}</p>
      {(f.tagline || f.hashtag || project?.hashtag) && <p className="tag">{[f.tagline, f.hashtag || project?.hashtag].filter(Boolean).join(' · ')}</p>}
      <div><button type="button" onClick={toTop}>{t(STRINGS, 'backToTop')}</button></div>
      <div className="legal">
        <a href="/impressum" target="_blank" rel="noopener noreferrer">{t(STRINGS, 'imprint')}</a>
        <a href="/datenschutz" target="_blank" rel="noopener noreferrer">{t(STRINGS, 'privacy')}</a>
      </div>
    </Wrap>
  );
}
export default Footer;
