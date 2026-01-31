// LoadingScreen.js - Editorial Theme
// Bold magazine typography style
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const revealText = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const expandLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #f5f5f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &.fade-out {
    animation: ${fadeOut} 0.8s ease forwards;
  }
`;

const ContentWrapper = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Eyebrow = styled.div`
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const MainText = styled.div`
  overflow: hidden;
`;

const BigText = styled.div`
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: 400;
  font-style: italic;
  color: #1a1a1a;
  line-height: 0.9;
  animation: ${revealText} 0.8s ease forwards;
  animation-delay: ${p => p.$delay || 0}s;
  
  @media (max-width: 768px) {
    font-size: clamp(3rem, 12vw, 5rem);
  }
`;

const Ampersand = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 6vw, 4rem);
  font-style: italic;
  color: #c4a77d;
  margin: 0.5rem 0;
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const AccentText = styled.div`
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 800;
  text-transform: uppercase;
  color: #c41e3a;
  letter-spacing: -0.02em;
  line-height: 0.9;
  animation: ${revealText} 0.8s ease forwards;
  animation-delay: 0.6s;
  
  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: #1a1a1a;
  margin: 2rem auto;
  transform-origin: left;
  animation: ${expandLine} 0.6s ease forwards;
  animation-delay: 0.8s;
  transform: scaleX(0);
`;

const LoadingIndicator = styled.div`
  margin-top: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #999;
  animation: ${slideUp} 0.6s ease forwards;
  animation-delay: 1s;
  opacity: 0;
`;

const ProgressDots = styled.span`
  &::after {
    content: '';
    animation: dots 1.5s infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }
`;

const MIN_DISPLAY_TIME = 2500;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [fadeOutState, setFadeOutState] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeReached(true);
    }, MIN_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimeReached && isDataReady) {
      setFadeOutState(true);
      const timer = setTimeout(() => {
        if (onLoadComplete) onLoadComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [minTimeReached, isDataReady, onLoadComplete]);

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
    <Container className={fadeOutState ? 'fade-out' : ''}>
      <ContentWrapper>
        <Eyebrow>Willkommen zur Hochzeit</Eyebrow>
        <MainText>
          <BigText $delay={0.3}>The</BigText>
          <Ampersand>&</Ampersand>
          <AccentText>Wedding</AccentText>
        </MainText>
        <Divider />
        <LoadingIndicator>
          Wird geladen<ProgressDots />
        </LoadingIndicator>
      </ContentWrapper>
    </Container>
  );
}

export default LoadingScreen;
