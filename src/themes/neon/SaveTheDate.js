// Neon SaveTheDate - Cyberpunk Style mit Supabase-Daten
import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const NeonGlobalStyles = createGlobalStyle`
  :root {
    --neon-cyan: #00ffff;
    --neon-pink: #ff00ff;
    --neon-green: #00ff88;
    --neon-purple: #b347ff;
    --neon-bg: #0a0a0f;
  }
`;

const glitch = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.6; }
  94% { opacity: 1; }
  96% { opacity: 0.7; }
  97% { opacity: 1; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan); }
  50% { box-shadow: 0 0 40px var(--neon-cyan), 0 0 80px var(--neon-cyan), 0 0 120px var(--neon-cyan); }
`;

const neonFlicker = keyframes`
  0%, 100% { text-shadow: 0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan); }
  50% { text-shadow: 0 0 5px var(--neon-cyan), 0 0 10px var(--neon-cyan); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
`;

const colorShift = keyframes`
  0% { color: var(--neon-cyan); }
  33% { color: var(--neon-pink); }
  66% { color: var(--neon-purple); }
  100% { color: var(--neon-cyan); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: var(--neon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
`;

const GridOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const Scanline = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.15), transparent);
  animation: ${scanline} 6s linear infinite;
  pointer-events: none;
  z-index: 10;
`;

const GlowOrb = styled.div`
  position: fixed;
  width: ${p => p.$size || '300px'};
  height: ${p => p.$size || '300px'};
  border-radius: 50%;
  background: ${p => p.$color || 'var(--neon-cyan)'};
  filter: blur(100px);
  opacity: 0.15;
  animation: ${float} ${p => p.$duration || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

const CornerDecor = styled.div`
  position: fixed;
  width: 100px;
  height: 100px;
  border: 2px solid ${p => p.$color || 'var(--neon-cyan)'};
  opacity: 0.3;
  
  ${p => p.$position === 'top-left' && css`top: 30px; left: 30px; border-right: none; border-bottom: none;`}
  ${p => p.$position === 'top-right' && css`top: 30px; right: 30px; border-left: none; border-bottom: none;`}
  ${p => p.$position === 'bottom-left' && css`bottom: 30px; left: 30px; border-right: none; border-top: none;`}
  ${p => p.$position === 'bottom-right' && css`bottom: 30px; right: 30px; border-left: none; border-top: none;`}
`;

const Card = styled.div`
  position: relative;
  z-index: 2;
  max-width: 700px;
  width: 100%;
  text-align: center;
`;

const Terminal = styled.div`
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid var(--neon-cyan);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 50px rgba(0, 255, 255, 0.2), inset 0 0 50px rgba(0, 255, 255, 0.03);
`;

const TerminalHeader = styled.div`
  background: rgba(0, 255, 255, 0.1);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${p => p.$color};
  box-shadow: 0 0 10px ${p => p.$color};
`;

const TerminalTitle = styled.span`
  color: var(--neon-cyan);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  margin-left: 15px;
  opacity: 0.8;
`;

const TerminalBody = styled.div`
  padding: 50px 40px;
  @media (max-width: 600px) { padding: 40px 25px; }
`;

const Badge = styled.div`
  display: inline-block;
  padding: 8px 20px;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 30px;
  animation: ${glowPulse} 3s infinite;
`;

const PreTitle = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 1rem;
  color: var(--neon-green);
  margin-bottom: 20px;
  &::before { content: '$ '; color: var(--neon-cyan); }
`;

const MainTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  position: relative;
  display: inline-block;
  animation: ${flicker} 4s infinite;
  
  &::before, &::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
  }
  
  &::before {
    color: var(--neon-cyan);
    animation: ${glitch} 3s infinite;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
    transform: translate(-3px, 0);
    opacity: 0.8;
  }
  
  &::after {
    color: var(--neon-pink);
    animation: ${glitch} 3s infinite reverse;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
    transform: translate(3px, 0);
    opacity: 0.8;
  }
`;

const Ampersand = styled.span`
  display: block;
  font-size: 3rem;
  color: var(--neon-pink);
  margin: 15px 0;
  animation: ${neonFlicker} 2s infinite, ${colorShift} 6s infinite;
  text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;
`;

const DateDisplay = styled.div`
  margin: 40px 0;
  padding: 30px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 255, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 20%; right: 20%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--neon-pink), transparent);
  }
`;

const DateLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 15px;
`;

const DateValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: 600;
  color: var(--neon-pink);
  text-shadow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-pink);
`;

const Location = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 40px;
  &::before { content: '📍 '; }
`;

