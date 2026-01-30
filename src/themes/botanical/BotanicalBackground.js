import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Cloudinary leaf images
const LEAVES = [
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789868/pngwing.com_6_xo6v3t.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_3_tz1fk6.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_1_z9rvnp.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_4_ugo8hl.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789865/pngwing.com_2_sxhekf.png',
  'https://res.cloudinary.com/si-weddings/image/upload/v1769789866/pngwing.com_7_npj9xa.png',
];

const BackgroundContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  background: var(--bg-gradient);
`;

// Ambient lighting - subtle green glows
const AmbientLight = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  pointer-events: none;
  
  &.light1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(34, 85, 51, 0.5) 0%, transparent 70%);
    top: -200px;
    left: -150px;
  }
  
  &.light2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(45, 90, 39, 0.4) 0%, transparent 70%);
    bottom: -100px;
    right: -100px;
  }
  
  &.light3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(28, 69, 39, 0.35) 0%, transparent 70%);
    top: 40%;
    left: 30%;
  }
  
  &.light4 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(39, 78, 45, 0.3) 0%, transparent 70%);
    top: 20%;
    right: 20%;
  }
`;

// Individual leaf with parallax - positioned to hide stems
const Leaf = styled.img`
  position: absolute;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.1s linear;
  
  /* Layer-based styling */
  &.back { filter: blur(3px) brightness(0.5); opacity: 0.6; }
  &.mid { filter: blur(1px) brightness(0.7); opacity: 0.75; }
  &.front { filter: blur(0px) brightness(0.85); opacity: 0.9; }
  
  @media (max-width: 768px) {
    &.hide-mobile { display: none; }
  }
`;

// Vignette overlay
const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 80% at 50% 50%,
    transparent 20%,
    rgba(4, 6, 4, 0.4) 70%,
    rgba(4, 6, 4, 0.85) 100%
  );
  pointer-events: none;
