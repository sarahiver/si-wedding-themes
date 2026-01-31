// LoadingScreen.js - Contemporary Theme
// Colorful, playful with geometric shapes
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(5deg); }
  50% { transform: translate(0, -20px) rotate(0deg); }
  75% { transform: translate(-10px, -10px) rotate(-5deg); }
`;

const scaleIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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
  overflow: hidden;
  
  &.fade-out {
    animation: ${fadeOut} 0.6s ease forwards;
  }
`;

// Floating geometric shapes
const Shape = styled.div`
  position: absolute;
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s;
`;

const Square = styled(Shape)`
  width: ${p => p.$size || 60}px;
  height: ${p => p.$size || 60}px;
  background: ${p => p.$color || '#FFE566'};
  border: 3px solid #1a1a1a;
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  animation: ${scaleIn} 0.5s ease forwards, ${float} 4s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s, ${p => (p.$delay || 0) + 0.5}s;
  opacity: 0;
`;

const Circle = styled(Shape)`
  width: ${p => p.$size || 50}px;
  height: ${p => p.$size || 50}px;
  background: ${p => p.$color || '#4ECDC4'};
  border-radius: 50%;
  border: 3px solid #1a1a1a;
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  bottom: ${p => p.$bottom};
  animation: ${scaleIn} 0.5s ease forwards, ${float} 3s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s, ${p => (p.$delay || 0) + 0.5}s;
  opacity: 0;
`;

const HalfCircle = styled(Shape)`
  width: ${p => p.$size || 80}px;
  height: ${p => (p.$size || 80) / 2}px;
  background: ${p => p.$color || '#FF6B6B'};
  border-radius: ${p => p.$size || 80}px ${p => p.$size || 80}px 0 0;
  border: 3px solid #1a1a1a;
  border-bottom: none;
  top: ${p => p.$top};
  right: ${p => p.$right};
  animation: ${scaleIn} 0.5s ease forwards, ${float} 5s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s, ${p => (p.$delay || 0) + 0.5}s;
  opacity: 0;
  transform-origin: bottom center;
`;

const ContentWrapper = styled.div`
  text-align: center;
  z-index: 10;
`;

const NameWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Name = styled.div`
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  color: ${p => p.$color || '#FF6B6B'};
  line-height: 1;
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: ${p => p.$delay || 0}s;
  opacity: 0;
  
  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }
`;

const Ampersand = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 6vw, 3rem);
  font-style: italic;
  color: #999;
  margin: 0.5rem 0;
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
`;

const InfoBoxes = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
  padding: 0 1rem;
`;

const InfoBox = styled.div`
  background: ${p => p.$bg || '#FFE566'};
  border: 3px solid #1a1a1a;
  padding: 0.75rem 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${scaleIn} 0.5s ease forwards;
  animation-delay: ${p => p.$delay || 0}s;
  opacity: 0;
`;

const LoadingBar = styled.div`
  width: 200px;
  height: 8px;
  background: #e8e4df;
  border: 2px solid #1a1a1a;
  margin-top: 3rem;
  overflow: hidden;
  animation: ${scaleIn} 0.5s ease forwards;
  animation-delay: 0.8s;
  opacity: 0;
`;

const LoadingFill = styled.div`
  height: 100%;
  background: #FF6B6B;
  width: ${p => p.$progress}%;
  transition: width 0.2s ease;
`;

const LoadingText = styled.div`
  margin-top: 1rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: 0.9s;
  opacity: 0;
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
        const increment = isDataReady ? 12 : 5;
        return Math.min(prev + Math.random() * increment + 3, 100);
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
    <Container className={fadeOutState ? 'fade-out' : ''}>
      {/* Decorative shapes */}
      <Square $size={50} $color="#FFE566" $top="15%" $right="20%" $delay={0.1} />
      <Circle $size={40} $color="#4ECDC4" $top="25%" $left="15%" $delay={0.2} />
      <HalfCircle $size={70} $color="#FF6B6B" $top="10%" $right="35%" $delay={0.3} />
      <Circle $size={60} $color="#FFE566" $bottom="20%" $left="20%" $delay={0.4} />
      <Square $size={40} $color="#4ECDC4" $top="60%" $right="15%" $delay={0.5} />
      
      <ContentWrapper>
        <NameWrapper>
          <Name $color="#FF6B6B" $delay={0.2}>SOPHIE</Name>
          <Ampersand>&</Ampersand>
          <Name $color="#1a1a1a" $delay={0.5}>MAX</Name>
        </NameWrapper>
        
        <InfoBoxes>
          <InfoBox $bg="#FFE566" $delay={0.6}>
            📅 Wird geladen...
          </InfoBox>
          <InfoBox $bg="#4ECDC4" $delay={0.7}>
            📍 Einen Moment
          </InfoBox>
        </InfoBoxes>
        
        <LoadingBar>
          <LoadingFill $progress={progress} />
        </LoadingBar>
        <LoadingText>{Math.round(progress)}%</LoadingText>
      </ContentWrapper>
    </Container>
  );
}

export default LoadingScreen;
