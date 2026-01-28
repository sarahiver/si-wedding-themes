// Contemporary Hero - SUPER POPPIG
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -30px) rotate(15deg); }
  50% { transform: translate(-15px, -50px) rotate(-10deg); }
  75% { transform: translate(25px, -20px) rotate(20deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-30px, 25px) rotate(-20deg); }
  66% { transform: translate(25px, 40px) rotate(15deg); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
`;

const expand = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(80px) rotate(-3deg); }
  to { opacity: 1; transform: translateY(0) rotate(0deg); }
`;

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0) rotate(-20deg); }
  70% { transform: scale(1.2) rotate(5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
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
  padding: clamp(2rem, 5vw, 6rem);
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
    opacity: 0.15;
  }
`;

const FloatingCircle = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--coral)'};
  border: 4px solid var(--black);
  border-radius: 50%;
  animation: ${float1} ${p => p.$duration || '12s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: ${p => p.$z || 1};
  
  @media (max-width: 768px) {
    width: calc(${p => p.$size || '100px'} * 0.6);
    height: calc(${p => p.$size || '100px'} * 0.6);
  }
`;

const FloatingSquare = styled.div`
  position: absolute;
  width: ${p => p.$size || '80px'};
  height: ${p => p.$size || '80px'};
  background: ${p => p.$color || 'var(--yellow)'};
  border: 4px solid var(--black);
  animation: ${float2} ${p => p.$duration || '10s'} ease-in-out infinite, ${wiggle} 3s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: ${p => p.$z || 1};
  
  @media (max-width: 768px) {
    width: calc(${p => p.$size || '80px'} * 0.5);
    height: calc(${p => p.$size || '80px'} * 0.5);
  }
`;

const SpinningRing = styled.div`
  position: absolute;
  width: ${p => p.$size || '120px'};
  height: ${p => p.$size || '120px'};
  border: 6px solid ${p => p.$color || 'var(--purple)'};
  border-radius: 50%;
  animation: ${spin} ${p => p.$duration || '20s'} linear infinite;
  z-index: ${p => p.$z || 1};
  
  @media (max-width: 768px) {
    width: calc(${p => p.$size || '120px'} * 0.5);
    height: calc(${p => p.$size || '120px'} * 0.5);
  }
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease;
  animation: ${p => p.$visible ? wiggle : 'none'} 3s ease-in-out infinite;
  
  &::after {
    content: '';
    height: 3px;
    background: var(--coral);
    animation: ${p => p.$visible ? expand : 'none'} 1s ease forwards 0.5s;
    width: ${p => p.$visible ? '60px' : '0'};
  }
`;

const NamesContainer = styled.div`
  margin-bottom: 2rem;
`;

const NameStyled = styled.h1`
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 700;
  line-height: 0.9;
  color: ${p => p.$first ? 'var(--coral)' : 'var(--black)'};
  text-transform: uppercase;
  letter-spacing: -0.03em;
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? slideUp : 'none'} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${p => p.$delay || '0s'};
`;

const Ampersand = styled.span`
  display: inline-block;
  font-size: clamp(3rem, 8vw, 6rem);
  color: var(--gray-400);
  margin: 0 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? popIn : 'none'} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
             ${p => p.$visible ? bounce : 'none'} 2s ease-in-out infinite 1s;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 700;
  padding: 1rem 1.5rem;
  background: ${p => p.$color || 'var(--yellow)'};
  color: var(--black);
  border: 4px solid var(--black);
  box-shadow: var(--shadow-lg);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: ${p => p.$delay || '0s'};
  animation: ${p => p.$visible ? pulse : 'none'} 3s ease-in-out infinite;
  
  &:hover {
    transform: translate(-4px, -4px) rotate(2deg);
    box-shadow: var(--shadow-xl);
  }
  
  .emoji {
    font-size: 1.3em;
    animation: ${bounce} 2s ease-in-out infinite;
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
  gap: 0.75rem;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 1.25rem 2.5rem;
  border: 4px solid var(--black);
  box-shadow: var(--shadow-lg);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.3s ease;
  transition-delay: 0.8s;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: ${shimmer} 2s ease-in-out infinite;
  }
  
  &:hover {
    transform: translate(-6px, -6px);
    box-shadow: 14px 14px 0 var(--black);
    background: var(--purple);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  font-weight: 700;
  color: var(--black);
  background: var(--white);
  padding: 1.25rem 2.5rem;
  border: 4px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.3s ease;
  transition-delay: 0.9s;
  
  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: var(--shadow-lg);
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
  font-size: 0.75rem;
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
  
  const name1 = heroData.name1 || project?.partner1_name || 'Sophie';
  const name2 = heroData.name2 || project?.partner2_name || 'Max';
  const date = heroData.date || project?.wedding_date;
  const location = heroData.location || project?.location || 'Berlin';
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
        <FloatingCircle $color="var(--coral)" $size="140px" style={{ top: '5%', left: '-5%' }} $duration="14s" $z={0} />
        <FloatingCircle $color="var(--electric)" $size="80px" style={{ top: '60%', left: '5%' }} $duration="11s" $delay="2s" $z={0} />
        <FloatingSquare $color="var(--yellow)" $size="100px" style={{ top: '15%', right: '10%' }} $duration="12s" $delay="1s" $z={0} />
        <FloatingSquare $color="var(--purple)" $size="60px" style={{ bottom: '20%', left: '15%' }} $duration="9s" $delay="3s" $z={0} />
        <SpinningRing $color="var(--coral)" $size="180px" style={{ bottom: '5%', right: '-5%' }} $duration="25s" $z={0} />
        
        <Eyebrow $visible={visible}>Wir heiraten</Eyebrow>
        
        <NamesContainer>
          <NameStyled $visible={visible} $delay="0.1s" $first>{name1}</NameStyled>
          <Ampersand $visible={visible}>&</Ampersand>
          <NameStyled $visible={visible} $delay="0.2s">{name2}</NameStyled>
        </NamesContainer>
        
        <InfoContainer>
          <InfoBadge $visible={visible} $delay="0.5s" $color="var(--yellow)">
            <span className="emoji">📅</span>
            {formattedDate}
          </InfoBadge>
          <InfoBadge $visible={visible} $delay="0.6s" $color="var(--electric)">
            <span className="emoji">📍</span>
            {location}
          </InfoBadge>
        </InfoContainer>
        
        <CTAContainer>
          <PrimaryButton href="#rsvp" $visible={visible}>
            Jetzt zusagen
            <span>→</span>
          </PrimaryButton>
          <SecondaryButton href="#story" $visible={visible}>
            Unsere Geschichte
          </SecondaryButton>
        </CTAContainer>
      </LeftPanel>
      
      <RightPanel $image={backgroundImage}>
        <FloatingCircle $color="var(--white)" $size="120px" style={{ top: '10%', right: '10%' }} $duration="15s" $delay="1s" />
        <FloatingSquare $color="var(--yellow)" $size="80px" style={{ bottom: '15%', left: '10%' }} $duration="11s" $delay="2s" />
        <SpinningRing $color="var(--white)" $size="150px" style={{ top: '30%', left: '5%' }} $duration="30s" />
      </RightPanel>
      
      <ScrollIndicator>
        Scroll
        <div style={{ fontSize: '1.5rem', color: 'var(--coral)' }}>↓</div>
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
