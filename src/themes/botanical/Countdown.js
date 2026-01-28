import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 6rem 2rem;
  background: var(--cream);
  position: relative;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  opacity: 0.1;
  pointer-events: none;
  animation: ${float} ${p => p.$duration || 6}s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s;
  
  svg { width: 100%; height: 100%; fill: var(--sage); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 400;
  font-style: italic;
  color: var(--forest);
`;

const CountdownGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 600px) { gap: 1rem; }
`;

const CountdownItem = styled.div`
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$delay}s;
`;

const Number = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 400;
  color: var(--sage);
  line-height: 1;
  margin-bottom: 0.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--sage-light), transparent);
  }
`;

const Label = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-top: 0.75rem;
`;

const Ornament = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.8s ease;
  transition-delay: 0.6s;
  
  .line {
    width: 50px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--sage-light), transparent);
  }
  
  .leaf {
    width: 20px;
    height: 20px;
    fill: var(--sage);
  }
`;

const LeafSVG = () => (
  <svg viewBox="0 0 24 24" className="leaf">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

function Countdown({ weddingDate = '2025-08-15T14:00:00', title = '', showSeconds = true }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(weddingDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const displayTitle = title || 'Noch so viele Tage bis zum großen Tag';

  return (
    <Section ref={sectionRef} id="countdown">
      <FloatingElement $duration={8} $delay={0} style={{ top: '20%', left: '10%', width: 60, height: 60 }}>
        <LeafSVG />
      </FloatingElement>
      <FloatingElement $duration={10} $delay={2} style={{ top: '30%', right: '15%', width: 40, height: 40 }}>
        <LeafSVG />
      </FloatingElement>
      
      <Container>
        <Header $visible={visible}>
          <Title>{displayTitle}</Title>
        </Header>
        
        <CountdownGrid>
          <CountdownItem $visible={visible} $delay={0.1}>
            <Number>{timeLeft.days}</Number>
            <Label>Tage</Label>
          </CountdownItem>
          <CountdownItem $visible={visible} $delay={0.2}>
            <Number>{timeLeft.hours}</Number>
            <Label>Stunden</Label>
          </CountdownItem>
          <CountdownItem $visible={visible} $delay={0.3}>
            <Number>{timeLeft.minutes}</Number>
            <Label>Minuten</Label>
          </CountdownItem>
          {showSeconds && (
            <CountdownItem $visible={visible} $delay={0.4}>
              <Number>{timeLeft.seconds}</Number>
              <Label>Sekunden</Label>
            </CountdownItem>
          )}
        </CountdownGrid>
        
        <Ornament $visible={visible}>
          <div className="line" />
          <LeafSVG />
          <div className="line" />
        </Ornament>
      </Container>
    </Section>
  );
}

export default Countdown;
