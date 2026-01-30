import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(40px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const glassReveal = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.95) translateY(30px);
    backdrop-filter: blur(0px);
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0);
    backdrop-filter: blur(40px);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const lineGrow = keyframes`
  from { height: 0; }
  to { height: 60px; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 10;
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  animation: ${fadeIn} 1.5s ease forwards;
  animation-delay: 0.2s;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.35) saturate(0.8);
  }
  
  /* Fallback gradient if no image */
  &.no-image {
    background: linear-gradient(135deg, #0a150a 0%, #152015 50%, #0a100a 100%);
  }
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 600px;
  width: 100%;
  padding: 0 1.5rem;
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  box-shadow: var(--glass-shadow);
  padding: clamp(2.5rem, 5vw, 3.5rem) clamp(2rem, 4vw, 3rem);
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: ${glassReveal} 1s ease forwards;
  animation-delay: 0.5s;
  
  /* Subtle noise texture */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.02;
    pointer-events: none;
    border-radius: inherit;
  }
  
  /* Top highlight */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255,255,255,0.25) 20%, 
      rgba(255,255,255,0.4) 50%, 
      rgba(255,255,255,0.25) 80%, 
      transparent 100%
    );
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 2rem;
    border-radius: 22px;
  }
`;

const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1.75rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1s;
`;

const Names = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3rem, 11vw, 5rem);
  font-weight: 300;
  line-height: 1;
  color: var(--text-light);
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.2s;
`;

const Ampersand = styled.span`
  display: block;
  font-size: 0.28em;
  font-style: italic;
  color: var(--text-muted);
  margin: 0.6em 0;
`;

const DateText = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
  font-weight: 400;
  color: var(--text-light);
  margin-top: 2rem;
  letter-spacing: 0.05em;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.4s;
`;

const Location = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-top: 0.5rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.5s;
`;

const CTAButton = styled.a`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.9rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-light);
  transition: all 0.4s ease;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.6s;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    color: var(--bg-dark);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255,255,255,0.15);
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
  gap: 0.75rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 2s;
  
  @media (max-width: 768px) {
    bottom: 1.5rem;
  }
`;

const ScrollText = styled.span`
  font-family: var(--font-body);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-dim);
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 0;
  background: var(--text-dim);
  animation: ${lineGrow} 0.8s ease forwards;
  animation-delay: 2.2s;
`;

// ============================================
// COMPONENT
// ============================================

function Hero() {
  const { content, coupleNames, weddingDate } = useWedding();
  const hero = content?.hero || {};
  
  // Parse couple names
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Anna', 'Thomas'];
  const name1 = names[0] || 'Anna';
  const name2 = names[1] || 'Thomas';
  
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

  // Background image
  const backgroundImage = hero.background_image || null;
  const mobileBackgroundImage = hero.background_image_mobile || null;

  return (
    <Section id="top">
      <BackgroundImage className={!backgroundImage ? 'no-image' : ''}>
        {backgroundImage && (
          <picture>
            {mobileBackgroundImage && (
              <source media="(max-width: 768px)" srcSet={mobileBackgroundImage} />
            )}
            <img src={backgroundImage} alt="" />
          </picture>
        )}
      </BackgroundImage>
      
      <HeroContent>
        <GlassCard>
          <Eyebrow>{hero.tagline || 'Wir heiraten'}</Eyebrow>
          
          <Names>
            {name1}
            <Ampersand>&</Ampersand>
            {name2}
          </Names>
          
          <DateText>{formatDate(weddingDate)}</DateText>
          
          {hero.location_short && (
            <Location>{hero.location_short}</Location>
          )}
          
          <CTAButton href="#rsvp">
            {hero.cta_text || 'Zusagen'}
          </CTAButton>
        </GlassCard>
      </HeroContent>
      
      <ScrollIndicator>
        <ScrollText>Scroll</ScrollText>
        <ScrollLine />
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
