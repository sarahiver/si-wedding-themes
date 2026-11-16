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

// Einmalige Abfolge beim Laden: Foto, dann Schriftzug, dann Datum und Ort.
// Ohne Bewegung (oder wenn das Gerät sie nicht wünscht) steht alles sofort da.
const enter = (delay, duration, shift) => `
  @media (prefers-reduced-motion: no-preference) {
    animation: ${shift ? 'cassisRise' : 'cassisFade'} ${duration}ms ease ${delay}ms both;
  }
`;
const Wrap = styled.header`
  position: relative; overflow: hidden; background: ${C.mist}; color: ${C.white};
  min-height: 34rem; height: 100vh; height: 100svh;
  display: flex; flex-direction: column; justify-content: flex-end; align-items: center;
  @keyframes cassisFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cassisRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  img.bg {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; ${enter(0, 1000, false)}
    /* Breite Bildschirme zeigen nur einen Streifen des Hochformats: Motiv im oberen Drittel halten, der Schriftzug steht darunter */
    @media (min-width: ${FOCAL_BREAKPOINT + 1}px) { object-position: 50% 44%; }
    ${(p) => imgFocalCss(p.$focal)}
  }
  /* Verlauf nur dort, wo Schrift steht: oben für die Kopfzeile, unten für Namen und Datum */
  &::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      linear-gradient(to bottom, rgba(51,53,63,0.36), rgba(51,53,63,0) 20%),
      linear-gradient(to top, rgba(51,53,63,0.64), rgba(51,53,63,0.3) 36%, rgba(51,53,63,0) 66%);
  }
`;
const Content = styled.div`
  position: relative; z-index: 1; box-sizing: border-box; width: 100%; text-align: center;
  padding: 0 clamp(1.5rem, 6vw, 4rem) clamp(4rem, 13vh, 7rem);
  @media (min-width: ${FOCAL_BREAKPOINT + 1}px) { padding-bottom: clamp(3rem, 7vh, 5rem); }
`;
const Names = styled.h1`
  margin: 0; ${enter(350, 850, true)}
  img { display: block; margin: 0 auto; height: auto; width: min(84vw, 26rem, 58vh); filter: drop-shadow(0 2px 14px rgba(51,53,63,0.35)); }
  span.text { display: block; font-family: ${SCRIPT}; font-weight: 400; font-size: clamp(4rem, 20vw, 9rem); line-height: 0.95; text-shadow: 0 2px 18px rgba(51,53,63,0.4); }
  span.text span { display: block; }
  span.text span + span { padding-left: 1.4em; }
  /* Die Grafik ist etwa 1,43-mal so breit wie hoch: die Höhe begrenzt sie, damit sie das Motiv nicht verdeckt */
  @media (min-width: ${FOCAL_BREAKPOINT + 1}px) { img { width: min(44vw, 48rem, 68vh); } }
`;
const Facts = styled.p`
  margin: clamp(1.25rem, 3.5vh, 2.25rem) 0 0; font-family: ${FONT}; font-weight: 300; font-size: clamp(1.125rem, 4.4vw, 1.375rem); line-height: 1.5; letter-spacing: 0.05em;
  text-shadow: 0 1px 12px rgba(51,53,63,0.5); ${enter(750, 800, true)}
  time, span { display: block; }
  @media (min-width: ${FOCAL_BREAKPOINT + 1}px) {
    font-size: clamp(1.25rem, 1.5vw, 1.75rem);
    time, span { display: inline; }
    time + span::before { content: ''; display: inline-block; width: 2.5em; height: 1px; margin: 0 1em; vertical-align: 0.32em; background: currentColor; opacity: 0.7; }
  }
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
