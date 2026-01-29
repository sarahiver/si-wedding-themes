// TreeOverlay - Growing tree illustration that responds to scroll
// Crown at top (Hero), trunk gets thicker as you scroll, roots at bottom
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
`;

const TreeSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1400px;
  height: 100%;
`;

// Generates organic wobbly line
function wobbleLine(x1, y1, x2, y2, wobble = 2, segments = 8) {
  let path = `M ${x1} ${y1}`;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    const wx = (Math.random() - 0.5) * wobble;
    const wy = (Math.random() - 0.5) * wobble;
    if (i === segments) {
      path += ` L ${x2} ${y2}`;
    } else {
      path += ` L ${x + wx} ${y + wy}`;
    }
  }
  return path;
}

// Branch component
const Branch = ({ x1, y1, x2, y2, thickness = 1, opacity = 1 }) => {
  const pathRef = useRef(null);
  const [path, setPath] = useState('');
  
  useEffect(() => {
    setPath(wobbleLine(x1, y1, x2, y2, thickness * 0.5));
  }, [x1, y1, x2, y2, thickness]);
  
  return (
    <path
      d={path}
      fill="none"
      stroke="var(--bark)"
      strokeWidth={thickness}
      strokeLinecap="round"
      opacity={opacity}
    />
  );
};

// Generate tree structure based on scroll progress
function generateTree(scrollProgress, viewportHeight) {
  const branches = [];
  const trunk = [];
  const rings = [];
  
  // Trunk center X
  const centerX = 50;
  
  // Trunk - gets thicker as we scroll down
  // At top (scroll=0): thin crown branches
  // At bottom (scroll=1): thick trunk with rings
  
  const trunkTopY = 5;
  const trunkBottomY = 95;
  const trunkHeight = trunkBottomY - trunkTopY;
  
  // Trunk width increases with depth
  const trunkWidthTop = 0.5;
  const trunkWidthBottom = 8;
  
  // Main trunk lines (left and right edge)
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    const y = trunkTopY + t * trunkHeight;
    const width = trunkWidthTop + t * (trunkWidthBottom - trunkWidthTop);
    
    // Only draw trunk section if we've scrolled past it
    const sectionScroll = t;
    if (scrollProgress >= sectionScroll * 0.8) {
      const opacity = Math.min(1, (scrollProgress - sectionScroll * 0.8) * 5);
      
      // Left trunk edge
      trunk.push({
        x: centerX - width,
        y: y,
        thickness: 0.3 + t * 0.5,
        opacity: opacity
      });
      
      // Right trunk edge  
      trunk.push({
        x: centerX + width,
        y: y,
        thickness: 0.3 + t * 0.5,
        opacity: opacity
      });
    }
  }
  
  // Crown branches at top (always visible, more detail as you scroll)
  const crownBranches = [
    // Main upward branches
    { x1: centerX, y1: 15, x2: centerX - 15, y2: 5, thick: 0.8 },
    { x1: centerX, y1: 15, x2: centerX + 12, y2: 3, thick: 0.8 },
    { x1: centerX, y1: 15, x2: centerX - 5, y2: 2, thick: 0.6 },
    { x1: centerX, y1: 15, x2: centerX + 8, y2: 6, thick: 0.5 },
    // Sub-branches
    { x1: centerX - 15, y1: 5, x2: centerX - 22, y2: 2, thick: 0.4 },
    { x1: centerX - 15, y1: 5, x2: centerX - 18, y2: 8, thick: 0.3 },
    { x1: centerX + 12, y1: 3, x2: centerX + 20, y2: 1, thick: 0.4 },
    { x1: centerX + 12, y1: 3, x2: centerX + 16, y2: 7, thick: 0.3 },
    // Tiny twigs
    { x1: centerX - 22, y1: 2, x2: centerX - 26, y2: 0, thick: 0.2 },
    { x1: centerX + 20, y1: 1, x2: centerX + 25, y2: -1, thick: 0.2 },
    { x1: centerX - 5, y1: 2, x2: centerX - 8, y2: -1, thick: 0.2 },
    { x1: centerX + 8, y1: 6, x2: centerX + 12, y2: 4, thick: 0.2 },
  ];
  
  crownBranches.forEach(b => {
    branches.push({
      ...b,
      opacity: Math.min(1, 0.3 + scrollProgress * 0.7)
    });
  });
  
  // Side branches that grow at different scroll positions
  const sideBranches = [
    { y: 25, dir: -1, scroll: 0.1 },
    { y: 30, dir: 1, scroll: 0.15 },
    { y: 40, dir: -1, scroll: 0.25 },
    { y: 45, dir: 1, scroll: 0.3 },
    { y: 55, dir: -1, scroll: 0.4 },
    { y: 58, dir: 1, scroll: 0.45 },
    { y: 68, dir: -1, scroll: 0.55 },
    { y: 72, dir: 1, scroll: 0.6 },
    { y: 80, dir: -1, scroll: 0.7 },
    { y: 83, dir: 1, scroll: 0.75 },
  ];
  
  sideBranches.forEach(sb => {
    if (scrollProgress >= sb.scroll) {
      const progress = Math.min(1, (scrollProgress - sb.scroll) * 4);
      const trunkWidth = trunkWidthTop + (sb.y / 100) * (trunkWidthBottom - trunkWidthTop);
      const startX = centerX + (sb.dir * trunkWidth);
      const endX = startX + (sb.dir * (8 + progress * 10));
      const endY = sb.y - 3 - progress * 2;
      
      branches.push({
        x1: startX,
        y1: sb.y,
        x2: endX,
        y2: endY,
        thick: 0.4 + progress * 0.3,
        opacity: progress
      });
      
      // Sub-branches
      if (progress > 0.5) {
        branches.push({
          x1: endX * 0.7 + startX * 0.3,
          y1: (sb.y + endY) / 2,
          x2: endX + sb.dir * 5,
          y2: endY + 2,
          thick: 0.2,
          opacity: (progress - 0.5) * 2
        });
      }
    }
  });
  
  // Growth rings - appear in lower portion as trunk gets thick
  if (scrollProgress > 0.5) {
    const ringProgress = (scrollProgress - 0.5) * 2;
    const numRings = Math.floor(ringProgress * 8);
    const ringY = 85; // Position of ring cross-section
    const ringWidth = trunkWidthTop + (ringY / 100) * (trunkWidthBottom - trunkWidthTop);
    
    for (let i = 1; i <= numRings; i++) {
      const scale = i / 8;
      rings.push({
        cx: centerX,
        cy: ringY,
        rx: ringWidth * scale,
        ry: ringWidth * scale * 0.4,
        opacity: 0.1 + scale * 0.2
      });
    }
  }
  
  // Roots at bottom
  const roots = [];
  if (scrollProgress > 0.8) {
    const rootProgress = (scrollProgress - 0.8) * 5;
    const rootWidth = trunkWidthBottom;
    
    const rootData = [
      { angle: -60, length: 15 },
      { angle: -30, length: 20 },
      { angle: 0, length: 12 },
      { angle: 30, length: 18 },
      { angle: 60, length: 14 },
    ];
    
    rootData.forEach((r, i) => {
      const progress = Math.min(1, rootProgress * (1 + i * 0.1));
      if (progress > 0) {
        const startX = centerX + (r.angle / 60) * rootWidth * 0.5;
        const endX = startX + Math.sin(r.angle * Math.PI / 180) * r.length * progress;
        const endY = 95 + Math.cos(r.angle * Math.PI / 180) * r.length * progress * 0.3;
        
        roots.push({
          x1: startX,
          y1: 93,
          x2: endX,
          y2: Math.min(100, endY),
          thick: 0.5 + (1 - Math.abs(r.angle) / 60) * 0.5,
          opacity: progress * 0.7
        });
      }
    });
  }
  
  return { trunk, branches, rings, roots };
}

