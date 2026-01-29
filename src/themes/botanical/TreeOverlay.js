// TreeOverlay - Sketchy hand-drawn tree that grows with scroll
// Many thin lines, organic, imperfect strokes - like pen sketches
import React, { useMemo } from 'react';
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
  max-width: 1800px;
  height: 100%;
`;

// Seeded random for consistent rendering
function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Generate a sketchy line with multiple thin strokes
function sketchyLine(x1, y1, x2, y2, seed = 0, numStrokes = 4) {
  const lines = [];
  
  for (let s = 0; s < numStrokes; s++) {
    let path = `M ${x1 + (seededRandom(seed + s * 100) - 0.5) * 0.5} ${y1 + (seededRandom(seed + s * 101) - 0.5) * 0.5}`;
    const segments = 8 + Math.floor(seededRandom(seed + s) * 6);
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      const wobbleX = (seededRandom(seed + i * 10 + s * 50) - 0.5) * 1.2;
      const wobbleY = (seededRandom(seed + i * 11 + s * 51) - 0.5) * 1.2;
      path += ` L ${x + wobbleX} ${y + wobbleY}`;
    }
    
    lines.push({
      d: path,
      opacity: 0.25 + seededRandom(seed + s * 200) * 0.45,
      strokeWidth: 0.04 + seededRandom(seed + s * 201) * 0.06
    });
  }
  
  return lines;
}

// Generate sketchy branch with many thin parallel lines
function sketchyBranch(x1, y1, x2, y2, thickness, seed) {
  const paths = [];
  
  // Multiple thin lines for the branch
  const numLines = Math.max(3, Math.floor(thickness * 6));
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;
  
  for (let i = 0; i < numLines; i++) {
    const offset = ((i / (numLines - 1)) - 0.5) * thickness * 0.4;
    const strokeLines = sketchyLine(
      x1 + nx * offset,
      y1 + ny * offset,
      x2 + nx * offset,
      y2 + ny * offset,
      seed + i * 1000,
      2 + Math.floor(seededRandom(seed + i) * 2)
    );
    paths.push(...strokeLines);
  }
  
  // Cross-hatching for texture
  if (thickness > 0.8 && len > 3) {
    const numHatches = Math.floor(len / 2);
    for (let i = 0; i < numHatches; i++) {
      const t = (i + 0.3 + seededRandom(seed + i * 500) * 0.4) / numHatches;
      const hx = x1 + dx * t;
      const hy = y1 + dy * t;
      const hatchLen = thickness * 0.3;
      const angle = Math.PI / 4 + (seededRandom(seed + i * 501) - 0.5) * 0.5;
      
      paths.push({
        d: `M ${hx - Math.cos(angle) * hatchLen} ${hy - Math.sin(angle) * hatchLen} L ${hx + Math.cos(angle) * hatchLen} ${hy + Math.sin(angle) * hatchLen}`,
        opacity: 0.1 + seededRandom(seed + i * 502) * 0.15,
        strokeWidth: 0.04
      });
    }
  }
  
  return paths;
}

// Generate wild organic crown with many branches
function generateCrown(centerX, topY, scrollProgress) {
  const paths = [];
  const baseOpacity = Math.min(1, 0.3 + scrollProgress * 0.7);
  
  // Main structure going up
  const trunkTop = topY + 20;
  
  // Many primary branches radiating out
  const primaryBranches = [
    { x: centerX - 18, y: topY + 5, thick: 1.2 },
    { x: centerX + 15, y: topY + 3, thick: 1.2 },
    { x: centerX - 8, y: topY + 1, thick: 1.0 },
    { x: centerX + 10, y: topY + 6, thick: 1.0 },
    { x: centerX - 22, y: topY + 12, thick: 1.1 },
    { x: centerX + 20, y: topY + 10, thick: 1.1 },
    { x: centerX - 3, y: topY, thick: 0.9 },
    { x: centerX + 5, y: topY + 2, thick: 0.8 },
    { x: centerX - 14, y: topY + 8, thick: 0.9 },
    { x: centerX + 18, y: topY + 14, thick: 1.0 },
    { x: centerX - 25, y: topY + 18, thick: 0.8 },
    { x: centerX + 24, y: topY + 16, thick: 0.9 },
  ];
  
  primaryBranches.forEach((b, i) => {
    const startY = trunkTop - 2 - (i % 5) * 3;
    const startX = centerX + (seededRandom(i * 50) - 0.5) * 2;
    
    // Primary branch
    const branchPaths = sketchyBranch(startX, startY, b.x, b.y, b.thick, i * 100);
    branchPaths.forEach(p => {
      p.opacity *= baseOpacity;
      paths.push(p);
    });
    
    // Secondary branches - more of them!
    const numSecondary = 3 + Math.floor(seededRandom(i * 60) * 4);
    for (let j = 0; j < numSecondary; j++) {
      const t = 0.25 + seededRandom(i * 70 + j) * 0.6;
      const sx = startX + (b.x - startX) * t;
      const sy = startY + (b.y - startY) * t;
      const ex = b.x + (seededRandom(i * 80 + j) - 0.5) * 15;
      const ey = b.y - 1 - seededRandom(i * 81 + j) * 8;
      
      const secPaths = sketchyBranch(sx, sy, ex, ey, 0.5, i * 90 + j);
      secPaths.forEach(p => {
        p.opacity *= baseOpacity * 0.7;
        paths.push(p);
      });
      
      // Tertiary twigs - lots of them!
      const numTwigs = 3 + Math.floor(seededRandom(i * 100 + j) * 4);
      for (let k = 0; k < numTwigs; k++) {
        const tt = 0.3 + seededRandom(i * 110 + j * 10 + k) * 0.6;
        const tsx = sx + (ex - sx) * tt;
        const tsy = sy + (ey - sy) * tt;
        const tex = tsx + (seededRandom(i * 120 + j * 10 + k) - 0.5) * 8;
        const tey = tsy - 1 - seededRandom(i * 121 + j * 10 + k) * 5;
        
        const twigPaths = sketchyLine(tsx, tsy, tex, tey, i * 130 + j * 10 + k, 3);
        twigPaths.forEach(p => {
          p.opacity *= baseOpacity * 0.4;
          paths.push(p);
        });
        
        // Even tinier twigs
        if (seededRandom(i * 140 + j * 10 + k) > 0.4) {
          const tex2 = tex + (seededRandom(i * 150 + k) - 0.5) * 4;
          const tey2 = tey - seededRandom(i * 151 + k) * 3;
          const tinyPaths = sketchyLine(tex, tey, tex2, tey2, i * 160 + k, 2);
          tinyPaths.forEach(p => {
            p.opacity *= baseOpacity * 0.25;
            paths.push(p);
          });
        }
      }
    }
  });
  
  return paths;
}

// Generate trunk with many parallel sketchy lines
function generateTrunk(centerX, startY, endY, scrollProgress) {
  const paths = [];
  
  const widthTop = 2;
  const widthBottom = 15;
  const numEdgeLines = 8;
  
  // Left and right edges with multiple sketchy lines
  for (let edge = 0; edge < 2; edge++) {
    const dir = edge === 0 ? -1 : 1;
    
    for (let line = 0; line < numEdgeLines; line++) {
      const lineOffset = (line / numEdgeLines) * 0.4;
      let path = '';
      
      const numPoints = 30;
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        if (t > scrollProgress * 1.3) break;
        
        const y = startY + (endY - startY) * t;
        const width = widthTop + (widthBottom - widthTop) * Math.pow(t, 0.6);
        const wobble = (seededRandom(edge * 5000 + line * 100 + i * 10) - 0.5) * 0.8;
        const x = centerX + dir * (width - lineOffset * width * 0.3) + wobble;
        
        if (i === 0) {
          path = `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
      
      if (path) {
        paths.push({
          d: path,
          opacity: 0.2 + seededRandom(edge * 6000 + line * 200) * 0.4,
          strokeWidth: 0.04 + seededRandom(edge * 6001 + line * 201) * 0.04
        });
      }
    }
  }
  
  // Vertical bark texture lines
  const numBarkLines = 25;
  for (let i = 0; i < numBarkLines; i++) {
    const xOffset = (seededRandom(i * 700) - 0.5) * 0.8;
    const startT = seededRandom(i * 701) * 0.4;
    const endT = startT + 0.2 + seededRandom(i * 702) * 0.4;
    
    if (startT > scrollProgress * 1.3) continue;
    
    const actualEndT = Math.min(endT, scrollProgress * 1.3);
    const midWidth = widthTop + (widthBottom - widthTop) * ((startT + actualEndT) / 2);
    const x = centerX + xOffset * midWidth;
    const y1 = startY + (endY - startY) * startT;
    const y2 = startY + (endY - startY) * actualEndT;
    
    const barkLines = sketchyLine(
      x + (seededRandom(i * 703) - 0.5) * 1.5,
      y1,
      x + (seededRandom(i * 704) - 0.5) * 1.5,
      y2,
      i * 710,
      2
    );
    barkLines.forEach(p => {
      p.opacity *= 0.2;
      paths.push(p);
    });
  }
  
  return paths;
}

