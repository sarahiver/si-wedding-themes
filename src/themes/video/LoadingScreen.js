// LoadingScreen.js - Video Theme
// Cinematic film countdown with dramatic reveal
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  75% { opacity: 0.95; }
`;

const countPulse = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const filmGrain = keyframes`
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1%, -1%); }
  20% { transform: translate(1%, 1%); }
  30% { transform: translate(-1%, 1%); }
  40% { transform: translate(1%, -1%); }
  50% { transform: translate(-1%, 0%); }
  60% { transform: translate(1%, 0%); }
  70% { transform: translate(0%, 1%); }
  80% { transform: translate(0%, -1%); }
  90% { transform: translate(1%, 1%); }
`;

const LoadingContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &.fade-out {
    animation: ${fadeOut} 0.8s ease forwards;
  }
`;

const FilmGrainOverlay = styled.div`
  position: absolute;
  inset: -50%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  animation: ${filmGrain} 0.5s steps(10) infinite;
`;

const VignetteOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  pointer-events: none;
`;

const CountdownWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircleRing = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 2;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: ${2 * Math.PI * 90};
  stroke-dashoffset: ${p => 2 * Math.PI * 90 * (1 - p.$progress / 100)};
  transition: stroke-dashoffset 0.3s ease;
`;

const CountdownNumber = styled.div`
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: 6rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  animation: ${countPulse} 0.5s ease forwards, ${flicker} 0.15s ease infinite;
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const PlayIcon = styled.div`
  font-size: 4rem;
  color: white;
  animation: ${countPulse} 0.5s ease forwards;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const LoadingText = styled.div`
  margin-top: 2.5rem;
  font-family: 'Inter', 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

const FilmStrip = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  
  &.top { top: 0; }
  &.bottom { bottom: 0; }
`;

const FilmHole = styled.div`
  width: 30px;
  height: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
  margin-top: 20px;
`;

const MIN_DISPLAY_TIME = 2500;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [fadeOutState, setFadeOutState] = useState(false);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const baseIncrement = isDataReady ? 10 : 5;
        const variance = isDataReady ? 6 : 3;
        const increment = Math.random() * baseIncrement + variance;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isDataReady]);

  // Countdown animation - goes 3, 2, 1, 0 (play)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeReached(true);
    }, MIN_DISPLAY_TIME);

    return () => clearTimeout(timer);
  }, []);

  // Complete loading
  useEffect(() => {
    if (progress >= 100 && minTimeReached && isDataReady && countdown === 0) {
      const timer = setTimeout(() => {
        setFadeOutState(true);
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 800);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, minTimeReached, isDataReady, countdown, onLoadComplete]);

  // Fallback
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!fadeOutState) {
        setFadeOutState(true);
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 800);
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [fadeOutState, onLoadComplete]);

  return (
    <LoadingContainer className={fadeOutState ? 'fade-out' : ''}>
      <FilmGrainOverlay />
      <VignetteOverlay />
      
      <FilmStrip className="top">
        {[...Array(12)].map((_, i) => <FilmHole key={i} />)}
      </FilmStrip>
      
      <CountdownWrapper>
        <CircleRing viewBox="0 0 200 200">
          <CircleBackground cx="100" cy="100" r="90" />
          <CircleProgress cx="100" cy="100" r="90" $progress={progress} />
        </CircleRing>
        
        {countdown > 0 ? (
          <CountdownNumber key={countdown}>{countdown}</CountdownNumber>
        ) : (
          <PlayIcon>▶</PlayIcon>
        )}
      </CountdownWrapper>
      
      <LoadingText>Film wird geladen</LoadingText>
      
      <FilmStrip className="bottom">
        {[...Array(12)].map((_, i) => <FilmHole key={i} />)}
      </FilmStrip>
    </LoadingContainer>
  );
}

export default LoadingScreen;