function TreeOverlay({ scrollProgress = 0 }) {
  const tree = generateTree(scrollProgress, 100);
  
  return (
    <Overlay>
      <TreeSVG viewBox="0 0 100 100" preserveAspectRatio="xMidYMin slice">
        {/* Trunk outline */}
        {tree.trunk.length >= 2 && (
          <path
            d={`M ${tree.trunk.filter((_, i) => i % 2 === 0).map(t => `${t.x} ${t.y}`).join(' L ')} 
                L ${tree.trunk.filter((_, i) => i % 2 === 1).reverse().map(t => `${t.x} ${t.y}`).join(' L ')} Z`}
            fill="none"
            stroke="var(--bark)"
            strokeWidth="0.3"
            opacity={tree.trunk[0]?.opacity || 0}
          />
        )}
        
        {/* Growth rings */}
        {tree.rings.map((ring, i) => (
          <ellipse
            key={`ring-${i}`}
            cx={ring.cx}
            cy={ring.cy}
            rx={ring.rx}
            ry={ring.ry}
            fill="none"
            stroke="var(--bark)"
            strokeWidth="0.15"
            opacity={ring.opacity}
          />
        ))}
        
        {/* Branches */}
        {tree.branches.map((b, i) => (
          <Branch
            key={`branch-${i}`}
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            thickness={b.thick}
            opacity={b.opacity}
          />
        ))}
        
        {/* Roots */}
        {tree.roots.map((r, i) => (
          <Branch
            key={`root-${i}`}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            thickness={r.thick}
            opacity={r.opacity}
          />
        ))}
      </TreeSVG>
    </Overlay>
  );
}

export default TreeOverlay;
