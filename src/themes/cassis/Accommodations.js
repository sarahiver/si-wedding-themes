// src/themes/cassis/Accommodations.js – Hotels als ruhige Reihe von Karten, die man seitlich wischt:
// Der Abschnitt bleibt kurz, auch bei vielen Hotels. Die nächste Karte schaut am rechten Rand hervor.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { optimizedUrl } from '../../lib/cloudinary';
import STRINGS from './strings';
import { OWN_TITLE } from './helpers';
import { C, SERIF, G, DESK, italic, Section, Inner, Full, Title, Lead, Button } from './shared';

// Kopf über die ganze Breite: Überschrift links, Begleitsatz rechts auf der Grundlinie.
const Head = styled.div`
  display: contents;
  h2:only-child { margin-bottom: clamp(2.5rem, 5vw, 5rem); }
  p { margin: 0.75rem 0 clamp(2.5rem, 5vw, 5rem); }
  ${DESK} {
    display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G}; align-items: end;
    margin: 0 0 clamp(2.5rem, 5vw, 5rem);
    h2, h2:only-child { grid-column: 1 / 8; margin: 0; }
    p { grid-column: 8 / 13; margin: 0 0 0.35em; max-width: none; }
  }
`;
// Die Reihe läuft nach beiden Seiten bis an den Seitenrand; jede Karte rastet an der Textkante ein.
const Track = styled.ul`
  list-style: none; margin: 0 calc(${G} * -1); padding: 0 ${G} 0.5rem; display: flex; gap: ${G};
  overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scroll-padding-inline: ${G};
  scrollbar-width: none; &::-webkit-scrollbar { display: none; }
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 4px; }
  @media (prefers-reduced-motion: no-preference) { scroll-behavior: smooth; }
`;
const Card = styled.li`
  flex: 0 0 82%; min-width: 0; scroll-snap-align: start; display: flex; flex-direction: column;
  ${DESK} { flex-basis: calc((100% - 2 * ${G}) / 2.6); }
  @media (min-width: 1400px) { flex-basis: calc((100% - 3 * ${G}) / 3.4); }
`;
const Shot = styled.figure`
  margin: 0 0 1.25rem;
  img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
`;
const Name = styled.h3`margin: 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.625rem, 2.2vw, 2.25rem); line-height: 1.1; overflow-wrap: anywhere;`;
const Distance = styled.p`margin: 0.4rem 0 0; ${italic} color: ${C.inkSoft}; overflow-wrap: anywhere;`;
const Facts = styled.div`
  margin-top: 1rem; padding-top: 1rem; border-top: 1px solid ${C.line};
  address { margin: 0; font-style: normal; white-space: pre-line; overflow-wrap: anywhere; }
  p { margin: 0.5rem 0 0; overflow-wrap: anywhere; }
  p:first-child { margin-top: 0; }
  .soft { color: ${C.inkSoft}; }
  b { font-weight: 400; letter-spacing: 0.08em; }
`;
// Buchen und Route im selben Kasten wie die übrigen Knöpfe, nur schmaler
const Links = styled.div`
  margin-top: auto; padding-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem;
  a { min-width: 0; min-height: 3rem; padding: 0.6rem 1.25rem; }
`;
// Pfeile zum Blättern – für alle, die nicht wischen (Maus, Tastatur). Nur wenn nicht alles hineinpasst.
const Arrows = styled.div`
  display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;
  button {
    width: 3rem; height: 3rem; display: inline-flex; align-items: center; justify-content: center; padding: 0; cursor: pointer;
    border: 1px solid ${C.ink}; border-radius: 0; background: transparent; color: ${C.ink}; transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
    &:hover:not(:disabled) { background: ${C.ink}; color: ${C.white}; }
    &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
    &:disabled { opacity: 0.3; cursor: default; }
    svg { width: 1.25rem; height: 1.25rem; }
  }
  @media (prefers-reduced-motion: reduce) { button { transition: none; } }
`;
const Chevron = ({ back }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d={back ? 'M12.5 4 6.5 10l6 6' : 'M7.5 4l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
);

// Merkt sich, ob es links oder rechts noch etwas zu sehen gibt
function useTrack(count) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const update = useCallback(() => {
    const el = ref.current; if (!el) return;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);
  useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update, count]);
  // Um genau eine Karte weiter
  const step = (dir) => {
    const el = ref.current; const card = el && el.firstElementChild; if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap) });
  };
  return { ref, edge, step };
}

const mapUrl = (h) => h.maps_url || (h.lat && h.lng ? `https://www.google.com/maps?q=${h.lat},${h.lng}` : (h.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.name || ''} ${h.address}`.trim())}` : ''));
const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '');

function Accommodations() {
  const { t } = useLanguage();
  const a = useLocalizedContent('accommodations', OWN_TITLE);
  const hotels = (Array.isArray(a.hotels) ? a.hotels : []).filter((h) => h && h.name);
  const { ref, edge, step } = useTrack(hotels.length);
  if (!hotels.length && !a.description) return null;
  const title = a.title || t(STRINGS, 'hotelsTitle');
  return (
    <Section id="accommodations" $tone="pearl">
      <Inner>
        <Full>
          <Head>
            <Title deco={t(STRINGS, 'decoHotels')}>{title}</Title>
            {a.description && <Lead>{a.description}</Lead>}
          </Head>
          {hotels.length > 0 && (<>
            {/* Mit der Tastatur erreichbar, damit sich die Reihe auch mit den Pfeiltasten verschieben lässt */}
            <Track ref={ref} tabIndex={edge.start && edge.end ? undefined : 0} aria-label={title}>
              {hotels.map((h, i) => {
                const route = safeUrl(mapUrl(h)); const book = safeUrl(h.booking_url || h.url);
                const facts = h.address || h.price_range || h.booking_code;
                return (
                  <Card key={i}>
                    {h.image && <Shot><img src={optimizedUrl.preview ? optimizedUrl.preview(h.image) : h.image} alt="" loading="lazy" /></Shot>}
                    <Name>{h.name}</Name>
                    {h.distance && <Distance>{h.distance}</Distance>}
                    {facts && (
                      <Facts>
                        {h.address && <address>{h.address}</address>}
                        {h.price_range && <p className="soft">{h.price_range}</p>}
                        {h.booking_code && <p><span className="soft">{t(STRINGS, 'bookingCode')}:</span> <b>{h.booking_code}</b></p>}
                      </Facts>
                    )}
                    {(route || book) && (
                      <Links>
                        {book && <Button href={book} target="_blank" rel="noopener noreferrer" $solid>{t(STRINGS, 'book')}</Button>}
                        {route && <Button href={route} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'route')}</Button>}
                      </Links>
                    )}
                  </Card>
                );
              })}
            </Track>
            {!(edge.start && edge.end) && (
              <Arrows>
                <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label={t(STRINGS, 'prevHotel')}><Chevron back /></button>
                <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label={t(STRINGS, 'nextHotel')}><Chevron /></button>
              </Arrows>
            )}
          </>)}
        </Full>
      </Inner>
    </Section>
  );
}
export default Accommodations;
