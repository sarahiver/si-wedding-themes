import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideLeft = keyframes`from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}`;
const slideRight = keyframes`from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}`;

function useInView(th = 0.08) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [th]);
  return [r, v];
}

const S = styled.section`
  padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem);
  background: var(--c-bg);
  position: relative;
  z-index: 2;
`;

const Inner = styled.div`
  max-width: var(--content-w);
  margin: 0 auto;
`;

const Hdr = styled.div`
  margin-bottom: clamp(2.5rem, 4vw, 4rem);
  opacity: 0;
  ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}
`;

const Eyebrow = styled.p`
  font-family: var(--font-s);
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  color: var(--c-accent);
  margin-bottom: 0.4rem;
`;

const H2 = styled.h2`
  font-family: var(--font-d);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  color: var(--c-text);
`;

const LocationGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 5vw, 5rem);
`;

/* Each location: map left, text right (odd: reversed) */
const LocationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
  direction: ${p => p.$reverse ? 'rtl' : 'ltr'};

  & > * { direction: ltr; }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    direction: ltr;
  }
`;

const MapWrap = styled.div`
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(44,36,22,0.1);
  aspect-ratio: 4/3;
  background: var(--c-bg-warm);
  opacity: 0;
  ${p => p.$v && css`animation: ${slideLeft} 0.9s var(--ease) ${p.$delay}s forwards;`}

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    filter: sepia(20%) contrast(95%);
  }
`;

const TextBlock = styled.div`
  opacity: 0;
  ${p => p.$v && css`animation: ${slideRight} 0.9s var(--ease) ${p.$delay + 0.15}s forwards;`}
`;

const Type = styled.p`
  font-family: var(--font-b);
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--c-accent);
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const LocName = styled.h3`
  font-family: var(--font-d);
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 400;
  color: var(--c-text);
  margin-bottom: 0.75rem;
`;

const Addr = styled.p`
  font-family: var(--font-b);
  font-size: 0.9rem;
  color: var(--c-text-sec);
  line-height: 1.7;
  margin-bottom: 1.25rem;
`;

const Desc = styled.p`
  font-family: var(--font-b);
  font-size: 0.88rem;
  color: var(--c-text-muted);
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const MapLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-b);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--c-text);
  border-bottom: 1px solid var(--c-accent);
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;

  &:hover {
    color: var(--c-accent);
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: var(--c-border);
  margin: clamp(2rem, 4vw, 4rem) 0;
`;

function buildMapsUrl(address) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`;
}

function buildMapsLink(address) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
}

const DEFAULT_LOCS = [
  { type: 'Standesamt', name: 'Standesamt Musterstadt', address: 'Rathausplatz 1, 80331 München', description: 'Hier geben wir offiziell Ja.' },
  { type: 'Feier-Location', name: 'Gut Sonnenhof', address: 'Gut Sonnenhof 1, 82041 Oberhaching', description: 'Unsere Traumlocation unter freiem Himmel — mit Wiese, Scheune und Ausblick.' },
];

function Locations() {
  const { content } = useWedding();
  const ld = content?.locations || {};
  const [ref, v] = useInView();

  const locs = ld.locations?.length ? ld.locations : DEFAULT_LOCS;

  return (
    <S id="locations" data-theme-light ref={ref}>
      <Inner>
        <Hdr $v={v}>
          <Eyebrow>wo wir uns trauen</Eyebrow>
          <H2>{ld.title || 'Unsere Location'}</H2>
        </Hdr>

        <LocationGrid>
          {locs.map((loc, i) => {
            const addr = loc.address || loc.addr || '';
            const mapsUrl = loc.maps_embed_url || (addr ? buildMapsUrl(addr) : null);
            const mapsLink = loc.maps_url || (addr ? buildMapsLink(addr) : null);

            return (
              <React.Fragment key={i}>
                {i > 0 && <Divider />}
                <LocationRow $reverse={i % 2 === 1}>
                  {mapsUrl ? (
                    <MapWrap $v={v} $delay={i * 0.1}>
                      <iframe
                        src={mapsUrl}
                        title={loc.name}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </MapWrap>
                  ) : (
                    <MapWrap $v={v} $delay={i * 0.1} style={{ background: 'var(--c-bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-s)', fontSize: '4rem', opacity: 0.3 }}>📍</span>
                    </MapWrap>
                  )}

                  <TextBlock $v={v} $delay={i * 0.1}>
                    {loc.type && <Type>{loc.type}</Type>}
                    <LocName>{loc.name}</LocName>
                    {addr && <Addr>{addr}</Addr>}
                    {loc.description && <Desc>{loc.description}</Desc>}
                    {mapsLink && (
                      <MapLink href={mapsLink} target="_blank" rel="noopener noreferrer">
                        In Google Maps öffnen →
                      </MapLink>
                    )}
                  </TextBlock>
                </LocationRow>
              </React.Fragment>
            );
          })}
        </LocationGrid>
      </Inner>
    </S>
  );
}

export default Locations;
