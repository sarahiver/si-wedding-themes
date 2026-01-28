// Luxe Accommodations
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-white);`;
const Container = styled.div`max-width: var(--container-width); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 4rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;`;
const Card = styled.div`opacity: 0; animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: ${p => 0.1 + p.$index * 0.15}s;`;
const CardImage = styled.div`aspect-ratio: 16/10; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--luxe-sand)'}; margin-bottom: 1.5rem;`;
const CardTitle = styled.h3`font-family: var(--font-serif); font-size: 1.25rem; color: var(--luxe-black); margin-bottom: 0.5rem;`;
const CardAddress = styled.p`font-family: var(--font-sans); font-size: 0.85rem; color: var(--luxe-charcoal); margin-bottom: 0.75rem;`;
const CardPrice = styled.span`font-family: var(--font-sans); font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--luxe-gold);`;
const CardLink = styled.a`display: inline-block; margin-top: 1rem; font-family: var(--font-sans); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--luxe-charcoal); border-bottom: 1px solid var(--luxe-taupe); padding-bottom: 0.25rem; &:hover { color: var(--luxe-gold); border-color: var(--luxe-gold); }`;

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  const title = data.title || 'Unterkuenfte';
  const hotels = data.hotels || [
    { name: 'Hotel Bella Vista', address: 'Via Roma 12, Florenz', price: 'ab 150 EUR/Nacht', image: '', url: '' },
    { name: 'Grand Palace', address: 'Piazza Grande 5, Florenz', price: 'ab 200 EUR/Nacht', image: '', url: '' }
  ];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="accommodations">
      <Container>
        <Header $visible={visible}><Eyebrow>Uebernachten</Eyebrow><Title>{title}</Title></Header>
        <Grid>
          {hotels.map((hotel, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <CardImage $image={hotel.image} />
              <CardTitle>{hotel.name}</CardTitle>
              <CardAddress>{hotel.address}</CardAddress>
              <CardPrice>{hotel.price}</CardPrice>
              {hotel.url && <CardLink href={hotel.url} target="_blank" rel="noopener">Buchen →</CardLink>}
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Accommodations;
