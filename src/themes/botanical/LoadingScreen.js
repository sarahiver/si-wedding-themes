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
  transition: opacity 0.6s ease;
  
  ${p => p.$loaded && `
    animation: ${fadeOut} 0.6s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const MonsteraContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

// Grayscale base layer
const MonsteraGray = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(100%) brightness(0.4);
`;

// Color layer with clip mask based on progress
const MonsteraColor = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.85) saturate(1.1);
  clip-path: ${p => `inset(${100 - p.$progress}% 0 0 0)`};
  transition: clip-path 0.3s ease;
`;

const LoadingText = styled.p`
  margin-top: 2rem;
  font-family: var(--font-body, 'Montserrat', sans-serif);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

const ProgressText = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-family: var(--font-display, 'Cormorant Garamond', serif);
  font-size: 1.2rem;
  color: rgba(255, 255, 255, ${p => 0.3 + (p.$progress / 100) * 0.5});
  transition: color 0.3s ease;
`;

const MONSTERA_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/w_400,q_auto,f_auto/v1769789866/pngwing.com_4_ugo8hl.png';

function LoadingScreen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate towards the end
        const increment = prev < 70 ? Math.random() * 15 + 5 : Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setLoaded(true);
        if (onLoadComplete) {
          setTimeout(onLoadComplete, 600);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoadComplete]);

  return (
    <LoadingContainer $loaded={loaded}>
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
