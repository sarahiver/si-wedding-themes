// src/components/Countdown.js - Neon Theme
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const holographicShift = keyframes`
  0%, 100% { 
    text-shadow: 
      0 0 10px rgba(0,255,255,0.8),
      0 0 20px rgba(0,255,255,0.5),
      0 0 40px rgba(0,255,255,0.3);
  }
  50% { 
    text-shadow: 
      0 0 20px rgba(255,0,255,0.8),
      0 0 40px rgba(255,0,255,0.5),
      0 0 60px rgba(255,0,255,0.3);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const scanline = keyframes`
  0% { top: -10%; }
  100% { top: 110%; }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #0a0a0f;
  overflow: hidden;
  padding: 100px 5%;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const GlowOrb = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  
  &:nth-child(1) {
    background: #00ffff;
    top: 10%;
    left: 10%;
  }
  
  &:nth-child(2) {
    background: #ff00ff;
    bottom: 10%;
    right: 10%;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 20px;
  
  &::before {
    content: '[ ';
    color: rgba(255,255,255,0.3);
  }
  &::after {
    content: ' ]';
    color: rgba(255,255,255,0.3);
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  
  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
`;

const TimeUnit = styled.div`
  position: relative;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.2);
  padding: 40px 20px;
  text-align: center;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease ${p => p.$delay}s;
  
  /* Scanline Effect */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent);
    animation: ${scanline} 3s linear infinite;
  }
  
  /* Corner Accents */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-top: 2px solid ${p => p.$color};
    border-left: 2px solid ${p => p.$color};
  }
  
  &:hover {
    border-color: ${p => p.$color};
    box-shadow: 0 0 30px ${p => p.$color}40;
  }
`;

const Number = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(4rem, 10vw, 6rem);
  font-weight: 700;
  color: ${p => p.$color};
  line-height: 1;
  margin-bottom: 15px;
  animation: ${holographicShift} 4s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
`;

const Label = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
`;

const ProgressSection = styled.div`
  margin-top: 60px;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.8s ease 0.6s;
`;

const ProgressBar = styled.div`
  max-width: 600px;
  margin: 0 auto 20px;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, #00ffff, #ff00ff);
  box-shadow: 0 0 20px rgba(0,255,255,0.5);
  transition: width 1s ease;
`;

const ProgressText = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  
  span {
    color: #00ffff;
    font-weight: 600;
  }
`;

const StatusLine = styled.div`
  margin-top: 40px;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: #00ff88;
  
  .blink {
    animation: ${pulse} 1s ease-in-out infinite;
  }
`;

function Countdown({ 
  weddingDate = "2025-08-15T14:00:00",
  title = "Countdown to",
  subtitle = "Forever"
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targetDate = new Date(weddingDate).getTime();
    // Assume engagement was 1 year before wedding for progress calculation
    const startDate = targetDate - (365 * 24 * 60 * 60 * 1000);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      const totalTime = targetDate - startDate;
      const elapsed = now - startDate;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
        setProgress(Math.min(100, (elapsed / totalTime) * 100));
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const units = [
    { value: timeLeft.days, label: 'Days', color: '#00ffff', delay: 0 },
    { value: timeLeft.hours, label: 'Hours', color: '#ff00ff', delay: 0.1 },
    { value: timeLeft.minutes, label: 'Minutes', color: '#b347ff', delay: 0.2 },
    { value: timeLeft.seconds, label: 'Seconds', color: '#00ff88', delay: 0.3 },
  ];

  return (
    <Section ref={sectionRef} id="countdown">
      <GridBG />
      <GlowOrb />
      <GlowOrb />
      
      <Container>
        <Header $visible={visible}>
          <Eyebrow>System Status</Eyebrow>
          <Title>{title} <span>{subtitle}</span></Title>
        </Header>
        
        <CountdownGrid>
          {units.map((unit, i) => (
            <TimeUnit 
              key={i} 
              $visible={visible} 
              $delay={unit.delay}
              $color={unit.color}
            >
              <Number $color={unit.color} $delay={i * 0.5}>
                {String(unit.value).padStart(2, '0')}
              </Number>
              <Label>{unit.label}</Label>
            </TimeUnit>
          ))}
        </CountdownGrid>
        
        <ProgressSection $visible={visible}>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
          <ProgressText>
            Journey Progress: <span>{Math.round(progress)}%</span> Complete
          </ProgressText>
          
          <StatusLine>
            $ wedding_countdown.exe --status <span className="blink">█</span>
          </StatusLine>
        </ProgressSection>
      </Container>
    </Section>
  );
}

export default Countdown;
