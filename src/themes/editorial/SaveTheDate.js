import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import EditorialGlobalStyles from './GlobalStyles';

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
    transform: translateY(40px); 
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
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--editorial-black);
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${p => p.$image ? `url(${p.$image})` : 'none'};
  background-size: cover;
  background-position: center;
  filter: grayscale(100%);
  opacity: 0;
  animation: ${fadeIn} 2s ease forwards;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem clamp(1.5rem, 5vw, 4rem);
  text-align: center;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.5s;
`;

const Headline = styled.h1`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 15vw, 12rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.85;
  margin-bottom: 2rem;
  
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeadlineLine = styled.span`
  display: flex;
  overflow: hidden;
  perspective: 1000px;
`;

const Letter = styled.span`
  display: inline-block;
  opacity: 0;
  transform-origin: bottom center;
  animation: ${letterReveal} 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: ${p => p.$delay}s;
  
  ${p => p.$accent && css`
    color: var(--editorial-red);
  `}
`;

const Ampersand = styled.span`
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.4em;
  color: var(--editorial-red);
  margin: 0.5rem 0;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 1.5s;
`;

const DateSection = styled.div`
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 2s;
`;

const Line = styled.div`
  width: 80px;
  height: 3px;
  background: var(--editorial-red);
  margin: 0 auto 2rem;
  transform: scaleX(0);
  animation: ${lineGrow} 0.8s ease forwards;
  animation-delay: 2.2s;
`;

const DateDisplay = styled.div`
  font-family: var(--font-headline);
  font-size: clamp(2rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

const LocationText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3rem;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 3rem;
  background: var(--editorial-red);
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards, ${pulse} 2s ease-in-out infinite;
  animation-delay: 2.5s, 3.5s;
  transition: background 0.3s ease, transform 0.3s ease;
  
  &:hover {
    background: #e01a38;
    transform: translateY(-3px);
  }
`;

const Footer = styled.footer`
  position: relative;
  z-index: 10;
  padding: 2rem;
  text-align: center;
`;

const FooterText = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
`;

// ============================================
// HELPER
// ============================================

const AnimatedText = ({ text, startDelay = 0, accent = false }) => {
  return (
    <HeadlineLine>
      {text.split('').map((letter, i) => (
        <Letter 
          key={i} 
          $delay={startDelay + i * 0.05}
          $accent={accent}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </Letter>
      ))}
    </HeadlineLine>
  );
};

// ============================================
// COMPONENT
// ============================================

function SaveTheDate() {
  const { content, coupleNames, weddingDate, projectSlug } = useWedding();
  const saveTheDateData = content?.savethedate || {};
  
  const backgroundImage = saveTheDateData.background_image || 
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600';
  const location = saveTheDateData.location || '';
  const ctaText = saveTheDateData.cta_text || 'Zur Einladung';
  const ctaUrl = saveTheDateData.cta_url || `/${projectSlug}`;
  
  // Parse couple names
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Braut', 'Bräutigam'];
  const name1 = names[0]?.toUpperCase() || 'BRAUT';
  const name2 = names[1]?.toUpperCase() || 'BRÄUTIGAM';
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Datum folgt';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('de-DE', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day}. ${month} ${year}`;
  };

  return (
    <>
      <EditorialGlobalStyles />
      <Page>
        <BackgroundImage $image={backgroundImage} />
        
        <Content>
          <Eyebrow>Save the Date</Eyebrow>
          
          <Headline>
            <AnimatedText text={name1} startDelay={0.8} />
            <Ampersand>&</Ampersand>
            <AnimatedText text={name2} startDelay={1.2} accent />
          </Headline>
          
          <DateSection>
            <Line />
            <DateDisplay>{formatDate(weddingDate)}</DateDisplay>
            {location && <LocationText>{location}</LocationText>}
            
            <CTAButton href={ctaUrl}>
              {ctaText} →
            </CTAButton>
          </DateSection>
        </Content>
        
        <Footer>
          <FooterText>Einladung folgt</FooterText>
        </Footer>
      </Page>
    </>
  );
}

export default SaveTheDate;