// Generate side branches
function generateSideBranches(centerX, scrollProgress) {
  const paths = [];
  
  const branches = [
    { y: 26, dir: -1, length: 22, scroll: 0.06 },
    { y: 30, dir: 1, length: 20, scroll: 0.10 },
    { y: 35, dir: -1, length: 25, scroll: 0.15 },
    { y: 40, dir: 1, length: 22, scroll: 0.20 },
    { y: 46, dir: -1, length: 28, scroll: 0.26 },
    { y: 51, dir: 1, length: 24, scroll: 0.31 },
    { y: 56, dir: -1, length: 22, scroll: 0.36 },
    { y: 61, dir: 1, length: 26, scroll: 0.41 },
    { y: 66, dir: -1, length: 24, scroll: 0.46 },
    { y: 71, dir: 1, length: 22, scroll: 0.51 },
    { y: 75, dir: -1, length: 20, scroll: 0.56 },
    { y: 79, dir: 1, length: 24, scroll: 0.61 },
    { y: 83, dir: -1, length: 18, scroll: 0.66 },
  ];
  
  branches.forEach((branch, idx) => {
    if (scrollProgress < branch.scroll) return;
    
    const progress = Math.min(1, (scrollProgress - branch.scroll) * 4);
    const trunkWidth = widthAtY(branch.y);
    
    const startX = centerX + branch.dir * trunkWidth;
    const endX = startX + branch.dir * branch.length * progress;
    const endY = branch.y - 5 - seededRandom(idx * 800) * 5;
    
    // Main branch with more strokes
    const branchPaths = sketchyBranch(startX, branch.y, endX, endY, 0.8 + progress * 0.5, idx * 1000);
    branchPaths.forEach(p => {
      p.opacity *= progress;
      paths.push(p);
    });
    
    // More sub-branches
    if (progress > 0.3) {
      const numSub = 3 + Math.floor(seededRandom(idx * 900) * 3);
      for (let i = 0; i < numSub; i++) {
        const t = 0.2 + seededRandom(idx * 910 + i) * 0.6;
        const sx = startX + (endX - startX) * t;
        const sy = branch.y + (endY - branch.y) * t;
        const subEndX = sx + branch.dir * (6 + seededRandom(idx * 920 + i) * 10) * progress;
        const subEndY = sy - 2 - seededRandom(idx * 930 + i) * 6;
        
        const subPaths = sketchyBranch(sx, sy, subEndX, subEndY, 0.4, idx * 940 + i);
        subPaths.forEach(p => {
          p.opacity *= progress * 0.6;
          paths.push(p);
        });
        
        // Tiny twigs
        if (progress > 0.5) {
          const numTwigs = 2 + Math.floor(seededRandom(idx * 950 + i) * 2);
          for (let j = 0; j < numTwigs; j++) {
            const tt = 0.4 + seededRandom(idx * 960 + i * 10 + j) * 0.4;
            const tsx = sx + (subEndX - sx) * tt;
            const tsy = sy + (subEndY - sy) * tt;
            const tex = tsx + branch.dir * (3 + seededRandom(idx * 970 + j) * 4);
            const tey = tsy - 1 - seededRandom(idx * 971 + j) * 3;
            
            const twigPaths = sketchyLine(tsx, tsy, tex, tey, idx * 980 + j, 2);
            twigPaths.forEach(p => {
              p.opacity *= progress * 0.35;
              paths.push(p);
            });
          }
        }
      }
    }
  });
  
  return paths;
}

