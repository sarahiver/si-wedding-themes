// Luxe Countdown - Elegant, Minimal
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-white);
`;

const Container = styled.div`
  max-width: var(--container-width);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: 0;
  animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-black);
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 700px;
  margin: 0 auto;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const TimeUnit = styled.div`
  text-align: center;
  opacity: 0;
  animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards;
  animation-delay: ${p => 0.1 + p.$index * 0.1}s;
`;

const TimeNumber = styled.div`
  font-family: var(--font-serif);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 300;
  color: var(--luxe-black);
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const TimeLabel = styled.div`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
`;

const DateDisplay = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--luxe-sand);
  opacity: 0;
  animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards;
  animation-delay: 0.5s;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  color: var(--luxe-charcoal);
`;

function Countdown() {
  const { content, project } = useWedding();
  const countdownData = content?.countdown || {};
  
  const title = countdownData.title || 'Der grosse Tag';
  const targetDate = countdownData.target_date || project?.wedding_date || '2025-09-21';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const units = [
    { value: timeLeft.days, label: 'Tage' },
    { value: timeLeft.hours, label: 'Stunden' },
    { value: timeLeft.minutes, label: 'Minuten' },
    { value: timeLeft.seconds, label: 'Sekunden' }
  ];

  return (
    <Section ref={sectionRef} id="countdown">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Save the Date</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <CountdownGrid>
          {units.map((unit, i) => (
            <TimeUnit key={unit.label} $visible={visible} $index={i}>
              <TimeNumber>{String(unit.value).padStart(2, '0')}</TimeNumber>
              <TimeLabel>{unit.label}</TimeLabel>
            </TimeUnit>
          ))}
        </CountdownGrid>
        
        <DateDisplay $visible={visible}>
          <DateText>{formattedDate}</DateText>
        </DateDisplay>
      </Container>
    </Section>
  );
}

export default Countdown;
