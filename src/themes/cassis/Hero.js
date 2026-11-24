// src/themes/cassis/Hero.js – Startbild als Vollbild; Schriftzug, Datum und Ort liegen einfarbig auf dem Foto
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { focalCss, imgFocalCss, FOCAL_BREAKPOINT } from '../../lib/focalPoint';
import { optimizedUrl } from '../../lib/cloudinary';
import { C, FONT, SERIF, SCRIPT, G, SPREAD, TALL } from './shared';
import { formatWeddingDate, formatWeddingDay, heroTone } from './helpers';

// Für Importe aus früheren Fassungen
export { formatWeddingDate };

// Farbe von Schriftzug, Datum und Ort – im Dashboard je Projekt passend zum Foto gewählt (Standard: weiß)
const TONES = {
  // Weiß: weicher dunkler Schatten und eine leichte Abdunklung halten die Schrift vor hellen Stellen lesbar
  light: { color: C.white, logo: 'brightness(0) invert(1) drop-shadow(0 2px 14px rgba(51,53,63,0.35))', shadow: '0 0 14px rgba(51,53,63,0.45)', wash: '51,53,63' },
  // Schwarz: dasselbe mit hellem Schein
  dark: { color: C.ink, logo: 'brightness(0) drop-shadow(0 2px 14px rgba(248,246,246,0.4))', shadow: '0 0 14px rgba(248,246,246,0.6)', wash: '248,246,246' },
};

// Einmalige Abfolge beim Laden: Foto, dann Schriftzug, dann Datum und Ort.
// Ohne Bewegung (oder wenn das Gerät sie nicht wünscht) steht alles sofort da.
const enter = (name, delay, duration) => `
  @media (prefers-reduced-motion: no-preference) { animation: ${name} ${duration}ms cubic-bezier(.2,.6,.2,1) ${delay}ms both; }
`;
const Wrap = styled.header`
  position: relative; z-index: 0; overflow: hidden; background: ${C.mist}; color: ${(p) => TONES[p.$tone].color}; font-family: ${FONT};
  height: 100vh; height: 100svh; min-height: 34rem;
  /* Bleibt stehen, während die Seite darüber zieht – nur bei genug Höhe. Das Startbild ist nie höher
     als der Bildschirm (außer unter der Mindesthöhe), sein unterer Rand bleibt also immer sichtbar. */
  ${TALL} { position: sticky; top: 0; }
  @keyframes cassisFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cassisZoom { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: none; } }
  @keyframes cassisRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  ${SPREAD} { min-height: 20rem; max-height: 70rem; }
  @media print { position: relative; }
`;
const Photo = styled.div`
  position: absolute; inset: 0; overflow: hidden;
  img.bg {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; ${enter('cassisZoom', 0, 2400)}
    ${(p) => imgFocalCss(p.$focal)}
  }
  &::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: ${(p) => { const w = TONES[p.$tone].wash; return `linear-gradient(to bottom, rgba(${w},0.32), rgba(${w},0.08) 25%, rgba(${w},0.08) 60%, rgba(${w},0.36))`; }};
  }
`;
// Schriftzug mit Datum und Ort in der Mitte des Bildes
const Center = styled.div`
  position: absolute; z-index: 2; inset: 0; box-sizing: border-box; padding: 5rem ${G} 4rem;
  display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
`;
const Names = styled.h1`
  margin: 0; ${enter('cassisRise', 350, 900)}
  img { display: block; width: min(80vw, 30rem); height: auto; max-height: 50svh; object-fit: contain; filter: ${(p) => TONES[p.$tone].logo}; }
  /* Ohne Grafik: die Namen in Schreibschrift */
  span.text { display: block; font-family: ${SCRIPT}; font-weight: 400; font-size: clamp(3.25rem, 15vw, 5.5rem); line-height: 1.05; text-shadow: ${(p) => TONES[p.$tone].shadow}; }
  span.text span { display: block; }
  ${SPREAD} {
    img { width: min(44vw, 38rem); max-height: 55svh; }
    span.text { font-size: clamp(3.5rem, 7vw, 8rem); }
  }
`;
const Facts = styled.p`
  margin: 2rem 0 0; text-shadow: ${(p) => TONES[p.$tone].shadow}; ${enter('cassisRise', 750, 800)}
  time { display: block; font-family: ${SERIF}; font-size: clamp(1.75rem, 2.6vw, 2.75rem); line-height: 1.1; font-variant-numeric: lining-nums; }
  span { display: block; margin-top: 0.5rem; font-size: 1rem; letter-spacing: 0.08em; }
`;
const Edge = styled.p`
  display: none;
  ${SPREAD} { display: block; position: absolute; z-index: 3; right: ${G}; bottom: clamp(2rem, 6vh, 4rem); margin: 0; writing-mode: vertical-rl; transform: rotate(180deg); font-size: 0.8125rem; letter-spacing: 0.14em; opacity: 0.9; text-shadow: ${(p) => TONES[p.$tone].shadow}; }
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
  const mark = hero.name_image;
  const tone = heroTone(hero);

  return (
    <Wrap id="top" $tone={tone} data-tone={tone}>
      <Photo $tone={tone} $focal={image && hero.background_focal ? focalCss(hero.background_focal) : null}>
        {image && (
          <picture>
            {mobileImage && <source media={`(max-width: ${FOCAL_BREAKPOINT}px)`} srcSet={optimizedUrl.hero(mobileImage)} />}
            <img className="bg" src={optimizedUrl.hero(image)} alt="" />
          </picture>
        )}
      </Photo>
      <Center>
        <Names aria-label={label} $tone={tone} data-graphic={mark ? 'true' : 'false'}>
          {mark
            ? <img src={mark} alt={label} />
            : <span className="text" aria-hidden="true">{(names.length ? names : [label]).map((n) => <span key={n}>{n}</span>)}</span>}
        </Names>
        {(date || place) && (
          <Facts $tone={tone}>
            {date && <time dateTime={date}>{formatWeddingDate(date, lang)}</time>}
            {place && <span>{place}</span>}
          </Facts>
        )}
      </Center>
      {date && <Edge aria-hidden="true" $tone={tone}>{formatWeddingDay(date, lang)}</Edge>}
    </Wrap>
  );
}
export default Hero;
