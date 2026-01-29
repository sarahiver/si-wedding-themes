// KnotholeOverlay - Elegant wood frame with animated organic holes
// SVG mask creates real transparent holes, CSS animations make them breathe
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Breathing animation for the whole overlay
const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.003); }
`;

// Floating animation for secondary holes
const float1 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(0.5%, 0.3%); }
  50% { transform: translate(0, 0.5%); }
  75% { transform: translate(-0.3%, 0.2%); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(-0.4%, 0.4%); }
  66% { transform: translate(0.3%, -0.2%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.12; }
  50% { opacity: 0.18; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  overflow: hidden;
`;

const AnimatedSVG = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: ${breathe} 8s ease-in-out infinite;
`;

// Menu button
const MenuButton = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(250, 248, 245, 0.95);
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
  z-index: 200;
  transition: all 0.3s ease;
  box-shadow: 0 2px 15px rgba(0,0,0,0.12);
  border: none;
  
  &:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 25px rgba(0,0,0,0.18);
  }
  
  span {
    width: 4px;
    height: 4px;
    background: #4A4A4A;
    border-radius: 50%;
    transition: background 0.3s ease;
  }
  
  &:hover span {
    background: #2D2D2D;
  }
`;

// Scroll indicator
const ScrollHint = styled.div`
  position: fixed;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: rgba(250, 248, 245, 0.8);
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 1s ease;
  pointer-events: none;
  z-index: 150;
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, rgba(250, 248, 245, 0.6), transparent);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(180deg, transparent, rgba(250, 248, 245, 0.9), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  
  @keyframes scrollPulse {
    0% { top: -50%; }
    100% { top: 150%; }
  }
`;

// Hole configurations per section
const sectionConfigs = {
  hero: {
    main: { cx: 50, cy: 50, rx: 30, ry: 36 },
    holes: []
  },
  countdown: {
    main: { cx: 50, cy: 48, rx: 26, ry: 28 },
    holes: [
      { cx: 12, cy: 72, rx: 9, ry: 11, anim: 1 },
      { cx: 86, cy: 22, rx: 7, ry: 9, anim: 2 },
    ]
  },
  story: {
    main: { cx: 28, cy: 50, rx: 23, ry: 32 },
    holes: [
      { cx: 72, cy: 52, rx: 20, ry: 26, anim: 1 },
    ]
  },
  timeline: {
    main: { cx: 50, cy: 48, rx: 28, ry: 38 },
    holes: [
      { cx: 10, cy: 78, rx: 6, ry: 7, anim: 2 },
      { cx: 88, cy: 82, rx: 5, ry: 6, anim: 1 },
    ]
  },
  gallery: {
    main: { cx: 26, cy: 35, rx: 18, ry: 22 },
    holes: [
      { cx: 70, cy: 32, rx: 18, ry: 22, anim: 1 },
      { cx: 48, cy: 74, rx: 20, ry: 16, anim: 2 },
    ]
  },
  rsvp: {
    main: { cx: 50, cy: 50, rx: 26, ry: 36 },
    holes: []
  },
  default: {
    main: { cx: 50, cy: 48, rx: 28, ry: 34 },
    holes: [
      { cx: 10, cy: 75, rx: 8, ry: 10, anim: 1 },
      { cx: 88, cy: 18, rx: 6, ry: 7, anim: 2 },
    ]
  },
};

