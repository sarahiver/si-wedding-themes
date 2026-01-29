// Botanical Countdown - Growing Organic Numbers
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(
    180deg,
    var(--bg-cream) 0%,
    var(--bg-moss) 100%
  );
  position: relative;
  overflow: hidden;
`;

// Floating organic shapes
const FloatingShape = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.1};
  border-radius: 60% 40% 50% 50% / 50% 50% 40% 60%;
  animation: ${sway} ${p => p.$duration || '12s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '15px'});
  transition: all 0.6s var(--ease-nature);
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s var(--ease-nature) 0.1s;
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

// Organic pebble-shaped number containers
const pebbleShapes = [
  '60% 40% 50% 50% / 50% 50% 40% 60%',
  '50% 50% 40% 60% / 60% 40% 50% 50%',
  '55% 45% 45% 55% / 45% 55% 55% 45%',
  '45% 55% 55% 45% / 55% 45% 45% 55%',
];

const TimeUnit = styled.div`
  background: var(--bg-cream);
  border-radius: ${p => pebbleShapes[p.$index % pebbleShapes.length]};
  padding: clamp(1.5rem, 4vw, 2.5rem);
  box-shadow: var(--shadow-medium);
  text-align: center;
  animation: ${breathe} ${p => 5 + p.$index}s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.3}s;
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-deep);
  }
`;

const Number = styled.div`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 600;
  color: var(--green-forest);
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 2vw, 1rem);
  font-weight: 600;
  color: var(--green-sage);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const DateDisplay = styled.div`
  text-align: center;
  margin-top: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s var(--ease-nature) 0.3s;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  color: var(--green-fern);
  
  span {
    color: var(--accent-golden);
  }
`;

function Countdown() {
  const { content, project } = useWedding();
  const countdownData = content?.countdown || {};
  
  const title = countdownData.title || 'Noch';
  const targetDate = countdownData.target_date || project?.wedding_date || '2025-08-15';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
    <Section ref={sectionRef} id="countdown">
      {/* Floating decorations */}
      <FloatingShape $size="150px" $color="var(--green-mint)" $opacity={0.08} style={{ top: '10%', left: '5%' }} />
      <FloatingShape $size="100px" $color="var(--green-sage)" $opacity={0.06} style={{ bottom: '15%', right: '8%' }} $duration="15s" />
      <FloatingShape $size="80px" $color="var(--water-stream)" $opacity={0.05} style={{ top: '60%', left: '10%' }} $duration="18s" />
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>⏳ Es dauert nicht mehr lange</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <CountdownGrid>
          {timeUnits.map((unit, index) => (
            <TimeUnit key={unit.label} $index={index}>
              <Number>{String(unit.value).padStart(2, '0')}</Number>
              <Label>{unit.label}</Label>
            </TimeUnit>
          ))}
        </CountdownGrid>
        
        <DateDisplay $visible={visible}>
          <DateText>
            bis zum <span>{formattedDate}</span>
          </DateText>
        </DateDisplay>
      </Container>
    </Section>
  );
}

export default Countdown;
