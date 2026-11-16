// src/themes/cassis/Timeline.js – Ablauf als gesetzte Tabelle, danach das zweite Foto als stehende Seite
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { optimizedUrl } from '../../lib/cloudinary';
import STRINGS from './strings';
import { C, FONT, SERIF, Section, Inner, Aside, Body, Title, DESK, G, useReveal } from './shared';

// Jede Zeile trägt die Uhrzeit als Überschrift; feine Linien trennen die Zeilen.
// Beim ersten Erscheinen folgen die Zeilen leicht versetzt (nur wenn useReveal das Element scharf geschaltet hat).
const List = styled.ol`
  list-style: none; margin: 0; padding: 0;
  &[data-reveal='armed'] li { opacity: 0; transform: translateY(12px); }
  &[data-reveal='in'] li { opacity: 1; transform: none; transition: opacity 0.5s ease, transform 0.5s ease; transition-delay: calc(var(--i) * 70ms); }
`;
const Item = styled.li`
  display: grid; grid-template-columns: 5.25rem 1fr; column-gap: 1.25rem; align-items: baseline;
  padding: clamp(1rem, 1.9vw, 1.9rem) 0; border-top: 1px solid ${C.haze};
  &:last-child { border-bottom: 1px solid ${C.haze}; }
  ${DESK} {
    grid-template-columns: minmax(6rem, 22%) 1fr; column-gap: ${G};
    /* Jede zweite Zeile ist eingerückt: die Tabelle bekommt einen ruhigen Rhythmus */
    &:nth-child(odd) > div { padding-left: clamp(0rem, 5vw, 6rem); }
  }
`;
const Time = styled.time`font-family: ${SERIF}; font-weight: 400; font-size: clamp(2rem, 3.9vw, 4.25rem); line-height: 1; font-variant-numeric: lining-nums tabular-nums; white-space: nowrap;`;
const What = styled.div`
  font-family: ${FONT}; font-weight: 300; font-size: clamp(1.125rem, 1.55vw, 1.625rem); line-height: 1.3; overflow-wrap: anywhere;
  small { display: block; margin-top: 0.3rem; font-weight: 400; font-size: 1rem; line-height: 1.5; color: ${C.inkSoft}; }
`;
// Zweites Foto: versetzt auf einer blaugrauen Fläche. Es bleibt am oberen Rand stehen,
// der nächste Abschnitt zieht darüber. Das Bild wird unten beschnitten – Köpfe bleiben frei.
const Figure = styled.figure`
  position: relative; z-index: 0; margin: 0; overflow: hidden; background: ${C.pearl}; line-height: 0;
  height: 100vh; height: 100svh; min-height: 34rem;
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G};
  @media (min-height: 34rem) { position: sticky; top: 0; }
  &::before { content: ''; grid-column: 1 / 9; grid-row: 1; background: ${C.mist}; margin-top: 30vh; }
  img { grid-column: 3 / 13; grid-row: 1; position: relative; z-index: 1; display: block; width: 100%; height: 74vh; height: 74svh; margin-top: 13vh; object-fit: cover; object-position: 50% 30%; }
  ${DESK} {
    min-height: 40rem;
    @media (max-height: 39.99rem) { position: relative; }
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
