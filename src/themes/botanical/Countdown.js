// Botanical Countdown - Garden Style with Growing Plants
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const grow = keyframes`from { transform: scaleY(0); } to { transform: scaleY(1); }`;
const sway = keyframes`0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); }`;
const float = keyframes`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); }`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--botanical-paper);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '3rem'};
  opacity: 0.15;
  animation: ${sway} ${p => p.$duration || '4s'} ease-in-out infinite;
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  bottom: ${p => p.$bottom};
`;

const Container = styled.div`max-width: 900px; margin: 0 auto; text-align: center; position: relative; z-index: 1;`;

const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--botanical-olive);
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  color: var(--botanical-forest);
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 0.1s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
`;

const Unit = styled.div`
  background: var(--botanical-cream);
  border-radius: 20px;
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 20px rgba(107, 127, 94, 0.15);
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.1}s;
  
  /* Growing plant decoration */
  &::before {
    content: '${p => ['🌱', '🌿', '🍃', '🌲'][p.$index]}';
    position: absolute;
    bottom: -5px;
    right: 10px;
    font-size: 2rem;
    opacity: 0.2;
    animation: ${float} 3s ease-in-out infinite;
    animation-delay: ${p => p.$index * 0.3}s;
  }
`;

const Number = styled.div`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--botanical-sage);
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const Label = styled.div`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--botanical-olive);
`;

const DateDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--botanical-sage), var(--botanical-olive));
  border-radius: 50px;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 0.6s;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: white;
`;

const DateIcon = styled.span`font-size: 1.25rem;`;

function Countdown() {
  const { content, project } = useWedding();
  const data = content?.countdown || {};
  const title = data.title || 'Bald ist es soweit';
  const targetDate = data.target_date || project?.wedding_date || '2025-06-21';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
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
    <Section ref={sectionRef} id="countdown">
      <DecoLeaf $top="10%" $left="5%" $size="4rem" $duration="5s">🌿</DecoLeaf>
      <DecoLeaf $top="20%" $right="8%" $size="3rem" $duration="4s">🍃</DecoLeaf>
      <DecoLeaf $bottom="15%" $left="10%" $size="3.5rem" $duration="6s">🌱</DecoLeaf>
      <DecoLeaf $bottom="10%" $right="5%" $size="4rem" $duration="4.5s">🌲</DecoLeaf>
      
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
        <DateDisplay $visible={visible}>
          <DateIcon>📅</DateIcon>
          <DateText>{formattedDate}</DateText>
          <DateIcon>🌿</DateIcon>
        </DateDisplay>
      </Container>
    </Section>
  );
}

export default Countdown;
