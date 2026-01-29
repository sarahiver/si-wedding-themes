// Botanical Hero - Looking through a Knothole into Nature
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// Animations
const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const drift = keyframes`
  0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
  25% { transform: translateY(-15px) translateX(8px) rotate(2deg); }
  50% { transform: translateY(-8px) translateX(-5px) rotate(-1deg); }
  75% { transform: translateY(-20px) translateX(3px) rotate(1deg); }
`;

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
`;

const morph = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%; }
  75% { border-radius: 40% 30% 60% 50% / 60% 50% 40% 30%; }
`;

// Main Section
const Section = styled.section`
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--green-deep) 0%,
    var(--green-forest) 30%,
    var(--green-moss) 70%,
    var(--green-fern) 100%
  );
`;

// The "Knothole" frame - organic opening
const KnotholeFrame = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  
  /* Dark vignette edges like looking through wood */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 70% at 50% 50%,
      transparent 30%,
      rgba(44, 74, 40, 0.4) 60%,
      rgba(44, 74, 40, 0.8) 80%,
      rgba(29, 43, 26, 0.95) 100%
    );
  }
  
  /* Organic wood grain texture overlay */
  &::after {
    content: '';
    position: absolute;
    inset: -50px;
    background: 
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 100px,
        rgba(92, 77, 60, 0.03) 100px,
        rgba(92, 77, 60, 0.03) 102px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 80px,
        rgba(92, 77, 60, 0.02) 80px,
        rgba(92, 77, 60, 0.02) 81px
      );
    animation: ${drift} 30s ease-in-out infinite;
  }
`;

// Floating organic shapes (leaves, petals)
const FloatingElement = styled.div`
  position: absolute;
  width: ${p => p.$size || '60px'};
  height: ${p => p.$size || '60px'};
  background: ${p => p.$color || 'var(--green-sage)'};
  opacity: ${p => p.$opacity || 0.4};
  border-radius: ${p => p.$shape === 'leaf' 
    ? '70% 30% 70% 30% / 30% 70% 30% 70%' 
    : '60% 40% 50% 50% / 50% 50% 40% 60%'};
  animation: ${drift} ${p => p.$duration || '15s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 1;
  filter: blur(${p => p.$blur || '0px'});
  
  ${p => p.$shape === 'leaf' && css`
    animation: ${sway} ${p.$duration || '10s'} ease-in-out infinite;
  `}
`;

// Light rays through the canopy
const LightRay = styled.div`
  position: absolute;
  width: ${p => p.$width || '150px'};
  height: 120%;
  background: linear-gradient(
    180deg,
    rgba(232, 213, 163, 0.3) 0%,
    rgba(232, 213, 163, 0.1) 50%,
    transparent 100%
  );
  transform: rotate(${p => p.$angle || '15deg'});
  transform-origin: top center;
  top: -10%;
  animation: ${shimmer} ${p => p.$duration || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 2;
  pointer-events: none;
`;

// Content Container - the view through the knothole
const Content = styled.div`
  position: relative;
  z-index: 4;
  text-align: center;
  max-width: 900px;
  padding: 2rem;
`;

// Tagline with handwritten style
const Tagline = styled.div`
  font-family: var(--font-handwritten);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--accent-sunlight);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s var(--ease-nature);
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  
  /* Decorative leaves */
  &::before, &::after {
    content: '🌿';
    margin: 0 1rem;
    display: inline-block;
    animation: ${sway} 4s ease-in-out infinite;
  }
  
  &::after {
    animation-delay: -2s;
    transform: scaleX(-1);
  }
`;

// Names Container
const NamesContainer = styled.div`
  margin-bottom: 2rem;
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? fadeIn : 'none'} 1s var(--ease-nature) forwards;
  animation-delay: 0.3s;
`;

const Name = styled.h1`
  font-family: var(--font-handwritten);
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: 600;
  color: var(--bg-cream);
  line-height: 0.9;
  text-shadow: 
    0 4px 30px rgba(0,0,0,0.3),
    0 0 60px rgba(168, 198, 159, 0.3);
  animation: ${breathe} 8s ease-in-out infinite;
  
  &:first-child {
    margin-bottom: -0.1em;
  }
`;

const Ampersand = styled.span`
  display: block;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 6vw, 4rem);
  font-style: italic;
  color: var(--green-mint);
  margin: 0.5rem 0;
  opacity: 0.8;
