import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeOut = keyframes`from { opacity: 1; } to { opacity: 0; }`;
const pulse = keyframes`0%, 100% { opacity: 0.3; } 50% { opacity: 1; }`;

const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease;

  &.fade-out {
    animation: ${fadeOut} 0.5s ease forwards;
  }
`;

const Logo = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2rem;
  font-weight: 300;
  color: #1A1A1A;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
`;

const Dots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #999;
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${p => p.$d}s;
`;

const MIN_DISPLAY_TIME = 1200;

function LoadingScreen({ onLoadComplete, isDataReady = false }) {
  const { project } = useWedding();
  const label = project?.couple_names || '';
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeReached(true), MIN_DISPLAY_TIME);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (minTimeReached && isDataReady && !fadingOut) {
      setFadingOut(true);
      const t = setTimeout(() => { if (onLoadComplete) onLoadComplete(); }, 500);
      return () => clearTimeout(t);
    }
  }, [minTimeReached, isDataReady, fadingOut, onLoadComplete]);

  // Fallback: nach 5s auf jeden Fall beenden
  useEffect(() => {
    const t = setTimeout(() => {
      if (!fadingOut) {
        setFadingOut(true);
        setTimeout(() => { if (onLoadComplete) onLoadComplete(); }, 500);
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [fadingOut, onLoadComplete]);

  return (
    <Screen className={fadingOut ? 'fade-out' : ''}>
      <Logo>{label}</Logo>
      <Dots>
        <Dot $d={0} />
        <Dot $d={0.2} />
        <Dot $d={0.4} />
      </Dots>
    </Screen>
  );
}

export default LoadingScreen;
