import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { downloadLocationsPDF } from '../../lib/locationsPdf';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 800px; width: 100%;`;
const Header = styled.div`display: flex; flex-direction: column; align-items: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;`;
const Card = styled.div`text-align: left; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s; overflow: hidden;`;
const CardImage = styled.div`width: 100%; height: 180px; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'rgba(255,255,255,0.1)'}; border-bottom: 1px solid rgba(255,255,255,0.1);`;
const CardContent = styled.div`padding: 1.5rem;`;
const TypeBadge = styled.span`font-family: var(--font-primary); font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--video-accent); display: block; margin-bottom: 0.75rem;`;
const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; color: var(--video-white); margin-bottom: 0.75rem;`;
const CardAddress = styled.p`font-family: var(--font-primary); font-size: 0.85rem; color: var(--video-silver); line-height: 1.6; white-space: pre-line; margin-bottom: 0.75rem;`;
const CardTime = styled.span`font-family: var(--font-accent); font-size: 0.9rem; font-style: italic; color: var(--video-accent);`;

const ExportSection = styled.div`
  margin-top: 1.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.2s;
`;

const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid var(--video-accent);
  font-family: var(--font-primary);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--video-accent);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--video-accent);
    color: var(--video-black);
  }
`;

function Locations() {
  const { content, project } = useWedding();
  const data = content?.locations || {};
  const title = data.title || 'Location';
  const locations = data.locations || [
    { name: 'Villa am See', type: 'Zeremonie und Empfang', address: 'Seestrasse 15\n12345 Berlin', time: '14:00 Uhr' }
  ];

  const name1 = project?.partner1_name || 'Partner1';
  const name2 = project?.partner2_name || 'Partner2';
  const coupleName = `${name1} & ${name2}`;

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleExport = () => downloadLocationsPDF(locations, coupleName);

  return (
    <SectionWrapper id="locations">
      <Content ref={sectionRef}>
        <Header>
          <Eyebrow $visible={visible}>Wo wir feiern</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <ExportSection $visible={visible}>
            <ExportButton onClick={handleExport}>
              <span>📄</span> Locations als PDF
            </ExportButton>
          </ExportSection>
        </Header>
        <Grid>
          {locations.map((loc, i) => (
            <Card key={i} $visible={visible} $index={i}>
              {loc.image && <CardImage $image={loc.image} />}
              <CardContent>
                <TypeBadge>{loc.type}</TypeBadge>
                <CardTitle>{loc.name}</CardTitle>
                <CardAddress>{loc.address}</CardAddress>
                <CardTime>{loc.time}</CardTime>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Content>
    </SectionWrapper>
  );
}

export default Locations;
