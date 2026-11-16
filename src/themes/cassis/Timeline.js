// src/themes/cassis/Timeline.js – Ablauf von oben nach unten, danach das zweite Foto als eigener Bildabschnitt
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { optimizedUrl } from '../../lib/cloudinary';
import STRINGS from './strings';
import { C, Section, Inner, Aside, Body, Title } from './shared';

// Eine durchgehende feine Linie; jede Zeile sitzt mit einem kleinen Punkt darauf.
const List = styled.ol`list-style: none; margin: 0; padding: 0;`;
const Item = styled.li`
  position: relative; display: grid; grid-template-columns: 4.25rem 1fr; column-gap: 2.75rem; align-items: baseline;
  padding: 0 0 clamp(1.75rem, 6vw, 2.5rem);
  &::before { content: ''; position: absolute; left: 5.625rem; top: 0.75rem; bottom: -0.75rem; width: 1px; background: ${C.haze}; }
  &:last-child { padding-bottom: 0; }
  &:last-child::before { display: none; }
  &::after { content: ''; position: absolute; left: calc(5.625rem - 3px); top: 0.6rem; width: 7px; height: 7px; border-radius: 50%; background: ${C.mist}; }
`;
const Time = styled.time`font-weight: 300; font-size: 1.375rem; line-height: 1.3; font-variant-numeric: tabular-nums; white-space: nowrap; color: ${C.inkSoft};`;
const What = styled.div`
  font-weight: 300; font-size: 1.375rem; line-height: 1.3; overflow-wrap: anywhere;
  small { display: block; margin-top: 0.3rem; font-weight: 400; font-size: 1rem; line-height: 1.5; color: ${C.inkSoft}; }
`;
// Bildabschnitt: auf dem Handy randlos, auf großen Flächen als ganzes Hochformat mit Luft
const Figure = styled.figure`
  margin: 0; background: ${C.mist}; line-height: 0; text-align: center;
  img { display: block; width: 100%; height: auto; }
  @media (min-width: 900px) {
    padding: clamp(4rem, 8vw, 7rem) 2rem;
    img { display: inline-block; width: auto; max-width: 100%; height: min(86vh, 58rem); object-fit: cover; }
  }
`;

function Timeline() {
  const { t } = useLanguage();
  const tl = useLocalizedContent('timeline');
  const events = Array.isArray(tl.events) ? tl.events.filter((e) => e && (e.time || e.title)) : [];
  if (!events.length && !tl.image) return null;
  return (
    <>
      {events.length > 0 && (
        <Section id="timeline" $tone="shell">
          <Inner>
            <Aside><Title>{tl.title || t(STRINGS, 'schedule')}</Title></Aside>
            <Body>
              <List>
                {events.map((e, i) => (
                  <Item key={i}>
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
