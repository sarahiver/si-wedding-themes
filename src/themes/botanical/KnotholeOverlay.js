// KnotholeOverlay - Fixed foreground with organic holes
// Content scrolls behind this overlay
import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Morph animations for the holes
const morph1 = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%; }
  75% { border-radius: 40% 30% 60% 50% / 60% 50% 40% 30%; }
`;

const morph2 = keyframes`
  0%, 100% { border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%; }
  33% { border-radius: 70% 30% 30% 70% / 40% 60% 40% 60%; }
  66% { border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%; }
`;

const morph3 = keyframes`
  0%, 100% { border-radius: 50% 50% 40% 60% / 40% 60% 50% 50%; }
  50% { border-radius: 60% 40% 50% 50% / 50% 50% 60% 40%; }
`;

// The fixed overlay container
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  overflow: hidden;
`;

// Wood/Bark texture background
const WoodFrame = styled.div`
  position: absolute;
  inset: 0;
  background: 
    /* Subtle grain texture */
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(61, 50, 41, 0.03) 2px,
      rgba(61, 50, 41, 0.03) 4px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 50px,
      rgba(61, 50, 41, 0.02) 50px,
      rgba(61, 50, 41, 0.02) 51px
    ),
    /* Base gradient */
    radial-gradient(ellipse at 30% 20%, var(--bark-light) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, var(--bark-highlight) 0%, transparent 40%),
    linear-gradient(135deg, var(--bark-dark) 0%, var(--bark-medium) 50%, var(--bark-dark) 100%);
`;

// Individual knothole (transparent window)
const Knothole = styled.div`
  position: absolute;
  background: transparent;
  box-shadow: var(--shadow-hole);
  transition: all 1.2s var(--ease-out);
  
  /* Ring marks around the hole */
  &::before {
    content: '';
    position: absolute;
    inset: -15px;
    border: 2px solid rgba(0,0,0,0.1);
    border-radius: inherit;
    animation: inherit;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: inherit;
    animation: inherit;
  }
`;

// Main large knothole
const MainHole = styled(Knothole)`
  width: ${p => p.$config?.width || '55vw'};
  height: ${p => p.$config?.height || '70vh'};
  left: ${p => p.$config?.left || '22.5vw'};
  top: ${p => p.$config?.top || '15vh'};
  animation: ${morph1} 20s ease-in-out infinite;
`;

// Secondary holes
const SecondaryHole = styled(Knothole)`
  width: ${p => p.$config?.width || '25vw'};
  height: ${p => p.$config?.height || '30vh'};
  left: ${p => p.$config?.left || '5vw'};
  top: ${p => p.$config?.top || '10vh'};
  animation: ${morph2} 25s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

const SmallHole = styled(Knothole)`
  width: ${p => p.$config?.width || '15vw'};
  height: ${p => p.$config?.height || '20vh'};
  left: ${p => p.$config?.left || '75vw'};
  top: ${p => p.$config?.top || '65vh'};
  animation: ${morph3} 18s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '-5s'};
`;

// Menu dots (top right)
const MenuButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 44px;
  height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: rgba(250, 248, 245, 0.9);
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  
  &:hover {
    background: var(--cream);
    transform: scale(1.05);
  }
  
  span {
    width: 4px;
    height: 4px;
    background: var(--bark-dark);
    border-radius: 50%;
  }
`;

// Scroll indicator
const ScrollHint = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--cream);
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 0.6 : 0};
  transition: opacity 0.5s ease;
  pointer-events: none;
  
  &::after {
    content: '';
    width: 1px;
    height: 30px;
    background: linear-gradient(180deg, var(--cream), transparent);
  }
`;

// Section configurations for different layouts
const sectionConfigs = {
  hero: {
    main: { width: '60vw', height: '75vh', left: '20vw', top: '12.5vh' },
    secondary: null,
    small: null,
  },
  countdown: {
    main: { width: '50vw', height: '50vh', left: '25vw', top: '25vh' },
    secondary: { width: '20vw', height: '25vh', left: '5vw', top: '60vh' },
    small: { width: '15vw', height: '18vh', left: '78vw', top: '15vh' },
  },
  story: {
    main: { width: '45vw', height: '70vh', left: '5vw', top: '15vh' },
    secondary: { width: '40vw', height: '55vh', left: '55vw', top: '25vh' },
    small: null,
  },
  timeline: {
    main: { width: '55vw', height: '80vh', left: '22.5vw', top: '10vh' },
    secondary: null,
    small: { width: '12vw', height: '15vh', left: '5vw', top: '70vh' },
  },
  gallery: {
    main: { width: '35vw', height: '45vh', left: '5vw', top: '10vh' },
    secondary: { width: '35vw', height: '45vh', left: '45vw', top: '8vh' },
    small: { width: '40vw', height: '35vh', left: '30vw', top: '58vh' },
  },
  rsvp: {
    main: { width: '50vw', height: '70vh', left: '25vw', top: '15vh' },
    secondary: null,
    small: null,
  },
  default: {
    main: { width: '55vw', height: '70vh', left: '22.5vw', top: '15vh' },
    secondary: { width: '18vw', height: '22vh', left: '3vw', top: '65vh' },
    small: { width: '12vw', height: '15vh', left: '80vw', top: '10vh' },
  },
};

function KnotholeOverlay({ currentSection = 'hero', onMenuClick }) {
  const [config, setConfig] = useState(sectionConfigs.hero);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const newConfig = sectionConfigs[currentSection] || sectionConfigs.default;
    setConfig(newConfig);
    
    // Hide scroll hint after first scroll
    if (currentSection !== 'hero') {
      setShowScrollHint(false);
    }
  }, [currentSection]);

  return (
    <Overlay>
      <WoodFrame />
      
      {/* Main viewing hole */}
      <MainHole $config={config.main} />
      
      {/* Secondary hole */}
      {config.secondary && (
        <SecondaryHole $config={config.secondary} $delay="-8s" />
      )}
      
      {/* Small accent hole */}
      {config.small && (
        <SmallHole $config={config.small} $delay="-12s" />
      )}
      
      {/* Menu button */}
      <MenuButton onClick={onMenuClick}>
        <span />
        <span />
        <span />
      </MenuButton>
      
      {/* Scroll hint */}
      <ScrollHint $visible={showScrollHint}>
        Scroll
      </ScrollHint>
    </Overlay>
  );
}

export default KnotholeOverlay;
