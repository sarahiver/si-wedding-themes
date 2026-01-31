// Contemporary Theme - LoadingScreen.js
// Warm geometric modern loading animation
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.95); opacity: 0.7; }
`;

const drawCircle = keyframes`
  from { stroke-dashoffset: 283; }
  to { stroke-dashoffset: 0; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #faf8f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &.fade-out {
    animation: ${fadeOut} 0.7s ease forwards;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  animation: ${fadeIn} 0.6s ease forwards;
`;

const GeometricShape = styled.div`
  position: absolute;
  inset: 0;
  
  /* Outer circle */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid rgba(180, 140, 100, 0.2);
    border-radius: 50%;
  }
  
  /* Inner square rotated */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    border: 1px solid rgba(180, 140, 100, 0.3);
    transform: translate(-50%, -50%) rotate(45deg);
  }
`;

const SpinningCircle = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: ${rotate} 3s linear infinite;
  
  circle {
    fill: none;
    stroke: #b48c64;
    stroke-width: 1;
    stroke-linecap: round;
    stroke-dasharray: 20 10;
  }
`;

const ProgressCircle = styled.svg`
  position: absolute;
  inset: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  transform: rotate(-90deg);
  
  circle {
    fill: none;
    stroke-width: 2;
    
    &.bg {
      stroke: rgba(180, 140, 100, 0.1);
    }
    
    &.progress {
      stroke: #b48c64;
      stroke-dasharray: 283;
      stroke-dashoffset: ${p => 283 - (283 * p.$progress / 100)};
      stroke-linecap: round;
      transition: stroke-dashoffset 0.3s ease;
    }
  }
`;

const CenterDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #b48c64;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const TextContainer = styled.div`
  margin-top: 2.5rem;
  text-align: center;
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #5a4a3a;
  margin: 0;
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #b48c64;
  margin-top: 0.75rem;
`;

const ProgressText = styled.div`
  margin-top: 2rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(90, 74, 58, 0.5);
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const MIN_DISPLAY_TIME = 2000;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const [progress, setProgress] = useState(0);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [fadeOutActive, setFadeOutActive] = useState(false);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = isDataReady ? 12 : 6;
        return Math.min(prev + increment + Math.random() * 4, 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isDataReady]);

  // Minimum display time
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeReached(true), MIN_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, []);

  // Complete
  useEffect(() => {
    if (progress >= 100 && minTimeReached && isDataReady) {
      setFadeOutActive(true);
      const timer = setTimeout(() => {
        if (onLoadComplete) onLoadComplete();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [progress, minTimeReached, isDataReady, onLoadComplete]);

  // Fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fadeOutActive) {
        setFadeOutActive(true);
        setTimeout(() => onLoadComplete?.(), 700);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [fadeOutActive, onLoadComplete]);

  return (
    <Container className={fadeOutActive ? 'fade-out' : ''}>
      <LogoContainer>
        <GeometricShape />
        <SpinningCircle viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="58" />
        </SpinningCircle>
        <ProgressCircle viewBox="0 0 100 100" $progress={progress}>
          <circle className="bg" cx="50" cy="50" r="45" />
          <circle className="progress" cx="50" cy="50" r="45" />
        </ProgressCircle>
        <CenterDot />
      </LogoContainer>
      
      <TextContainer>
        <Title>Loading</Title>
        <Subtitle>Please wait</Subtitle>
      </TextContainer>
      
      <ProgressText>{Math.round(progress)}%</ProgressText>
    </Container>
  );
}

export default LoadingScreen;
