import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const scaleReveal = keyframes`from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: scale(1); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-void);`;
const Container = styled.div`max-width: var(--container-max); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;`;
const Card = styled.div`opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s;`;
const CardImage = styled.div`aspect-ratio: 16/10; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--luxe-charcoal)'}; margin-bottom: 1.5rem; overflow: hidden;`;
const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.5rem; font-style: italic; color: var(--luxe-cream); margin-bottom: 0.5rem;`;
const CardAddress = styled.p`font-family: var(--font-body); font-size: 0.85rem; color: var(--luxe-pearl); margin-bottom: 0.75rem;`;
const CardPrice = styled.span`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-gold);`;
const CardLink = styled.a`display: inline-block; margin-top: 1rem; font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-pearl); border-bottom: 1px solid var(--luxe-graphite); padding-bottom: 0.25rem; transition: all 0.3s ease; &:hover { color: var(--luxe-gold); border-color: var(--luxe-gold); }`;

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  const title = data.title || 'Unterkuenfte';
  const hotels = data.hotels || [
    { name: 'Grand Hotel', address: 'Hauptstrasse 1', price: 'ab 150 EUR/Nacht', image: '', url: '' },
    { name: 'Boutique Hotel', address: 'Altstadt 15', price: 'ab 120 EUR/Nacht', image: '', url: '' }
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
        <Header><Eyebrow $visible={visible}>Uebernachten</Eyebrow><Title $visible={visible}>{title}</Title></Header>
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
