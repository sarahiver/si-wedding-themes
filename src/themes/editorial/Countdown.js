import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 6rem 2rem;
  background: #fafafa;
  text-align: center;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.8s ease;
`;

const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  
  @media (max-width: 600px) {
    gap: 1.5rem;
  }
`;

const Unit = styled.div`
  text-align: center;
`;

const Number = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 400;
  color: #000;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
`;

function Countdown() {
  const { content, weddingDate } = useWedding();
  const countdown = content?.countdown || {};
  
  const targetDate = countdown.target_date || weddingDate || '2026-08-15T14:00:00';
  const showSeconds = countdown.show_seconds !== false;
  
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
      <Container>
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
          {showSeconds && (
            <Unit>
              <Number>{timeLeft.seconds}</Number>
              <Label>Sekunden</Label>
            </Unit>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

export default Countdown;
