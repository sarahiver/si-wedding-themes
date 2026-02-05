// LoadingScreen.js - Video Theme
// Clean, minimal with subtle blue accent
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &.fade-out {
    animation: ${fadeOut} 0.5s ease forwards;
  }
`;

const ContentWrapper = styled.div`
  text-align: center;
`;

const NumberDisplay = styled.div`
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: clamp(5rem, 18vw, 10rem);
  font-weight: 200;
  color: #00a8ff;
  line-height: 1;
  letter-spacing: -0.03em;
  text-shadow: 0 0 40px rgba(0, 168, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: clamp(4rem, 15vw, 6rem);
  }
`;

const Percentage = styled.span`
  font-size: 0.25em;
  font-weight: 300;
  opacity: 0.5;
  margin-left: 0.1em;
`;

const ProgressLine = styled.div`
  width: 120px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 2rem auto 0;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #00a8ff;
  width: ${p => p.$progress}%;
  transition: width 0.2s ease;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
`;

const StatusText = styled.div`
  margin-top: 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const MIN_DISPLAY_TIME = 1500;

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
        const increment = isDataReady ? 12 : 5;
        return Math.min(prev + Math.random() * increment + 2, 100);
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
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, minTimeReached, isDataReady, onLoadComplete]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!fadeOutState) {
        setFadeOutState(true);
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 500);
      }
    }, 5000);
    return () => clearTimeout(fallbackTimer);
  }, [fadeOutState, onLoadComplete]);

  return (
    <Container className={fadeOutState ? 'fade-out' : ''}>
      <ContentWrapper>
        <NumberDisplay>
          {Math.round(progress)}
          <Percentage>%</Percentage>
        </NumberDisplay>
        
        <ProgressLine>
          <ProgressFill $progress={progress} />
        </ProgressLine>
        
        <StatusText>Video wird geladen</StatusText>
      </ContentWrapper>
    </Container>
  );
}

export default LoadingScreen;
