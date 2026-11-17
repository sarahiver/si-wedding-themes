// src/themes/cassis/Accommodations.js – Hotels wie die Seite eines kleinen Reiseführers:
// großer Name, Bild und Angaben in zwei ruhigen Spalten, Haarlinien dazwischen.
import React from 'react';
import styled, { css } from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { optimizedUrl } from '../../lib/cloudinary';
import STRINGS from './strings';
import { OWN_TITLE } from './helpers';
import { C, SERIF, G, DESK, HEADER, italic, textLink, Section, Inner, Full, Title, Lead } from './shared';

// Kopf über die ganze Breite: Überschrift links, Begleitsatz rechts auf der Grundlinie.
// Die Überschrift bleibt unter der Kopfzeile stehen, bis die Hotels darunter durchgelaufen sind;
// die deckende Fläche gehört dazu, damit die Einträge sauber dahinter verschwinden.
// Sehr niedrige Fenster (Handy quer) haben dafür keinen Platz – dort läuft alles normal mit.
const STICK = '@media (min-height: 30.01rem)';
const bar = css`position: sticky; top: calc(${HEADER} - 1px); z-index: 2; background: ${C.pearl};`;
const Head = styled.div`
  display: contents;
  h2 { padding: 0.75rem 0 0.5rem; margin-top: -0.75rem; ${STICK} { ${bar} } }
  h2:only-child { margin-bottom: clamp(2.5rem, 5vw, 5rem); }
  p { margin: 0.75rem 0 clamp(2.5rem, 5vw, 5rem); }
  ${DESK} {
    display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G}; align-items: end;
    padding: 1rem 0 clamp(1.25rem, 2vw, 2rem); margin: -1rem 0 clamp(1.25rem, 3vw, 3rem);
    ${STICK} { ${bar} }
    h2, h2:only-child { grid-column: 1 / 8; position: static; padding: 0; margin: 0; background: none; }
    p { grid-column: 8 / 13; margin: 0 0 0.35em; max-width: none; }
  }
`;
const List = styled.ul`list-style: none; margin: 0; padding: 0;`;
// Jeder Eintrag hat dieselben zwei Spalten. Links steht das Bild – ohne Bild der Name.
const Hotel = styled.li`
  padding: clamp(1.75rem, 3.2vw, 3.5rem) 0; border-top: 1px solid ${C.line};
  &:last-child { border-bottom: 1px solid ${C.line}; }
  ${DESK} { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G}; }
`;
const Shot = styled.figure`
  margin: 0 0 1.5rem;
  img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
  ${DESK} { grid-column: 1 / 7; margin: 0; }
`;
const Lede = styled.div`min-width: 0; ${DESK} { grid-column: 1 / 7; }`;
// Neben einem Bild steht der Name oben und die Angaben schließen unten mit dem Bild ab
const Info = styled.div`
  min-width: 0; margin-top: ${(p) => (p.$after ? '1.25rem' : '0')}; display: flex; flex-direction: column; justify-content: space-between; gap: 1.25rem;
  ${DESK} { grid-column: 7 / 13; margin-top: 0; gap: 2rem; padding-top: ${(p) => (p.$after ? '0.5em' : '0')}; }
`;
const Name = styled.h3`margin: 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(2rem, 3.6vw, 3.75rem); line-height: 1.05; letter-spacing: -0.005em; overflow-wrap: anywhere;`;
const Distance = styled.p`margin: 0.6rem 0 0; ${italic} color: ${C.inkSoft}; overflow-wrap: anywhere;`;
const Facts = styled.div`
  address { margin: 0; font-style: normal; white-space: pre-line; overflow-wrap: anywhere; }
  p { margin: 0.5rem 0 0; overflow-wrap: anywhere; }
  p:first-child { margin-top: 0; }
  .soft { color: ${C.inkSoft}; }
  b { font-weight: 400; letter-spacing: 0.08em; }
`;
const Links = styled.p`
  && { margin: 0.75rem 0 -0.5rem; } display: flex; flex-wrap: wrap; gap: 0 2rem;
  a { ${textLink} }
`;
const mapUrl = (h) => h.maps_url || (h.lat && h.lng ? `https://www.google.com/maps?q=${h.lat},${h.lng}` : (h.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.name || ''} ${h.address}`.trim())}` : ''));
const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '');

function Accommodations() {
  const { t } = useLanguage();
  const a = useLocalizedContent('accommodations', OWN_TITLE);
  const hotels = (Array.isArray(a.hotels) ? a.hotels : []).filter((h) => h && h.name);
  if (!hotels.length && !a.description) return null;
  return (
    <Section id="accommodations" $tone="pearl">
      <Inner>
        <Full>
          <Head>
            <Title>{a.title || t(STRINGS, 'hotelsTitle')}</Title>
            {a.description && <Lead>{a.description}</Lead>}
          </Head>
          {hotels.length > 0 && (
            <List>
              {hotels.map((h, i) => {
                const route = safeUrl(mapUrl(h)); const book = safeUrl(h.booking_url || h.url);
                const facts = h.address || h.price_range || h.booking_code || route || book;
                const head = (<><Name>{h.name}</Name>{h.distance && <Distance>{h.distance}</Distance>}</>);
                const details = facts && (
                  <Facts>
                    {h.address && <address>{h.address}</address>}
                    {h.price_range && <p className="soft">{h.price_range}</p>}
                    {h.booking_code && <p><span className="soft">{t(STRINGS, 'bookingCode')}:</span> <b>{h.booking_code}</b></p>}
                    {(route || book) && (
                      <Links>
                        {book && <a href={book} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'book')}</a>}
                        {route && <a href={route} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'route')}</a>}
                      </Links>
                    )}
                  </Facts>
                );
                return h.image ? (
                  <Hotel key={i}>
                    <Shot><img src={optimizedUrl.preview ? optimizedUrl.preview(h.image) : h.image} alt="" loading="lazy" /></Shot>
                    <Info><div>{head}</div>{details}</Info>
                  </Hotel>
                ) : (
                  <Hotel key={i}>
                    <Lede>{head}</Lede>
                    {details && <Info $after>{details}</Info>}
                  </Hotel>
                );
              })}
            </List>
          )}
        </Full>
      </Inner>
    </Section>
  );
}
export default Accommodations;
