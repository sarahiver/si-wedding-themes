// LoadingScreen.js - Video Theme
// TV static/flicker effect with blue numbers
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const flicker = keyframes`
  0% { opacity: 1; }
  5% { opacity: 0.8; }
  10% { opacity: 1; }
  15% { opacity: 0.9; }
  20% { opacity: 1; }
  50% { opacity: 1; }
  55% { opacity: 0.7; }
  60% { opacity: 1; }
  80% { opacity: 1; }
  85% { opacity: 0.85; }
  90% { opacity: 1; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const noise = keyframes`
  0%, 100% { background-position: 0 0; }
  10% { background-position: -5% -10%; }
  20% { background-position: -15% 5%; }
  30% { background-position: 7% -25%; }
  40% { background-position: 20% 25%; }
  50% { background-position: -25% 10%; }
  60% { background-position: 15% 5%; }
  70% { background-position: 0 15%; }
  80% { background-position: 25% 35%; }
  90% { background-position: -10% 10%; }
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
  overflow: hidden;
  animation: ${flicker} 0.3s infinite;
  
  &.fade-out {
    animation: ${fadeOut} 0.5s ease forwards;
  }
`;

const StaticOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.08;
  pointer-events: none;
  animation: ${noise} 0.5s steps(10) infinite;
`;

const ScanLine = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.03);
  animation: ${scanline} 3s linear infinite;
  pointer-events: none;
`;

const VHSLines = styled.div`
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  animation: ${glitch} 0.3s infinite;
`;

const NumberDisplay = styled.div`
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: clamp(6rem, 20vw, 12rem);
  font-weight: 700;
  color: #00a8ff;
  text-shadow: 
    0 0 20px rgba(0, 168, 255, 0.8),
    0 0 40px rgba(0, 168, 255, 0.6),
    0 0 60px rgba(0, 168, 255, 0.4),
    2px 2px 0 #ff0040,
    -2px -2px 0 #00ff88;
  line-height: 1;
  letter-spacing: -0.05em;
  
  @media (max-width: 768px) {
    font-size: clamp(4rem, 15vw, 6rem);
  }
`;

const Percentage = styled.span`
  font-size: 0.3em;
  vertical-align: top;
  margin-left: 0.1em;
  opacity: 0.7;
`;

const StatusText = styled.div`
  margin-top: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  
  span {
    color: #00a8ff;
  }
`;

const ProgressBar = styled.div`
  width: 250px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1.5rem auto 0;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #00a8ff;
  box-shadow: 0 0 10px #00a8ff;
  width: ${p => p.$progress}%;
  transition: width 0.15s ease;
`;

const CornerMarker = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  
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

const RecIndicator = styled.div`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #ff0040;
    border-radius: 50%;
    animation: ${flicker} 1s infinite;
  }
`;

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
        const increment = isDataReady ? 10 : 4;
        return Math.min(prev + Math.random() * increment + 2, 100);
      });
    }, 80);
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
      <StaticOverlay />
      <ScanLine />
      <VHSLines />
      
      <CornerMarker className="top-left" />
      <CornerMarker className="top-right" />
      <CornerMarker className="bottom-left" />
      <CornerMarker className="bottom-right" />
      
      <RecIndicator>LOADING</RecIndicator>
      
      <ContentWrapper>
        <NumberDisplay>
          {Math.round(progress).toString().padStart(2, '0')}
          <Percentage>%</Percentage>
        </NumberDisplay>
        
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>
        
        <StatusText>
          <span>▶</span> Video wird geladen
        </StatusText>
      </ContentWrapper>
    </Container>
  );
}

export default LoadingScreen;
