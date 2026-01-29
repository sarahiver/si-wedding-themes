// Botanical Countdown - Content in holes
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

// Main content in main hole
const MainContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
`;

// Secondary content in secondary holes
const SecondaryContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.75rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 1.5rem;
`;

const CountdownGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 3vw, 2rem);
  flex-wrap: wrap;
`;

const TimeUnit = styled.div`
  text-align: center;
`;

const Number = styled.div`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 300;
  color: var(--black);
  line-height: 1;
`;

const Label = styled.div`
  font-family: var(--font-sans);
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--light);
  margin-top: 0.3rem;
`;

const SmallNumber = styled.div`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  color: var(--medium);
  line-height: 1;
`;

const SmallLabel = styled.div`
  font-family: var(--font-sans);
  font-size: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--light);
  margin-top: 0.25rem;
`;

function Countdown() {
  const { content, project } = useWedding();
  const { mainHole, secondaryHoles } = useKnotholes();
  const countdownData = content?.countdown || {};
  
  const title = countdownData.title || 'Noch';
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

  return (
    <Section data-section="countdown">
      {/* Main hole: Days and Hours */}
      <MainContent $hole={mainHole}>
        <Eyebrow>Es dauert nicht mehr lange</Eyebrow>
        <Title>{title}</Title>
        <CountdownGrid>
          <TimeUnit>
            <Number>{String(timeLeft.days).padStart(2, '0')}</Number>
            <Label>Tage</Label>
          </TimeUnit>
          <TimeUnit>
            <Number>{String(timeLeft.hours).padStart(2, '0')}</Number>
            <Label>Stunden</Label>
          </TimeUnit>
        </CountdownGrid>
      </MainContent>
      
      {/* Secondary holes: Minutes and Seconds */}
      {secondaryHoles[0] && (
        <SecondaryContent $hole={secondaryHoles[0]}>
          <TimeUnit>
            <SmallNumber>{String(timeLeft.minutes).padStart(2, '0')}</SmallNumber>
            <SmallLabel>Min</SmallLabel>
          </TimeUnit>
        </SecondaryContent>
      )}
      
      {secondaryHoles[1] && (
        <SecondaryContent $hole={secondaryHoles[1]}>
          <TimeUnit>
            <SmallNumber>{String(timeLeft.seconds).padStart(2, '0')}</SmallNumber>
            <SmallLabel>Sek</SmallLabel>
          </TimeUnit>
        </SecondaryContent>
      )}
    </Section>
  );
}

export default Countdown;
