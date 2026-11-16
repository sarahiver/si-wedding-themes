// src/themes/cassis/Hero.js – großes Startfoto mit Schriftzug, Datum und Ort
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { focalCss, imgFocalCss, FOCAL_BREAKPOINT } from '../../lib/focalPoint';
import { optimizedUrl } from '../../lib/cloudinary';
import { C, FONT, SCRIPT } from './shared';
import { formatWeddingDate } from './helpers';

// Für Importe aus früheren Fassungen
export { formatWeddingDate };

const Wrap = styled.header`
  position: relative; overflow: hidden; background: ${C.mist}; color: ${C.white};
  min-height: 34rem; height: 100vh; height: 100svh; max-height: 75rem;
  display: flex; flex-direction: column; justify-content: flex-end; align-items: center;
  img.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; ${(p) => imgFocalCss(p.$focal)} }
  /* Verlauf nur dort, wo Schrift steht: oben für die Kopfzeile, unten für Namen und Datum */
  &::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      linear-gradient(to bottom, rgba(51,53,63,0.34), rgba(51,53,63,0) 22%),
      linear-gradient(to top, rgba(51,53,63,0.62), rgba(51,53,63,0.28) 34%, rgba(51,53,63,0) 62%);
  }
`;
const Content = styled.div`
  position: relative; z-index: 1; box-sizing: border-box; width: 100%; text-align: center;
  padding: 0 clamp(1.5rem, 6vw, 4rem) clamp(2.5rem, 9vh, 5.5rem);
  @media (prefers-reduced-motion: no-preference) {
    animation: cassisRise 1.1s ease 0.15s both;
    @keyframes cassisRise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  }
`;
const Names = styled.h1`
  margin: 0;
  img { display: block; margin: 0 auto; height: auto; width: min(78vw, 24rem); filter: drop-shadow(0 2px 14px rgba(51,53,63,0.35)); }
  span.text { display: block; font-family: ${SCRIPT}; font-weight: 400; font-size: clamp(4rem, 20vw, 8rem); line-height: 0.95; text-shadow: 0 2px 18px rgba(51,53,63,0.4); }
  span.text span { display: block; }
  span.text span + span { padding-left: 1.4em; }
  @media (min-width: ${FOCAL_BREAKPOINT + 1}px) { img { width: min(34vw, 30rem); } }
`;
const Facts = styled.p`
  margin: clamp(1.5rem, 4vh, 2.5rem) 0 0; font-family: ${FONT}; font-weight: 300; font-size: clamp(1.125rem, 4.4vw, 1.375rem); line-height: 1.5; letter-spacing: 0.04em;
  text-shadow: 0 1px 12px rgba(51,53,63,0.5);
  time, span { display: block; }
`;

function Hero() {
  const { project, coupleNames, weddingDate } = useWedding();
  const { lang } = useLanguage();
  const hero = useLocalizedContent('hero');
  const countdown = useLocalizedContent('countdown');

  const date = countdown.target_date || weddingDate;
  const names = [project?.partner1_name, project?.partner2_name].filter(Boolean);
  const label = names.length ? names.join(' ') : (coupleNames || '');
  const image = hero.background_image;
  const mobileImage = hero.background_image_mobile;
  const place = hero.location_short || project?.location;

  return (
    <Wrap id="top" $focal={image && hero.background_focal ? focalCss(hero.background_focal) : null}>
      {image && (
        <picture>
          {mobileImage && <source media={`(max-width: ${FOCAL_BREAKPOINT}px)`} srcSet={optimizedUrl.hero(mobileImage)} />}
          <img className="bg" src={optimizedUrl.hero(image)} alt="" />
        </picture>
      )}
      <Content>
        <Names aria-label={label}>
          {hero.name_image
            ? <img src={hero.name_image} alt={label} />
            : <span className="text" aria-hidden="true">{(names.length ? names : [label]).map((n) => <span key={n}>{n}</span>)}</span>}
        </Names>
        {(date || place) && (
          <Facts>
            {date && <time dateTime={date}>{formatWeddingDate(date, lang)}</time>}
            {place && <span>{place}</span>}
          </Facts>
        )}
      </Content>
    </Wrap>
  );
}
export default Hero;
