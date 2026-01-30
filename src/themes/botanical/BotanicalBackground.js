import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Cloudinary leaf images (ohne pngwing.com_1 und pngwing.com_7)
const LEAVES = [
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789868/pngwing.com_6_xo6v3t.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_3_tz1fk6.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_4_ugo8hl.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789865/pngwing.com_2_sxhekf.png',
];

// Background layer (behind content)
const BackgroundContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  background: var(--bg-gradient);
  pointer-events: none;
`;

// Foreground layer - corner leaves that grow/scale on scroll
const ForegroundContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  pointer-events: none;
`;

// Ambient lighting
const AmbientLight = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.35;
  pointer-events: none;
  
  &.light1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(34, 85, 51, 0.5) 0%, transparent 70%);
    top: -150px;
    left: -100px;
  }
  
  &.light2 {
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(45, 90, 39, 0.4) 0%, transparent 70%);
    bottom: -100px;
    right: -80px;
  }
  
  &.light3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(28, 69, 39, 0.3) 0%, transparent 70%);
    top: 50%;
    left: 20%;
  }
`;

// Background leaf - subtle, blurred, minimal movement
const BgLeaf = styled.img`
  position: absolute;
  pointer-events: none;
  will-change: transform;
  filter: blur(${p => p.$blur || 2}px) brightness(0.45);
  opacity: ${p => p.$opacity || 0.5};
  
  @media (max-width: 768px) {
    &.hide-mobile { display: none; }
  }
`;

// Foreground corner leaf - grows from corner on scroll
const CornerLeaf = styled.img`
  position: absolute;
  pointer-events: none;
  will-change: transform;
  filter: brightness(0.7);
  opacity: 0.85;
  transform-origin: ${p => p.$origin || 'center center'};
  
  @media (max-width: 768px) {
    &.hide-mobile { display: none; }
  }
`;

// Vignette
const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 70% at 50% 50%,
    transparent 10%,
    rgba(4, 6, 4, 0.5) 60%,
    rgba(4, 6, 4, 0.9) 100%
  );
  pointer-events: none;
`;

// BACKGROUND LEAVES - subtle, blurred, almost static
const BG_LEAVES = [
  // Top - very blurred, far back
  { src: 0, style: { top: '-10%', left: '5%', width: '300px', transform: 'rotate(175deg) scaleX(-1)' }, blur: 4, opacity: 0.35, speed: 0.005 },
  { src: 1, style: { top: '-8%', right: '10%', width: '280px', transform: 'rotate(170deg)' }, blur: 3, opacity: 0.4, speed: 0.008 },
  
  // Left edge
  { src: 2, style: { top: '25%', left: '-8%', width: '320px', transform: 'rotate(95deg)' }, blur: 3, opacity: 0.45, speed: 0.006 },
  { src: 3, className: 'hide-mobile', style: { top: '60%', left: '-6%', width: '280px', transform: 'rotate(85deg) scaleY(-1)' }, blur: 4, opacity: 0.35, speed: 0.004 },
  
  // Right edge
  { src: 0, style: { top: '30%', right: '-8%', width: '300px', transform: 'rotate(-90deg)' }, blur: 3, opacity: 0.45, speed: 0.007 },
  { src: 1, className: 'hide-mobile', style: { top: '65%', right: '-6%', width: '260px', transform: 'rotate(-85deg) scaleY(-1)' }, blur: 4, opacity: 0.35, speed: 0.005 },
  
  // Bottom
  { src: 2, style: { bottom: '-12%', left: '15%', width: '320px', transform: 'rotate(-5deg)' }, blur: 3, opacity: 0.4, speed: 0.006 },
  { src: 3, style: { bottom: '-10%', right: '10%', width: '300px', transform: 'rotate(8deg) scaleX(-1)' }, blur: 3, opacity: 0.4, speed: 0.008 },
];

// CORNER LEAVES - foreground, grow from corners on scroll
const CORNER_LEAVES = [
  // Top-left corner - grows diagonally into view
  { 
    src: 2, 
    style: { top: '-5%', left: '-5%', width: '400px', transform: 'rotate(130deg)' },
    origin: 'top left',
    baseScale: 0.8,
    maxScale: 1.15,
  },
  // Top-right corner
  { 
    src: 0, 
    style: { top: '-5%', right: '-5%', width: '380px', transform: 'rotate(-130deg) scaleX(-1)' },
    origin: 'top right',
    baseScale: 0.8,
    maxScale: 1.12,
  },
  // Bottom-left corner
  { 
    src: 1, 
    className: 'hide-mobile',
    style: { bottom: '-3%', left: '-4%', width: '350px', transform: 'rotate(45deg)' },
    origin: 'bottom left',
    baseScale: 0.85,
    maxScale: 1.1,
  },
  // Bottom-right corner
  { 
    src: 3, 
    className: 'hide-mobile',
    style: { bottom: '-3%', right: '-4%', width: '340px', transform: 'rotate(-45deg) scaleX(-1)' },
    origin: 'bottom right',
    baseScale: 0.85,
    maxScale: 1.08,
  },
];

function BotanicalBackground() {
  const bgLeafRefs = useRef([]);
  const cornerLeafRefs = useRef([]);
  const scrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const scrollProgress = Math.min(scrollY.current / Math.max(maxScroll, 1), 1);
          
          // Background leaves - very subtle vertical movement
          bgLeafRefs.current.forEach((leaf, index) => {
            if (leaf && BG_LEAVES[index]) {
              const speed = BG_LEAVES[index].speed;
              const yOffset = scrollY.current * speed;
              const baseTransform = BG_LEAVES[index].style.transform || '';
              leaf.style.transform = `${baseTransform} translateY(${yOffset}px)`;
            }
          });
          
          // Corner leaves - scale/grow from corners
          cornerLeafRefs.current.forEach((leaf, index) => {
            if (leaf && CORNER_LEAVES[index]) {
              const config = CORNER_LEAVES[index];
              const baseTransform = config.style.transform || '';
              const scale = config.baseScale + (scrollProgress * (config.maxScale - config.baseScale));
              leaf.style.transform = `${baseTransform} scale(${scale})`;
            }
          });
          
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Background layer - behind content */}
      <BackgroundContainer>
        <AmbientLight className="light1" />
        <AmbientLight className="light2" />
        <AmbientLight className="light3" />
        
        {BG_LEAVES.map((config, index) => (
          <BgLeaf
            key={`bg-${index}`}
            ref={el => bgLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
            className={config.className || ''}
            style={config.style}
            $blur={config.blur}
            $opacity={config.opacity}
            alt=""
            loading="lazy"
          />
        ))}
        
        <Vignette />
      </BackgroundContainer>
      
      {/* Foreground layer - corner leaves that grow */}
      <ForegroundContainer>
        {CORNER_LEAVES.map((config, index) => (
          <CornerLeaf
            key={`corner-${index}`}
            ref={el => cornerLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
            className={config.className || ''}
            style={config.style}
            $origin={config.origin}
            alt=""
            loading="lazy"
          />
        ))}
      </ForegroundContainer>
    </>
  );
}

export default BotanicalBackground;
