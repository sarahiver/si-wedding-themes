// Contemporary Hero - Split Screen, Floating Shapes, Optional Image
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================
const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -15px) rotate(5deg); }
  50% { transform: translate(-10px, -25px) rotate(-3deg); }
  75% { transform: translate(-15px, 10px) rotate(3deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(45deg); }
  25% { transform: translate(10px, -10px) rotate(50deg); }
  50% { transform: translate(-8px, -20px) rotate(42deg); }
  75% { transform: translate(-10px, 8px) rotate(48deg); }
`;

const float3 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(12px, -12px); }
  66% { transform: translate(-8px, -18px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const expand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const Section = styled.section`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const LeftPanel = styled.div`
  background: var(--white);
  padding: clamp(6rem, 10vw, 8rem) clamp(2rem, 5vw, 4rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 900px) {
    min-height: 100vh;
    padding-top: 8rem;
    padding-bottom: 4rem;
  }
`;

// Floating Shapes
const FloatingCircle1 = styled.div`
  position: absolute;
  width: clamp(50px, 8vw, 80px);
  height: clamp(50px, 8vw, 80px);
  background: var(--coral);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  border-radius: 50%;
  top: 15%;
  right: 15%;
  animation: ${float1} 7s ease-in-out infinite;
  z-index: 1;
  
  @media (max-width: 900px) {
    top: 10%;
    right: 10%;
  }
`;

const FloatingSquare = styled.div`
  position: absolute;
  width: clamp(35px, 5vw, 50px);
  height: clamp(35px, 5vw, 50px);
  background: var(--electric);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  bottom: 25%;
  left: 10%;
  animation: ${float2} 8s ease-in-out infinite;
  animation-delay: 1s;
  z-index: 1;
`;

const FloatingCircle2 = styled.div`
  position: absolute;
  width: clamp(25px, 4vw, 35px);
  height: clamp(25px, 4vw, 35px);
  background: var(--yellow);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  border-radius: 50%;
  top: 60%;
  right: 25%;
  animation: ${float3} 6s ease-in-out infinite;
  animation-delay: 2s;
  z-index: 1;
  
  @media (max-width: 900px) {
    top: 75%;
    right: 15%;
  }
`;

const FloatingTriangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid var(--purple);
  top: 35%;
  left: 20%;
  animation: ${float1} 9s ease-in-out infinite;
  animation-delay: 0.5s;
  z-index: 1;
  filter: drop-shadow(3px 3px 0 var(--black));
  
  @media (max-width: 600px) {
    display: none;
  }
`;

const SpinningDecor = styled.div`
  position: absolute;
  bottom: 15%;
  right: 10%;
  width: clamp(40px, 6vw, 60px);
  height: clamp(40px, 6vw, 60px);
  border: 3px solid var(--black);
  animation: ${spin} 20s linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40%;
    height: 40%;
    background: var(--pink);
    transform: translate(-50%, -50%);
  }
  
  @media (max-width: 900px) {
    bottom: 5%;
    right: 5%;
  }
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${slideUp} 0.6s ease forwards 0.2s;
  
  span {
    font-size: clamp(0.7rem, 1.5vw, 0.8rem);
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gray-600);
  }
  
  .line {
    flex: 1;
    max-width: 100px;
    height: 3px;
    background: var(--black);
    transform-origin: left;
    animation: ${expand} 0.8s ease forwards 0.5s;
    transform: scaleX(0);
  }
`;

const NamesWrapper = styled.div`
  margin-bottom: 2rem;
`;

const NameLine = styled.h1`
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 700;
  color: var(--black);
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: ${p => p.$delay || '0.4s'};
  
  .highlight {
    color: var(--coral);
  }
`;

const Ampersand = styled.span`
  display: inline-block;
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--gray-400);
  margin: 0 0.3em;
`;

const DateLocation = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${slideUp} 0.6s ease forwards 0.8s;
`;

const Badge = styled.span`
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: 600;
  color: var(--black);
  padding: 0.75rem 1.25rem;
  background: ${p => p.$color || 'var(--yellow)'};
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-md);
  }
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  opacity: 0;
  animation: ${slideUp} 0.6s ease forwards 1s;
`;

const PrimaryButton = styled.a`
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--black);
  }
  
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0 var(--black);
  }
`;

const SecondaryButton = styled.a`
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  font-weight: 700;
  color: var(--black);
  background: var(--white);
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--electric);
    color: var(--white);
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--black);
  }
`;

const ScrollPrompt = styled.div`
  position: absolute;
  bottom: 2rem;
  left: clamp(2rem, 5vw, 4rem);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray-500);
  opacity: 0;
  animation: ${slideUp} 0.6s ease forwards 1.2s;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const ScrollDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--coral);
  border: 2px solid var(--black);
  animation: ${bounce} 2s ease-in-out infinite;
`;

// Right Panel - Optional Image or Gradient
const RightPanel = styled.div`
  position: relative;
  overflow: hidden;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const ParallaxBackground = styled.div`
  position: absolute;
  inset: -10%;
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover`
    : 'linear-gradient(135deg, var(--coral), var(--electric), var(--yellow))'
  };
  transform: translateY(${p => p.$scroll * 50}px);
  transition: transform 0.1s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.03) 41px),
      repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.03) 41px);
  }
  
  ${p => p.$image && css`
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.2);
    }
  `}
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateBadge = styled.div`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--white);
  background: var(--black);
  padding: 1.5rem 3rem;
  border: 4px solid var(--white);
  box-shadow: var(--shadow-lg);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ============================================
// COMPONENT
// ============================================
function Hero() {
  const { content, project } = useWedding();
  const heroData = content?.hero || {};
  
  const name1 = project?.partner1_name || 'Sophie';
  const name2 = project?.partner2_name || 'Max';
  const weddingDate = project?.wedding_date 
    ? new Date(project.wedding_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '15. August 2025';
  const location = heroData.location_short || project?.location || 'Berlin';
  const tagline = heroData.tagline || "We're getting married";
  const backgroundImage = heroData.background_image || null;
  
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        setScrollY(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Section ref={sectionRef} id="hero">
      <LeftPanel>
        {/* Floating Decorative Shapes */}
        <FloatingCircle1 />
        <FloatingSquare />
        <FloatingCircle2 />
        <FloatingTriangle />
        <SpinningDecor />
        
        <Eyebrow>
          <span>{tagline}</span>
          <div className="line" />
        </Eyebrow>
        
        <NamesWrapper>
          <NameLine $delay="0.4s">
            <span className="highlight">{name1}</span>
          </NameLine>
          <NameLine $delay="0.5s">
            <Ampersand>&</Ampersand>{name2}
          </NameLine>
        </NamesWrapper>
        
        <DateLocation>
          <Badge $color="var(--yellow)">📅 {weddingDate}</Badge>
          <Badge $color="var(--electric)">📍 {location}</Badge>
        </DateLocation>
        
        <CTAGroup>
          <PrimaryButton href="#rsvp">Jetzt Zusagen →</PrimaryButton>
          <SecondaryButton href="#story">Unsere Story</SecondaryButton>
        </CTAGroup>
        
        <ScrollPrompt>
          <ScrollDot />
          Scroll to explore
        </ScrollPrompt>
      </LeftPanel>
      
      <RightPanel>
        <ParallaxBackground $scroll={scrollY} $image={backgroundImage} />
        <ImageOverlay>
          <DateBadge>{weddingDate}</DateBadge>
        </ImageOverlay>
      </RightPanel>
    </Section>
  );
}

export default Hero;
