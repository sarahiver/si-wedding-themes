import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const imgReveal = keyframes`from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0); }`;

const S = styled.section`padding: var(--section-pad) 0; background: var(--c-white);`;
const Header = styled.div`text-align: center; margin-bottom: clamp(4rem, 8vw, 6rem); padding: 0 clamp(1.5rem, 5vw, 4rem);`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;

const LocBlock = styled.div`margin-bottom: clamp(4rem, 8vw, 6rem);`;
const ImgWrap = styled.div`width: 100%; overflow: hidden; opacity: 0; ${p => p.$v && css`animation: ${imgReveal} 1.2s var(--ease) forwards;`}`;
const LocImg = styled.img`width: 100%; aspect-ratio: 21/9; object-fit: cover; @media(max-width:768px){ aspect-ratio: 16/10; }`;
const Card = styled.div`
  max-width: 500px; margin: calc(var(--overlap) * -1) auto 0; position: relative; z-index: 2;
  background: var(--c-white); padding: clamp(2rem, 4vw, 3rem);
  box-shadow: 0 20px 60px rgba(0,0,0,0.07); text-align: center;
  opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.4s;`}
  @media(max-width:768px){ margin: -50px 1rem 0; }
`;
const Label = styled.p`font-family: var(--font-body); font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 0.5rem;`;
const LocName = styled.h3`font-family: var(--font-display); font-size: 1.8rem; font-weight: 400; margin-bottom: 0.75rem;`;
const LocDesc = styled.p`font-size: 0.85rem; font-weight: 300; color: var(--c-text-sec); line-height: 1.8; margin-bottom: 0.5rem;`;
const Addr = styled.p`font-size: 0.8rem; font-style: italic; color: var(--c-text-muted);`;
const MapLink = styled.a`display: inline-block; margin-top: 1rem; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--c-gold-dark); border-bottom: 1px solid var(--c-gold); padding-bottom: 2px; &:hover { color: var(--c-text); border-color: var(--c-text); }`;

const DEFAULTS = [
  { label: 'Trauung', name: 'Orangerie Charlottenburg', description: 'Die Zeremonie findet in der historischen Orangerie statt.', address: 'Spandauer Damm 10, 14059 Berlin', image: 'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg' },
  { label: 'Feier', name: 'Schloss Charlottenburg', description: 'Die Feier im prachtvollen Spiegelsaal des Schlosses.', address: 'Spandauer Damm 20, 14059 Berlin', image: 'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg' },
];

function useInView(th = 0.1) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th }); if (r.current) o.observe(r.current); return () => o.disconnect(); }, [th]); return [r, v]; }

function Locations() {
  const { content } = useWedding();
  const ld = content?.locations || {};
  const [hRef, hV] = useInView();
  const locs = ld.locations?.length ? ld.locations : DEFAULTS;
  return (
    <S id="locations">
      <Header ref={hRef}><Eye $v={hV}>Wo wir feiern</Eye><Title $v={hV}>{ld.title || 'Unsere Locations'}</Title></Header>
      {locs.map((loc, i) => { const [ref, v] = useInView(0.08); return (
        <LocBlock key={i} ref={ref}>
          <ImgWrap $v={v}><LocImg src={loc.image || DEFAULTS[0].image} alt={loc.name} loading="lazy" /></ImgWrap>
          <Card $v={v}>
            {loc.label && <Label>{loc.label}</Label>}
            <LocName>{loc.name || loc.titel}</LocName>
            {(loc.description || loc.beschreibung) && <LocDesc>{loc.description || loc.beschreibung}</LocDesc>}
            {(loc.address || loc.adresse) && <Addr>{loc.address || loc.adresse}</Addr>}
            {loc.maps_url && <MapLink href={loc.maps_url} target="_blank" rel="noopener">Route anzeigen →</MapLink>}
          </Card>
        </LocBlock>
      ); })}
    </S>
  );
}
export default Locations;
