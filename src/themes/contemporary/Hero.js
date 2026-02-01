// Contemporary Hero - Balanced animations
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const float = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(10px, -15px) rotate(5deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const expand = keyframes`
  from { width: 0; }
  to { width: 60px; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  background: var(--white);
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5rem);
  position: relative;
  z-index: 2;
  
  @media (max-width: 968px) {
    min-height: 100vh;
    padding: 6rem 2rem 4rem;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  position: relative;
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover` 
    : `linear-gradient(135deg, var(--coral) 0%, var(--purple) 50%, var(--electric) 100%)`};
  
  @media (max-width: 968px) {
    position: absolute;
    inset: 0;
    opacity: 0.1;
  }
`;

const FloatingCircle = styled.div`
  position: absolute;
  width: ${p => p.$size || '80px'};
  height: ${p => p.$size || '80px'};
  background: ${p => p.$color || 'var(--coral)'};
  border: 3px solid var(--black);
  border-radius: 50%;
  animation: ${float} ${p => p.$duration || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 0;
  
  @media (max-width: 768px) {
    width: calc(${p => p.$size || '80px'} * 0.6);
    height: calc(${p => p.$size || '80px'} * 0.6);
  }
`;

const FloatingSquare = styled.div`
  position: absolute;
  width: ${p => p.$size || '60px'};
  height: ${p => p.$size || '60px'};
  background: ${p => p.$color || 'var(--yellow)'};
  border: 3px solid var(--black);
  animation: ${float} ${p => p.$duration || '10s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 0;
`;

const SpinningRing = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  border: 4px solid ${p => p.$color || 'var(--electric)'};
  border-radius: 50%;
  animation: ${spin} ${p => p.$duration || '20s'} linear infinite;
  z-index: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  
  &::after {
    content: '';
    height: 3px;
    background: var(--coral);
    animation: ${p => p.$visible ? expand : 'none'} 0.8s ease forwards 0.3s;
  }
`;

const NamesContainer = styled.div`
  margin-bottom: 2rem;
`;

const NameStyled = styled.h1`
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 700;
  line-height: 0.95;
  color: ${p => p.$first ? 'var(--coral)' : 'var(--black)'};
  text-transform: uppercase;
  letter-spacing: -0.03em;
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? slideUp : 'none'} 0.7s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
`;

const Ampersand = styled.span`
  display: inline-block;
  font-size: clamp(2.5rem, 6vw, 5rem);
  color: var(--gray-400);
  margin: 0 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.5s ease 0.3s;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  font-weight: 700;
  padding: 0.75rem 1.25rem;
  background: ${p => p.$color || 'var(--yellow)'};
  color: var(--black);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.5s ease;
  transition-delay: ${p => p.$delay || '0s'};
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: var(--shadow-lg);
  }
`;

const CTAContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.3s ease;
  transition-delay: 0.6s;
  
  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: var(--shadow-lg);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--black);
  background: var(--white);
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.3s ease;
  transition-delay: 0.7s;
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: var(--shadow-md);
    background: var(--electric);
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-500);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  animation: ${bounce} 2s ease-in-out infinite;
  z-index: 10;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

function Hero() {
  const { content, project } = useWedding();
  const heroData = content?.hero || {};
  
  // NEU: project hat Priorität vor heroData
  const name1 = project?.partner1_name || heroData.name1 || 'Sophie';
  const name2 = project?.partner2_name || heroData.name2 || 'Max';
  const date = project?.wedding_date || heroData.date;
  const location = project?.location || heroData.location_short || heroData.location || 'Berlin';
  const tagline = heroData.tagline || 'Wir heiraten';
  const backgroundImage = heroData.background_image;
  
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = date ? new Date(date).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '15. August 2025';

  return (
    <Section id="hero">
      <LeftPanel>
        <FloatingCircle $color="var(--coral)" $size="100px" style={{ top: '10%', left: '5%' }} $duration="10s" />
        <FloatingCircle $color="var(--electric)" $size="60px" style={{ top: '60%', left: '10%' }} $duration="8s" $delay="1s" />
        <FloatingSquare $color="var(--yellow)" $size="70px" style={{ top: '20%', right: '15%' }} $duration="12s" $delay="0.5s" />
        <FloatingSquare $color="var(--purple)" $size="50px" style={{ bottom: '25%', left: '20%' }} $duration="9s" $delay="2s" />
        <SpinningRing $color="var(--coral)" $size="120px" style={{ bottom: '10%', right: '5%' }} $duration="25s" />
        
        <Eyebrow $visible={visible}>{tagline}</Eyebrow>
        
        <NamesContainer>
          <NameStyled $visible={visible} $delay="0.1s" $first>{name1}</NameStyled>
          <Ampersand $visible={visible}>&</Ampersand>
          <NameStyled $visible={visible} $delay="0.2s">{name2}</NameStyled>
        </NamesContainer>
        
        <InfoContainer>
          <InfoBadge $visible={visible} $delay="0.4s" $color="var(--yellow)">
            <span>📅</span>
            {formattedDate}
          </InfoBadge>
          <InfoBadge $visible={visible} $delay="0.5s" $color="var(--electric)">
            <span>📍</span>
            {location}
          </InfoBadge>
        </InfoContainer>
        
        <CTAContainer>
          <PrimaryButton href="#rsvp" $visible={visible}>
            Jetzt zusagen →
          </PrimaryButton>
          <SecondaryButton href="#story" $visible={visible}>
            Unsere Geschichte
          </SecondaryButton>
        </CTAContainer>
      </LeftPanel>
      
      <RightPanel $image={backgroundImage}>
        <FloatingCircle $color="rgba(255,255,255,0.3)" $size="100px" style={{ top: '15%', right: '15%' }} $duration="12s" $delay="1s" />
        <FloatingSquare $color="rgba(255,255,255,0.2)" $size="60px" style={{ bottom: '20%', left: '15%' }} $duration="10s" $delay="2s" />
      </RightPanel>
      
      <ScrollIndicator>
        Scroll
        <span style={{ fontSize: '1.2rem', color: 'var(--coral)' }}>↓</span>
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
