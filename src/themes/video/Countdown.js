// Video Theme - Countdown Section
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 700px;`;

const Eyebrow = styled.p`
  font-family: var(--font-primary);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--video-accent);
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.1s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  
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
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 300;
  color: var(--video-white);
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-family: var(--font-primary);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--video-gray);
`;

const Divider = styled.div`
  width: 60px;
  height: 1px;
  background: var(--video-accent);
  margin: 0 auto 2rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.6s;
`;

const DateDisplay = styled.p`
  font-family: var(--font-accent);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-style: italic;
  color: var(--video-silver);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.7s;
`;

function Countdown({ background }) {
  const { content, project } = useWedding();
  const data = content?.countdown || {};
  const title = data.title || 'Der grosse Tag';
  const targetDate = data.target_date || project?.wedding_date || '2025-06-21';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const calc = () => {
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
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const units = [
    { value: timeLeft.days, label: 'Tage' },
    { value: timeLeft.hours, label: 'Stunden' },
    { value: timeLeft.minutes, label: 'Minuten' },
    { value: timeLeft.seconds, label: 'Sekunden' }
  ];

  return (
    <SectionWrapper id="countdown" background={background}>
      <Content ref={sectionRef}>
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
      </Content>
    </SectionWrapper>
  );
}

export default Countdown;
