import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 800px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;`;
const Card = styled.div`text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s;`;
const TypeBadge = styled.span`font-family: var(--font-primary); font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--video-accent); display: block; margin-bottom: 0.75rem;`;
const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; color: var(--video-white); margin-bottom: 0.75rem;`;
const CardAddress = styled.p`font-family: var(--font-primary); font-size: 0.85rem; color: var(--video-silver); line-height: 1.6; white-space: pre-line; margin-bottom: 0.75rem;`;
const CardTime = styled.span`font-family: var(--font-accent); font-size: 0.9rem; font-style: italic; color: var(--video-accent);`;

function Locations() {
  const { content } = useWedding();
  const data = content?.locations || {};
  const title = data.title || 'Location';
  const locations = data.locations || [
    { name: 'Villa am See', type: 'Zeremonie und Empfang', address: 'Seestrasse 15\n12345 Berlin', time: '14:00 Uhr' }
  ];
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="locations">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Wo wir feiern</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Grid>
          {locations.map((loc, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <TypeBadge>{loc.type}</TypeBadge>
              <CardTitle>{loc.name}</CardTitle>
              <CardAddress>{loc.address}</CardAddress>
              <CardTime>{loc.time}</CardTime>
            </Card>
          ))}
        </Grid>
      </Content>
    </SectionWrapper>
  );
}

export default Locations;
