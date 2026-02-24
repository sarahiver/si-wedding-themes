// Luxe SaveTheDate - Elegant Cinematic Style mit Supabase-Daten
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
import LuxeGlobalStyles from './GlobalStyles';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const revealText = keyframes`
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
`;

const expandLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--luxe-void);
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background: ${p => p.$image ? `url(${p.$image})` : 'linear-gradient(135deg, var(--luxe-charcoal) 0%, var(--luxe-void) 100%)'};
  background-size: cover;
  background-position: center;
  opacity: 0.4;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.7) 100%);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
`;

const Eyebrow = styled.div`
  overflow: hidden;
  margin-bottom: 2rem;
`;

const EyebrowText = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  opacity: 0;
  animation: ${slideUp} 0.8s var(--ease-out-expo) forwards;
  animation-delay: 0.3s;
`;

const NamesContainer = styled.div`
  margin-bottom: 2rem;
`;

const NameLine = styled.div`
  overflow: hidden;
`;

const NameText = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-cream);
  line-height: 0.9;
  letter-spacing: -0.03em;
  transform: translateY(110%);
  animation: ${revealText} 1.2s var(--ease-out-expo) forwards;
  animation-delay: ${p => p.$delay || '0.5s'};
`;

const Ampersand = styled.div`
  overflow: hidden;
  margin: 0.5rem 0;
`;

const AmpersandText = styled.span`
  display: inline-block;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-style: italic;
  color: var(--luxe-gold);
  transform: translateY(110%);
  animation: ${revealText} 1s var(--ease-out-expo) forwards;
  animation-delay: 0.8s;
`;

const Divider = styled.div`
  width: 80px;
  height: 1px;
  background: var(--luxe-gold);
  margin: 2rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${expandLine} 1s var(--ease-out-expo) forwards;
  animation-delay: 1.2s;
`;

const InfoBox = styled.div`
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 1.4s;
`;

const DateText = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-style: italic;
  color: var(--luxe-cream);
  margin-bottom: 0.5rem;
`;

const LocationText = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-pearl);
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  color: var(--luxe-pearl);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto 2rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.6s;
`;

const CountdownGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 4vw, 3rem);
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 1.8s;
`;

const CountdownItem = styled.div`
  text-align: center;
`;

const CountdownNumber = styled.div`
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 300;
  color: var(--luxe-cream);
  line-height: 1;
`;

const CountdownLabel = styled.div`
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-top: 0.5rem;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards, ${float} 3s ease-in-out infinite;
  animation-delay: 2s, 2s;
`;

const FooterText = styled.p`
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-pearl);
`;

// Component
function SaveTheDate() {
  const { content, project, weddingDate } = useWedding();
  const heroData = content?.hero || {};
  const stdData = content?.savethedate || {};
  
  // Namen aus project
  const name1 = project?.partner1_name || 'Alexandra';
  const name2 = project?.partner2_name || 'Benjamin';
  const location = project?.location || heroData.location || '';
  
  // STD-spezifische Daten
  const tagline = stdData.tagline || 'Save the Date';
  const message = stdData.message || 'Wir freuen uns, diesen besonderen Tag mit euch zu feiern. Einladung folgt.';
  const backgroundImage = stdData.hero_image || heroData.background_image;
  const showCountdown = stdData.countdown_active !== false;
  
  // Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    if (!weddingDate) return;
    
    const targetDate = new Date(weddingDate);
    const calculate = () => {
      const now = new Date();
      const diff = targetDate - now;
      
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
  const formattedDate = weddingDate 
    ? new Date(weddingDate).toLocaleDateString('de-DE', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Datum folgt';
  
  const pad = n => String(n).padStart(2, '0');

  return (
    <>
      <LuxeGlobalStyles />
      <Page>
        <BackgroundImage $image={optimizedUrl.hero(backgroundImage)} />
        
        <Content>
          <Eyebrow>
            <EyebrowText>{tagline}</EyebrowText>
          </Eyebrow>
          
          <NamesContainer>
            <NameLine>
              <NameText $delay="0.5s">{name1}</NameText>
            </NameLine>
            <Ampersand>
              <AmpersandText>&</AmpersandText>
            </Ampersand>
            <NameLine>
              <NameText $delay="0.7s">{name2}</NameText>
            </NameLine>
          </NamesContainer>
          
          <Divider />
          
          <InfoBox>
            <DateText>{formattedDate}</DateText>
            {location && <LocationText>{location}</LocationText>}
          </InfoBox>
          
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
          
          <Message>{message}</Message>
        </Content>
        
        <Footer>
          <FooterText>Einladung folgt</FooterText>
        </Footer>
      </Page>
    </>
  );
}

export default SaveTheDate;
