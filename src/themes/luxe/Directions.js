// Luxe Directions
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-sand);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const Content = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.2s; @media (max-width: 600px) { grid-template-columns: 1fr; }`;
const InfoBlock = styled.div``;
const InfoTitle = styled.h4`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem;`;
const InfoText = styled.p`font-family: var(--font-sans); font-size: 0.9rem; line-height: 1.8; color: var(--luxe-charcoal);`;

const MapLink = styled.a`display: inline-block; margin-top: 2rem; padding: 1rem 2rem; font-family: var(--font-sans); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-white); background: var(--luxe-black); &:hover { background: var(--luxe-charcoal); }`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  const title = data.title || 'Anfahrt';
  const car = data.car_info || 'Parkplaetze stehen kostenlos zur Verfuegung. Die Einfahrt befindet sich auf der Rueckseite des Gebaudes.';
  const publicTransport = data.public_transport || 'Mit der S-Bahn bis Hauptbahnhof, dann weiter mit der Buslinie 42 bis Haltestelle Schlosspark.';
  const address = data.address || 'Villa Medici\nVia della Pergola 15\n50121 Florenz';
  const mapsUrl = data.maps_url || '';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="directions">
      <Container>
        <Header $visible={visible}><Eyebrow>So findet ihr uns</Eyebrow><Title>{title}</Title></Header>
        <Content $visible={visible}>
          <InfoBlock><InfoTitle>Mit dem Auto</InfoTitle><InfoText>{car}</InfoText></InfoBlock>
          <InfoBlock><InfoTitle>Oeffentliche Verkehrsmittel</InfoTitle><InfoText>{publicTransport}</InfoText></InfoBlock>
        </Content>
        {mapsUrl && <div style={{ textAlign: 'center' }}><MapLink href={mapsUrl} target="_blank" rel="noopener">Route anzeigen</MapLink></div>}
      </Container>
    </Section>
  );
}

export default Directions;
