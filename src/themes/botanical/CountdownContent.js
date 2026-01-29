// CountdownContent
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../../context/WeddingContext';

const Wrapper = styled.div`
  text-align: center;
`;

const Eyebrow = styled.p`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--black);
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;

const Unit = styled.div`
  text-align: center;
`;

const Number = styled.div`
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--black);
  line-height: 1;
`;

const Label = styled.div`
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--light);
  margin-top: 0.3rem;
`;

function CountdownContent() {
  const { content, project } = useWedding();
  const data = content?.countdown || {};
  
  const title = data.title || 'Countdown';
  const targetDate = data.target_date || project?.wedding_date || '2025-08-15';
  
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          mins: Math.floor((diff % 3600000) / 60000),
          secs: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <Wrapper>
      <Eyebrow>Es dauert noch</Eyebrow>
      <Title>{title}</Title>
      <Grid>
        <Unit>
          <Number>{String(time.days).padStart(2, '0')}</Number>
          <Label>Tage</Label>
        </Unit>
        <Unit>
          <Number>{String(time.hours).padStart(2, '0')}</Number>
          <Label>Stunden</Label>
        </Unit>
        <Unit>
          <Number>{String(time.mins).padStart(2, '0')}</Number>
          <Label>Minuten</Label>
        </Unit>
        <Unit>
          <Number>{String(time.secs).padStart(2, '0')}</Number>
          <Label>Sek</Label>
        </Unit>
      </Grid>
    </Wrapper>
  );
}

export default CountdownContent;