// Helper: width at Y position
function widthAtY(y) {
  const startY = 22;
  const endY = 88;
  const widthTop = 2;
  const widthBottom = 15;
  const t = (y - startY) / (endY - startY);
  return widthTop + (widthBottom - widthTop) * Math.pow(Math.max(0, Math.min(1, t)), 0.6);
}

// Generate growth rings
function generateRings(centerX, centerY, scrollProgress) {
  const paths = [];
  
  if (scrollProgress < 0.55) return paths;
  
  const ringProgress = (scrollProgress - 0.55) / 0.45;
  const numRings = Math.floor(ringProgress * 12);
  const maxRadius = 10;
  
  for (let i = 1; i <= numRings; i++) {
    const radius = (i / 12) * maxRadius;
    const numStrokes = 4;
    
    for (let s = 0; s < numStrokes; s++) {
      const points = [];
      const numPoints = 32;
      
      for (let j = 0; j <= numPoints; j++) {
        const angle = (j / numPoints) * Math.PI * 2;
        const wobble = (seededRandom(i * 1000 + j * 10 + s) - 0.5) * 0.6;
        const r = radius + wobble;
        points.push({
          x: centerX + Math.cos(angle) * r * 1.3,
          y: centerY + Math.sin(angle) * r * 0.45
        });
      }
      
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let j = 1; j < points.length; j++) {
        path += ` L ${points[j].x} ${points[j].y}`;
      }
      
      paths.push({
        d: path,
        opacity: 0.1 + seededRandom(i * 1100 + s) * 0.2,
        strokeWidth: 0.05
      });
    }
  }
  
  return paths;
}

