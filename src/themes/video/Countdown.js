// src/components/Countdown.js
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 150px 5%;
  background: #FAF8F5;
  position: relative;
  overflow: hidden;
`;

const WatermarkDate = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(8rem, 20vw, 18rem);
  font-weight: 300;
  color: rgba(184, 151, 106, 0.08);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.5);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #1A1A1A;
  margin-bottom: 15px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease 0.1s;

  span {
    font-style: italic;
  }
`;

const DateText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease 0.2s;
`;

const CountdownBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #FFFFFF;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.08);
  max-width: 700px;
  margin: 0 auto 50px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease 0.3s;

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CountdownItem = styled.div`
  padding: 40px 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  
  &:last-child {
    border-right: none;
  }

  @media (max-width: 500px) {
    &:nth-child(2) {
      border-right: none;
    }
    &:nth-child(1), &:nth-child(2) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
  }
`;

const Number = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 300;
  color: #1A1A1A;
  line-height: 1;
  margin-bottom: 10px;
`;

const Label = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #B8976A;
`;

const CTAButton = styled.a`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
  background: #B8976A;
  padding: 20px 50px;
  transition: all 0.4s ease;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease 0.4s, background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: #1A1A1A;
    transform: translateY(-3px);
  }
`;

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Wedding date - replace with actual
  const weddingDate = new Date('2025-06-21T14:00:00');
  const formattedDate = "Samstag, 21. Juni 2025";

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate - now;

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
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const padNumber = (num) => String(num).padStart(2, '0');

  return (
    <Section ref={sectionRef} id="countdown">
      <WatermarkDate>21.06.25</WatermarkDate>
      
      <Container>
        <Eyebrow $visible={isVisible}>Countdown</Eyebrow>
        <Title $visible={isVisible}>Der große <span>Moment</span></Title>
        <DateText $visible={isVisible}>{formattedDate}</DateText>

        <CountdownBox $visible={isVisible}>
          <CountdownItem>
            <Number>{timeLeft.days}</Number>
            <Label>Tage</Label>
          </CountdownItem>
          <CountdownItem>
            <Number>{padNumber(timeLeft.hours)}</Number>
            <Label>Stunden</Label>
          </CountdownItem>
          <CountdownItem>
            <Number>{padNumber(timeLeft.minutes)}</Number>
            <Label>Minuten</Label>
          </CountdownItem>
          <CountdownItem>
            <Number>{padNumber(timeLeft.seconds)}</Number>
            <Label>Sekunden</Label>
          </CountdownItem>
        </CountdownBox>

        <CTAButton href="#rsvp" $visible={isVisible}>
          Jetzt zusagen →
        </CTAButton>
      </Container>
    </Section>
  );
}

export default Countdown;
