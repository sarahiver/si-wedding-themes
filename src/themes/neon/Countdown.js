// Countdown.js - Neon Theme (Supabase integrated)
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const glowPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const scanlineAnim = keyframes`
  0% { top: -100%; }
  100% { top: 100%; }
`;

const numberGlow = keyframes`
  0%, 100% {
    text-shadow:
      0 0 10px rgba(0, 255, 255, 0.8),
      0 0 20px rgba(0, 255, 255, 0.6),
      0 0 40px rgba(0, 255, 255, 0.4);
  }
  50% {
    text-shadow:
      0 0 15px rgba(0, 255, 255, 1),
      0 0 30px rgba(0, 255, 255, 0.8),
      0 0 60px rgba(0, 255, 255, 0.6);
  }
`;

const Section = styled.section`
  min-height: 100vh;
  background: var(--neon-bg, #0a0a0f);
  padding: clamp(4rem, 10vw, 9rem) 5vw;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const Scanline = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
  animation: ${scanlineAnim} 6s linear infinite;
  pointer-events: none;
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;

  &:nth-child(1) {
    width: 300px;
    height: 300px;
    background: rgba(0, 255, 255, 0.4);
    top: 10%;
    left: -100px;
  }

  &:nth-child(2) {
    width: 250px;
    height: 250px;
    background: rgba(255, 0, 255, 0.4);
    bottom: 10%;
    right: -100px;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const TerminalWindow = styled.div`
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid var(--neon-cyan, #00ffff);
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(0, 255, 255, 0.2),
    inset 0 0 30px rgba(0, 255, 255, 0.05);
`;

const TerminalHeader = styled.div`
  background: rgba(0, 255, 255, 0.1);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 8px ${props => props.color};
`;

const TerminalTitle = styled.span`
  color: var(--neon-cyan, #00ffff);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  margin-left: 12px;
  opacity: 0.8;
`;

const TerminalBody = styled.div`
  padding: 40px 30px;
`;

const Header = styled.div`
  margin-bottom: 50px;
  text-align: center;
`;

const CommandLine = styled.div`
  font-family: 'Space Grotesk', monospace;
  color: var(--neon-green, #00ff88);
  font-size: 0.9rem;
  margin-bottom: 15px;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;

  &::before {
    content: '$ ';
    color: var(--neon-cyan, #00ffff);
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  text-shadow:
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 30px rgba(0, 255, 255, 0.4);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  font-family: 'Space Grotesk', monospace;

  &::before {
    content: '// ';
    color: var(--neon-pink, #ff00ff);
  }
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 600px) {
    grid-template-columns: repeat(${props => props.$columns}, 1fr);
  }
`;

const UnitCard = styled.div`
  background: rgba(0, 255, 255, 0.03);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 4px;
  padding: 30px 20px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--neon-cyan, #00ffff), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(0, 255, 255, 0.06);
    border-color: rgba(0, 255, 255, 0.4);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);

    &::before {
      opacity: 1;
    }
  }
`;

const UnitNumber = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  color: var(--neon-cyan, #00ffff);
  line-height: 1;
  animation: ${numberGlow} 3s ease-in-out infinite;

  /* Digital display effect */
  &::before {
    content: '[';
    color: rgba(255, 255, 255, 0.3);
    margin-right: 5px;
  }

  &::after {
    content: ']';
    color: rgba(255, 255, 255, 0.3);
    margin-left: 5px;
  }
`;

const UnitLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--neon-pink, #ff00ff);
  margin-top: 15px;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
`;

const UnitIndex = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
`;

const StatusBar = styled.div`
  margin-top: 40px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  flex-wrap: wrap;
  gap: 10px;
`;

const StatusText = styled.span`
  color: var(--neon-green, #00ff88);

  span {
    color: var(--neon-cyan, #00ffff);
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: var(--neon-cyan, #00ffff);
  margin-left: 5px;
  vertical-align: middle;
  animation: ${blink} 1s infinite;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--neon-cyan, #00ffff), var(--neon-pink, #ff00ff));
  width: ${props => props.$progress}%;
  transition: width 1s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
`;

function Countdown() {
  const { content, weddingDate } = useWedding();
  const countdown = content?.countdown || {};

  const targetDate = countdown.target_date || weddingDate || '2026-08-15T14:00:00';
  const showSeconds = countdown.show_seconds !== false;

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });

        // Calculate progress (assuming max countdown is 365 days)
        const maxDays = 365;
        const progressPercent = Math.max(0, Math.min(100, ((maxDays - days) / maxDays) * 100));
        setProgress(progressPercent);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: 'Tage', index: '00' },
    { value: timeLeft.hours, label: 'Stunden', index: '01' },
    { value: timeLeft.minutes, label: 'Minuten', index: '02' },
    ...(showSeconds ? [{ value: timeLeft.seconds, label: 'Sekunden', index: '03' }] : []),
  ];

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <Section ref={sectionRef} id="countdown">
      <GridOverlay />
      <Scanline />
      <GlowOrb />
      <GlowOrb />

      <Container>
        <TerminalWindow>
          <TerminalHeader>
            <Dot color="#ff5f56" />
            <Dot color="#ffbd2e" />
            <Dot color="#27ca40" />
            <TerminalTitle>countdown_timer.exe</TerminalTitle>
          </TerminalHeader>

          <TerminalBody>
            <Header>
              <CommandLine $visible={visible}>
                ./calculate_time_remaining --target="{targetDate}"
              </CommandLine>
              <Title>{countdown.title || 'Countdown'}</Title>
              <Subtitle>Zeit bis zum großen Tag</Subtitle>
            </Header>

            <CountdownGrid $columns={units.length}>
              {units.map((unit) => (
                <UnitCard key={unit.label}>
                  <UnitIndex>{unit.index}</UnitIndex>
                  <UnitNumber>{formatNumber(unit.value)}</UnitNumber>
                  <UnitLabel>{unit.label}</UnitLabel>
                </UnitCard>
              ))}
            </CountdownGrid>

            <ProgressBar>
              <ProgressFill $progress={progress} />
            </ProgressBar>

            <StatusBar>
              <StatusText>
                target: <span>{new Date(targetDate).toLocaleDateString('de-DE')}</span>
              </StatusText>
              <StatusText>
                status: <span>counting</span>
                <Cursor />
              </StatusText>
            </StatusBar>
          </TerminalBody>
        </TerminalWindow>
      </Container>
    </Section>
  );
}

export default Countdown;
