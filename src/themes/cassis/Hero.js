// src/themes/cassis/Hero.js – Startbild als Doppelseite: Papier und Foto, der Schriftzug liegt über der Kante
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { focalCss, imgFocalCss, FOCAL_BREAKPOINT } from '../../lib/focalPoint';
import { optimizedUrl } from '../../lib/cloudinary';
import { C, FONT, SERIF, SCRIPT, G, SPREAD, TALL } from './shared';
import { formatWeddingDate, formatWeddingDay } from './helpers';

// Für Importe aus früheren Fassungen
export { formatWeddingDate };

// Einmalige Abfolge beim Laden: Foto, dann Schriftzug, dann Datum und Ort.
// Ohne Bewegung (oder wenn das Gerät sie nicht wünscht) steht alles sofort da.
const enter = (name, delay, duration) => `
  @media (prefers-reduced-motion: no-preference) { animation: ${name} ${duration}ms cubic-bezier(.2,.6,.2,1) ${delay}ms both; }
`;
// Die Grafik des Schriftzugs ist etwa 1,42-mal so breit wie hoch (--wmh = Höhe).
// Sie liegt zweimal deckungsgleich übereinander: dunkel auf dem Papier, weiß auf dem Foto.
// Jede Fläche schneidet ihre Fassung an der gemeinsamen Kante ab – so wechselt der Schriftzug dort die Farbe.
const Wrap = styled.header`
  position: relative; z-index: 0; overflow: hidden; background: ${C.shell}; color: ${C.ink}; font-family: ${FONT};
  display: flex; flex-direction: column; height: 100vh; height: 100svh; min-height: 34rem;
  --wmw: min(86vw, 28rem); --wmh: calc(var(--wmw) * 0.703); --paper: calc(var(--wmh) * 0.45 + 8.5rem);
  /* Bleibt stehen, während die Seite darüber zieht – nur bei genug Höhe. Das Startbild ist nie höher
     als der Bildschirm (außer unter der Mindesthöhe), sein unterer Rand bleibt also immer sichtbar. */
  ${TALL} { position: sticky; top: 0; }
  @keyframes cassisFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cassisZoom { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: none; } }
  @keyframes cassisRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  ${SPREAD} {
    display: block; min-height: 20rem; max-height: 70rem;
    /* Der Schriftzug richtet sich nach Breite und Höhe – so passt er auch auf ein Handy im Querformat */
    --split: 41vw; --wmw: min(50vw, 89vh); --wmw: min(50vw, 89svh); --wml: 15vw; --wmt: calc(50% - var(--wmw) * 0.36);
    @media (max-height: 30rem) { --wmw: min(50vw, 70vh); --wmw: min(50vw, 70svh); }
  }
  @media print { position: relative; }
`;
const Photo = styled.div`
  position: relative; flex: 1 1 auto; min-height: 0; overflow: hidden; background: ${C.mist}; color: ${C.white};
  img.bg {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; ${enter('cassisZoom', 0, 2400)}
    ${(p) => imgFocalCss(p.$focal)}
  }
  &::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to bottom, rgba(51,53,63,0.3), rgba(51,53,63,0) 22%, rgba(51,53,63,0) 55%, rgba(51,53,63,0.28)); }
  img.wm { position: absolute; z-index: 2; left: 7vw; bottom: calc(var(--wmh) * -0.45); width: var(--wmw); height: auto; filter: drop-shadow(0 2px 14px rgba(51,53,63,0.3)); ${enter('cassisRise', 350, 900)} }
  ${SPREAD} {
    position: absolute; top: 0; bottom: 0; left: var(--split); right: 0;
    img.bg { object-position: 38% 42%; ${(p) => imgFocalCss(p.$focal)} }
    img.wm { left: calc(var(--wml) - var(--split)); top: var(--wmt); bottom: auto; }
  }
`;
const Paper = styled.div`
  position: relative; flex: none; height: var(--paper); overflow: hidden;
  ${SPREAD} { position: absolute; top: 0; bottom: 0; left: 0; width: var(--split); height: auto; }
`;
const Names = styled.h1`
  margin: 0; ${enter('cassisRise', 350, 900)}
  /* Mit Grafik: deckungsgleich zur weißen Fassung auf dem Foto */
  &[data-graphic='true'] { position: absolute; z-index: 2; left: 7vw; top: calc(var(--wmh) * -0.55); width: var(--wmw); }
  img { display: block; width: 100%; height: auto; filter: brightness(0) opacity(0.82); }
  /* Ohne Grafik: die Namen stehen gesetzt auf dem Papier */
  span.text { display: block; padding: 1.5rem ${G} 0; font-family: ${SCRIPT}; font-weight: 400; font-size: clamp(2.75rem, 13vw, 4.5rem); line-height: 1; }
  span.text span { display: block; }
  span.text span + span { padding-left: 1em; }
  ${SPREAD} {
    &[data-graphic='true'] { left: var(--wml); top: var(--wmt); }
    span.text { position: absolute; left: 0; right: 0; top: 32%; padding: 0 ${G}; font-size: clamp(3rem, 6vw, 7rem); }
  }
`;
const Facts = styled.p`
  position: absolute; z-index: 3; left: ${G}; right: ${G}; bottom: 2rem; margin: 0; ${enter('cassisRise', 750, 800)}
  time { display: block; font-family: ${SERIF}; font-size: clamp(1.75rem, 2.6vw, 2.75rem); line-height: 1.1; font-variant-numeric: lining-nums; }
  span { display: block; margin-top: 0.5rem; font-size: 1rem; letter-spacing: 0.04em; color: ${C.inkSoft}; }
  ${SPREAD} { bottom: clamp(2rem, 6vh, 4rem); }
`;
const Edge = styled.p`
  display: none;
  ${SPREAD} { display: block; position: absolute; z-index: 3; right: ${G}; bottom: clamp(2rem, 6vh, 4rem); margin: 0; writing-mode: vertical-rl; transform: rotate(180deg); color: ${C.white}; font-size: 0.8125rem; letter-spacing: 0.14em; opacity: 0.9; text-shadow: 0 0 10px rgba(51,53,63,0.5); }
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

  return (
    <Wrap id="top">
      <Photo $focal={image && hero.background_focal ? focalCss(hero.background_focal) : null}>
        {image && (
          <picture>
            {mobileImage && <source media={`(max-width: ${FOCAL_BREAKPOINT}px)`} srcSet={optimizedUrl.hero(mobileImage)} />}
            <img className="bg" src={optimizedUrl.hero(image)} alt="" />
          </picture>
        )}
        {mark && <img className="wm" src={mark} alt="" aria-hidden="true" />}
      </Photo>
      <Paper>
        <Names aria-label={label} data-graphic={mark ? 'true' : 'false'}>
          {mark
            ? <img src={mark} alt={label} />
            : <span className="text" aria-hidden="true">{(names.length ? names : [label]).map((n) => <span key={n}>{n}</span>)}</span>}
        </Names>
        {(date || place) && (
          <Facts>
            {date && <time dateTime={date}>{formatWeddingDate(date, lang)}</time>}
            {place && <span>{place}</span>}
          </Facts>
        )}
      </Paper>
      {date && <Edge aria-hidden="true">{formatWeddingDay(date, lang)}</Edge>}
    </Wrap>
  );
}
export default Hero;