`;

// Date & Location Badges
const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s var(--ease-nature) 0.5s;
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  background: rgba(250, 248, 243, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(250, 248, 243, 0.3);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--bg-cream);
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    background: rgba(250, 248, 243, 0.25);
    transform: translateY(-3px);
  }
  
  span {
    font-size: 1.25rem;
  }
`;

// CTA Buttons
const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s var(--ease-nature) 0.7s;
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 2.5rem;
  background: var(--bg-cream);
  color: var(--green-forest);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: var(--shadow-medium);
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-deep), var(--shadow-glow);
    background: var(--green-mint);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 2.5rem;
  background: transparent;
  color: var(--bg-cream);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid rgba(250, 248, 243, 0.5);
  border-radius: 50px;
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    background: rgba(250, 248, 243, 0.1);
    border-color: var(--bg-cream);
    transform: translateY(-3px);
  }
`;

// Scroll Indicator
const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 5;
  opacity: ${p => p.$visible ? 0.7 : 0};
  transition: opacity 1s ease 1.5s;
  
  span {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--bg-cream);
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }
`;

const ScrollLine = styled.div`
  width: 2px;
  height: 40px;
  background: linear-gradient(180deg, var(--bg-cream), transparent);
  animation: ${breathe} 2s ease-in-out infinite;
`;

function Hero() {
  const { content, project } = useWedding();
  const heroData = content?.hero || {};
  
  const name1 = heroData.name1 || project?.partner1_name || 'Emma';
  const name2 = heroData.name2 || project?.partner2_name || 'Oliver';
  const tagline = heroData.tagline || 'Wir heiraten';
  const date = heroData.date || project?.wedding_date;
  const location = heroData.location_short || heroData.location || project?.location || 'Im Grünen';
  
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = date ? new Date(date).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '15. August 2025';

  return (
    <Section id="hero">
      {/* Floating organic elements */}
      <FloatingElement $color="var(--green-sage)" $size="80px" $opacity={0.3} style={{ top: '15%', left: '10%' }} $duration="18s" />
      <FloatingElement $color="var(--green-mint)" $size="50px" $opacity={0.25} $shape="leaf" style={{ top: '25%', right: '15%' }} $duration="12s" $delay="-3s" />
      <FloatingElement $color="var(--accent-sunlight)" $size="40px" $opacity={0.2} style={{ bottom: '30%', left: '8%' }} $duration="20s" $delay="-5s" />
      <FloatingElement $color="var(--green-leaf)" $size="70px" $opacity={0.2} $shape="leaf" style={{ bottom: '20%', right: '12%' }} $duration="15s" $delay="-8s" />
      <FloatingElement $color="var(--water-stream)" $size="35px" $opacity={0.15} $blur="2px" style={{ top: '60%', left: '20%' }} $duration="22s" $delay="-2s" />
      
      {/* Light rays */}
      <LightRay $width="200px" $angle="20deg" style={{ left: '10%' }} $duration="10s" />
      <LightRay $width="150px" $angle="-15deg" style={{ right: '15%' }} $duration="12s" $delay="-4s" />
      <LightRay $width="100px" $angle="5deg" style={{ left: '40%' }} $duration="8s" $delay="-2s" />
      
      {/* Knothole vignette effect */}
      <KnotholeFrame />
      
      {/* Main content */}
      <Content>
        <Tagline $visible={visible}>{tagline}</Tagline>
        
        <NamesContainer $visible={visible}>
          <Name>{name1}</Name>
          <Ampersand>&</Ampersand>
          <Name>{name2}</Name>
        </NamesContainer>
        
        <InfoRow $visible={visible}>
          <InfoBadge>
            <span>📅</span>
            {formattedDate}
          </InfoBadge>
          <InfoBadge>
            <span>🌿</span>
            {location}
          </InfoBadge>
        </InfoRow>
        
        <ButtonRow $visible={visible}>
          <PrimaryButton href="#rsvp">
            Zusagen
            <span>→</span>
          </PrimaryButton>
          <SecondaryButton href="#story">
            Unsere Geschichte
          </SecondaryButton>
        </ButtonRow>
      </Content>
      
      <ScrollIndicator $visible={visible}>
        <span>Entdecken</span>
        <ScrollLine />
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
