import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 157, 131, 0.4); }
  50% { transform: scale(1.02); box-shadow: 0 0 0 15px rgba(139, 157, 131, 0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

const countUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
  position: relative;
  overflow: hidden;
`;

// Decorative Background
const BgDecor = styled.div`
  position: absolute;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--sage-muted) 0%, transparent 70%);
  top: ${p => p.top};
  left: ${p => p.left};
  right: ${p => p.right};
  pointer-events: none;
  animation: ${float} ${p => p.duration || 8}s ease-in-out infinite;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 4rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  &::before, &::after {
    content: '';
    width: 40px;
    height: 1px;
    background: var(--sage);
  }
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.8;
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 400px) {
    gap: 1rem;
  }
`;

const TimeUnit = styled.div`
  position: relative;
  opacity: ${p => p.visible ? 1 : 0};
  transform: scale(${p => p.visible ? 1 : 0.8});
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: ${p => p.index * 0.1}s;
`;

const CircleWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
  
  @media (max-width: 400px) {
    width: 100px;
    height: 100px;
  }
`;

const CircleBg = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--cream);
  border: 2px solid rgba(139, 157, 131, 0.2);
`;

const CircleProgress = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  
  circle {
    fill: none;
    stroke-width: 4;
    stroke-linecap: round;
    
    &.bg {
      stroke: rgba(139, 157, 131, 0.1);
    }
    
    &.progress {
      stroke: var(--sage);
      stroke-dasharray: ${p => p.circumference};
      stroke-dashoffset: ${p => p.circumference - (p.percent / 100) * p.circumference};
      transition: stroke-dashoffset 1s ease;
    }
  }
`;

const CircleContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${p => p.animate ? pulse : 'none'} 2s ease-in-out infinite;
`;

const Number = styled.span`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  color: var(--forest);
  line-height: 1;
  overflow: hidden;
  
  span {
    display: inline-block;
    animation: ${countUp} 0.6s ease forwards;
    animation-delay: ${p => p.delay || 0}s;
  }
`;

const Label = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-top: 0.25rem;
`;

// Decorative Element
const LeafIcon = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  opacity: 0.4;
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${p => p.delay || 0}s;
  
  svg {
    width: 100%;
    height: 100%;
    fill: var(--sage);
  }
`;

const Message = styled.div`
  padding: 2rem;
  background: var(--cream);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--sage-light);
  max-width: 600px;
  margin: 0 auto;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.5s;
  
  p {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-style: italic;
    color: var(--text);
    line-height: 1.7;
    
    .emoji {
      font-style: normal;
      margin: 0 0.25rem;
    }
  }
`;

// Rotating Ring Decoration
const RotatingRing = styled.div`
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1px dashed rgba(139, 157, 131, 0.2);
  animation: ${rotate} 60s linear infinite;
  
  &::before {
    content: '🌿';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 0.8rem;
  }
`;

// SVG
const LeafSVG = () => (
  <svg viewBox="0 0 24 24">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Countdown({
  weddingDate = '2025-06-21T15:00:00',
  message = 'Bald beginnt unser gemeinsames Abenteuer – und wir können es kaum erwarten, es mit euch zu teilen.',
}) {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const sectionRef = useRef(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Countdown Timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const wedding = new Date(weddingDate).getTime();
      const now = new Date().getTime();
      const diff = wedding - now;

      if (diff > 0) {
        return {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Tage', max: 365, emoji: '📅' },
    { value: timeLeft.hours, label: 'Stunden', max: 24, emoji: '⏰' },
    { value: timeLeft.minutes, label: 'Minuten', max: 60, emoji: '⌛' },
    { value: timeLeft.seconds, label: 'Sekunden', max: 60, emoji: '💫' },
  ];

  const circumference = 2 * Math.PI * 68; // radius 68

  return (
    <Section ref={sectionRef} id="countdown">
      <BgDecor size={400} top="-100px" left="-100px" duration={12} />
      <BgDecor size={300} top="50%" right="-80px" duration={10} />
      
      <Container>
        <Header visible={visible}>
          <Eyebrow>Countdown</Eyebrow>
          <Title>Es wird Zeit</Title>
          <Subtitle>Jeder Moment bringt uns unserem großen Tag näher</Subtitle>
        </Header>

        <CountdownGrid>
          {timeUnits.map((unit, i) => (
            <TimeUnit key={unit.label} index={i} visible={visible}>
              <CircleWrapper>
                <CircleBg />
                <CircleProgress 
                  viewBox="0 0 150 150" 
                  circumference={circumference}
                  percent={(unit.value / unit.max) * 100}
                >
                  <circle className="bg" cx="75" cy="75" r="68" />
                  <circle className="progress" cx="75" cy="75" r="68" />
                </CircleProgress>
                <CircleContent animate={i === 3}>
                  <Number delay={0.3 + i * 0.1}>
                    <span>{String(unit.value).padStart(2, '0')}</span>
                  </Number>
                  <Label>{unit.label}</Label>
                </CircleContent>
                <RotatingRing />
                <LeafIcon delay={i * 0.5}>
                  <LeafSVG />
                </LeafIcon>
              </CircleWrapper>
            </TimeUnit>
          ))}
        </CountdownGrid>

        <Message visible={visible}>
          <p>
            <span className="emoji">🌸</span>
            {message}
            <span className="emoji">🌿</span>
          </p>
        </Message>
      </Container>
    </Section>
  );
}

export default Countdown;
