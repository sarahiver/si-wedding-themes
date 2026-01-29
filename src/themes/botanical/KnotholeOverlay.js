// KnotholeOverlay - Black & White Tree Cross-Section
// Drawn style with growth rings, hard edges
import React, { useState, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';

// Context to share hole positions with components
export const KnotholeContext = createContext({
  holes: [],
  currentSection: 'hero'
});

export const useKnotholes = () => useContext(KnotholeContext);

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  overflow: hidden;
`;

const MenuButton = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #fff;
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
  z-index: 200;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border: 1px solid #ddd;
  
  &:hover {
    transform: scale(1.1);
  }
  
  span {
    width: 4px;
    height: 4px;
    background: #333;
    border-radius: 50%;
  }
`;

const ScrollHint = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #666;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 1s ease;
  pointer-events: none;
  z-index: 150;
  
  &::after {
    content: '';
    width: 1px;
    height: 30px;
    background: linear-gradient(180deg, #999, transparent);
  }
`;

// Hole configurations - organic irregular shapes
const sectionConfigs = {
  hero: {
    main: { cx: 50, cy: 50, points: generateOrganicShape(50, 50, 28, 34, 12) },
    holes: []
  },
  countdown: {
    main: { cx: 50, cy: 48, points: generateOrganicShape(50, 48, 24, 26, 10) },
    holes: [
      { cx: 13, cy: 73, points: generateOrganicShape(13, 73, 8, 10, 8) },
      { cx: 85, cy: 20, points: generateOrganicShape(85, 20, 6, 8, 6) },
    ]
  },
  story: {
    main: { cx: 28, cy: 50, points: generateOrganicShape(28, 50, 22, 30, 10) },
    holes: [
      { cx: 73, cy: 52, points: generateOrganicShape(73, 52, 18, 24, 10) },
    ]
  },
  timeline: {
    main: { cx: 50, cy: 48, points: generateOrganicShape(50, 48, 26, 36, 12) },
    holes: [
      { cx: 11, cy: 78, points: generateOrganicShape(11, 78, 5, 6, 6) },
    ]
  },
  gallery: {
    main: { cx: 27, cy: 36, points: generateOrganicShape(27, 36, 17, 20, 10) },
    holes: [
      { cx: 71, cy: 34, points: generateOrganicShape(71, 34, 16, 20, 10) },
      { cx: 50, cy: 76, points: generateOrganicShape(50, 76, 18, 14, 8) },
    ]
  },
  rsvp: {
    main: { cx: 50, cy: 50, points: generateOrganicShape(50, 50, 24, 34, 12) },
    holes: []
  },
  default: {
    main: { cx: 50, cy: 48, points: generateOrganicShape(50, 48, 26, 32, 12) },
    holes: [
      { cx: 12, cy: 75, points: generateOrganicShape(12, 75, 7, 9, 8) },
      { cx: 86, cy: 18, points: generateOrganicShape(86, 18, 5, 6, 6) },
    ]
  },
};

// Generate organic irregular polygon points
function generateOrganicShape(cx, cy, rx, ry, numPoints, seed = 1) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    // Add organic variation
    const variation = 0.85 + Math.sin(angle * 3 + seed) * 0.1 + Math.cos(angle * 2 + seed * 2) * 0.08;
    const x = cx + Math.cos(angle) * rx * variation;
    const y = cy + Math.sin(angle) * ry * variation;
    points.push({ x, y });
  }
  return points;
}

// Convert points to smooth SVG path
function pointsToPath(points) {
  if (points.length < 3) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length; i++) {
    const p0 = points[(i - 1 + points.length) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];
    
    // Catmull-Rom to Bezier conversion for smooth curves
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  
  return path + ' Z';
}

// Generate growth rings path
function generateRingsPath(cx, cy, rx, ry, numRings) {
  let paths = [];
  for (let i = 1; i <= numRings; i++) {
    const scale = i / numRings;
    const points = generateOrganicShape(
      cx, cy, 
      rx * scale, 
      ry * scale, 
      12, 
      i * 0.5
    );
    paths.push(pointsToPath(points));
  }
  return paths;
}

function KnotholeOverlay({ currentSection = 'hero', onMenuClick, children }) {
  const [config, setConfig] = useState(sectionConfigs.hero);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [morphProgress, setMorphProgress] = useState(0);

  useEffect(() => {
    const newConfig = sectionConfigs[currentSection] || sectionConfigs.default;
    setConfig(newConfig);
    
    if (currentSection !== 'hero') {
      setShowScrollHint(false);
    }
  }, [currentSection]);

  // Slow morphing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMorphProgress(p => (p + 0.002) % 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const { main, holes } = config;
  
  // Generate ring paths for main hole
  const mainRings = generateRingsPath(main.cx, main.cy, 
    main.points[0] ? Math.abs(main.points[3]?.x - main.cx) || 26 : 26,
    main.points[0] ? Math.abs(main.points[0]?.y - main.cy) || 32 : 32,
    15
  );

  // Slight wobble based on morphProgress
  const wobble = Math.sin(morphProgress * Math.PI * 2) * 0.3;

  // Context value for child components
  const contextValue = {
    holes: [main, ...holes],
    currentSection,
    mainHole: {
      x: `${main.cx - 28}%`,
      y: `${main.cy - 34}%`,
      width: '56%',
      height: '68%',
    }
  };

  return (
    <KnotholeContext.Provider value={contextValue}>
      <Overlay>
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%' 
          }}
        >
          <defs>
            {/* Mask for holes */}
            <mask id="holeMask">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              
              {/* Main hole */}
              <path 
                d={pointsToPath(main.points)} 
                fill="black"
                style={{ 
                  transform: `translate(${wobble}px, ${wobble * 0.5}px)`,
                  transition: 'all 2s ease-out'
                }}
              />
              
              {/* Secondary holes */}
              {holes.map((hole, i) => (
                <path 
                  key={i}
                  d={pointsToPath(hole.points)} 
                  fill="black"
                  style={{ 
                    transform: `translate(${wobble * (i % 2 ? 1 : -1) * 0.5}px, ${wobble * 0.3}px)`,
                    transition: 'all 2.5s ease-out'
                  }}
                />
              ))}
            </mask>
          </defs>
          
          {/* White background with mask */}
          <rect 
            x="0" y="0" width="100" height="100" 
            fill="#f8f8f8"
            mask="url(#holeMask)"
          />
          
          {/* Outer bark edge - rough */}
          <rect 
            x="0" y="0" width="100" height="100" 
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="8"
            mask="url(#holeMask)"
            style={{ 
              filter: 'url(#roughEdge)',
            }}
          />
          
          {/* Growth rings around main hole */}
          {mainRings.map((ringPath, i) => (
            <path 
              key={i}
              d={ringPath}
              fill="none"
              stroke="#333"
              strokeWidth={i % 3 === 0 ? 0.15 : 0.08}
              opacity={0.4 + (i / mainRings.length) * 0.3}
              style={{ 
                transform: `translate(${wobble}px, ${wobble * 0.5}px)`,
                transition: 'all 2s ease-out'
              }}
            />
          ))}
          
          {/* Inner edge of main hole */}
          <path 
            d={pointsToPath(main.points)} 
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="0.4"
            style={{ 
              transform: `translate(${wobble}px, ${wobble * 0.5}px)`,
              transition: 'all 2s ease-out'
            }}
          />
          
          {/* Rings and edges for secondary holes */}
          {holes.map((hole, i) => {
            const holeRings = generateRingsPath(
              hole.cx, hole.cy,
              hole.points[0] ? Math.abs(hole.points[3]?.x - hole.cx) || 8 : 8,
              hole.points[0] ? Math.abs(hole.points[0]?.y - hole.cy) || 10 : 10,
              6
            );
            return (
              <g key={i} style={{ 
                transform: `translate(${wobble * (i % 2 ? 1 : -1) * 0.5}px, ${wobble * 0.3}px)`,
                transition: 'all 2.5s ease-out'
              }}>
                {holeRings.map((ringPath, j) => (
                  <path 
                    key={j}
                    d={ringPath}
                    fill="none"
                    stroke="#333"
                    strokeWidth={j % 2 === 0 ? 0.12 : 0.06}
                    opacity={0.3 + (j / holeRings.length) * 0.3}
                  />
                ))}
                <path 
                  d={pointsToPath(hole.points)} 
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="0.3"
                />
              </g>
            );
          })}
          
          {/* Rough edge filter */}
          <defs>
            <filter id="roughEdge" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      </Overlay>
      
      <MenuButton onClick={onMenuClick}>
        <span />
        <span />
        <span />
      </MenuButton>
      
      <ScrollHint $visible={showScrollHint}>
        Scroll
      </ScrollHint>
      
      {children}
    </KnotholeContext.Provider>
  );
}

export default KnotholeOverlay;
