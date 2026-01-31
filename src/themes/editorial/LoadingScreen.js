// Editorial Theme - LoadingScreen.js
// Minimalist magazine/typography style loading animation
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const expandLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const typeReveal = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &.fade-out {
    animation: ${fadeOut} 0.6s ease forwards;
  }
`;

const Content = styled.div`
  text-align: center;
  max-width: 400px;
  padding: 0 2rem;
`;

const Year = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  color: #999;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: 0.2s;
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(3rem, 12vw, 5rem);
  font-weight: 300;
  font-style: italic;
  color: #1a1a1a;
  line-height: 1;
  margin: 0;
  animation: ${slideUp} 0.8s ease forwards;
  
  span {
    display: inline-block;
    animation: ${typeReveal} 0.8s ease forwards;
    animation-delay: 0.3s;
  }
`;

const Ampersand = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  font-style: italic;
  color: #ccc;
  margin: 0.5rem 0;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: 0.5s;
`;

const Line = styled.div`
  width: 60px;
  height: 1px;
  background: #1a1a1a;
  margin: 2.5rem auto;
  transform-origin: left;
  transform: scaleX(0);
  animation: ${expandLine} 0.8s ease forwards;
  animation-delay: 0.6s;
`;

const ProgressContainer = styled.div`
  margin-top: 0;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: 0.8s;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 1px;
  background: #eee;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${p => p.$progress}%;
  background: #1a1a1a;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  margin-top: 1.5rem;
`;

const Issue = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #ccc;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: 1s;
`;

const MIN_DISPLAY_TIME = 2000;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const [progress, setProgress] = useState(0);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [fadeOutActive, setFadeOutActive] = useState(false);

  const currentYear = new Date().getFullYear();

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = isDataReady ? 10 : 4;
        return Math.min(prev + increment + Math.random() * 3, 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isDataReady]);

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
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, minTimeReached, isDataReady, onLoadComplete]);

  // Fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fadeOutActive) {
        setFadeOutActive(true);
        setTimeout(() => onLoadComplete?.(), 600);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [fadeOutActive, onLoadComplete]);

  return (
    <Container className={fadeOutActive ? 'fade-out' : ''}>
      <Content>
        <Year>{currentYear}</Year>
        <Title><span>The</span></Title>
        <Ampersand>&</Ampersand>
        <Title><span>Wedding</span></Title>
        <Line />
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
          <ProgressText>
            {progress < 100 ? 'Loading' : 'Welcome'}
          </ProgressText>
        </ProgressContainer>
      </Content>
      <Issue>Issue No. 01</Issue>
    </Container>
  );
}

export default LoadingScreen;
