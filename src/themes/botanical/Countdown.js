// Botanical Countdown - Clean design for knothole view
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  position: relative;
  scroll-snap-align: start;
`;

const Content = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 300;
  color: var(--forest-deep);
  margin-bottom: 3rem;
`;

const CountdownGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(1.5rem, 4vw, 3rem);
  flex-wrap: wrap;
`;

const TimeUnit = styled.div`
  text-align: center;
`;

const Number = styled.div`
  font-family: var(--font-serif);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 300;
  color: var(--forest-deep);
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--bark-light);
`;

const DateText = styled.p`
  margin-top: 3rem;
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-style: italic;
  color: var(--forest-light);
`;

function Countdown() {
  const { content, project } = useWedding();
  const countdownData = content?.countdown || {};
  
  const title = countdownData.title || 'Noch';
  const targetDate = countdownData.target_date || project?.wedding_date || '2025-08-15';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
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

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const timeUnits = [
    { value: timeLeft.days, label: 'Tage' },
    { value: timeLeft.hours, label: 'Stunden' },
    { value: timeLeft.minutes, label: 'Minuten' },
    { value: timeLeft.seconds, label: 'Sekunden' },
  ];

  return (
    <Section id="countdown" data-section="countdown">
      <Content>
        <Eyebrow>Es dauert nicht mehr lange</Eyebrow>
        <Title>{title}</Title>
        
        <CountdownGrid>
          {timeUnits.map((unit) => (
            <TimeUnit key={unit.label}>
              <Number>{String(unit.value).padStart(2, '0')}</Number>
              <Label>{unit.label}</Label>
            </TimeUnit>
          ))}
        </CountdownGrid>
        
        <DateText>bis zum {formattedDate}</DateText>
      </Content>
    </Section>
  );
}

export default Countdown;
