// Contemporary Countdown - Colorful Brutalist Cards
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const float = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(10px, -10px) rotate(5deg); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--black);
  position: relative;
  overflow: hidden;
`;

// Floating decorations
const FloatingShape = styled.div`
  position: absolute;
  width: ${p => p.$size || '60px'};
  height: ${p => p.$size || '60px'};
  background: ${p => p.$color || 'var(--coral)'};
  border: 3px solid var(--white);
  border-radius: ${p => p.$round ? '50%' : '0'};
  opacity: 0.2;
  animation: ${float} ${p => p.$duration || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const TimeCard = styled.div`
  background: ${p => colors[p.$index % colors.length]};
  border: 3px solid var(--white);
  box-shadow: 6px 6px 0 rgba(255,255,255,0.2);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'}) rotate(${p => p.$visible ? 0 : (p.$index % 2 === 0 ? -5 : 5)}deg);
  transition: all 0.6s ease ${p => 0.2 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateY(-5px) rotate(0deg);
    box-shadow: 10px 10px 0 rgba(255,255,255,0.3);
  }
`;

const TimeNumber = styled.div`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: ${p => p.$index === 2 ? 'var(--black)' : 'var(--white)'};
  line-height: 1;
  animation: ${bounce} 2s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.2}s;
`;

const TimeLabel = styled.div`
  font-size: clamp(0.7rem, 1.5vw, 0.85rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$index === 2 ? 'var(--black)' : 'var(--white)'};
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const Message = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--gray-400);
  max-width: 500px;
  margin: 0 auto;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.6s;
`;

const DateBadge = styled.div`
  display: inline-block;
  background: var(--white);
  color: var(--black);
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 700;
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
  animation: ${pulse} 2s ease-in-out infinite;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.6s ease 0.8s;
`;

function Countdown() {
  const { content, project } = useWedding();
  const countdownData = content?.countdown || {};
  
  const title = countdownData.title || 'Countdown';
  const targetDate = countdownData.target_date || project?.wedding_date || '2025-08-15';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
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
    { value: timeLeft.seconds, label: 'Sekunden' }
  ];

  return (
    <Section ref={sectionRef} id="countdown">
      {/* Floating decorations */}
      <FloatingShape $color="var(--coral)" $size="80px" $round style={{ top: '10%', left: '5%' }} $duration="10s" />
      <FloatingShape $color="var(--electric)" $size="50px" style={{ top: '20%', right: '10%' }} $duration="8s" $delay="1s" />
      <FloatingShape $color="var(--yellow)" $size="40px" $round style={{ bottom: '15%', left: '15%' }} $duration="9s" $delay="2s" />
      <FloatingShape $color="var(--purple)" $size="60px" style={{ bottom: '20%', right: '5%' }} $duration="11s" $delay="0.5s" />
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>⏰ Save the Date</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <CountdownGrid>
          {timeUnits.map((unit, index) => (
            <TimeCard key={unit.label} $index={index} $visible={visible}>
              <TimeNumber $index={index}>
                {String(unit.value).padStart(2, '0')}
              </TimeNumber>
              <TimeLabel $index={index}>{unit.label}</TimeLabel>
            </TimeCard>
          ))}
        </CountdownGrid>
        
        <Message $visible={visible}>
          Wir können es kaum erwarten, diesen besonderen Tag mit euch zu feiern!
        </Message>
        
        <DateBadge $visible={visible}>
          📅 {formattedDate}
        </DateBadge>
      </Container>
    </Section>
  );
}

export default Countdown;
