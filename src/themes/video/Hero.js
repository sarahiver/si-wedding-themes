// Video Theme - Hero Section
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const lineExpand = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const Content = styled.div`text-align: center; max-width: 800px;`;

const Eyebrow = styled.p`
  font-family: var(--font-primary);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--video-accent);
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.3s;
`;

const Names = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--video-white);
  line-height: 0.95;
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => p.$delay || '0.5s'};
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
`;

const Ampersand = styled.span`
  display: block;
  font-family: var(--font-accent);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-style: italic;
  font-weight: 400;
  color: var(--video-accent);
  margin: 1rem 0;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 0.8s ease forwards` : 'none'};
  animation-delay: 0.7s;
`;

const Divider = styled.div`
  width: 80px;
  height: 1px;
  background: var(--video-accent);
  margin: 2rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${p => p.$visible ? css`${lineExpand} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 1s;
`;

const DateText = styled.p`
  font-family: var(--font-accent);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  color: var(--video-white);
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.2s;
`;

const LocationText = styled.p`
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--video-silver);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.4s;
`;

function Hero() {
  const { content, project } = useWedding();
  const heroData = content?.hero || {};
  
  // NEU: project hat Priorität vor heroData
  const name1 = project?.partner1_name || heroData.name1 || 'Emma';
  const name2 = project?.partner2_name || heroData.name2 || 'Noah';
  const date = project?.wedding_date || heroData.date;
  const location = project?.location || heroData.location || 'Berlin';
  
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = date 
    ? new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '21. Juni 2025';

  return (
    <SectionWrapper id="hero">
      <Content>
        <Eyebrow $visible={visible}>Wir heiraten</Eyebrow>
        <Names $visible={visible} $delay="0.5s">{name1}</Names>
        <Ampersand $visible={visible}>&</Ampersand>
        <Names $visible={visible} $delay="0.9s">{name2}</Names>
        <Divider $visible={visible} />
        <DateText $visible={visible}>{formattedDate}</DateText>
        <LocationText $visible={visible}>{location}</LocationText>
      </Content>
    </SectionWrapper>
  );
}

export default Hero;
