import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const glassReveal = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px) scale(0.98);
    backdrop-filter: blur(0px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
    backdrop-filter: blur(var(--glass-blur));
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const HeroSection = styled.section`
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7rem 2rem 4rem; /* Extra top padding for floating nav */
  overflow: hidden;
`;

// Background image with jungle/dark overlay
const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${p => p.$image ? `url(${p.$image}) center/cover no-repeat` : 'none'};
    filter: brightness(0.4) saturate(0.8);
  }
  
  /* Dark jungle gradient overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(to bottom, 
        rgba(4, 10, 4, 0.7) 0%,
        rgba(4, 10, 4, 0.3) 30%,
        rgba(4, 10, 4, 0.3) 70%,
        rgba(4, 10, 4, 0.8) 100%
      ),
      linear-gradient(to right,
        rgba(15, 35, 15, 0.4) 0%,
        transparent 30%,
        transparent 70%,
        rgba(15, 35, 15, 0.4) 100%
      );
  }
`;

// Glass card container
const GlassCard = styled.div`
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  box-shadow: var(--glass-shadow);
  padding: clamp(2.5rem, 5vw, 4rem) clamp(2rem, 4vw, 5rem);
  max-width: 550px;
  width: 100%;
  text-align: center;
  opacity: 0;
  
  animation: ${glassReveal} 1.2s ease forwards;
  animation-delay: 0.3s;
  
  /* Top highlight line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.25) 30%, 
      rgba(255, 255, 255, 0.4) 50%, 
      rgba(255, 255, 255, 0.25) 70%, 
      transparent 100%
    );
  }
  
  /* Subtle inner glow */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(
      ellipse 60% 40% at 50% 0%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
  
  @media (max-width: 600px) {
    border-radius: 24px;
    padding: 2rem 1.5rem;
  }
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 0.8s;
`;

const Names = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 10vw, 4.5rem);
  font-weight: 300;
  line-height: 1;
  color: var(--text-light);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 1s;
`;

const Ampersand = styled.span`
  display: block;
  font-size: 0.35em;
  font-style: italic;
  color: var(--text-muted);
  margin: 0.4em 0;
`;

const DateLocation = styled.div`
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 1.2s;
`;

const WeddingDate = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  font-weight: 400;
  color: var(--text-light);
  letter-spacing: 0.05em;
`;

const Location = styled.p`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-top: 0.5rem;
`;

const CTAButton = styled.a`
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-light);
  transition: all 0.4s ease;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 1.4s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
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
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards, ${float} 3s ease-in-out infinite;
  animation-delay: 2s, 2s;
`;

const ScrollText = styled.span`
  font-family: var(--font-body);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
`;

const ScrollArrow = styled.span`
  font-size: 1.2rem;
  color: var(--text-dim);
`;

// ============================================
// COMPONENT
// ============================================

function Hero() {
  const { project, weddingDate, content, isComponentActive } = useWedding();
  const heroData = content?.hero || {};
  
  // Use provided image or default (Dschungel/Forest für Botanical)
  const heroImage = heroData.background_image || 'https://res.cloudinary.com/si-weddings/image/upload/q_auto,f_auto,w_1920/v1769793086/forest-6761846_1920_dumcnj.jpg';
  
  // NEU: Namen direkt aus project lesen (mit Fallbacks)
  const name1 = project?.partner1_name || heroData.name1 || 'Anna';
  const name2 = project?.partner2_name || heroData.name2 || 'Thomas';
  
  // Location aus project oder heroData
  const locationShort = heroData.location_short || project?.location || 'Hamburg';
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Datum folgt';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <HeroSection id="hero">
      <HeroBackground $image={heroImage} />
      
      <GlassCard>
        <Eyebrow>Wir heiraten</Eyebrow>
        
        <Names>
          {name1}
          <Ampersand>&</Ampersand>
          {name2}
        </Names>
        
        <DateLocation>
          <WeddingDate>{formatDate(weddingDate)}</WeddingDate>
          <Location>{locationShort}</Location>
        </DateLocation>
        
        {isComponentActive('rsvp') && (
          <CTAButton href="#rsvp">
            Jetzt zusagen
          </CTAButton>
        )}
      </GlassCard>
      
      <ScrollIndicator>
        <ScrollText>Entdecken</ScrollText>
        <ScrollArrow>↓</ScrollArrow>
      </ScrollIndicator>
    </HeroSection>
  );
}

export default Hero;
