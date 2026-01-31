// Video Theme - LoadingScreen.js
// Cinematic film countdown style loading animation
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

const countdownPulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
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

const lineExpand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
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
    animation: ${fadeOut} 0.8s ease forwards;
  }
  
  /* Film grain overlay */
  &::before {
    content: '';
    position: absolute;
    inset: -50%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.03;
    animation: ${filmGrain} 0.5s steps(10) infinite;
    pointer-events: none;
  }
  
  /* Vignette */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
  }
`;

const FilmReel = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  z-index: 1;
`;

const ReelCircle = styled.div`
  position: absolute;
  inset: 0;
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 50%;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(255,255,255,0.1);
  }
  
  /* Cross lines */
  &::before {
    top: 50%;
    left: 10%;
    right: 10%;
    height: 1px;
    transform: translateY(-50%);
  }
  
  &::after {
    left: 50%;
    top: 10%;
    bottom: 10%;
    width: 1px;
    transform: translateX(-50%);
  }
`;

const CountdownNumber = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bebas Neue', 'Oswald', sans-serif;
  font-size: 4rem;
  font-weight: 400;
  color: rgba(255,255,255,0.9);
  animation: ${countdownPulse} 1s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(255,255,255,0.3);
`;

const ProgressRing = styled.svg`
  position: absolute;
  inset: -5px;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  transform: rotate(-90deg);
  
  circle {
    fill: none;
    stroke-width: 2;
    
    &.bg {
      stroke: rgba(255,255,255,0.05);
    }
    
    &.progress {
      stroke: rgba(255,255,255,0.6);
      stroke-dasharray: 377;
      stroke-dashoffset: ${p => 377 - (377 * p.$progress / 100)};
      transition: stroke-dashoffset 0.3s ease;
      filter: drop-shadow(0 0 6px rgba(255,255,255,0.4));
    }
  }
`;

const Text = styled.p`
  margin-top: 2.5rem;
  font-family: 'Inter', 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  z-index: 1;
  animation: ${flicker} 3s ease-in-out infinite;
`;

const Line = styled.div`
  width: 60px;
  height: 1px;
  background: rgba(255,255,255,0.2);
  margin-top: 1.5rem;
  transform-origin: center;
  animation: ${lineExpand} 1s ease forwards;
  z-index: 1;
`;

const MIN_DISPLAY_TIME = 2000;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
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
        return Math.min(prev + increment + Math.random() * 5, 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isDataReady]);

  // Countdown (3, 2, 1)
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [countdown]);

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
      <FilmReel>
        <ReelCircle />
        <ProgressRing viewBox="0 0 120 120" $progress={progress}>
          <circle className="bg" cx="60" cy="60" r="58" />
          <circle className="progress" cx="60" cy="60" r="58" />
        </ProgressRing>
        <CountdownNumber>
          {countdown > 0 ? countdown : '▶'}
        </CountdownNumber>
      </FilmReel>
      <Text>Film wird geladen</Text>
      <Line />
    </Container>
  );
}

export default LoadingScreen;
