import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-charcoal);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Content = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s; @media (max-width: 600px) { grid-template-columns: 1fr; }`;
const Block = styled.div``;
const BlockTitle = styled.h4`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem;`;
const BlockText = styled.p`font-family: var(--font-body); font-size: 0.9rem; line-height: 1.8; color: var(--luxe-pearl);`;

const MapBtn = styled.a`display: inline-block; margin-top: 2rem; padding: 1rem 2rem; font-family: var(--font-body); font-size: 0.7rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-void); background: var(--luxe-gold); transition: background 0.3s ease; &:hover { background: var(--luxe-champagne); }`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  const title = data.title || 'Anfahrt';
  const car = data.car_info || 'Kostenlose Parkplaetze stehen vor Ort zur Verfuegung.';
  const publicTransport = data.public_transport || 'Mit der S-Bahn bis Hauptbahnhof, dann Bus Linie 42.';
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
        <Header><Eyebrow $visible={visible}>So findet ihr uns</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Content $visible={visible}>
          <Block><BlockTitle>Mit dem Auto</BlockTitle><BlockText>{car}</BlockText></Block>
          <Block><BlockTitle>Oeffentlich</BlockTitle><BlockText>{publicTransport}</BlockText></Block>
        </Content>
        {mapsUrl && <div style={{ textAlign: 'center' }}><MapBtn href={mapsUrl} target="_blank" rel="noopener">Route anzeigen</MapBtn></div>}
      </Container>
    </Section>
  );
}

export default Directions;
