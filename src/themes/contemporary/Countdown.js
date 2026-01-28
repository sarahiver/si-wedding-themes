// Contemporary Countdown - Mit Progress Bars, ausbalanciert
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const float = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -10px); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--black);
  position: relative;
  overflow: hidden;
`;

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
  margin-bottom: 0.75rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease 0.1s;
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const TimeCard = styled.div`
  background: ${p => colors[p.$index % colors.length]};
  border: 3px solid var(--white);
  box-shadow: 6px 6px 0 rgba(255,255,255,0.2);
  padding: clamp(1.25rem, 3vw, 2rem);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.5s ease ${p => 0.2 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 8px 8px 0 rgba(255,255,255,0.3);
  }
`;

const TimeNumber = styled.div`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  color: ${p => p.$index === 2 ? 'var(--black)' : 'var(--white)'};
  line-height: 1;
  animation: ${bounce} 2.5s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.2}s;
`;

const TimeLabel = styled.div`
  font-size: clamp(0.65rem, 1.2vw, 0.8rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$index === 2 ? 'var(--black)' : 'var(--white)'};
  opacity: 0.85;
  margin-top: 0.5rem;
`;

const ProgressContainer = styled.div`
  margin-top: 0.75rem;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid ${p => p.$index === 2 ? 'var(--black)' : 'var(--white)'};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${p => p.$index === 2 ? 'var(--black)' : 'var(--white)'};
  width: ${p => p.$progress}%;
  transition: width 0.5s ease;
`;

const ProgressLabel = styled.div`
  font-size: 0.55rem;
  font-weight: 600;
  color: ${p => p.$index === 2 ? 'var(--black)' : 'var(--white)'};
  opacity: 0.6;
  margin-top: 0.25rem;
`;

const Message = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
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
  animation: ${pulse} 3s ease-in-out infinite;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.6s ease 0.8s;
`;

function Countdown() {
  const { content, project } = useWedding();
  const countdownData = content?.countdown || {};
  
  const title = countdownData.title || 'Countdown';
  const targetDate = countdownData.target_date || project?.wedding_date || '2025-08-15';
  const startDate = '2026-01-01';
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
      const start = new Date(startDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      const totalDiff = target - start;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const totalDays = Math.floor(totalDiff / (1000 * 60 * 60 * 24));
        const daysElapsed = totalDays - days;
        
        setTimeLeft({ days, hours, minutes, seconds });
        setProgress({
          days: Math.min(100, Math.round((daysElapsed / totalDays) * 100)),
          hours: Math.round(((24 - hours) / 24) * 100),
          minutes: Math.round(((60 - minutes) / 60) * 100),
          seconds: Math.round(((60 - seconds) / 60) * 100)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, startDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const timeUnits = [
    { value: timeLeft.days, label: 'Tage', progress: progress.days },
    { value: timeLeft.hours, label: 'Stunden', progress: progress.hours },
    { value: timeLeft.minutes, label: 'Minuten', progress: progress.minutes },
    { value: timeLeft.seconds, label: 'Sekunden', progress: progress.seconds }
  ];

  return (
    <Section ref={sectionRef} id="countdown">
      <FloatingShape $color="var(--coral)" $size="80px" $round style={{ top: '10%', left: '5%' }} $duration="10s" />
      <FloatingShape $color="var(--electric)" $size="50px" style={{ top: '20%', right: '10%' }} $duration="8s" $delay="1s" />
      <FloatingShape $color="var(--yellow)" $size="40px" $round style={{ bottom: '15%', left: '15%' }} $duration="9s" $delay="2s" />
      <FloatingShape $color="var(--purple)" $size="60px" style={{ bottom: '20%', right: '5%' }} $duration="11s" $delay="0.5s" />
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Save the Date</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <CountdownGrid>
          {timeUnits.map((unit, index) => (
            <TimeCard key={unit.label} $index={index} $visible={visible}>
              <TimeNumber $index={index}>
                {String(unit.value).padStart(2, '0')}
              </TimeNumber>
              <TimeLabel $index={index}>{unit.label}</TimeLabel>
              <ProgressContainer>
                <ProgressTrack $index={index}>
                  <ProgressFill $index={index} $progress={unit.progress} />
                </ProgressTrack>
                <ProgressLabel $index={index}>{unit.progress}%</ProgressLabel>
              </ProgressContainer>
            </TimeCard>
          ))}
        </CountdownGrid>
        
        <Message $visible={visible}>
          Wir koennen es kaum erwarten, diesen besonderen Tag mit euch zu feiern!
        </Message>
        
        <DateBadge $visible={visible}>
          📅 {formattedDate}
        </DateBadge>
      </Container>
    </Section>
  );
}

export default Countdown;
