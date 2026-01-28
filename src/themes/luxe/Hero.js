// Luxe Hero - Elegant Fullscreen mit Slide-In
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const lineExpand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background: ${p => p.$image ? `url(${p.$image}) center/cover no-repeat` : 'var(--luxe-sand)'};
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(26, 26, 26, 0.1) 0%,
      rgba(26, 26, 26, 0.3) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  max-width: 900px;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-white);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? slideUp : 'none'} 0.8s var(--transition-slow) forwards;
`;

const NamesWrapper = styled.div`
  margin-bottom: 2rem;
`;

const Name = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-white);
  line-height: 1;
  opacity: 0;
  animation: ${p => p.$visible ? slideInLeft : 'none'} 1s var(--transition-slow) forwards;
  animation-delay: ${p => p.$delay || '0s'};
  
  &:last-of-type {
    animation-name: ${p => p.$visible ? keyframes`
      from { opacity: 0; transform: translateX(60px); }
      to { opacity: 1; transform: translateX(0); }
    ` : 'none'};
  }
`;

const Ampersand = styled.span`
  display: block;
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-style: italic;
  color: var(--luxe-gold);
  margin: 0.5rem 0;
  opacity: 0;
  animation: ${p => p.$visible ? fadeIn : 'none'} 1s ease forwards;
  animation-delay: 0.4s;
`;

const Line = styled.div`
  width: 80px;
  height: 1px;
  background: var(--luxe-gold);
  margin: 2rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${p => p.$visible ? lineExpand : 'none'} 1s ease forwards;
  animation-delay: 0.6s;
`;

const DateLocation = styled.div`
  opacity: 0;
  animation: ${p => p.$visible ? slideUp : 'none'} 0.8s ease forwards;
  animation-delay: 0.8s;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 400;
  color: var(--luxe-white);
  margin-bottom: 0.5rem;
`;

const LocationText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--luxe-white);
  opacity: 0;
  animation: ${p => p.$visible ? fadeIn : 'none'} 1s ease forwards;
  animation-delay: 1.2s;
`;

const ScrollText = styled.span`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, var(--luxe-white), transparent);
  
  @keyframes scrollPulse {
    0%, 100% { transform: scaleY(1); opacity: 1; }
    50% { transform: scaleY(0.6); opacity: 0.5; }
  }
  
  animation: scrollPulse 2s ease-in-out infinite;
`;

function Hero() {
  const { content, project } = useWedding();
  const heroData = content?.hero || {};
  
  const name1 = heroData.name1 || project?.partner1_name || 'Emma';
  const name2 = heroData.name2 || project?.partner2_name || 'James';
  const date = heroData.date || project?.wedding_date;
  const location = heroData.location || project?.location || 'Toskana, Italien';
  const backgroundImage = heroData.background_image;
  
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = date 
    ? new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '21. September 2025';

  return (
    <Section id="hero">
      <BackgroundImage $image={backgroundImage} />
      
      <Content>
        <Eyebrow $visible={visible}>Wir heiraten</Eyebrow>
        
        <NamesWrapper>
          <Name $visible={visible} $delay="0.2s">{name1}</Name>
          <Ampersand $visible={visible}>&</Ampersand>
          <Name $visible={visible} $delay="0.3s">{name2}</Name>
        </NamesWrapper>
        
        <Line $visible={visible} />
        
        <DateLocation $visible={visible}>
          <DateText>{formattedDate}</DateText>
          <LocationText>{location}</LocationText>
        </DateLocation>
      </Content>
      
      <ScrollIndicator $visible={visible}>
        <ScrollText>Entdecken</ScrollText>
        <ScrollLine />
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
