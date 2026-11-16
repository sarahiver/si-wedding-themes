// src/themes/cassis/Timeline.js – Ablauf von oben nach unten, danach das zweite Foto als eigener Bildabschnitt
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { optimizedUrl } from '../../lib/cloudinary';
import STRINGS from './strings';
import { C, Section, Inner, Aside, Body, Title, DESK, HEADER, useReveal } from './shared';

// Eine durchgehende feine Linie; jede Zeile sitzt mit einem kleinen Punkt darauf.
// Maße in em: Die Liste wächst auf großen Flächen als Ganzes mit.
// Beim ersten Erscheinen baut sich die Linie von oben nach unten auf, die Zeilen
// folgen leicht versetzt (nur wenn useReveal das Element scharf geschaltet hat).
const List = styled.ol`
  list-style: none; margin: 0; padding: 0; font-weight: 300; font-size: 1.375rem; line-height: 1.3;
  ${DESK} { font-size: clamp(1.625rem, 2.15vw, 2.5rem); }
  &[data-reveal='armed'] li { opacity: 0; transform: translateY(12px); }
  &[data-reveal='armed'] li::before { transform: scaleY(0); }
  &[data-reveal='in'] li { opacity: 1; transform: none; transition: opacity 0.5s ease, transform 0.5s ease; transition-delay: calc(var(--i) * 65ms); }
  &[data-reveal='in'] li::before { transform: none; transition: transform 0.5s ease; transition-delay: calc(var(--i) * 65ms + 120ms); }
`;
const Item = styled.li`
  position: relative; display: grid; grid-template-columns: 3.1em 1fr; column-gap: 2.1em; align-items: baseline;
  padding: 0 0 clamp(1.9rem, 6.5vw, 2.5rem);
  ${DESK} { padding-bottom: 1.5em; }
  &::before { content: ''; position: absolute; left: 4.15em; top: 0.62em; bottom: -0.62em; width: 1px; background: ${C.haze}; transform-origin: top; }
  &:last-child { padding-bottom: 0; }
  &:last-child::before { display: none; }
  &::after { content: ''; position: absolute; left: calc(4.15em - 3px); top: calc(0.62em - 3px); width: 7px; height: 7px; border-radius: 50%; background: ${C.mist}; }
`;
const Time = styled.time`font-variant-numeric: tabular-nums; white-space: nowrap; color: ${C.inkSoft};`;
const What = styled.div`
  overflow-wrap: anywhere;
  small { display: block; margin-top: 0.3rem; font-weight: 400; font-size: 1rem; line-height: 1.5; color: ${C.inkSoft}; }
  ${DESK} { small { font-size: 0.52em; } }
`;
// Bildabschnitt: randlos über die ganze Breite. Auf breiten Bildschirmen eine große,
// fast quadratische Fläche – so bleibt das Paar im Hochformat von Kopf bis Fuß im Bild.
const Figure = styled.figure`
  margin: 0; background: ${C.mist}; line-height: 0; scroll-margin-top: ${HEADER};
  img { display: block; width: 100%; height: auto; }
  ${DESK} {
    img { height: min(84vw, 150vh); object-fit: cover; object-position: 50% 62%; }
  }
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
        <Section id="timeline" $tone="shell">
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
