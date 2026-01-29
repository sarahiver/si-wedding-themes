// Botanical Tree Countdown - Grows from branch
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const CountdownGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const TimeUnit = styled.div`
  text-align: center;
  min-width: 60px;
`;

const Number = styled.div`
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 300;
  color: var(--black);
  line-height: 1;
`;

const Label = styled.div`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--light);
  margin-top: 0.4rem;
`;

const DateDisplay = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-style: italic;
  color: var(--medium);
  text-align: center;
  margin-top: 1.5rem;
`;

function Countdown({ side = 'right' }) {
  const { content, project } = useWedding();
  const countdownData = content?.countdown || {};
  
  const title = countdownData.title || 'Countdown';
  const targetDate = countdownData.target_date || project?.wedding_date || '2025-08-15';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
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
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <ContentBranch side={side} eyebrow="Es dauert noch" title={title} align="center">
      <CountdownGrid>
        <TimeUnit>
          <Number>{String(timeLeft.days).padStart(2, '0')}</Number>
          <Label>Tage</Label>
        </TimeUnit>
        <TimeUnit>
          <Number>{String(timeLeft.hours).padStart(2, '0')}</Number>
          <Label>Stunden</Label>
        </TimeUnit>
        <TimeUnit>
          <Number>{String(timeLeft.minutes).padStart(2, '0')}</Number>
          <Label>Minuten</Label>
        </TimeUnit>
        <TimeUnit>
          <Number>{String(timeLeft.seconds).padStart(2, '0')}</Number>
          <Label>Sekunden</Label>
        </TimeUnit>
      </CountdownGrid>
      <DateDisplay>{formattedDate}</DateDisplay>
    </ContentBranch>
  );
}

export default Countdown;
