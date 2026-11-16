// src/themes/cassis/Timeline.js – zweites Paarfoto und Ablauf
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, Section, Inner, Title } from './shared';

const Photo = styled.img`display: block; width: 100%; height: auto; max-height: 92vh; object-fit: cover; background: ${C.blueLight};`;
const List = styled.ol`
  list-style: none; margin: 0; padding: 0.5rem 0 0.5rem 0; position: relative;
  &::before { content: ''; position: absolute; top: 0; bottom: 0; left: 7.1rem; width: 5px; border-radius: 50%; background: rgba(255,255,255,0.4); }
  @media (max-width: 360px) { &::before { left: 5.9rem; } }
`;
const Item = styled.li`
  display: grid; grid-template-columns: 6rem 1fr; column-gap: 2.5rem; align-items: baseline; padding: 0.9rem 0;
  @media (max-width: 360px) { grid-template-columns: 5rem 1fr; column-gap: 2rem; }
`;
const Time = styled.time`
  justify-self: end; font-size: 1.75rem; line-height: 1; font-weight: 300; white-space: nowrap;
  sup { font-size: 0.5em; vertical-align: 0.75em; margin-left: 0.3em; letter-spacing: 0.04em; }
`;
const What = styled.div`
  font-size: 1.375rem; line-height: 1.25; overflow-wrap: anywhere;
  small { display: block; margin-top: 0.2rem; font-size: 1rem; line-height: 1.45; }
`;

function Timeline() {
  const { t } = useLanguage();
  const tl = useLocalizedContent('timeline');
  const events = Array.isArray(tl.events) ? tl.events.filter((e) => e && (e.time || e.title)) : [];
  if (!events.length && !tl.image) return null;
  return (
    <>
      {tl.image && <Photo src={tl.image} alt="" loading="lazy" />}
      <Section id="timeline" $tone="blue">
        <Inner>
          <Title $align="left">{tl.title || t(STRINGS, 'schedule')}</Title>
          <List>
            {events.map((e, i) => {
              const [h, m] = String(e.time || '').split(/[:.]/);
              return (
                <Item key={i}>
                  <Time dateTime={e.time || undefined}>{h}{m !== undefined && <sup>{m}</sup>}</Time>
                  <What>{e.title}{(e.location || e.description) && <small>{[e.location, e.description].filter(Boolean).join(' · ')}</small>}</What>
                </Item>
              );
            })}
          </List>
        </Inner>
      </Section>
    </>
  );
}
export default Timeline;
