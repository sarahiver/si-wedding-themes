// src/themes/cassis/Footer.js – ruhiger Abschluss mit dem Schriftzug
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SCRIPT } from './shared';
import { formatWeddingDate } from './helpers';

const Wrap = styled.footer`
  background: ${C.deep}; color: ${C.white}; font-family: ${FONT}; font-weight: 400; text-align: center;
  padding: clamp(4rem, 12vw, 6.5rem) 1.5rem 2.5rem;
  .mark { margin: 0; }
  .mark img { display: block; margin: 0 auto; width: min(52vw, 11rem); height: auto; }
  .mark span { font-family: ${SCRIPT}; font-size: clamp(2.5rem, 12vw, 3.5rem); line-height: 1; }
  .line { margin: 1.5rem 0 0; font-weight: 300; font-size: 1.0625rem; letter-spacing: 0.04em; }
  .links { margin-top: clamp(2.5rem, 8vw, 4rem); display: flex; flex-wrap: wrap; justify-content: center; gap: 0 0.5rem; }
  a, button {
    color: ${C.white}; font-family: ${FONT}; font-size: 0.9375rem; background: none; border: none; cursor: pointer;
    text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.25em; min-height: 2.75rem; padding: 0 0.75rem; display: inline-flex; align-items: center; opacity: 0.85;
  }
  a:hover, button:hover { opacity: 1; }
  a:focus-visible, button:focus-visible { outline: 2px solid ${C.white}; outline-offset: 2px; opacity: 1; }
`;

function Footer() {
  const { coupleNames, project, weddingDate } = useWedding();
  const { lang, t } = useLanguage();
  const f = useLocalizedContent('footer');
  const hero = useLocalizedContent('hero');
  const countdown = useLocalizedContent('countdown');
  const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
  const label = f.names || (names.length ? names.join(' ') : (coupleNames || ''));
  const date = formatWeddingDate(countdown.target_date || weddingDate, lang);
  const tag = f.tagline || f.hashtag || project?.hashtag;
  const toTop = () => {
    const calm = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <Wrap>
      <p className="mark">{hero.name_image ? <img src={hero.name_image} alt={label} loading="lazy" /> : <span>{label}</span>}</p>
      {date && <p className="line">{date}</p>}
      {tag && <p className="line">{tag}</p>}
      <div className="links">
        <button type="button" onClick={toTop}>{t(STRINGS, 'backToTop')}</button>
        <a href="/impressum" target="_blank" rel="noopener noreferrer">{t(STRINGS, 'imprint')}</a>
        <a href="/datenschutz" target="_blank" rel="noopener noreferrer">{t(STRINGS, 'privacy')}</a>
      </div>
    </Wrap>
  );
}
export default Footer;