`;

// Leaf configurations - JUNGLE DENSITY with hidden stems (rotated to push stems outside viewport)
const LEAF_CONFIG = [
  // === TOP EDGE (stems rotated upward/outside) ===
  { src: 0, className: 'back', style: { top: '-15%', left: '5%', width: '380px', transform: 'rotate(175deg) scaleX(-1)' }, speed: 0.015 },
  { src: 1, className: 'mid', style: { top: '-12%', left: '25%', width: '320px', transform: 'rotate(160deg)' }, speed: 0.025 },
  { src: 2, className: 'front', style: { top: '-18%', left: '45%', width: '400px', transform: 'rotate(185deg) scaleX(-1)' }, speed: 0.035 },
  { src: 3, className: 'back', style: { top: '-10%', right: '20%', width: '350px', transform: 'rotate(170deg)' }, speed: 0.02 },
  { src: 4, className: 'mid', style: { top: '-14%', right: '5%', width: '380px', transform: 'rotate(190deg) scaleX(-1)' }, speed: 0.028 },
  { src: 5, className: 'front hide-mobile', style: { top: '-8%', left: '60%', width: '280px', transform: 'rotate(165deg)' }, speed: 0.032 },
  
  // === LEFT EDGE (stems rotated left/outside) ===
  { src: 0, className: 'front', style: { top: '10%', left: '-12%', width: '420px', transform: 'rotate(95deg)' }, speed: 0.04 },
  { src: 2, className: 'mid', style: { top: '35%', left: '-15%', width: '380px', transform: 'rotate(85deg) scaleY(-1)' }, speed: 0.025 },
  { src: 4, className: 'back', style: { top: '55%', left: '-10%', width: '350px', transform: 'rotate(100deg)' }, speed: 0.018 },
  { src: 1, className: 'front', style: { top: '75%', left: '-14%', width: '400px', transform: 'rotate(80deg) scaleY(-1)' }, speed: 0.038 },
  { src: 3, className: 'mid hide-mobile', style: { top: '20%', left: '-8%', width: '300px', transform: 'rotate(110deg)' }, speed: 0.022 },
  
  // === RIGHT EDGE (stems rotated right/outside) ===
  { src: 1, className: 'front', style: { top: '5%', right: '-12%', width: '400px', transform: 'rotate(-95deg) scaleY(-1)' }, speed: 0.035 },
  { src: 3, className: 'mid', style: { top: '30%', right: '-14%', width: '360px', transform: 'rotate(-85deg)' }, speed: 0.028 },
  { src: 5, className: 'back', style: { top: '50%', right: '-10%', width: '380px', transform: 'rotate(-100deg) scaleY(-1)' }, speed: 0.02 },
  { src: 0, className: 'front', style: { top: '70%', right: '-15%', width: '420px', transform: 'rotate(-80deg)' }, speed: 0.042 },
  { src: 2, className: 'mid hide-mobile', style: { top: '15%', right: '-8%', width: '320px', transform: 'rotate(-110deg) scaleY(-1)' }, speed: 0.03 },
  
  // === BOTTOM EDGE (stems rotated downward/outside) ===
  { src: 5, className: 'back', style: { bottom: '-18%', left: '10%', width: '400px', transform: 'rotate(-5deg)' }, speed: 0.015 },
  { src: 0, className: 'mid', style: { bottom: '-15%', left: '35%', width: '350px', transform: 'rotate(10deg) scaleX(-1)' }, speed: 0.022 },
  { src: 2, className: 'front', style: { bottom: '-20%', right: '25%', width: '420px', transform: 'rotate(-10deg)' }, speed: 0.032 },
  { src: 4, className: 'back', style: { bottom: '-12%', right: '5%', width: '380px', transform: 'rotate(5deg) scaleX(-1)' }, speed: 0.018 },
  { src: 1, className: 'mid hide-mobile', style: { bottom: '-16%', left: '55%', width: '300px', transform: 'rotate(15deg)' }, speed: 0.025 },
  
  // === CORNER CLUSTERS (extra density) ===
  // Top-left corner
  { src: 3, className: 'front', style: { top: '-5%', left: '-8%', width: '450px', transform: 'rotate(135deg)' }, speed: 0.038 },
  { src: 5, className: 'mid', style: { top: '8%', left: '-5%', width: '320px', transform: 'rotate(120deg) scaleX(-1)' }, speed: 0.025 },
  
  // Top-right corner
  { src: 4, className: 'front', style: { top: '-5%', right: '-8%', width: '430px', transform: 'rotate(-135deg) scaleX(-1)' }, speed: 0.04 },
  { src: 2, className: 'mid', style: { top: '10%', right: '-3%', width: '300px', transform: 'rotate(-125deg)' }, speed: 0.028 },
  
  // Bottom-left corner
  { src: 1, className: 'front', style: { bottom: '-8%', left: '-10%', width: '400px', transform: 'rotate(45deg) scaleY(-1)' }, speed: 0.035 },
  { src: 0, className: 'mid', style: { bottom: '5%', left: '-6%', width: '280px', transform: 'rotate(60deg)' }, speed: 0.022 },
  
  // Bottom-right corner
  { src: 3, className: 'front', style: { bottom: '-10%', right: '-10%', width: '420px', transform: 'rotate(-45deg)' }, speed: 0.038 },
  { src: 5, className: 'mid', style: { bottom: '8%', right: '-5%', width: '300px', transform: 'rotate(-55deg) scaleY(-1)' }, speed: 0.025 },
  
  // === ADDITIONAL SCATTERED LEAVES (more jungle feel) ===
  { src: 2, className: 'back hide-mobile', style: { top: '25%', left: '2%', width: '250px', transform: 'rotate(75deg)' }, speed: 0.015 },
  { src: 4, className: 'back hide-mobile', style: { top: '45%', right: '3%', width: '280px', transform: 'rotate(-70deg)' }, speed: 0.018 },
  { src: 0, className: 'back', style: { top: '65%', left: '1%', width: '300px', transform: 'rotate(85deg) scaleX(-1)' }, speed: 0.012 },
  { src: 1, className: 'back', style: { top: '85%', right: '2%', width: '260px', transform: 'rotate(-80deg) scaleX(-1)' }, speed: 0.016 },
];

function BotanicalBackground() {
  const leafRefs = useRef([]);
  const scrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      
      if (!ticking.current) {
        requestAnimationFrame(() => {
          leafRefs.current.forEach((leaf, index) => {
            if (leaf && LEAF_CONFIG[index]) {
              const speed = LEAF_CONFIG[index].speed;
              const yOffset = scrollY.current * speed;
              const baseTransform = LEAF_CONFIG[index].style.transform || '';
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
    <BackgroundContainer>
      {/* Ambient lighting */}
      <AmbientLight className="light1" />
      <AmbientLight className="light2" />
      <AmbientLight className="light3" />
      <AmbientLight className="light4" />
      
      {/* Parallax leaves - jungle density */}
      {LEAF_CONFIG.map((config, index) => (
        <Leaf
          key={index}
          ref={el => leafRefs.current[index] = el}
          src={LEAVES[config.src]}
          className={config.className}
          style={config.style}
          alt=""
          loading="lazy"
        />
      ))}
      
      {/* Vignette overlay */}
      <Vignette />
    </BackgroundContainer>
  );
}

export default BotanicalBackground;
