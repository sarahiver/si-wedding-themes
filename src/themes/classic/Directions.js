import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const Section = styled.section`
  padding: clamp(5rem,12vh,10rem) clamp(2rem,6vw,6rem);
  background: var(--c-cream); position: relative; z-index: 2;
`;

const Inner = styled.div`
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: clamp(3rem,6vw,6rem); align-items: center;
  @media(max-width:900px){ grid-template-columns:1fr; }
`;

const TextSide = styled.div`
  max-width: 420px; opacity:0;
  ${p => p.$v && css`animation:${fadeUp} 0.8s var(--ease) forwards; animation-delay:0.12s;`}
`;

const Eye = styled.p`font-size:0.45rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:300;line-height:1.2;margin-bottom:1.2rem;`;
const Desc = styled.p`font-size:0.82rem;line-height:2;color:var(--c-text-sec);margin-bottom:2rem;`;

const TransportList = styled.div`display:flex;flex-direction:column;gap:1.5rem;`;
const TransItem = styled.div`display:flex;gap:1rem;align-items:flex-start;`;
const TIcon = styled.span`font-size:1.2rem;flex-shrink:0;margin-top:0.15rem;`;
const TInfo = styled.div``;
const TTitle = styled.p`font-size:0.82rem;font-weight:500;margin-bottom:0.25rem;`;
const TText = styled.p`font-size:0.75rem;font-weight:300;color:var(--c-text-sec);line-height:1.7;`;

const ImageCluster = styled.div`
  position: relative; opacity:0;
  ${p => p.$v && css`animation:${fadeUp} 0.8s var(--ease) forwards; animation-delay:0.24s;`}
`;

const MainImg = styled.img`
  width: 80%; aspect-ratio: 3/4; object-fit: cover;
  margin-left: auto; display: block;
  filter: grayscale(20%);
`;

const AccentImg = styled.img`
  position: absolute; width: 50%; aspect-ratio: 1.2;
  object-fit: cover; border: 6px solid white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  bottom: -1.5rem; left: 0; z-index: 2;
`;

const MapBtn = styled.a`
  display:inline-block;margin-top:1.5rem;padding:0.7rem 1.8rem;
  border:1px solid var(--c-text-muted);color:var(--c-text);
  font-size:0.5rem;letter-spacing:0.15em;text-transform:uppercase;
  text-decoration:none;transition:all 0.3s;
  &:hover{background:var(--c-dark);color:white;border-color:var(--c-dark);}
`;

const DEF_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg';
const DEF_ACC = 'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg';

function Directions() {
  const { content } = useWedding();
  const dir = content?.directions || {};
  const [ref, v] = useInView();
  const title = dir.title || 'Anfahrt';
  const description = dir.description || 'So findet ihr zu uns.';
  const transport = dir.transport || [
    { icon: '\u{1F697}', title: 'Mit dem Auto', text: 'Parkplätze stehen vor Ort zur Verfügung.' },
    { icon: '\u{1F686}', title: 'Mit der Bahn', text: 'Die nächste S-Bahn-Station ist 10 Min. Fußweg entfernt.' },
    { icon: '\u{1F695}', title: 'Taxi', text: 'Wir organisieren einen Shuttle-Service.' },
  ];
  const image = dir.image || DEF_IMG;
  const accentImage = dir.accent_image || DEF_ACC;

  return (
    <Section id="directions">
      <Inner ref={ref}>
        <TextSide $v={v}>
          <Eye>Anreise</Eye>
          <Title>{title}</Title>
          <Desc>{description}</Desc>
          <TransportList>
            {transport.map((t, i) => (
              <TransItem key={i}>
                <TIcon>{t.icon}</TIcon>
                <TInfo>
                  <TTitle>{t.title || t.titel}</TTitle>
                  <TText>{t.text || t.beschreibung}</TText>
                </TInfo>
              </TransItem>
            ))}
          </TransportList>
          {dir.maps_url && <MapBtn href={dir.maps_url} target="_blank" rel="noopener">Route anzeigen →</MapBtn>}
        </TextSide>
        <ImageCluster $v={v}>
          <MainImg src={image} alt="Anfahrt" loading="lazy" />
          <AccentImg src={accentImage} alt="" loading="lazy" />
        </ImageCluster>
      </Inner>
    </Section>
  );
}
export default Directions;
