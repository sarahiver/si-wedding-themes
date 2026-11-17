// src/themes/cassis/Timeline.js – Ablauf als gesetzte Tabelle, danach das zweite Foto als stehende Seite
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { optimizedUrl } from '../../lib/cloudinary';
import STRINGS from './strings';
import { C, SERIF, Section, Inner, Aside, Body, Title, DESK, TALL, G, italic, useReveal } from './shared';

// Jede Zeile trägt die Uhrzeit als Überschrift; feine Linien trennen die Zeilen.
// Beim ersten Erscheinen folgen die Zeilen leicht versetzt (nur wenn useReveal das Element scharf geschaltet hat).
const List = styled.ol`
  list-style: none; margin: 0; padding: 0;
  &[data-reveal='armed'] li { opacity: 0; transform: translateY(12px); }
  &[data-reveal='in'] li { opacity: 1; transform: none; transition: opacity 0.5s ease, transform 0.5s ease; transition-delay: calc(var(--i) * 70ms); }
`;
// Uhrzeit links, der Text mittig in der übrigen Breite – alle Texte stehen auf derselben Achse,
// ruhig wie ein gesetztes Programm. Auf breiten Bildschirmen spiegelt eine leere dritte Spalte
// die Uhrzeit: dann liegt die Achse genau in der Mitte der Zeile.
const Item = styled.li`
  display: grid; grid-template-columns: 4.75rem minmax(0, 1fr); column-gap: 0.75rem; align-items: center;
  padding: clamp(1.1rem, 2vw, 2.1rem) 0; border-top: 1px solid ${C.haze};
  &:last-child { border-bottom: 1px solid ${C.haze}; }
  ${DESK} { grid-template-columns: minmax(5rem, 22%) minmax(0, 1fr); column-gap: ${G}; }
  @media (min-width: 1100px) { grid-template-columns: minmax(6rem, 22%) minmax(0, 1fr) minmax(6rem, 22%); }
`;
const Time = styled.time`font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.875rem, 3.9vw, 4.25rem); line-height: 1; font-variant-numeric: lining-nums tabular-nums; white-space: nowrap;`;
// Titel in der Serifenschrift, der Zusatz darunter als kursiver Begleitsatz
const What = styled.div`
  text-align: center; font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.375rem, 2.1vw, 2.25rem); line-height: 1.15; overflow-wrap: anywhere;
  small { display: block; margin-top: 0.35rem; ${italic} font-size: 1.0625rem; line-height: 1.4; color: ${C.inkSoft}; }
  ${DESK} { small { font-size: clamp(1.0625rem, 1.25vw, 1.3125rem); } }
`;
// Zweites Foto: versetzt auf einer blaugrauen Fläche. Es bleibt am oberen Rand stehen,
// der nächste Abschnitt zieht darüber. Das Bild wird unten beschnitten – Köpfe bleiben frei.
const Figure = styled.figure`
  position: relative; z-index: 0; margin: 0; overflow: hidden; background: ${C.pearl}; line-height: 0;
  height: 100vh; height: 100svh; min-height: 20rem;
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G};
  ${TALL} { position: sticky; top: 0; }
  &::before { content: ''; grid-column: 1 / 9; grid-row: 1; background: ${C.mist}; margin-top: 30vh; }
  img { grid-column: 3 / 13; grid-row: 1; position: relative; z-index: 1; display: block; width: 100%; height: 74vh; height: 74svh; margin-top: 13vh; object-fit: cover; object-position: 50% 30%; }
  ${DESK} {
    &::before { grid-column: 1 / 8; margin-top: 24vh; }
    img { grid-column: 4 / 13; height: 84vh; margin-top: 8vh; }
  }
  @media print { position: relative; height: auto; img { height: auto; } }
`;

function Timeline() {
  const { t } = useLanguage();
  const tl = useLocalizedContent('timeline');
  const listRef = useReveal();
  const events = Array.isArray(tl.events) ? tl.events.filter((e) => e && (e.time || e.title)) : [];
  if (!events.length && !tl.image) return null;
  return (
    <>
      {events.length > 0 && (
        <Section id="timeline" $tone="pearl">
          <Inner>
            <Aside><Title>{tl.title || t(STRINGS, 'schedule')}</Title></Aside>
            <Body>
              <List ref={listRef}>
                {events.map((e, i) => (
                  <Item key={i} style={{ '--i': i }}>
                    <Time dateTime={e.time || undefined}>{e.time}</Time>
                    <What>{e.title}{(e.location || e.description) && <small>{[e.location, e.description].filter(Boolean).join(', ')}</small>}</What>
                  </Item>
                ))}
              </List>
            </Body>
          </Inner>
        </Section>
      )}
      {tl.image && <Figure data-cassis-photo><img src={optimizedUrl.hero(tl.image)} alt="" loading="lazy" /></Figure>}
    </>
  );
}
export default Timeline;
