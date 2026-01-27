import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const expand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--black);
  position: relative;
  overflow: hidden;
`;

const BigNumber = styled.div`
  position: absolute;
  font-size: clamp(20rem, 50vw, 40rem);
  font-weight: 700;
  color: rgba(255,255,255,0.03);
  line-height: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  white-space: nowrap;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const BarsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BarItem = styled.div`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '-30px'});
  transition: all 0.6s ease ${p => 0.2 + p.$index * 0.1}s;
`;

const BarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;
`;

const BarLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray-400);
`;

const BarValue = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${p => p.$color};
`;

const BarTrack = styled.div`
  height: 12px;
  background: var(--gray-800);
  border: 2px solid var(--gray-600);
  position: relative;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: ${p => p.$color};
  width: ${p => p.$percentage}%;
  transform-origin: left;
  transform: scaleX(0);
  ${p => p.$visible && css`animation: ${expand} 1s ease forwards ${0.3 + p.$index * 0.1}s;`}
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease 0.6s;
`;

const CTAButton = styled.a`
  display: inline-block;
  font-size: 1rem;
  font-weight: 700;
  color: var(--black);
  background: var(--yellow);
  padding: 1.25rem 3rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--coral);
    color: var(--white);
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--black);
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

function Countdown({ weddingDate = '2025-08-15T14:00:00' }) {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
    const calculateTime = () => {
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
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const bars = [
    { label: 'Tage', value: timeLeft.days, max: 365, color: colors[0] },
    { label: 'Stunden', value: timeLeft.hours, max: 24, color: colors[1] },
    { label: 'Minuten', value: timeLeft.minutes, max: 60, color: colors[2] },
    { label: 'Sekunden', value: timeLeft.seconds, max: 60, color: colors[3] },
  ];

  return (
    <Section ref={sectionRef}>
      <BigNumber>{timeLeft.days}</BigNumber>
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>⏰ Countdown</Eyebrow>
          <Title $visible={visible}>Time is ticking</Title>
        </Header>
        
        <BarsContainer>
          {bars.map((bar, i) => (
            <BarItem key={i} $index={i} $visible={visible}>
              <BarHeader>
                <BarLabel>{bar.label}</BarLabel>
                <BarValue $color={bar.color}>{String(bar.value).padStart(2, '0')}</BarValue>
              </BarHeader>
              <BarTrack>
                <BarFill $color={bar.color} $percentage={(bar.value / bar.max) * 100} $index={i} $visible={visible} />
              </BarTrack>
            </BarItem>
          ))}
        </BarsContainer>
        
        <CTASection $visible={visible}>
          <CTAButton href="#rsvp">Let's make it epic →</CTAButton>
        </CTASection>
      </Container>
    </Section>
  );
}

export default Countdown;
