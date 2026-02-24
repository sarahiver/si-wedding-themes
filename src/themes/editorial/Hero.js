import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

// ============================================
// ANIMATIONS
// ============================================

const letterReveal = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(100%) rotateX(-90deg);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) rotateX(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  background: var(--editorial-black);
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${p => p.$image ? `url(${p.$image})` : 'none'};
  background-size: cover;
  background-position: center;
  filter: grayscale(100%);
  opacity: 0;
  animation: ${fadeIn} 1.5s ease forwards;
  animation-delay: 0.2s;
  
  /* Mobile image override */
  @media (max-width: 768px) {
    background-image: ${p => p.$mobileImage ? `url(${p.$mobileImage})` : (p.$image ? `url(${p.$image})` : 'none')};
  }
  
  /* Dark overlay for text readability */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.1) 40%,
      rgba(0, 0, 0, 0.4) 70%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
  padding-bottom: clamp(3rem, 8vh, 6rem);
  max-width: 1400px;
`;

const Tagline = styled.p`
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.8s;
`;

const HeadlineContainer = styled.div`
  overflow: hidden;
  margin-bottom: 1rem;
`;

const Headline = styled.h1`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 12vw, 10rem);
  font-weight: 700;
  line-height: 0.9;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.2em;
`;

const Word = styled.span`
  display: inline-flex;
  overflow: hidden;
  perspective: 1000px;
`;

const Letter = styled.span`
  display: inline-block;
  opacity: 0;
  transform-origin: bottom center;
  animation: ${letterReveal} 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: ${p => p.$delay}s;
  
  /* Accent color for specific letters/words */
  ${p => p.$accent && css`
    color: var(--editorial-red);
  `}
`;

const Ampersand = styled.span`
  display: inline-block;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.7em;
  color: var(--editorial-red);
  margin: 0 0.15em;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: 1.2s;
`;

const DateLine = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.8s;
`;

const Line = styled.div`
  width: 60px;
  height: 2px;
  background: var(--editorial-red);
  transform: scaleX(0);
  transform-origin: left;
  animation: ${lineGrow} 0.6s ease forwards;
  animation-delay: 2s;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-style: italic;
  color: var(--editorial-white);
  letter-spacing: 0.02em;
`;

const Location = styled.p`
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 1vw, 0.8rem);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.75rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 2.2s;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  right: clamp(1.5rem, 5vw, 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 2.5s;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ScrollText = styled.span`
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  writing-mode: vertical-rl;
`;

const ScrollDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--editorial-red);
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

// ============================================
// HELPER FUNCTIONS
// ============================================

const AnimatedWord = ({ text, startDelay = 0, accent = false }) => {
  return (
    <Word>
      {text.split('').map((letter, i) => (
        <Letter 
          key={i} 
          $delay={startDelay + i * 0.05}
          $accent={accent}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </Letter>
      ))}
    </Word>
  );
};

// ============================================
// COMPONENT
// ============================================

function Hero() {
  const { content, project, weddingDate } = useWedding();
  const hero = content?.hero || {};
  
  // NEU: Namen direkt aus project lesen (mit Fallbacks)
  const name1 = (project?.partner1_name || hero.name1 || 'Braut').toUpperCase();
  const name2 = (project?.partner2_name || hero.name2 || 'Bräutigam').toUpperCase();
  
  // Location aus project oder heroData
  const locationShort = hero.location_short || project?.location || null;
  
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

  // Default background image (Cloudinary)
  const backgroundImage = hero.background_image || 
    'https://res.cloudinary.com/si-weddings/image/upload/v1769537648/siwedding/demo/hero/t4rsv6gjmwtow3k761d2.jpg';
  
  // Optional mobile background image
  const mobileBackgroundImage = hero.background_image_mobile || null;

  return (
    <Section id="top">
      <BackgroundImage $image={optimizedUrl.hero(backgroundImage)} $mobileImage={mobileBackgroundImage ? optimizedUrl.hero(mobileBackgroundImage) : null} />
      
      <Content>
        <Tagline>{hero.tagline || 'Wir sagen Ja'}</Tagline>
        
        <HeadlineContainer>
          <Headline>
            <AnimatedWord text={name1} startDelay={0.5} />
            <Ampersand>&</Ampersand>
            <AnimatedWord text={name2} startDelay={0.9} accent />
          </Headline>
        </HeadlineContainer>
        
        <DateLine>
          <Line />
          <DateText>{formatDate(weddingDate)}</DateText>
        </DateLine>
        
        {locationShort && (
          <Location>{locationShort}</Location>
        )}
      </Content>
      
      <ScrollIndicator>
        <ScrollText>Scroll</ScrollText>
        <ScrollDot />
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
