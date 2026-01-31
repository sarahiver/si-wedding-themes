// Luxe Theme - LoadingScreen.js
// Elegant gold shimmer loading animation
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #0c0a09;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &.fade-out {
    animation: ${fadeOut} 0.8s ease forwards;
  }
  
  /* Subtle pattern overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const DiamondContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  animation: ${fadeIn} 0.6s ease forwards;
`;

const Diamond = styled.div`
  position: absolute;
  inset: 0;
  border: 1px solid rgba(212, 175, 55, 0.3);
  transform: rotate(45deg);
  
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(212, 175, 55, 0.5);
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 16px;
    border: 1px solid rgba(212, 175, 55, 0.7);
    background: rgba(212, 175, 55, 0.05);
  }
`;

const SpinningRing = styled.div`
  position: absolute;
  inset: -15px;
  border: 1px solid transparent;
  border-top-color: rgba(212, 175, 55, 0.8);
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: #d4af37;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
  }
`;

const Monogram = styled.div`
  font-family: 'Playfair Display', 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 400;
  font-style: italic;
  color: #d4af37;
  position: relative;
  z-index: 1;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const TextContainer = styled.div`
  margin-top: 3rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
`;

const Title = styled.h1`
  font-family: 'Playfair Display', 'Cormorant Garamond', serif;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: rgba(212, 175, 55, 0.6);
  margin-bottom: 1.5rem;
`;

const ProgressBar = styled.div`
  width: 180px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, 
    transparent,
    rgba(212, 175, 55, 0.5),
    #d4af37,
    rgba(212, 175, 55, 0.5),
    transparent
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s linear infinite;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem;
  font-style: italic;
  color: rgba(212, 175, 55, 0.4);
  margin-top: 1rem;
  letter-spacing: 0.1em;
`;

const Dots = styled.span`
  &::after {
    content: '...';
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
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
        const increment = isDataReady ? 12 : 5;
        return Math.min(prev + increment + Math.random() * 3, 100);
      });
    }, 120);
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
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, minTimeReached, isDataReady, onLoadComplete]);

  // Fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fadeOutActive) {
        setFadeOutActive(true);
        setTimeout(() => onLoadComplete?.(), 800);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [fadeOutActive, onLoadComplete]);

  return (
    <Container className={fadeOutActive ? 'fade-out' : ''}>
      <DiamondContainer>
        <Diamond />
        <SpinningRing />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transform: 'rotate(45deg)'
        }}>
          <Monogram style={{ transform: 'rotate(-45deg)' }}>L</Monogram>
        </div>
      </DiamondContainer>
      
      <TextContainer>
        <Title>Preparing Your Experience</Title>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>
        <ProgressText>
          {progress < 100 ? (
            <>Loading<Dots /></>
          ) : (
            'Welcome'
          )}
        </ProgressText>
      </TextContainer>
    </Container>
  );
}

export default LoadingScreen;
