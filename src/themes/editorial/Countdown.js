import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(40px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const numberFlip = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  30% { transform: translateY(10%); opacity: 1; }
  50% { transform: translateY(-5%); }
  70% { transform: translateY(2%); }
  100% { transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem);
  background: var(--editorial-white);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.95;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${p => p.$cols}, 1fr);
  gap: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const Unit = styled.div`
  text-align: center;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.6s ease forwards;
    animation-delay: ${p.$delay}s;
  `}
`;

const NumberWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: clamp(4rem, 15vw, 10rem);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Number = styled.span`
  font-family: var(--font-headline);
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: 700;
  color: var(--editorial-black);
  line-height: 1;
  display: inline-block;
  animation: ${numberFlip} 0.5s ease;
`;

const Label = styled.div`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--editorial-gray);
  margin-top: 0.5rem;
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: var(--editorial-red);
  margin: 3rem auto 0;
  transform: scaleX(0);
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 0.8s;
  `}
`;

const DateDisplay = styled.p`
  text-align: center;
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 2rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 1s;
  `}
`;

// ============================================
// COMPONENT
// ============================================

function Countdown() {
  const { content, weddingDate } = useWedding();
  const countdown = content?.countdown || {};
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const targetDate = countdown.target_date || weddingDate || '2026-08-15T14:00:00';
  const showSeconds = countdown.show_seconds !== false;
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Format target date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const units = [
    { value: timeLeft.days, label: 'Tage' },
    { value: timeLeft.hours, label: 'Stunden' },
    { value: timeLeft.minutes, label: 'Minuten' },
    ...(showSeconds ? [{ value: timeLeft.seconds, label: 'Sekunden' }] : []),
  ];

  return (
    <Section id="countdown" ref={sectionRef}>
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Der große Tag</Eyebrow>
          <Title>{countdown.title || 'Countdown'}</Title>
        </Header>
        
        <Grid $cols={units.length}>
          {units.map((unit, index) => (
            <Unit 
              key={unit.label} 
              $visible={isVisible}
              $delay={0.2 + index * 0.1}
            >
              <NumberWrapper>
                <Number key={unit.value}>{String(unit.value).padStart(2, '0')}</Number>
              </NumberWrapper>
              <Label>{unit.label}</Label>
            </Unit>
          ))}
        </Grid>
        
        <Divider $visible={isVisible} />
        <DateDisplay $visible={isVisible}>
          {formatDate(targetDate)}
        </DateDisplay>
      </Container>
    </Section>
  );
}

export default Countdown;