function KnotholeOverlay({ currentSection = 'hero', onMenuClick }) {
  const [config, setConfig] = useState(sectionConfigs.hero);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [time, setTime] = useState(0);

  // Organic wobble animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.02);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newConfig = sectionConfigs[currentSection] || sectionConfigs.default;
    setConfig(newConfig);
    
    if (currentSection !== 'hero') {
      setShowScrollHint(false);
    }
  }, [currentSection]);

  const { main, holes } = config;

  // Organic wobble for main hole
  const wobbleX = Math.sin(time) * 0.4;
  const wobbleY = Math.cos(time * 0.7) * 0.3;
  const wobbleRX = Math.sin(time * 0.5) * 0.3;
  const wobbleRY = Math.cos(time * 0.6) * 0.25;

  return (
    <>
      <Overlay>
        <AnimatedSVG 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <defs>
            {/* Mask with animated holes */}
            <mask id="holeMask">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              
              {/* Main hole with organic wobble */}
              <ellipse 
                cx={main.cx + wobbleX} 
                cy={main.cy + wobbleY} 
                rx={main.rx + wobbleRX}
                ry={main.ry + wobbleRY}
                fill="black"
              >
                <animate 
                  attributeName="rx" 
                  values={`${main.rx};${main.rx + 0.5};${main.rx}`}
                  dur="6s" 
                  repeatCount="indefinite"
                />
                <animate 
                  attributeName="ry" 
                  values={`${main.ry};${main.ry + 0.4};${main.ry}`}
                  dur="7s" 
                  repeatCount="indefinite"
                />
              </ellipse>
              
              {/* Secondary holes with their own animations */}
              {holes.map((hole, i) => (
                <ellipse
                  key={i}
                  cx={hole.cx}
                  cy={hole.cy}
                  rx={hole.rx}
                  ry={hole.ry}
                  fill="black"
                >
                  <animate 
                    attributeName="cx" 
                    values={`${hole.cx};${hole.cx + (hole.anim === 1 ? 0.8 : -0.6)};${hole.cx}`}
                    dur={hole.anim === 1 ? "10s" : "12s"}
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="cy" 
                    values={`${hole.cy};${hole.cy + (hole.anim === 1 ? 0.6 : 0.8)};${hole.cy}`}
                    dur={hole.anim === 1 ? "8s" : "9s"}
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="rx" 
                    values={`${hole.rx};${hole.rx * 1.08};${hole.rx}`}
                    dur={hole.anim === 1 ? "5s" : "6s"}
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="ry" 
                    values={`${hole.ry};${hole.ry * 1.06};${hole.ry}`}
                    dur={hole.anim === 1 ? "7s" : "5s"}
                    repeatCount="indefinite"
                  />
                </ellipse>
              ))}
            </mask>
            
            {/* Elegant gradient - less brown, more sophisticated */}
            <radialGradient id="frameGradient" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#8B8578" />
              <stop offset="40%" stopColor="#6B635A" />
              <stop offset="70%" stopColor="#524B44" />
              <stop offset="100%" stopColor="#3A3530" />
            </radialGradient>
            
            {/* Subtle light spots */}
            <radialGradient id="lightSpot1" cx="25%" cy="20%" r="30%">
              <stop offset="0%" stopColor="#A09A90" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A09A90" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="lightSpot2" cx="75%" cy="75%" r="35%">
              <stop offset="0%" stopColor="#9A9488" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#9A9488" stopOpacity="0" />
            </radialGradient>
            
            {/* Fine grain texture */}
            <pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100">
              <rect width="100" height="100" fill="transparent" />
              <circle cx="10" cy="15" r="0.15" fill="#000" opacity="0.03" />
              <circle cx="30" cy="45" r="0.1" fill="#000" opacity="0.02" />
              <circle cx="55" cy="25" r="0.12" fill="#000" opacity="0.025" />
              <circle cx="75" cy="65" r="0.1" fill="#000" opacity="0.02" />
              <circle cx="90" cy="35" r="0.15" fill="#000" opacity="0.03" />
              <circle cx="20" cy="80" r="0.1" fill="#000" opacity="0.02" />
              <circle cx="60" cy="90" r="0.12" fill="#000" opacity="0.025" />
              <circle cx="85" cy="10" r="0.1" fill="#000" opacity="0.02" />
            </pattern>
          </defs>
          
          {/* Base frame */}
          <rect 
            x="0" y="0" width="100" height="100" 
            fill="url(#frameGradient)"
            mask="url(#holeMask)"
          />
          
          {/* Light accents */}
          <rect 
            x="0" y="0" width="100" height="100" 
            fill="url(#lightSpot1)"
            mask="url(#holeMask)"
          />
          <rect 
            x="0" y="0" width="100" height="100" 
            fill="url(#lightSpot2)"
            mask="url(#holeMask)"
          />
          
          {/* Subtle grain */}
          <rect 
            x="0" y="0" width="100" height="100" 
            fill="url(#grain)"
            mask="url(#holeMask)"
            opacity="1"
          />
          
          {/* Ring around main hole - animated */}
          <ellipse 
            cx={main.cx + wobbleX} 
            cy={main.cy + wobbleY} 
            rx={main.rx + wobbleRX + 1} 
            ry={main.ry + wobbleRY + 1}
            fill="none"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="0.3"
          />
          <ellipse 
            cx={main.cx + wobbleX} 
            cy={main.cy + wobbleY} 
            rx={main.rx + wobbleRX + 2} 
            ry={main.ry + wobbleRY + 2}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="0.2"
          />
          
          {/* Rings around secondary holes */}
          {holes.map((hole, i) => (
            <g key={i}>
              <ellipse 
                cx={hole.cx}
                cy={hole.cy}
                rx={hole.rx + 0.8}
                ry={hole.ry + 0.8}
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="0.25"
              >
                <animate 
                  attributeName="cx" 
                  values={`${hole.cx};${hole.cx + (hole.anim === 1 ? 0.8 : -0.6)};${hole.cx}`}
                  dur={hole.anim === 1 ? "10s" : "12s"}
                  repeatCount="indefinite"
                />
                <animate 
                  attributeName="cy" 
                  values={`${hole.cy};${hole.cy + (hole.anim === 1 ? 0.6 : 0.8)};${hole.cy}`}
                  dur={hole.anim === 1 ? "8s" : "9s"}
                  repeatCount="indefinite"
                />
                <animate 
                  attributeName="rx" 
                  values={`${hole.rx + 0.8};${hole.rx * 1.08 + 0.8};${hole.rx + 0.8}`}
                  dur={hole.anim === 1 ? "5s" : "6s"}
                  repeatCount="indefinite"
                />
                <animate 
                  attributeName="ry" 
                  values={`${hole.ry + 0.8};${hole.ry * 1.06 + 0.8};${hole.ry + 0.8}`}
                  dur={hole.anim === 1 ? "7s" : "5s"}
                  repeatCount="indefinite"
                />
              </ellipse>
            </g>
          ))}
        </AnimatedSVG>
      </Overlay>
      
      <MenuButton onClick={onMenuClick}>
        <span />
        <span />
        <span />
      </MenuButton>
      
      <ScrollHint $visible={showScrollHint}>
        Scroll
        <ScrollLine />
      </ScrollHint>
    </>
  );
}

export default KnotholeOverlay;
