import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 700px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  text-align: left;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.2s;
  
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Block = styled.div`
  padding: 1.5rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
`;

const BlockTitle = styled.h4`font-family: var(--font-primary); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem;`;
const BlockText = styled.p`font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-silver); line-height: 1.8;`;

const MapBtn = styled.a`
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-family: var(--font-primary);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--video-white);
  background: var(--video-accent);
  transition: background 0.3s ease;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.3s;
  
  &:hover { background: var(--video-accent-light); }
`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  const title = data.title || 'Anfahrt';
  const car = data.car_info || 'Parkplaetze stehen kostenlos zur Verfuegung. Bitte folgen Sie der Beschilderung vor Ort.';
  const publicTransport = data.public_transport || 'S-Bahn bis Hauptbahnhof, dann Bus 100 bis zur Location. Fahrtzeit ca. 20 Minuten.';
  const mapsUrl = data.maps_url || '';
  
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
        <Eyebrow $visible={visible}>So findet ihr uns</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Grid $visible={visible}>
          <Block>
            <BlockTitle>Mit dem Auto</BlockTitle>
            <BlockText>{car}</BlockText>
          </Block>
          <Block>
            <BlockTitle>Oeffentliche Verkehrsmittel</BlockTitle>
            <BlockText>{publicTransport}</BlockText>
          </Block>
        </Grid>
        {mapsUrl && <MapBtn href={mapsUrl} target="_blank" $visible={visible}>Route anzeigen</MapBtn>}
      </Content>
    </SectionWrapper>
  );
}

export default Directions;
