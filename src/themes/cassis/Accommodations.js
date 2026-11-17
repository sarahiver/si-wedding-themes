// src/themes/cassis/Accommodations.js – Hotels als ruhige Liste
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { optimizedUrl } from '../../lib/cloudinary';
import STRINGS from './strings';
import { C, SERIF, Section, Inner, Aside, Body, Title, Lead } from './shared';

const List = styled.ul`list-style: none; margin: 0; padding: 0;`;
// Mit Bild steht es links neben dem Text – sobald der Eintrag selbst breit genug ist
const Hotel = styled.li`
  display: grid; gap: 1.25rem clamp(1.25rem, 2.5vw, 2.5rem); align-items: start; padding: clamp(1.25rem, 2vw, 2rem) 0; border-top: 1px solid ${C.haze};
  grid-template-columns: ${(p) => (p.$image ? 'repeat(auto-fit, minmax(min(100%, 13rem), 1fr))' : '1fr')};
  &:last-child { border-bottom: 1px solid ${C.haze}; }
  img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
`;
const Name = styled.h3`margin: 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.625rem, 2.2vw, 2.25rem); line-height: 1.15; overflow-wrap: anywhere;`;
const Facts = styled.p`margin: 0.35rem 0 0; display: flex; flex-wrap: wrap; gap: 0 1.25rem; color: ${C.inkSoft};`;
const Address = styled.address`margin: 0.75rem 0 0; font-style: normal; white-space: pre-line; overflow-wrap: anywhere;`;
const Code = styled.p`margin: 0.75rem 0 0; b { font-weight: 400; letter-spacing: 0.06em; }`;
const Links = styled.p`
  margin: 0.5rem 0 0; display: flex; flex-wrap: wrap; gap: 0 1.5rem;
  a { color: ${C.ink}; min-height: 2.75rem; display: inline-flex; align-items: center; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.3em; text-decoration-color: ${C.haze}; transition: text-decoration-color 0.2s ease; }
  a:hover { text-decoration-color: ${C.ink}; }
  a:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
`;
const mapUrl = (h) => h.maps_url || (h.lat && h.lng ? `https://www.google.com/maps?q=${h.lat},${h.lng}` : (h.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.name || ''} ${h.address}`.trim())}` : ''));
const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '');

function Accommodations() {
  const { t } = useLanguage();
  const a = useLocalizedContent('accommodations');
  const hotels = (Array.isArray(a.hotels) ? a.hotels : []).filter((h) => h && h.name);
  if (!hotels.length && !a.description) return null;
  return (
    <Section id="accommodations" $tone="pearl">
      <Inner>
        <Aside>
          <Title $small>{a.title || t(STRINGS, 'hotelsTitle')}</Title>
          {a.description && <Lead>{a.description}</Lead>}
        </Aside>
        <Body>
          <List>
            {hotels.map((h, i) => {
              const route = safeUrl(mapUrl(h)); const book = safeUrl(h.booking_url || h.url);
              return (
                <Hotel key={i} $image={!!h.image}>
                  {h.image && <img src={optimizedUrl.card ? optimizedUrl.card(h.image) : h.image} alt="" loading="lazy" />}
                  <div>
                    <Name>{h.name}</Name>
                    {(h.distance || h.price_range) && <Facts>{h.distance && <span>{h.distance}</span>}{h.price_range && <span>{h.price_range}</span>}</Facts>}
                    {h.address && <Address>{h.address}</Address>}
                    {h.booking_code && <Code>{t(STRINGS, 'bookingCode')}: <b>{h.booking_code}</b></Code>}
                    {(route || book) && (
                      <Links>
                        {book && <a href={book} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'book')}</a>}
                        {route && <a href={route} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'route')}</a>}
                      </Links>
                    )}
                  </div>
                </Hotel>
              );
            })}
          </List>
        </Body>
      </Inner>
    </Section>
  );
}
export default Accommodations;
