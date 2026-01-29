import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-cream);`;
const Container = styled.div`max-width: 1000px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;`;
const Card = styled.div`background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(107, 127, 94, 0.12); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.1}s; transition: transform 0.3s ease; &:hover { transform: translateY(-5px); }`;
const CardImage = styled.div`aspect-ratio: 16/10; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'linear-gradient(135deg, var(--botanical-mint), var(--botanical-sage))'};`;
const CardContent = styled.div`padding: 1.5rem;`;
const CardTitle = styled.h3`font-family: var(--font-handwritten); font-size: 1.5rem; color: var(--botanical-forest); margin-bottom: 0.5rem;`;
const CardAddress = styled.p`font-family: var(--font-body); font-size: 0.85rem; color: var(--botanical-brown); margin-bottom: 0.75rem;`;
const CardPrice = styled.span`display: inline-block; font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; color: var(--botanical-sage); background: var(--botanical-mint); padding: 0.25rem 0.75rem; border-radius: 20px;`;
const CardLink = styled.a`display: inline-block; margin-top: 1rem; font-family: var(--font-body); font-size: 0.8rem; font-weight: 600; color: var(--botanical-olive); &:hover { color: var(--botanical-forest); }`;

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  const title = data.title || 'Unterkuenfte';
  const hotels = data.hotels || [
    { name: 'Hotel Botanica', address: 'Gartenstrasse 15, Berlin', price: 'ab 95 EUR/Nacht', image: '', url: '' },
    { name: 'Pension Gruener Baum', address: 'Am Park 8, Berlin', price: 'ab 75 EUR/Nacht', image: '', url: '' }
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
        <Header><Eyebrow $visible={visible}>🏨 Uebernachten</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Grid>
          {hotels.map((hotel, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <CardImage $image={hotel.image} />
              <CardContent>
                <CardTitle>🌿 {hotel.name}</CardTitle>
                <CardAddress>{hotel.address}</CardAddress>
                <CardPrice>{hotel.price}</CardPrice>
                {hotel.url && <CardLink href={hotel.url} target="_blank">Buchen →</CardLink>}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Accommodations;
