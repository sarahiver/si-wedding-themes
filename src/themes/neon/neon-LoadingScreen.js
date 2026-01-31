// Neon Theme - LoadingScreen.js
// Cyberpunk glitch style loading animation
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const neonPulse = keyframes`
  0%, 100% { 
    text-shadow: 0 0 10px #ff3366, 0 0 20px #ff3366, 0 0 40px #ff3366;
    opacity: 1;
  }
  50% { 
    text-shadow: 0 0 5px #ff3366, 0 0 10px #ff3366;
    opacity: 0.8;
  }
`;

const cyanPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
    opacity: 1;
  }
  50% { 
    box-shadow: 0 0 5px #00ffff;
    opacity: 0.7;
  }
`;

const glitch = keyframes`
  0%, 90%, 100% { transform: translate(0); }
  92% { transform: translate(-2px, 1px); }
  94% { transform: translate(2px, -1px); }
  96% { transform: translate(-1px, 2px); }
  98% { transform: translate(1px, -2px); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &.fade-out {
    animation: ${fadeOut} 0.5s ease forwards;
  }
  
  /* Grid background */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }
  
  /* Scanline */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(transparent, rgba(0,255,255,0.1), transparent);
    animation: ${scanline} 3s linear infinite;
    pointer-events: none;
  }
`;

const GlitchWrapper = styled.div`
  position: relative;
  animation: ${glitch} 2s ease-in-out infinite;
`;

const Logo = styled.div`
  font-family: 'Space Grotesk', 'Orbitron', sans-serif;
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #ff3366;
  text-transform: uppercase;
  animation: ${neonPulse} 1.5s ease-in-out infinite;
  position: relative;
  
  /* Glitch layers */
  &::before, &::after {
    content: 'LOADING';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  &::before {
    color: #00ffff;
    z-index: -1;
    animation: ${glitch} 0.3s ease-in-out infinite reverse;
    clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  }
  
  &::after {
    color: #ff3366;
    z-index: -1;
    animation: ${glitch} 0.3s ease-in-out infinite;
    clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  }
`;

const ProgressContainer = styled.div`
  margin-top: 3rem;
  width: 280px;
  position: relative;
`;

const ProgressBar = styled.div`
  height: 3px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(0,255,255,0.3);
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, #ff3366, #00ffff);
  box-shadow: 0 0 10px #00ffff;
  transition: width 0.2s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: -4px;
    bottom: -4px;
    width: 2px;
    background: #00ffff;
    animation: ${cyanPulse} 0.5s ease-in-out infinite;
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
`;

const Percent = styled.span`
  color: #00ffff;
  font-weight: 600;
`;

const Terminal = styled.div`
  margin-top: 2rem;
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 0.65rem;
  color: rgba(0,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '>';
    color: #ff3366;
  }
`;

const TerminalText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  animation: ${typewriter} 1s steps(20) forwards;
`;

const Cursor = styled.span`
  animation: ${blink} 0.8s step-end infinite;
  color: #00ffff;
`;

const MIN_DISPLAY_TIME = 2000;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const [progress, setProgress] = useState(0);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [fadeOutActive, setFadeOutActive] = useState(false);
  const [statusText, setStatusText] = useState('initializing_system');

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = isDataReady ? 15 : 8;
        return Math.min(prev + increment + Math.random() * 5, 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isDataReady]);

  // Status text changes
  useEffect(() => {
    const texts = [
      'initializing_system',
      'loading_assets',
      'connecting_to_mainframe',
      'decrypting_data',
      'system_ready'
    ];
    const index = Math.floor(progress / 25);
    setStatusText(texts[Math.min(index, texts.length - 1)]);
  }, [progress]);

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
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, minTimeReached, isDataReady, onLoadComplete]);

  // Fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fadeOutActive) {
        setFadeOutActive(true);
        setTimeout(() => onLoadComplete?.(), 500);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [fadeOutActive, onLoadComplete]);

  return (
    <Container className={fadeOutActive ? 'fade-out' : ''}>
      <GlitchWrapper>
        <Logo>LOADING</Logo>
      </GlitchWrapper>
      
      <ProgressContainer>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>
        <ProgressText>
          <span>0x{Math.floor(progress * 2.55).toString(16).toUpperCase().padStart(2, '0')}</span>
          <Percent>{Math.round(progress)}%</Percent>
        </ProgressText>
      </ProgressContainer>
      
      <Terminal>
        <TerminalText key={statusText}>{statusText}</TerminalText>
        <Cursor>_</Cursor>
      </Terminal>
    </Container>
  );
}

export default LoadingScreen;
