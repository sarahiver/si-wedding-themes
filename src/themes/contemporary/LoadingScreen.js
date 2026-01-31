// LoadingScreen.js - Contemporary Theme
// Warm geometric neo-brutalist design
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const LoadingContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #faf8f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &.fade-out {
    animation: ${fadeOut} 0.5s ease forwards;
  }
`;

const GeometricWrapper = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterRing = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  border: 4px solid #1a1a1a;
  border-radius: 50%;
  border-top-color: #b48c64;
  border-right-color: #b48c64;
  animation: ${rotate} 2s linear infinite;
`;

const MiddleSquare = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 3px solid #1a1a1a;
  transform: rotate(45deg);
  animation: ${rotate} 4s linear infinite reverse;
`;

const InnerCircle = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  background: #b48c64;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 1.5s ease-in-out infinite;
  box-shadow: 4px 4px 0 #1a1a1a;
`;

const HeartIcon = styled.span`
  font-size: 1.5rem;
  color: white;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: #e8e4df;
  border: 2px solid #1a1a1a;
  margin-top: 3rem;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #b48c64;
  width: ${p => p.$progress}%;
  transition: width 0.3s ease;
`;

const LoadingText = styled.div`
  margin-top: 1.5rem;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 0.1em;
  animation: ${slideUp} 0.6s ease forwards;
`;

const SubText = styled.div`
  margin-top: 0.5rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #b48c64;
`;

const CornerDecor = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid #1a1a1a;
  
  &.top-left {
    top: 2rem;
    left: 2rem;
    border-right: none;
    border-bottom: none;
  }
  
  &.top-right {
    top: 2rem;
    right: 2rem;
    border-left: none;
    border-bottom: none;
  }
  
  &.bottom-left {
    bottom: 2rem;
    left: 2rem;
    border-right: none;
    border-top: none;
  }
  
  &.bottom-right {
    bottom: 2rem;
    right: 2rem;
    border-left: none;
    border-top: none;
  }
`;

const MIN_DISPLAY_TIME = 2000;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const [progress, setProgress] = useState(0);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const baseIncrement = isDataReady ? 12 : 6;
        const variance = isDataReady ? 8 : 4;
        const increment = prev < 70 
          ? Math.random() * baseIncrement + variance 
          : Math.random() * (baseIncrement * 0.5) + (variance * 0.3);
        return Math.min(prev + increment, 100);
      });
    }, 120);

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
      setFadeOut(true);
      const timer = setTimeout(() => {
        if (onLoadComplete) onLoadComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, minTimeReached, isDataReady, onLoadComplete]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!fadeOut) {
        setFadeOut(true);
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 500);
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [fadeOut, onLoadComplete]);

  return (
    <LoadingContainer className={fadeOut ? 'fade-out' : ''}>
      <CornerDecor className="top-left" />
      <CornerDecor className="top-right" />
      <CornerDecor className="bottom-left" />
      <CornerDecor className="bottom-right" />
      
      <GeometricWrapper>
        <OuterRing />
        <MiddleSquare />
        <InnerCircle>
          <HeartIcon>♥</HeartIcon>
        </InnerCircle>
      </GeometricWrapper>
      
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>
      
      <LoadingText>Wird geladen</LoadingText>
      <SubText>{Math.round(progress)}%</SubText>
    </LoadingContainer>
  );
}

export default LoadingScreen;
