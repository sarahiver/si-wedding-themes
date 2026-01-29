import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 800px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;`;

const Card = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.5rem;
  text-align: left;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.1}s;
  transition: border-color 0.3s ease;
  
  &:hover { border-color: var(--video-accent); }
`;

const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--video-white); margin-bottom: 0.75rem;`;
const CardAddress = styled.p`font-family: var(--font-primary); font-size: 0.8rem; color: var(--video-gray); line-height: 1.6; margin-bottom: 0.75rem;`;
const CardPrice = styled.span`font-family: var(--font-primary); font-size: 0.75rem; font-weight: 500; color: var(--video-accent);`;
const CardLink = styled.a`display: block; margin-top: 1rem; font-family: var(--font-primary); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--video-silver); transition: color 0.3s ease; &:hover { color: var(--video-accent); }`;

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  const title = data.title || 'Unterkuenfte';
  const hotels = data.hotels || [
    { name: 'Hotel Adlon', address: 'Unter den Linden 77, Berlin', price: 'ab 180 EUR/Nacht', url: '' },
    { name: 'The Ritz-Carlton', address: 'Potsdamer Platz 3, Berlin', price: 'ab 220 EUR/Nacht', url: '' }
  ];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Uebernachten</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Grid>
          {hotels.map((hotel, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <CardTitle>{hotel.name}</CardTitle>
              <CardAddress>{hotel.address}</CardAddress>
              <CardPrice>{hotel.price}</CardPrice>
              {hotel.url && <CardLink href={hotel.url} target="_blank">Buchen →</CardLink>}
            </Card>
          ))}
        </Grid>
      </Content>
    </SectionWrapper>
  );
}

export default Accommodations;
