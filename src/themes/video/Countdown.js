// Countdown.js - video Theme (Supabase integrated)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: 5rem 2rem;
  background: var(--section-bg, #f9f9f9);
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 2rem;
  color: var(--text-primary, #333);
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 600px;
  margin: 0 auto;
`;

const Unit = styled.div`
  text-align: center;
  min-width: 80px;
`;

const Number = styled.div`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 400;
  color: var(--accent, #8B9D83);
  line-height: 1;
`;

const Label = styled.div`
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary, #666);
  margin-top: 0.5rem;
`;

function Countdown() {
  const { content, weddingDate } = useWedding();
  const countdown = content?.countdown || {};
  
  const targetDate = countdown.target_date || weddingDate || '2026-08-15T14:00:00';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  return (
    <Section id="countdown">
      <Title>{countdown.title || 'Noch'}</Title>
      <Grid>
        <Unit>
          <Number>{timeLeft.days}</Number>
          <Label>Tage</Label>
        </Unit>
        <Unit>
          <Number>{timeLeft.hours}</Number>
          <Label>Stunden</Label>
        </Unit>
        <Unit>
          <Number>{timeLeft.minutes}</Number>
          <Label>Minuten</Label>
        </Unit>
        <Unit>
          <Number>{timeLeft.seconds}</Number>
          <Label>Sekunden</Label>
        </Unit>
      </Grid>
    </Section>
  );
}

export default Countdown;
