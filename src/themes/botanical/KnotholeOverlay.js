// KnotholeOverlay - Tree Cross-Section with ordered rings
// Exports hole positions so components can adapt their layout
import React, { useState, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';

// Context shares hole positions with all components
export const KnotholeContext = createContext({
  mainHole: { x: 20, y: 12, width: 60, height: 76 },
  secondaryHoles: [],
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  
  &:hover { transform: scale(1.1); }
  
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
  color: #999;
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

// Section configurations with hole positions (in viewport %)
const sectionConfigs = {
  hero: {
    main: { cx: 50, cy: 50, rx: 30, ry: 38 },
    holes: []
  },
  countdown: {
    main: { cx: 50, cy: 50, rx: 26, ry: 30 },
    holes: [
      { cx: 12, cy: 75, rx: 8, ry: 10 },
      { cx: 87, cy: 22, rx: 7, ry: 8 },
    ]
  },
  story: {
    main: { cx: 30, cy: 50, rx: 24, ry: 34 },
    holes: [
      { cx: 74, cy: 50, rx: 20, ry: 28 },
    ]
  },
  timeline: {
    main: { cx: 50, cy: 50, rx: 30, ry: 42 },
    holes: [
      { cx: 10, cy: 82, rx: 6, ry: 7 },
    ]
  },
  locations: {
    main: { cx: 35, cy: 45, rx: 26, ry: 32 },
    holes: [
      { cx: 75, cy: 55, rx: 18, ry: 24 },
    ]
  },
  gallery: {
    main: { cx: 30, cy: 35, rx: 22, ry: 26 },
    holes: [
      { cx: 72, cy: 35, rx: 20, ry: 24 },
      { cx: 50, cy: 78, rx: 24, ry: 16 },
    ]
  },
  rsvp: {
    main: { cx: 50, cy: 50, rx: 28, ry: 40 },
    holes: []
  },
  faq: {
    main: { cx: 50, cy: 50, rx: 30, ry: 40 },
    holes: [
      { cx: 88, cy: 80, rx: 6, ry: 7 },
    ]
  },
  default: {
    main: { cx: 50, cy: 50, rx: 28, ry: 36 },
    holes: [
      { cx: 12, cy: 78, rx: 7, ry: 9 },
      { cx: 88, cy: 20, rx: 6, ry: 7 },
    ]
  },
};

// Generate organic but MORE ORDERED shape
function generateOrganicShape(cx, cy, rx, ry, numPoints = 12, seed = 1) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    // Less variation = more ordered
    const variation = 0.94 + 
      Math.sin(angle * 2 + seed) * 0.04 + 
      Math.cos(angle * 3 + seed * 0.5) * 0.03;
    points.push({
      x: cx + Math.cos(angle) * rx * variation,
      y: cy + Math.sin(angle) * ry * variation
    });
  }
  return points;
}

// Smooth path from points
function pointsToPath(points) {
  if (points.length < 3) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length; i++) {
    const p0 = points[(i - 1 + points.length) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path + ' Z';
}

// Generate concentric rings - MORE ORDERED, from outside in
function generateRings(hole, numRings, baseOpacity = 0.5) {
  const rings = [];
  for (let i = 0; i < numRings; i++) {
    // Scale from outer (large) to inner (hole edge)
    const t = i / (numRings - 1); // 0 = outermost, 1 = at hole
    const scale = 2.2 - t * 1.2; // 2.2 → 1.0
    
    // Very subtle variation per ring - keeps them ordered
    const points = generateOrganicShape(
      hole.cx, hole.cy,
      hole.rx * scale,
      hole.ry * scale,
      16, // more points = smoother
      i * 0.3 // subtle seed change
    );
    
    // Opacity: outer rings lighter, inner rings darker
    const opacity = baseOpacity * (0.3 + t * 0.7);
    // Stroke: every 3rd ring slightly thicker
    const strokeWidth = i % 3 === 0 ? 0.2 : 0.1;
    
    rings.push({ path: pointsToPath(points), opacity, strokeWidth });
  }
  return rings;
}

function KnotholeOverlay({ currentSection = 'hero', onMenuClick, children }) {
  const [config, setConfig] = useState(sectionConfigs.hero);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [wobble, setWobble] = useState(0);

  useEffect(() => {
    const newConfig = sectionConfigs[currentSection] || sectionConfigs.default;
    setConfig(newConfig);
    if (currentSection !== 'hero') setShowScrollHint(false);
  }, [currentSection]);

  // Very slow wobble
  useEffect(() => {
    const interval = setInterval(() => {
      setWobble(w => (w + 0.002) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const { main, holes } = config;
  
  // Subtle wobble offsets
  const wobbleX = Math.sin(wobble) * 0.1;
  const wobbleY = Math.cos(wobble * 0.7) * 0.08;

  // Main hole path
  const mainPoints = generateOrganicShape(
    main.cx + wobbleX, main.cy + wobbleY,
    main.rx, main.ry, 16, 1
  );
  const mainPath = pointsToPath(mainPoints);
  
  // Main rings - DARKER (baseOpacity 0.6)
  const mainRings = generateRings(
    { cx: main.cx + wobbleX, cy: main.cy + wobbleY, rx: main.rx, ry: main.ry },
    18, 0.6
  );

  // Context for child components - viewport percentages
  const contextValue = {
    mainHole: {
      x: main.cx - main.rx,
      y: main.cy - main.ry,
      width: main.rx * 2,
      height: main.ry * 2,
      cx: main.cx,
      cy: main.cy,
      rx: main.rx,
      ry: main.ry
    },
    secondaryHoles: holes.map(h => ({
      x: h.cx - h.rx,
      y: h.cy - h.ry,
      width: h.rx * 2,
      height: h.ry * 2,
      cx: h.cx,
      cy: h.cy,
      rx: h.rx,
      ry: h.ry
    })),
    currentSection
  };

  return (
    <KnotholeContext.Provider value={contextValue}>
      <Overlay>
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <mask id="frameMask">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              <path d={mainPath} fill="black" />
              {holes.map((hole, i) => {
                const hw = Math.sin(wobble + i * 2) * 0.08;
                const hwy = Math.cos(wobble * 0.8 + i) * 0.06;
                const holePoints = generateOrganicShape(
                  hole.cx + hw, hole.cy + hwy,
                  hole.rx, hole.ry, 12, i + 5
                );
                return <path key={i} d={pointsToPath(holePoints)} fill="black" />;
              })}
            </mask>
          </defs>
          
          {/* Background */}
          <rect x="0" y="0" width="100" height="100" fill="#f5f5f5" mask="url(#frameMask)" />
          
          {/* Main hole rings - DARKER */}
          {mainRings.map((ring, i) => (
            <path 
              key={`m-${i}`}
              d={ring.path}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          ))}
          
          {/* Main hole edge */}
          <path d={mainPath} fill="none" stroke="#1a1a1a" strokeWidth="0.4" opacity="0.85" />
          
          {/* Secondary holes - LIGHTER (baseOpacity 0.25) */}
          {holes.map((hole, i) => {
            const hw = Math.sin(wobble + i * 2) * 0.08;
            const hwy = Math.cos(wobble * 0.8 + i) * 0.06;
            const wobbledHole = { cx: hole.cx + hw, cy: hole.cy + hwy, rx: hole.rx, ry: hole.ry };
            const holePoints = generateOrganicShape(wobbledHole.cx, wobbledHole.cy, hole.rx, hole.ry, 12, i + 5);
            const holePath = pointsToPath(holePoints);
            const holeRings = generateRings(wobbledHole, 10, 0.25); // LIGHTER
            
            return (
              <g key={i}>
                {holeRings.map((ring, j) => (
                  <path 
                    key={j}
                    d={ring.path}
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth={ring.strokeWidth * 0.8}
                    opacity={ring.opacity}
                  />
                ))}
                <path d={holePath} fill="none" stroke="#1a1a1a" strokeWidth="0.3" opacity="0.6" />
              </g>
            );
          })}
          
          {/* Outer border */}
          <rect x="0.3" y="0.3" width="99.4" height="99.4" fill="none" stroke="#333" strokeWidth="0.8" opacity="0.4" />
        </svg>
      </Overlay>
      
      <MenuButton onClick={onMenuClick}>
        <span /><span /><span />
      </MenuButton>
      
      <ScrollHint $visible={showScrollHint}>Scroll</ScrollHint>
      
      {children}
    </KnotholeContext.Provider>
  );
}

export default KnotholeOverlay;
