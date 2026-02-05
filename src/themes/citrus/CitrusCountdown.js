// src/themes/citrus/CitrusCountdown.js
// Countdown with animated citrus slices
import React, { useState, useEffect, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { LimeSlice } from './components/Citrus3D';
import { colors, fonts } from './GlobalStyles';

// ============================================
// COUNTDOWN LOGIC
// ============================================
const calculateTimeLeft = (targetDate) => {
  const difference = new Date(targetDate) - new Date();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

// ============================================
// 3D SCENE FOR BACKGROUND
// ============================================
function SliceScene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <LimeSlice position={[-3, 0, 0]} scale={1.2} rotation={[0.2, 0.1, 0]} />
      <LimeSlice position={[3, 0.5, -1]} scale={0.8} rotation={[-0.1, 0.3, 0.2]} />
      <LimeSlice position={[0, -2, -2]} scale={0.6} rotation={[0.3, 0.2, 0.1]} />
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
const CitrusCountdown = ({ targetDate = '2026-08-15T14:00:00', title = 'Bis zum großen Tag' }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Tage' },
    { value: timeLeft.hours, label: 'Stunden' },
    { value: timeLeft.minutes, label: 'Minuten' },
    { value: timeLeft.seconds, label: 'Sekunden' }
  ];

  return (
    <SectionWrapper id="countdown">
      {/* 3D Background */}
      <CanvasBackground>
        <Canvas>
          <Suspense fallback={null}>
            <SliceScene />
          </Suspense>
        </Canvas>
      </CanvasBackground>

      <Container>
        <SectionTitle>{title}</SectionTitle>

        <CountdownGrid>
          {timeUnits.map((unit, index) => (
            <CountdownItem key={unit.label} $delay={index * 0.1}>
              <NumberWrapper>
                <Number>{String(unit.value).padStart(2, '0')}</Number>
                <SliceDecor />
              </NumberWrapper>
              <Label>{unit.label}</Label>
            </CountdownItem>
          ))}
        </CountdownGrid>

        <Tagline>
          <span>Wir können es kaum erwarten</span>
          <HeartIcon>🍋</HeartIcon>
        </Tagline>
      </Container>

      {/* Decorative Elements */}
      <DecoLeaf $position="left" />
      <DecoLeaf $position="right" />
    </SectionWrapper>
  );
};

export default CitrusCountdown;

// ============================================
// ANIMATIONS
// ============================================
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const SectionWrapper = styled.section`
  position: relative;
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: ${colors.warmWhite};
  overflow: hidden;
`;

const CanvasBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: ${fonts.heading};
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  font-style: italic;
  color: ${colors.charcoal};
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.8s ease forwards;
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const CountdownItem = styled.div`
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: ${p => p.$delay}s;
  opacity: 0;
`;

const NumberWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Number = styled.span`
  display: block;
  font-family: ${fonts.heading};
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 600;
  color: ${colors.leafGreen};
  line-height: 1;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SliceDecor = styled.div`
  position: absolute;
  top: -10px;
  right: -15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    ${colors.lime} 0deg 36deg,
    ${colors.cream} 36deg 72deg,
    ${colors.lime} 72deg 108deg,
    ${colors.cream} 108deg 144deg,
    ${colors.lime} 144deg 180deg,
    ${colors.cream} 180deg 216deg,
    ${colors.lime} 216deg 252deg,
    ${colors.cream} 252deg 288deg,
    ${colors.lime} 288deg 324deg,
    ${colors.cream} 324deg 360deg
  );
  border: 3px solid ${colors.leafGreen};
  animation: ${spin} 10s linear infinite;

  @media (max-width: 600px) {
    width: 20px;
    height: 20px;
    top: -5px;
    right: -10px;
  }
`;

const Label = styled.p`
  font-family: ${fonts.body};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.lime};
  margin-top: 0.5rem;
`;

const Tagline = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: ${fonts.accent};
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  color: ${colors.charcoal};
  margin-top: 3rem;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const HeartIcon = styled.span`
  font-size: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: 150px;
  height: 200px;
  background: ${colors.leafGreen};
  opacity: 0.1;
  clip-path: ellipse(40% 50% at 50% 50%);
  transform: rotate(${p => p.$position === 'left' ? '-30deg' : '30deg'});

  ${p => p.$position === 'left' ? `
    left: -50px;
    top: 20%;
  ` : `
    right: -50px;
    bottom: 20%;
  `}

  @media (max-width: 768px) {
    display: none;
  }
`;
