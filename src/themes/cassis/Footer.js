// src/themes/cassis/Footer.js – ruhiger Abschluss mit dem Schriftzug
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SERIF, SCRIPT, DESK, G } from './shared';
import { formatWeddingDate } from './helpers';

const Wrap = styled.footer`
  position: relative; z-index: 1; overflow: hidden; background: ${C.deep}; color: ${C.white}; font-family: ${FONT}; font-weight: 400;
  padding: clamp(4rem, 8vw, 8rem) ${G} 2.5rem;
  .mark { margin: 0 0 2.5rem; }
  .mark img { display: block; width: 100%; max-width: 44rem; height: auto; }
  .mark span { font-family: ${SCRIPT}; font-size: clamp(2.5rem, 12vw, 6rem); line-height: 1; }
  .line { margin: 0 0 0.5rem; font-family: ${SERIF}; font-size: clamp(1.5rem, 2.2vw, 2.25rem); line-height: 1.2; font-variant-numeric: lining-nums; }
  .line + .links { margin-top: 1.5rem; }
  .links { display: flex; flex-wrap: wrap; gap: 0 1.25rem; margin-left: -0.25rem; }
  a, button {
    color: ${C.white}; font-family: ${FONT}; font-size: 1rem; background: none; border: none; cursor: pointer;
    text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.3em; min-height: 2.75rem; padding: 0 0.25rem; display: inline-flex; align-items: center; opacity: 0.85; transition: opacity 0.2s ease;
  }
  a:hover, button:hover { opacity: 1; }
  a:focus-visible, button:focus-visible { outline: 2px solid ${C.white}; outline-offset: 2px; opacity: 1; }
  ${DESK} {
    display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G}; align-items: end;
    .mark { grid-column: 1 / 8; margin: 0 0 -1.5vw; }
    .meta { grid-column: 9 / 13; text-align: right; }
    .links { justify-content: flex-end; margin: 0 -0.25rem 0 0; }
  }
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
      <div className="meta">
      {date && <p className="line">{date}</p>}
      {tag && <p className="line">{tag}</p>}
      <div className="links">
        <button type="button" onClick={toTop}>{t(STRINGS, 'backToTop')}</button>
        <a href="/impressum" target="_blank" rel="noopener noreferrer">{t(STRINGS, 'imprint')}</a>
        <a href="/datenschutz" target="_blank" rel="noopener noreferrer">{t(STRINGS, 'privacy')}</a>
      </div>
      </div>
    </Wrap>
  );
}
export default Footer;
