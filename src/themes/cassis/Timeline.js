// src/themes/cassis/Timeline.js – Ablauf als Zeitstrahl, danach das zweite Foto als stehende Seite
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { optimizedUrl } from '../../lib/cloudinary';
import STRINGS from './strings';
import { OWN_TITLE } from './helpers';
import { C, FONT, Section, Inner, Aside, Body, Title, DESK, TALL, G, useReveal } from './shared';

// Zeitstrahl wie in der Einladung: links die Uhrzeit (Stunde groß, Minuten hochgestellt), in der Mitte zwei
// schlanke, leicht geschwungene Linien, rechts der Programmpunkt. Keine Trennlinien zwischen den Zeilen.
// --tc: Breite der Uhrzeit-Spalte, --lc: Breite der Spalte mit den Linien.
const List = styled.ol`
  --tc: 5.25rem; --lc: 2.75rem;
  position: relative; list-style: none; margin: 0; padding: 0.5rem 0 2.5rem; color: var(--title, ${C.white});
  ${DESK} { --tc: clamp(6rem, 9vw, 9rem); --lc: clamp(3rem, 5vw, 5.5rem); }
  &[data-reveal='armed'] li { opacity: 0; transform: translateY(12px); }
  &[data-reveal='in'] li { opacity: 1; transform: none; transition: opacity 0.5s ease, transform 0.5s ease; transition-delay: calc(var(--i) * 70ms); }
`;
// Die Linien wachsen mit der Liste: feste Breite, Höhe = ganze Liste (preserveAspectRatio none)
const Stems = styled.svg`
  position: absolute; top: -1.5rem; bottom: -3rem; left: var(--tc); width: var(--lc); height: calc(100% + 4.5rem); overflow: visible; pointer-events: none;
`;
const Item = styled.li`
  position: relative; display: grid; grid-template-columns: var(--tc) var(--lc) minmax(0, 1fr); align-items: baseline;
  padding: clamp(0.9rem, 1.8vw, 1.75rem) 0;
`;
const Time = styled.time`
  justify-self: end; font-family: ${FONT}; font-weight: 300; font-size: clamp(2.25rem, 3.8vw, 4rem); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums; white-space: nowrap; letter-spacing: 0.01em;
  sup { display: inline-block; vertical-align: top; margin-left: 0.3em; font-size: 0.36em; line-height: 1; letter-spacing: 0.04em; transform: translateY(0.15em); }
`;
const What = styled.div`
  grid-column: 3; font-family: ${FONT}; font-weight: 300; font-size: clamp(1.375rem, 2.1vw, 2.125rem); line-height: 1.2; overflow-wrap: anywhere;
  small { display: block; margin-top: 0.3rem; font-size: 1.0625rem; line-height: 1.4; opacity: 0.85; }
  ${DESK} { small { font-size: clamp(1.0625rem, 1.2vw, 1.25rem); } }
`;

// „15:00" → Stunde und Minuten getrennt; andere Angaben (z. B. „ab 15 Uhr") bleiben, wie sie sind
export function splitTime(time) {
  const m = /^\s*(\d{1,2})[:.h](\d{2})\s*$/.exec(String(time || ''));
  return m ? { hour: m[1], minutes: m[2] } : null;
}

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
  const tl = useLocalizedContent('timeline', OWN_TITLE);
  const listRef = useReveal();
  const events = Array.isArray(tl.events) ? tl.events.filter((e) => e && (e.time || e.title)) : [];
  if (!events.length && !tl.image) return null;
  return (
    <>
      {events.length > 0 && (
        <Section id="timeline" $tone="mist">
          <Inner>
            <Aside><Title deco={t(STRINGS, 'decoTimeline')}>{tl.title || t(STRINGS, 'schedule')}</Title></Aside>
            <Body>
              <List ref={listRef}>
                <Stems viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  {/* Hauptlinie: oben fein, nach unten etwas kräftiger und leicht nach rechts geneigt */}
                  <path d="M29 0 C30 300 32 650 35 1000 L39 1000 C35.5 650 32.6 300 30.2 0 Z" fill="rgba(255,255,255,0.55)" />
                  {/* Zweite Linie: beginnt im unteren Drittel links und kreuzt die erste */}
                  <path d="M6 640 C16 770 28 880 46 1000 L48.6 1000 C30 880 17.6 770 7.2 640 Z" fill="rgba(255,255,255,0.42)" />
                </Stems>
                {events.map((e, i) => {
                  const hm = splitTime(e.time);
                  return (
                    <Item key={i} style={{ '--i': i }}>
                      <Time dateTime={e.time || undefined}>{hm ? <>{hm.hour}<sup>{hm.minutes}</sup></> : e.time}</Time>
                      <What>{e.title}{(e.location || e.description) && <small>{[e.location, e.description].filter(Boolean).join(', ')}</small>}</What>
                    </Item>
                  );
                })}
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
