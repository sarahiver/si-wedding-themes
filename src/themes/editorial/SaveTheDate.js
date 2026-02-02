// Editorial SaveTheDate - Magazine Style mit Dashboard-Daten
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import EditorialGlobalStyles from './GlobalStyles';

// ============================================
// ANIMATIONS
// ============================================

const letterReveal = keyframes`
  0% { opacity: 0; transform: translateY(100%) rotateX(-90deg); }
  100% { opacity: 1; transform: translateY(0) rotateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
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
  ${p => p.$accent && css`color: var(--editorial-red);`}
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
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto 2rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 2.4s;
`;

const CountdownGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(1.5rem, 5vw, 3rem);
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 2.6s;
`;

const CountdownItem = styled.div`
  text-align: center;
`;

const CountdownNumber = styled.div`
  font-family: var(--font-headline);
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--editorial-white);
  line-height: 1;
`;

const CountdownLabel = styled.div`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-top: 0.5rem;
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

const AnimatedText = ({ text, startDelay = 0, accent = false }) => (
  <HeadlineLine>
    {text.split('').map((letter, i) => (
      <Letter key={i} $delay={startDelay + i * 0.05} $accent={accent}>
        {letter === ' ' ? '\u00A0' : letter}
      </Letter>
    ))}
  </HeadlineLine>
);

// ============================================
// COMPONENT
// ============================================

function SaveTheDate() {
  const { content, project, weddingDate } = useWedding();
  const heroData = content?.hero || {};
  const stdData = content?.savethedate || {};
  
  // Namen aus project
  const name1 = (project?.partner1_name || 'Braut').toUpperCase();
  const name2 = (project?.partner2_name || 'Bräutigam').toUpperCase();
  const location = project?.location || heroData.location_short || '';
  
  // STD-spezifische Daten aus Dashboard
  const tagline = stdData.tagline || 'Save the Date';
  const message = stdData.message || '';
  const showCountdown = stdData.countdown_active !== false;
  // Hero-Bild: STD eigenes Bild, sonst normales Hero-Bild
  const backgroundImage = stdData.hero_image || heroData.background_image;
  
  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    if (!weddingDate) return;
    const targetDate = new Date(weddingDate);
    
    const calculate = () => {
      const diff = targetDate - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Datum folgt';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('de-DE', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day}. ${month} ${year}`;
  };
  
  const pad = n => String(n).padStart(2, '0');

  return (
    <>
      <EditorialGlobalStyles />
      <Page>
        <BackgroundImage $image={backgroundImage} />
        
        <Content>
          <Eyebrow>{tagline}</Eyebrow>
          
          <Headline>
            <AnimatedText text={name1} startDelay={0.8} />
            <Ampersand>&</Ampersand>
            <AnimatedText text={name2} startDelay={1.2} accent />
          </Headline>
          
          <DateSection>
            <Line />
            <DateDisplay>{formatDate(weddingDate)}</DateDisplay>
            {location && <LocationText>{location}</LocationText>}
          </DateSection>
          
          {message && <Message>{message}</Message>}
          
          {showCountdown && weddingDate && (
            <CountdownGrid>
              <CountdownItem>
                <CountdownNumber>{pad(timeLeft.days)}</CountdownNumber>
                <CountdownLabel>Tage</CountdownLabel>
              </CountdownItem>
              <CountdownItem>
                <CountdownNumber>{pad(timeLeft.hours)}</CountdownNumber>
                <CountdownLabel>Stunden</CountdownLabel>
              </CountdownItem>
              <CountdownItem>
                <CountdownNumber>{pad(timeLeft.minutes)}</CountdownNumber>
                <CountdownLabel>Minuten</CountdownLabel>
              </CountdownItem>
              <CountdownItem>
                <CountdownNumber>{pad(timeLeft.seconds)}</CountdownNumber>
                <CountdownLabel>Sekunden</CountdownLabel>
              </CountdownItem>
            </CountdownGrid>
          )}
        </Content>
        
        <Footer>
          <FooterText>Einladung folgt</FooterText>
        </Footer>
      </Page>
    </>
  );
}

export default SaveTheDate;
