// LoadingScreen.js - Botanical Glass Theme
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const LoadingContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #040604;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &.fade-out {
    animation: ${fadeOut} 0.6s ease forwards;
  }
`;

const MonsteraContainer = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
  animation: ${pulse} 2.5s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const MonsteraGray = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(100%) brightness(0.25);
`;

const MonsteraColor = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.8) saturate(1.1);
  clip-path: inset(${p => 100 - p.$progress}% 0 0 0);
  transition: clip-path 0.4s ease;
`;

const LoadingText = styled.p`
  margin-top: 2rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
`;

const ProgressText = styled.span`
  display: block;
  margin-top: 0.75rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, ${p => 0.2 + (p.$progress / 100) * 0.5});
  transition: color 0.3s ease;
`;

const MONSTERA_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/w_300,q_auto,f_auto/v1769789866/pngwing.com_4_ugo8hl.png';

const MIN_DISPLAY_TIME = 2000;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const [progress, setProgress] = useState(0);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [fadeOutState, setFadeOutState] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const baseIncrement = isDataReady ? 15 : 8;
        const variance = isDataReady ? 10 : 6;
        const increment = prev < 60 
          ? Math.random() * baseIncrement + variance 
          : Math.random() * (baseIncrement * 0.6) + (variance * 0.4);
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isDataReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeReached(true);
    }, MIN_DISPLAY_TIME);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100 && minTimeReached && isDataReady) {
      setFadeOutState(true);
      const timer = setTimeout(() => {
        if (onLoadComplete) onLoadComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, minTimeReached, isDataReady, onLoadComplete]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!fadeOutState) {
        setFadeOutState(true);
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 600);
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [fadeOutState, onLoadComplete]);

  return (
    <LoadingContainer className={fadeOutState ? 'fade-out' : ''}>
      <MonsteraContainer>
        <MonsteraGray src={MONSTERA_IMG} alt="" />
        <MonsteraColor src={MONSTERA_IMG} alt="" $progress={progress} />
      </MonsteraContainer>
      <LoadingText>Wird geladen</LoadingText>
      <ProgressText $progress={progress}>{Math.round(progress)}%</ProgressText>
    </LoadingContainer>
  );
}

export default LoadingScreen;
