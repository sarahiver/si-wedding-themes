import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
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
    animation: ${fadeOut} 0.8s ease forwards;
  }
`;

const MonsteraContainer = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  animation: ${pulse} 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
  }
`;

const MonsteraGray = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(100%) brightness(0.3);
`;

const MonsteraColor = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.85) saturate(1.1);
  clip-path: inset(${p => 100 - p.$progress}% 0 0 0);
  transition: clip-path 0.3s ease;
`;

const LoadingText = styled.p`
  margin-top: 2rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
`;

const ProgressText = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, ${p => 0.25 + (p.$progress / 100) * 0.5});
  transition: color 0.3s ease;
`;

const MONSTERA_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/w_400,q_auto,f_auto/v1769789866/pngwing.com_4_ugo8hl.png';

const MIN_DISPLAY_TIME = 2000; // Minimum 2 seconds

function LoadingScreen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);
  const [canHide, setCanHide] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [startTime] = useState(Date.now());

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 60 ? Math.random() * 12 + 5 : Math.random() * 6 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanHide(true);
    }, MIN_DISPLAY_TIME);

    return () => clearTimeout(timer);
  }, []);

  // Trigger fade out when both conditions met
  useEffect(() => {
    if (progress >= 100 && canHide) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        if (onLoadComplete) onLoadComplete();
      }, 800); // Match fade animation duration
      return () => clearTimeout(timer);
    }
  }, [progress, canHide, onLoadComplete]);

  return (
    <LoadingContainer className={fadeOut ? 'fade-out' : ''}>
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
