// KnotholeOverlay - Tree Cross-Section
// Rings on the OUTSIDE (dark), holes are WHITE/transparent
import React, { useState, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';

// Context to share hole positions with components
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

// Section configurations - positions in viewport percentages
const sectionConfigs = {
  hero: {
    main: { cx: 50, cy: 50, rx: 28, ry: 36 },
    holes: []
  },
  countdown: {
    main: { cx: 50, cy: 48, rx: 24, ry: 28 },
    holes: [
      { cx: 12, cy: 75, rx: 8, ry: 10 },
      { cx: 86, cy: 20, rx: 6, ry: 8 },
    ]
  },
  story: {
    main: { cx: 28, cy: 50, rx: 22, ry: 32 },
    holes: [
      { cx: 73, cy: 52, rx: 18, ry: 26 },
    ]
  },
  timeline: {
    main: { cx: 50, cy: 50, rx: 28, ry: 40 },
    holes: [
      { cx: 10, cy: 80, rx: 6, ry: 7 },
    ]
  },
  gallery: {
    main: { cx: 27, cy: 36, rx: 18, ry: 22 },
    holes: [
      { cx: 72, cy: 34, rx: 17, ry: 22 },
      { cx: 50, cy: 78, rx: 20, ry: 14 },
    ]
  },
  rsvp: {
    main: { cx: 50, cy: 50, rx: 26, ry: 36 },
    holes: []
  },
  default: {
    main: { cx: 50, cy: 50, rx: 28, ry: 34 },
    holes: [
      { cx: 12, cy: 76, rx: 8, ry: 10 },
      { cx: 87, cy: 18, rx: 6, ry: 7 },
    ]
  },
};

// Generate organic shape points
function generateOrganicShape(cx, cy, rx, ry, numPoints = 12, seed = 1) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const variation = 0.88 + 
      Math.sin(angle * 3 + seed) * 0.08 + 
      Math.cos(angle * 2.5 + seed * 1.5) * 0.06;
    points.push({
      x: cx + Math.cos(angle) * rx * variation,
      y: cy + Math.sin(angle) * ry * variation
    });
  }
  return points;
}

// Convert points to smooth SVG path with Catmull-Rom splines
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

// Generate concentric rings from OUTSIDE toward the hole
function generateRings(hole, numRings = 12) {
  const rings = [];
  // Start from large (outer edge) and go smaller toward hole
  for (let i = numRings; i >= 1; i--) {
    // Scale from outer boundary inward
    const outerScale = 2.5; // How far out the rings extend
    const scale = 1 + (outerScale - 1) * (i / numRings);
    const points = generateOrganicShape(
      hole.cx, 
      hole.cy, 
      hole.rx * scale, 
      hole.ry * scale, 
      12, 
      i * 0.7 + hole.cx * 0.1
    );
    rings.push({
      path: pointsToPath(points),
      opacity: 0.15 + (1 - i / numRings) * 0.4,
      strokeWidth: i % 4 === 0 ? 0.25 : 0.12
    });
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
    
    if (currentSection !== 'hero') {
      setShowScrollHint(false);
    }
  }, [currentSection]);

  // Slow wobble animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWobble(w => (w + 0.003) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const { main, holes } = config;
  
  // Calculate wobble offsets
  const wobbleX = Math.sin(wobble) * 0.15;
  const wobbleY = Math.cos(wobble * 0.7) * 0.1;

  // Generate paths for main hole
  const mainPoints = generateOrganicShape(
    main.cx + wobbleX, 
    main.cy + wobbleY, 
    main.rx, 
    main.ry, 
    14, 
    1
  );
  const mainPath = pointsToPath(mainPoints);
  const mainRings = generateRings({ ...main, cx: main.cx + wobbleX, cy: main.cy + wobbleY }, 15);

  // Context for components
  const contextValue = {
    mainHole: {
      x: main.cx - main.rx,
      y: main.cy - main.ry,
      width: main.rx * 2,
      height: main.ry * 2,
      cx: main.cx,
      cy: main.cy
    },
    secondaryHoles: holes.map(h => ({
      x: h.cx - h.rx,
      y: h.cy - h.ry,
      width: h.rx * 2,
      height: h.ry * 2,
      cx: h.cx,
      cy: h.cy
    })),
    currentSection
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
            {/* Mask: white = visible frame, black = transparent holes */}
            <mask id="frameMask">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              {/* Cut out main hole */}
              <path d={mainPath} fill="black" />
              {/* Cut out secondary holes */}
              {holes.map((hole, i) => {
                const holeWobbleX = Math.sin(wobble + i * 2) * 0.1;
                const holeWobbleY = Math.cos(wobble * 0.8 + i * 1.5) * 0.08;
                const holePoints = generateOrganicShape(
                  hole.cx + holeWobbleX, 
                  hole.cy + holeWobbleY, 
                  hole.rx, 
                  hole.ry, 
                  10, 
                  i + 5
                );
                return <path key={i} d={pointsToPath(holePoints)} fill="black" />;
              })}
            </mask>
          </defs>
          
          {/* Light gray background for the "wood" area */}
          <rect 
            x="0" y="0" width="100" height="100" 
            fill="#f0f0f0"
            mask="url(#frameMask)"
          />
          
          {/* Growth rings around main hole - going OUTWARD */}
          {mainRings.map((ring, i) => (
            <path 
              key={`main-ring-${i}`}
              d={ring.path}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          ))}
          
          {/* Edge of main hole */}
          <path 
            d={mainPath}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="0.5"
            opacity="0.9"
          />
          
          {/* Secondary holes: rings and edges */}
          {holes.map((hole, i) => {
            const holeWobbleX = Math.sin(wobble + i * 2) * 0.1;
            const holeWobbleY = Math.cos(wobble * 0.8 + i * 1.5) * 0.08;
            const wobbledHole = { 
              ...hole, 
              cx: hole.cx + holeWobbleX, 
              cy: hole.cy + holeWobbleY 
            };
            const holePoints = generateOrganicShape(
              wobbledHole.cx, wobbledHole.cy, 
              hole.rx, hole.ry, 10, i + 5
            );
            const holePath = pointsToPath(holePoints);
            const holeRings = generateRings(wobbledHole, 8);
            
            return (
              <g key={i}>
                {holeRings.map((ring, j) => (
                  <path 
                    key={j}
                    d={ring.path}
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth={ring.strokeWidth * 0.8}
                    opacity={ring.opacity * 0.8}
                  />
                ))}
                <path 
                  d={holePath}
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="0.4"
                  opacity="0.85"
                />
              </g>
            );
          })}
          
          {/* Outer bark edge - rough border */}
          <rect 
            x="0.5" y="0.5" width="99" height="99" 
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="1.5"
            opacity="0.6"
          />
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