const Countdown = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 40px;
  @media (max-width: 500px) { grid-template-columns: repeat(2, 1fr); }
`;

const CountdownUnit = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 255, 0.2);
  padding: 20px 15px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: ${p => p.$color};
    box-shadow: 0 0 10px ${p => p.$color};
  }
`;

const CountdownNumber = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${p => p.$color};
  text-shadow: 0 0 15px ${p => p.$color};
  margin-bottom: 5px;
`;

const CountdownLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Message = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 30px;
`;

const StatusLine = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: var(--neon-green);
  span { color: var(--neon-cyan); }
`;

function SaveTheDate() {
  const { content, project, weddingDate } = useWedding();
  const stdData = content?.savethedate || {};
  const heroData = content?.hero || {};
  
  // Daten aus Supabase
  const name1 = project?.partner1_name || 'Alex';
  const name2 = project?.partner2_name || 'Jordan';
  const location = project?.location || heroData.location_short || 'Berlin';
  const tagline = stdData.tagline || 'Save the Date';
  const message = stdData.message || 'Wir freuen uns, diesen besonderen Tag mit euch zu feiern.';
  const showCountdown = stdData.countdown_active !== false;
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    if (!weddingDate || !showCountdown) return;
    
    const targetDate = new Date(weddingDate).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate, showCountdown]);
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Datum folgt';
    return new Date(dateStr).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  return (
    <>
      <NeonGlobalStyles />
      <Page>
        <GridOverlay />
        <Scanline />
        
        <GlowOrb $color="var(--neon-cyan)" $size="400px" style={{ top: '-10%', left: '-10%' }} $duration="10s" />
        <GlowOrb $color="var(--neon-pink)" $size="350px" style={{ bottom: '-10%', right: '-10%' }} $duration="12s" $delay="2s" />
        <GlowOrb $color="var(--neon-purple)" $size="250px" style={{ top: '50%', right: '10%' }} $duration="8s" $delay="1s" />
        
        <CornerDecor $position="top-left" $color="var(--neon-cyan)" />
        <CornerDecor $position="top-right" $color="var(--neon-pink)" />
        <CornerDecor $position="bottom-left" $color="var(--neon-pink)" />
        <CornerDecor $position="bottom-right" $color="var(--neon-cyan)" />
        
        <Card>
          <Terminal>
            <TerminalHeader>
              <Dot $color="#ff5f56" />
              <Dot $color="#ffbd2e" />
              <Dot $color="#27ca40" />
              <TerminalTitle>save_the_date.exe</TerminalTitle>
            </TerminalHeader>
            
            <TerminalBody>
              <Badge>{tagline}</Badge>
              
              <PreTitle>initializing wedding_sequence...</PreTitle>
              
              <MainTitle data-text={name1}>{name1}</MainTitle>
              <Ampersand>&</Ampersand>
              <MainTitle data-text={name2}>{name2}</MainTitle>
              
              <DateDisplay>
                <DateLabel>Das Datum</DateLabel>
                <DateValue>{formatDate(weddingDate)}</DateValue>
              </DateDisplay>
              
              <Location>{location}</Location>
              
              {message && <Message>{message}</Message>}
              
              {showCountdown && (
                <Countdown>
                  <CountdownUnit $color="var(--neon-cyan)">
                    <CountdownNumber $color="var(--neon-cyan)">{timeLeft.days}</CountdownNumber>
                    <CountdownLabel>Tage</CountdownLabel>
                  </CountdownUnit>
                  <CountdownUnit $color="var(--neon-pink)">
                    <CountdownNumber $color="var(--neon-pink)">{timeLeft.hours}</CountdownNumber>
                    <CountdownLabel>Stunden</CountdownLabel>
                  </CountdownUnit>
                  <CountdownUnit $color="var(--neon-green)">
                    <CountdownNumber $color="var(--neon-green)">{timeLeft.minutes}</CountdownNumber>
                    <CountdownLabel>Minuten</CountdownLabel>
                  </CountdownUnit>
                  <CountdownUnit $color="var(--neon-purple)">
                    <CountdownNumber $color="var(--neon-purple)">{timeLeft.seconds}</CountdownNumber>
                    <CountdownLabel>Sekunden</CountdownLabel>
                  </CountdownUnit>
                </Countdown>
              )}
              
              <StatusLine>
                Status: <span>Einladung folgt...</span>
              </StatusLine>
            </TerminalBody>
          </Terminal>
        </Card>
      </Page>
    </>
  );
}

export default SaveTheDate;
