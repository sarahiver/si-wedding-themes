// Luxe Countdown - Elegant Dark with Gold Accents
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: var(--section-padding-y) var(--section-padding-x);
  background: var(--luxe-cream);
  color: var(--luxe-anthracite);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  text-align: center;
`;

const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-anthracite);
  margin-bottom: 4rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.1s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto 4rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const Unit = styled.div`
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.1}s;
`;

const Number = styled.div`
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 10vw, 6rem);
  font-weight: 300;
  color: var(--luxe-anthracite);
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-slate);
`;

const Divider = styled.div`
  width: 1px;
  height: 60px;
  background: var(--luxe-gold);
  margin: 0 auto 2rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.6s;
`;

const DateDisplay = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-style: italic;
  color: var(--luxe-graphite);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.7s;
`;

function Countdown() {
  const { content, project } = useWedding();
  const countdownData = content?.countdown || {};
  const title = countdownData.title || 'Der grosse Tag';
  const targetDate = countdownData.target_date || project?.wedding_date || '2025-09-21';
  const showSeconds = countdownData.show_seconds !== false;
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
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
    ...(showSeconds ? [{ value: timeLeft.seconds, label: 'Sekunden' }] : []),
  ];

  return (
    <Section ref={sectionRef} id="countdown">
      <Container>
        <Eyebrow $visible={visible}>Save the Date</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Grid>
          {units.map((unit, i) => (
            <Unit key={unit.label} $visible={visible} $index={i}>
              <Number>{String(unit.value).padStart(2, '0')}</Number>
              <Label>{unit.label}</Label>
            </Unit>
          ))}
        </Grid>
        <Divider $visible={visible} />
        <DateDisplay $visible={visible}>{formattedDate}</DateDisplay>
      </Container>
    </Section>
  );
}

export default Countdown;
