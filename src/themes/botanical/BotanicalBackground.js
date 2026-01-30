import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Cloudinary leaf images (ohne pngwing.com_1)
const LEAVES = [
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789868/pngwing.com_6_xo6v3t.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_3_tz1fk6.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_4_ugo8hl.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789865/pngwing.com_2_sxhekf.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_7_npj9xa.png',
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

// Foreground layer (overlays glass elements in the middle)
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
  opacity: 0.4;
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
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(28, 69, 39, 0.3) 0%, transparent 70%);
    top: 50%;
    left: 20%;
  }
`;

// Leaf styling
const Leaf = styled.img`
  position: absolute;
  pointer-events: none;
  will-change: transform;
  
  &.back { filter: blur(2px) brightness(0.5); opacity: 0.5; }
  &.mid { filter: blur(1px) brightness(0.65); opacity: 0.7; }
  &.front { filter: blur(0px) brightness(0.8); opacity: 0.85; }
  &.overlay { filter: blur(0.5px) brightness(0.75); opacity: 0.9; }
  
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

// BACKGROUND LEAVES - behind content (reduced count for performance)
const BG_LEAVES = [
  // Top edge
  { src: 0, className: 'back', style: { top: '-12%', left: '8%', width: '320px', transform: 'rotate(175deg) scaleX(-1)' }, speed: 0.012 },
  { src: 1, className: 'mid', style: { top: '-10%', right: '15%', width: '300px', transform: 'rotate(170deg)' }, speed: 0.018 },
  
  // Left edge
  { src: 2, className: 'mid', style: { top: '20%', left: '-10%', width: '340px', transform: 'rotate(95deg)' }, speed: 0.02 },
  { src: 3, className: 'back', style: { top: '55%', left: '-8%', width: '300px', transform: 'rotate(85deg) scaleY(-1)' }, speed: 0.015 },
  
  // Right edge
  { src: 4, className: 'mid', style: { top: '25%', right: '-10%', width: '320px', transform: 'rotate(-90deg)' }, speed: 0.018 },
  { src: 0, className: 'back', style: { top: '60%', right: '-8%', width: '280px', transform: 'rotate(-85deg) scaleY(-1)' }, speed: 0.014 },
  
  // Bottom edge
  { src: 1, className: 'back', style: { bottom: '-15%', left: '20%', width: '350px', transform: 'rotate(-5deg)' }, speed: 0.012 },
  { src: 3, className: 'mid', style: { bottom: '-12%', right: '15%', width: '320px', transform: 'rotate(8deg) scaleX(-1)' }, speed: 0.016 },
  
  // Corners
  { src: 2, className: 'front', style: { top: '-5%', left: '-6%', width: '380px', transform: 'rotate(130deg)' }, speed: 0.022 },
  { src: 4, className: 'front', style: { top: '-5%', right: '-6%', width: '360px', transform: 'rotate(-130deg) scaleX(-1)' }, speed: 0.024 },
  { src: 0, className: 'mid', style: { bottom: '-8%', left: '-5%', width: '340px', transform: 'rotate(50deg)' }, speed: 0.018 },
  { src: 1, className: 'mid', style: { bottom: '-8%', right: '-5%', width: '320px', transform: 'rotate(-50deg) scaleX(-1)' }, speed: 0.02 },
];

// FOREGROUND LEAVES - overlay glass elements in middle
const FG_LEAVES = [
  // Left side overlays
  { src: 3, className: 'overlay', style: { top: '30%', left: '-3%', width: '280px', transform: 'rotate(100deg)' }, speed: 0.025 },
  { src: 4, className: 'overlay hide-mobile', style: { top: '65%', left: '-2%', width: '240px', transform: 'rotate(80deg) scaleY(-1)' }, speed: 0.028 },
  
  // Right side overlays
  { src: 2, className: 'overlay', style: { top: '35%', right: '-3%', width: '260px', transform: 'rotate(-95deg) scaleY(-1)' }, speed: 0.026 },
  { src: 0, className: 'overlay hide-mobile', style: { top: '70%', right: '-2%', width: '220px', transform: 'rotate(-75deg)' }, speed: 0.03 },
  
  // Top overlay (subtle)
  { src: 1, className: 'overlay hide-mobile', style: { top: '-8%', left: '40%', width: '200px', transform: 'rotate(180deg)' }, speed: 0.02 },
];

function BotanicalBackground() {
  const bgLeafRefs = useRef([]);
  const fgLeafRefs = useRef([]);
  const scrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      
      if (!ticking.current) {
        requestAnimationFrame(() => {
          // Animate background leaves
          bgLeafRefs.current.forEach((leaf, index) => {
            if (leaf && BG_LEAVES[index]) {
              const speed = BG_LEAVES[index].speed;
              const yOffset = scrollY.current * speed;
              const baseTransform = BG_LEAVES[index].style.transform || '';
              leaf.style.transform = `${baseTransform} translateY(${yOffset}px)`;
            }
          });
          
          // Animate foreground leaves
          fgLeafRefs.current.forEach((leaf, index) => {
            if (leaf && FG_LEAVES[index]) {
              const speed = FG_LEAVES[index].speed;
              const yOffset = scrollY.current * speed;
              const baseTransform = FG_LEAVES[index].style.transform || '';
              leaf.style.transform = `${baseTransform} translateY(${yOffset}px)`;
            }
          });
          
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
          <Leaf
            key={`bg-${index}`}
            ref={el => bgLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
            className={config.className}
            style={config.style}
            alt=""
            loading="lazy"
          />
        ))}
        
        <Vignette />
      </BackgroundContainer>
      
      {/* Foreground layer - overlays glass elements */}
      <ForegroundContainer>
        {FG_LEAVES.map((config, index) => (
          <Leaf
            key={`fg-${index}`}
            ref={el => fgLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
            className={config.className}
            style={config.style}
            alt=""
            loading="lazy"
          />
        ))}
      </ForegroundContainer>
    </>
  );
}

export default BotanicalBackground;