// Generate roots
function generateRoots(centerX, startY, scrollProgress) {
  const paths = [];
  
  if (scrollProgress < 0.72) return paths;
  
  const rootProgress = (scrollProgress - 0.72) / 0.28;
  
  const roots = [
    { angle: -75, length: 18 },
    { angle: -55, length: 24 },
    { angle: -35, length: 22 },
    { angle: -15, length: 18 },
    { angle: 10, length: 20 },
    { angle: 30, length: 25 },
    { angle: 50, length: 22 },
    { angle: 70, length: 17 },
    { angle: 85, length: 14 },
  ];
  
  roots.forEach((root, idx) => {
    const progress = Math.min(1, rootProgress * (1.6 - idx * 0.08));
    if (progress <= 0) return;
    
    const rad = root.angle * Math.PI / 180;
    const endX = centerX + Math.sin(rad) * root.length * progress;
    const endY = startY + Math.abs(Math.cos(rad)) * root.length * 0.35 * progress;
    
    const rootPaths = sketchyBranch(centerX + (seededRandom(idx * 2000) - 0.5) * 3, startY, endX, endY, 0.6, idx * 2100);
    rootPaths.forEach(p => {
      p.opacity *= progress * 0.6;
      paths.push(p);
    });
    
    // Sub-roots
    if (progress > 0.4) {
      const numSub = 2 + Math.floor(seededRandom(idx * 2200) * 3);
      for (let i = 0; i < numSub; i++) {
        const t = 0.3 + seededRandom(idx * 2300 + i) * 0.5;
        const sx = centerX + (endX - centerX) * t;
        const sy = startY + (endY - startY) * t;
        const subAngle = root.angle + (seededRandom(idx * 2400 + i) - 0.5) * 50;
        const subRad = subAngle * Math.PI / 180;
        const subLen = 5 + seededRandom(idx * 2500 + i) * 7;
        const subEndX = sx + Math.sin(subRad) * subLen * progress;
        const subEndY = sy + Math.abs(Math.cos(subRad)) * subLen * 0.3 * progress;
        
        const subPaths = sketchyLine(sx, sy, subEndX, subEndY, idx * 2600 + i, 3);
        subPaths.forEach(p => {
          p.opacity *= progress * 0.4;
          paths.push(p);
        });
      }
    }
  });
  
  return paths;
}

function TreeOverlay({ scrollProgress = 0 }) {
  const allPaths = useMemo(() => {
    const paths = [];
    const centerX = 50;
    
    // Crown at top
    paths.push(...generateCrown(centerX, 0, scrollProgress));
    
    // Main trunk
    paths.push(...generateTrunk(centerX, 20, 88, scrollProgress));
    
    // Side branches
    paths.push(...generateSideBranches(centerX, scrollProgress));
    
    // Growth rings
    paths.push(...generateRings(centerX, 86, scrollProgress));
    
    // Roots at bottom
    paths.push(...generateRoots(centerX, 90, scrollProgress));
    
    return paths;
  }, [scrollProgress]);

  return (
    <Overlay>
      <TreeSVG viewBox="0 0 100 100" preserveAspectRatio="xMidYMin slice">
        {allPaths.map((path, i) => (
          <path
            key={i}
            d={path.d}
            fill="none"
            stroke="var(--bark, #2d2d2d)"
            strokeWidth={path.strokeWidth}
            strokeLinecap="round"
            opacity={path.opacity}
          />
        ))}
      </TreeSVG>
    </Overlay>
  );
}

export default TreeOverlay;
