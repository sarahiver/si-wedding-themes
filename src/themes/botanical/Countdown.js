import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const countUp = keyframes`
  0% { 
    opacity: 0;
    transform: translateY(20px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  z-index: 10;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--section-padding) 2rem;
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  box-shadow: var(--glass-shadow);
  padding: clamp(2.5rem, 5vw, 4rem) clamp(2rem, 4vw, 4rem);
  text-align: center;
  max-width: 700px;
  width: 100%;
  position: relative;
  overflow: hidden;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
  
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
      rgba(255,255,255,0.2) 20%, 
      rgba(255,255,255,0.35) 50%, 
      rgba(255,255,255,0.2) 80%, 
      transparent 100%
    );
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 22px;
  }
`;

const Title = styled.p`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 2rem;
`;

const CountdownGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 3vw, 2rem);
`;

const CountdownUnit = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: clamp(1.25rem, 3vw, 1.75rem) clamp(1rem, 2vw, 1.5rem);
  min-width: clamp(75px, 15vw, 100px);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${countUp} 0.6s ease forwards;
    animation-delay: ${0.2 + p.$index * 0.1}s;
  `}
  
  @media (max-width: 768px) {
    min-width: 75px;
    padding: 1.25rem 0.75rem;
  }
`;

const CountdownNumber = styled.div`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 300;
  color: var(--text-light);
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const CountdownLabel = styled.div`
  font-family: var(--font-body);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
`;

const Message = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 2rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.7s;
  `}
`;

// ============================================
// COMPONENT
// ============================================

function Countdown() {
  const { content, weddingDate } = useWedding();
  const countdownData = content?.countdown || {};
  
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!weddingDate) return;
    
    const calculateTimeLeft = () => {
      const targetDate = new Date(weddingDate);
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [weddingDate]);

  const title = countdownData.title || 'Es dauert noch';
  const message = countdownData.message || '';
  const showSeconds = countdownData.show_seconds !== false; // Default true

  const units = [
    { value: timeLeft.days, label: 'Tage' },
    { value: timeLeft.hours, label: 'Stunden' },
    { value: timeLeft.minutes, label: 'Minuten' },
    ...(showSeconds ? [{ value: timeLeft.seconds, label: 'Sekunden' }] : []),
  ];

  return (
    <Section id="countdown" ref={sectionRef}>
      <GlassCard $visible={visible}>
        <Title>{title}</Title>
        
        <CountdownGrid>
          {units.map((unit, i) => (
            <CountdownUnit key={unit.label} $visible={visible} $index={i}>
              <CountdownNumber>
                {String(unit.value).padStart(2, '0')}
              </CountdownNumber>
              <CountdownLabel>{unit.label}</CountdownLabel>
            </CountdownUnit>
          ))}
        </CountdownGrid>
        
        {message && <Message $visible={visible}>{message}</Message>}
      </GlassCard>
    </Section>
  );
}

export default Countdown;
