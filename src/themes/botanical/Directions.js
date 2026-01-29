import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-mint);`;
const Container = styled.div`max-width: 800px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 2.5rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Content = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.2s; @media (max-width: 600px) { grid-template-columns: 1fr; }`;
const Block = styled.div`background: white; border-radius: 20px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(107, 127, 94, 0.1);`;
const BlockIcon = styled.div`font-size: 2rem; margin-bottom: 0.75rem;`;
const BlockTitle = styled.h4`font-family: var(--font-handwritten); font-size: 1.25rem; color: var(--botanical-forest); margin-bottom: 0.75rem;`;
const BlockText = styled.p`font-family: var(--font-body); font-size: 0.9rem; line-height: 1.7; color: var(--botanical-brown);`;

const MapBtn = styled.a`display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 2rem; padding: 1rem 2rem; font-family: var(--font-handwritten); font-size: 1.1rem; color: white; background: linear-gradient(135deg, var(--botanical-sage), var(--botanical-olive)); border-radius: 50px; transition: all 0.3s ease; &:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(107, 127, 94, 0.3); }`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  const title = data.title || 'Anfahrt';
  const car = data.car_info || 'Kostenlose Parkplaetze stehen auf dem Gelaende zur Verfuegung.';
  const publicTransport = data.public_transport || 'S-Bahn bis Botanischer Garten, dann 5 Min. Fussweg.';
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
        <Header><Eyebrow $visible={visible}>🗺️ So findet ihr uns</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Content $visible={visible}>
          <Block><BlockIcon>🚗</BlockIcon><BlockTitle>Mit dem Auto</BlockTitle><BlockText>{car}</BlockText></Block>
          <Block><BlockIcon>🚃</BlockIcon><BlockTitle>Oeffentlich</BlockTitle><BlockText>{publicTransport}</BlockText></Block>
        </Content>
        {mapsUrl && <div style={{ textAlign: 'center' }}><MapBtn href={mapsUrl} target="_blank">📍 Route anzeigen</MapBtn></div>}
      </Container>
    </Section>
  );
}

export default Directions;
