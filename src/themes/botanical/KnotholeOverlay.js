// KnotholeOverlay - Fixed foreground with REAL transparent holes
// Uses SVG mask to cut actual holes in the wood frame
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Subtle animation for organic feel
const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  overflow: hidden;
`;

// Menu dots (top right) - needs pointer events
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
  box-shadow: 0 2px 15px rgba(0,0,0,0.15);
  border: none;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  
  span {
    width: 4px;
    height: 4px;
    background: #3D3229;
    border-radius: 50%;
  }
`;

// Scroll indicator
const ScrollHint = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(250, 248, 245, 0.7);
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.8s ease;
  pointer-events: none;
  z-index: 150;
  
  &::after {
    content: '';
    width: 1px;
    height: 35px;
    background: linear-gradient(180deg, rgba(250, 248, 245, 0.5), transparent);
    animation: ${breathe} 2s ease-in-out infinite;
  }
`;

// Section configurations for hole layouts
const sectionConfigs = {
  hero: {
    main: { cx: 50, cy: 50, rx: 32, ry: 38 },
    holes: []
  },
  countdown: {
    main: { cx: 50, cy: 50, rx: 28, ry: 30 },
    holes: [
      { cx: 12, cy: 75, rx: 10, ry: 12 },
      { cx: 85, cy: 20, rx: 8, ry: 10 },
    ]
  },
  story: {
    main: { cx: 30, cy: 50, rx: 25, ry: 35 },
    holes: [
      { cx: 72, cy: 55, rx: 22, ry: 28 },
    ]
  },
  timeline: {
    main: { cx: 50, cy: 50, rx: 30, ry: 42 },
    holes: [
      { cx: 10, cy: 80, rx: 7, ry: 8 },
    ]
  },
  gallery: {
    main: { cx: 28, cy: 35, rx: 20, ry: 25 },
    holes: [
      { cx: 68, cy: 32, rx: 20, ry: 25 },
      { cx: 50, cy: 75, rx: 22, ry: 18 },
    ]
  },
  rsvp: {
    main: { cx: 50, cy: 50, rx: 28, ry: 38 },
    holes: []
  },
  default: {
    main: { cx: 50, cy: 50, rx: 30, ry: 36 },
    holes: [
      { cx: 10, cy: 78, rx: 9, ry: 11 },
      { cx: 88, cy: 15, rx: 7, ry: 8 },
    ]
  },
};

// Generate organic ellipse path
const generateOrganicPath = (cx, cy, rx, ry, wobble = 0.15) => {
  // Create slightly irregular ellipse using bezier curves
  const w = rx * wobble;
  const h = ry * wobble;
  
  return `
    M ${cx - rx} ${cy}
    C ${cx - rx} ${cy - ry * 0.55 - h}, ${cx - rx * 0.55 - w} ${cy - ry}, ${cx} ${cy - ry}
    C ${cx + rx * 0.55 + w} ${cy - ry}, ${cx + rx} ${cy - ry * 0.55 + h}, ${cx + rx} ${cy}
    C ${cx + rx} ${cy + ry * 0.55 + h}, ${cx + rx * 0.55 - w} ${cy + ry}, ${cx} ${cy + ry}
    C ${cx - rx * 0.55 + w} ${cy + ry}, ${cx - rx} ${cy + ry * 0.55 - h}, ${cx - rx} ${cy}
    Z
  `;
};

function KnotholeOverlay({ currentSection = 'hero', onMenuClick }) {
  const [config, setConfig] = useState(sectionConfigs.hero);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [animatedConfig, setAnimatedConfig] = useState(sectionConfigs.hero);

  useEffect(() => {
    const newConfig = sectionConfigs[currentSection] || sectionConfigs.default;
    setConfig(newConfig);
    
    // Animate to new config
    setAnimatedConfig(newConfig);
    
    if (currentSection !== 'hero') {
      setShowScrollHint(false);
    }
  }, [currentSection]);

  const { main, holes } = animatedConfig;

  return (
    <>
      <Overlay>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            {/* Mask that defines the holes */}
            <mask id="holeMask">
              {/* White = visible (the wood frame) */}
              <rect x="0" y="0" width="100" height="100" fill="white" />
              
              {/* Black = transparent (the holes) */}
              <ellipse 
                cx={main.cx} 
                cy={main.cy} 
                rx={main.rx} 
                ry={main.ry}
                fill="black"
                style={{ transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              
              {holes.map((hole, i) => (
                <ellipse
                  key={i}
                  cx={hole.cx}
                  cy={hole.cy}
                  rx={hole.rx}
                  ry={hole.ry}
                  fill="black"
                  style={{ transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
              ))}
            </mask>
            
            {/* Wood grain pattern */}
            <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#5C4D3C" />
              <line x1="0" y1="0" x2="4" y2="0" stroke="#3D3229" strokeWidth="0.1" opacity="0.3" />
            </pattern>
            
            {/* Gradient for depth */}
            <radialGradient id="woodGradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#7A6B5A" />
              <stop offset="50%" stopColor="#5C4D3C" />
              <stop offset="100%" stopColor="#3D3229" />
            </radialGradient>
          </defs>
          
          {/* The wood frame with holes cut out */}
          <rect 
            x="0" 
            y="0" 
            width="100" 
            height="100" 
            fill="url(#woodGradient)"
            mask="url(#holeMask)"
          />
          
          {/* Subtle texture overlay */}
          <rect 
            x="0" 
            y="0" 
            width="100" 
            height="100" 
            fill="url(#woodGrain)"
            mask="url(#holeMask)"
            opacity="0.3"
          />
          
          {/* Inner shadow/ring around main hole */}
          <ellipse 
            cx={main.cx} 
            cy={main.cy} 
            rx={main.rx + 0.8} 
            ry={main.ry + 0.8}
            fill="none"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.5"
            style={{ transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
          <ellipse 
            cx={main.cx} 
            cy={main.cy} 
            rx={main.rx + 1.5} 
            ry={main.ry + 1.5}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.3"
            style={{ transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
          
          {/* Rings around secondary holes */}
          {holes.map((hole, i) => (
            <g key={i}>
              <ellipse 
                cx={hole.cx} 
                cy={hole.cy} 
                rx={hole.rx + 0.6} 
                ry={hole.ry + 0.6}
                fill="none"
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="0.4"
                style={{ transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </g>
          ))}
        </svg>
      </Overlay>
      
      {/* Menu button - separate for pointer events */}
      <MenuButton onClick={onMenuClick}>
        <span />
        <span />
        <span />
      </MenuButton>
      
      {/* Scroll hint */}
      <ScrollHint $visible={showScrollHint}>
        Scroll
      </ScrollHint>
    </>
  );
}

export default KnotholeOverlay;
