// Contemporary Countdown - POPPIG mit Progress Bars
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS - Viel mehr Bewegung!
// ============================================
const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -20px) rotate(10deg); }
  50% { transform: translate(-10px, -35px) rotate(-5deg); }
  75% { transform: translate(20px, -15px) rotate(15deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-20px, 15px) rotate(-15deg); }
  66% { transform: translate(15px, 25px) rotate(10deg); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-15px) scale(1.05); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 8px 8px 0 rgba(255,255,255,0.3); }
  50% { transform: scale(1.02); box-shadow: 12px 12px 0 rgba(255,255,255,0.4); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const progressPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const Section = styled.section`
  padding: clamp(5rem, 12vh, 10rem) 2rem;
  background: var(--black);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 107, 107, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(155, 93, 229, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const FloatingCircle = styled.div`
  position: absolute;
  width: ${p => p.$size || '80px'};
  height: ${p => p.$size || '80px'};
  background: ${p => p.$color || 'var(--coral)'};
  border: 4px solid var(--white);
  border-radius: 50%;
  opacity: 0.25;
  animation: ${float1} ${p => p.$duration || '12s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  
  @media (max-width: 768px) {
    width: calc(${p => p.$size || '80px'} * 0.5);
    height: calc(${p => p.$size || '80px'} * 0.5);
    opacity: 0.15;
  }
`;

const FloatingSquare = styled.div`
  position: absolute;
  width: ${p => p.$size || '60px'};
  height: ${p => p.$size || '60px'};
  background: ${p => p.$color || 'var(--yellow)'};
  border: 4px solid var(--white);
  opacity: 0.2;
  animation: ${float2} ${p => p.$duration || '10s'} ease-in-out infinite, 
             ${wiggle} 3s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SpinningShape = styled.div`
  position: absolute;
  width: ${p => p.$size || '50px'};
  height: ${p => p.$size || '50px'};
  border: 4px solid ${p => p.$color || 'var(--electric)'};
  opacity: 0.3;
  animation: ${spin} ${p => p.$duration || '20s'} linear infinite;
  
  @media (max-width: 768px) {
    opacity: 0.15;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  animation: ${p => p.$visible ? wiggle : 'none'} 2s ease-in-out infinite;
`;

const Title = styled.h2`
  font-size: clamp(3rem, 10vw, 5rem);
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
  gap: 1.5rem;
  margin-bottom: 4rem;
  
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const colors = [
  { bg: 'var(--coral)', text: 'var(--white)', bar: 'var(--white)' },
  { bg: 'var(--electric)', text: 'var(--black)', bar: 'var(--black)' },
  { bg: 'var(--yellow)', text: 'var(--black)', bar: 'var(--black)' },
  { bg: 'var(--purple)', text: 'var(--white)', bar: 'var(--white)' }
];

const TimeCard = styled.div`
  background: ${p => colors[p.$index % colors.length].bg};
  border: 4px solid var(--white);
  box-shadow: 8px 8px 0 rgba(255,255,255,0.3);
  padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 2vw, 1.5rem);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '50px'}) rotate(${p => p.$visible ? 0 : (p.$index % 2 === 0 ? -8 : 8)}deg);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${p => 0.2 + p.$index * 0.1}s;
  animation: ${p => p.$visible ? pulse : 'none'} 3s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.5}s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px) rotate(0deg) scale(1.05);
    box-shadow: 12px 12px 0 rgba(255,255,255,0.5);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: ${shimmer} 3s ease-in-out infinite;
    animation-delay: ${p => p.$index * 0.3}s;
  }
`;

const TimeNumber = styled.div`
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  color: ${p => colors[p.$index % colors.length].text};
  line-height: 1;
  animation: ${bounce} 2s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.15}s;
  position: relative;
  z-index: 1;
`;

const TimeLabel = styled.div`
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => colors[p.$index % colors.length].text};
  opacity: 0.8;
  margin-top: 0.75rem;
  position: relative;
  z-index: 1;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
  position: relative;
  z-index: 1;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid ${p => colors[p.$index % colors.length].text};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${p => colors[p.$index % colors.length].bar};
  width: ${p => p.$progress}%;
  transition: width 0.3s ease;
  animation: ${progressPulse} 1s ease-in-out infinite;
`;

const ProgressLabel = styled.div`
  font-size: 0.6rem;
  font-weight: 700;
  color: ${p => colors[p.$index % colors.length].text};
  opacity: 0.6;
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Message = styled.p`
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: var(--gray-300);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.7s;
`;

const DateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: var(--white);
  color: var(--black);
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  font-weight: 700;
  padding: 1.25rem 2.5rem;
  border: 4px solid var(--black);
  box-shadow: 8px 8px 0 var(--coral);
  margin-top: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease 0.9s;
  animation: ${p => p.$visible ? wiggle : 'none'} 4s ease-in-out infinite;
  
  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0 var(--coral);
  }
  
  .emoji {
    font-size: 1.5em;
    animation: ${bounce} 1.5s ease-in-out infinite;
  }
`;

// ============================================
// COMPONENT
// ============================================
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
      { threshold: 0.15 }
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
    { value: timeLeft.days, label: 'Tage', progress: progress.days, info: 'verstrichen' },
    { value: timeLeft.hours, label: 'Stunden', progress: progress.hours, info: 'des Tages' },
    { value: timeLeft.minutes, label: 'Minuten', progress: progress.minutes, info: 'der Stunde' },
    { value: timeLeft.seconds, label: 'Sekunden', progress: progress.seconds, info: 'der Minute' }
  ];

  return (
    <Section ref={sectionRef} id="countdown">
      <FloatingCircle $color="var(--coral)" $size="120px" style={{ top: '5%', left: '3%' }} $duration="14s" />
      <FloatingCircle $color="var(--electric)" $size="80px" style={{ top: '15%', right: '8%' }} $duration="11s" $delay="1s" />
      <FloatingCircle $color="var(--pink)" $size="60px" style={{ bottom: '20%', left: '8%' }} $duration="13s" $delay="2s" />
      <FloatingCircle $color="var(--purple)" $size="100px" style={{ bottom: '10%', right: '5%' }} $duration="12s" $delay="0.5s" />
      
      <FloatingSquare $color="var(--yellow)" $size="70px" style={{ top: '25%', left: '12%' }} $duration="10s" $delay="1.5s" />
      <FloatingSquare $color="var(--coral)" $size="50px" style={{ bottom: '30%', right: '15%' }} $duration="9s" $delay="2.5s" />
      
      <SpinningShape $color="var(--electric)" $size="80px" style={{ top: '40%', left: '5%' }} $duration="25s" />
      <SpinningShape $color="var(--yellow)" $size="60px" style={{ top: '60%', right: '8%' }} $duration="20s" />
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>⏰ Save the Date ⏰</Eyebrow>
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
                <ProgressLabel $index={index}>{unit.progress}% {unit.info}</ProgressLabel>
              </ProgressContainer>
            </TimeCard>
          ))}
        </CountdownGrid>
        
        <Message $visible={visible}>
          Wir koennen es kaum erwarten, diesen besonderen Tag mit euch zu feiern!
        </Message>
        
        <DateBadge $visible={visible}>
          <span className="emoji">📅</span>
          {formattedDate}
        </DateBadge>
      </Container>
    </Section>
  );
}

export default Countdown;
