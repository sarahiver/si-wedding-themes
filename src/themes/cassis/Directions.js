// src/themes/cassis/Directions.js – Ort und Antwort auf einer Fläche:
// die Illustration des Orts bleibt links stehen, Anfahrt und Antwortkarte ziehen rechts darüber.
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SERIF, Title, Button, DESK, LOW, HEADER, G, italic, reveal, useReveal } from './shared';
import { mapsLink, follows } from './helpers';
import { RsvpCard, RsvpHead } from './RSVP';

// Zwei Zeilen: oben die Anfahrt, darunter die Antwortkarte. Die Illustration reicht über beide.
const Venue = styled.div`
  position: relative; z-index: 1; background: ${C.mist}; color: ${C.ink}; padding: 0 ${G} 4rem;
  font-family: ${FONT}; font-weight: 400; font-size: 1.0625rem; line-height: 1.65; font-variant-numeric: lining-nums;
  box-shadow: 0 -30px 60px -40px rgba(51,53,63,0.5);
  display: flex; flex-direction: column;
  ${DESK} {
    display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-template-rows: auto 1fr; column-gap: ${G};
    padding-bottom: clamp(5rem, 9vw, 9rem); font-size: clamp(1.0625rem, 1.2vw, 1.375rem);
  }
`;
// Bleibt unter der Kopfzeile stehen, solange die Fläche durchläuft
const Stand = styled.div`
  order: 2; position: sticky; top: ${HEADER}; padding: 1.5rem 0; display: flex; justify-content: center;
  img { display: block; width: 88%; max-height: 52vh; max-height: 52svh; object-fit: contain; opacity: 0.55; }
  ${DESK} {
    grid-column: 1 / 7; grid-row: 1 / 4; align-self: start; height: calc(100vh - ${HEADER}); box-sizing: border-box; padding: 0 0 5vh; align-items: flex-end; justify-content: flex-start;
    /* Über der Illustration bleibt Platz für die stehende Überschrift der Antwort */
    img { width: 100%; max-height: min(54vh, calc(100vh - 21rem - 5vh)); object-position: left bottom; }
    ${LOW} { img { max-height: 54vh; } }
  }
  img { ${reveal} }
  img[data-reveal='armed'] { transform: translateX(-2vw); }
  img[data-reveal='in'] { opacity: 0.55; transition: opacity 1.1s ease, transform 1.2s cubic-bezier(.2,.6,.2,1); }
  @media print { position: relative; height: auto; }
`;
const Info = styled.section`
  order: 1; position: relative; z-index: 1; scroll-margin-top: calc(${HEADER} - 2px); padding: 4.5rem 0 1rem;
  ${DESK} {
    grid-column: 8 / 13; grid-row: 1; box-sizing: border-box; padding: clamp(5rem, 9vw, 9rem) 0 clamp(3rem, 6vw, 6rem);
    display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
    /* Raum für die Illustration daneben – auf sehr hohen Bildschirmen (Tablet hochkant) begrenzt */
    min-height: ${(p) => (p.$tall ? `min(calc(100vh - ${HEADER}), 46rem)` : '0')};
  }
  ${reveal}
`;
const Place = styled.address`
  margin: 2.5rem 0 0; font-style: normal; white-space: pre-line; overflow-wrap: anywhere;
  font-family: ${SERIF}; font-size: clamp(1.5rem, 2.4vw, 2.6rem); line-height: 1.2;
`;
const Note = styled.p`margin: 1.5rem 0 0; max-width: 26em; white-space: pre-line; overflow-wrap: anywhere; ${italic}`;
const Actions = styled.div`margin-top: 2rem;`;
const Options = styled.dl`margin: 2.5rem 0 0; display: grid; gap: 1.5rem; max-width: 30em;`;
const Term = styled.dt`font-family: ${SERIF}; font-size: clamp(1.375rem, 1.8vw, 1.875rem); line-height: 1.2;`;
const Desc = styled.dd`margin: 0.3rem 0 0; white-space: pre-line; overflow-wrap: anywhere;`;
// Überschrift der Antwort: läuft mit der Karte hoch und bleibt dann über der Illustration stehen.
// Gleiche Höhe wie die Fläche der Illustration – beide lösen sich am Ende im selben Moment.
const HeadStand = styled.div`
  order: 3; position: relative; z-index: 1; margin: 1rem 0 1.5rem;
  ${DESK} {
    grid-column: 1 / 6; grid-row: 2; align-self: start; position: sticky; top: ${HEADER}; height: calc(100vh - ${HEADER}); box-sizing: border-box;
    margin: 0; padding-top: 1.5rem; pointer-events: none;
    > * { pointer-events: auto; }
    /* Niedrige Fenster: Überschrift und Illustration hätten nicht beide Platz – die Überschrift läuft dann mit der Karte mit */
    ${LOW} { grid-column: 6 / 13; position: relative; top: auto; height: auto; padding: 0 0 1.5rem; }
  }
  @media print { position: relative; height: auto; }
`;
const CardSlot = styled.div`
  order: 4; position: relative; z-index: 2; min-width: 0;
  ${DESK} { grid-column: 6 / 13; grid-row: 2; ${LOW} { grid-row: 3; } }
`;

function Directions() {
  const { project, isComponentActive } = useWedding();
  const { t } = useLanguage();
  const d = useLocalizedContent('directions');
  const imgRef = useReveal();
  const infoRef = useReveal();
  const items = (Array.isArray(d.items) ? d.items : (Array.isArray(d.options) ? d.options : [])).filter((x) => x && (x.title || x.description));
  const url = mapsLink(d, project?.location);
  if (!d.description && !d.address && !items.length) return null;
  // Steht die Antwortkarte direkt dahinter, teilen sich beide diese Fläche
  const withRsvp = isComponentActive('rsvp') && follows(project, isComponentActive, 'directions', 'rsvp');
  return (
    <Venue>
      {d.image && <Stand aria-hidden="true"><img ref={imgRef} src={d.image} alt="" loading="lazy" /></Stand>}
      <Info id="directions" ref={infoRef} $tall={!!d.image && withRsvp}>
        <Title>{d.title || t(STRINGS, 'directions')}</Title>
        {d.address && <Place>{[project?.location, d.address].filter(Boolean).join('\n')}</Place>}
        {d.description && <Note>{d.description}</Note>}
        {url && <Actions><Button href={url} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'route')}</Button></Actions>}
        {items.length > 0 && (
          <Options>
            {items.map((x, i) => (<div key={i}><Term>{x.title}</Term><Desc>{x.description}</Desc></div>))}
          </Options>
        )}
      </Info>
      {withRsvp && (<>
        <HeadStand><div><RsvpHead /></div></HeadStand>
        <CardSlot><RsvpCard /></CardSlot>
      </>)}
    </Venue>
  );
}
export default Directions;
