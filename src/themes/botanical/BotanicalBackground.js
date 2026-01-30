import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Cloudinary leaf images (ohne pngwing.com_1)
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

// Foreground layer - corner leaves that grow on scroll
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
    background: radial-gradient(circle, rgba(28, 69, 39, 0.35) 0%, transparent 70%);
    top: 40%;
    left: 25%;
  }
`;

// Leaf base styles
const Leaf = styled.img`
  position: absolute;
  pointer-events: none;
  will-change: transform;
  
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

// === LAYER 1: BACK - very blurred, slow, atmospheric ===
const BACK_LEAVES = [
  { src: 0, style: { top: '-12%', left: '0%', width: '350px', transform: 'rotate(175deg) scaleX(-1)' }, blur: 5, brightness: 0.4, opacity: 0.4, speed: 0.008 },
  { src: 1, style: { top: '-10%', right: '5%', width: '320px', transform: 'rotate(165deg)' }, blur: 4, brightness: 0.45, opacity: 0.45, speed: 0.01 },
  { src: 2, style: { top: '20%', left: '-12%', width: '380px', transform: 'rotate(100deg)' }, blur: 5, brightness: 0.4, opacity: 0.4, speed: 0.007 },
  { src: 3, style: { top: '50%', left: '-10%', width: '340px', transform: 'rotate(80deg) scaleY(-1)' }, blur: 4, brightness: 0.45, opacity: 0.45, speed: 0.009 },
  { src: 0, style: { top: '25%', right: '-12%', width: '360px', transform: 'rotate(-95deg)' }, blur: 5, brightness: 0.4, opacity: 0.4, speed: 0.008 },
  { src: 1, style: { top: '55%', right: '-10%', width: '330px', transform: 'rotate(-80deg) scaleY(-1)' }, blur: 4, brightness: 0.45, opacity: 0.45, speed: 0.01 },
  { src: 2, style: { bottom: '-15%', left: '10%', width: '380px', transform: 'rotate(-8deg)' }, blur: 5, brightness: 0.4, opacity: 0.4, speed: 0.007 },
  { src: 3, style: { bottom: '-12%', right: '5%', width: '350px', transform: 'rotate(10deg) scaleX(-1)' }, blur: 4, brightness: 0.45, opacity: 0.45, speed: 0.009 },
];

// === LAYER 2: MID - medium blur, moderate movement ===
const MID_LEAVES = [
  { src: 2, style: { top: '-8%', left: '20%', width: '280px', transform: 'rotate(170deg)' }, blur: 2, brightness: 0.55, opacity: 0.6, speed: 0.015 },
  { src: 3, style: { top: '-6%', right: '25%', width: '260px', transform: 'rotate(175deg) scaleX(-1)' }, blur: 2, brightness: 0.55, opacity: 0.6, speed: 0.018, className: 'hide-mobile' },
  { src: 0, style: { top: '35%', left: '-6%', width: '300px', transform: 'rotate(90deg)' }, blur: 2, brightness: 0.55, opacity: 0.65, speed: 0.016 },
  { src: 1, style: { top: '70%', left: '-5%', width: '280px', transform: 'rotate(85deg) scaleY(-1)' }, blur: 2, brightness: 0.55, opacity: 0.6, speed: 0.014, className: 'hide-mobile' },
  { src: 2, style: { top: '40%', right: '-6%', width: '290px', transform: 'rotate(-90deg)' }, blur: 2, brightness: 0.55, opacity: 0.65, speed: 0.017 },
  { src: 3, style: { top: '75%', right: '-5%', width: '270px', transform: 'rotate(-85deg) scaleY(-1)' }, blur: 2, brightness: 0.55, opacity: 0.6, speed: 0.015, className: 'hide-mobile' },
  { src: 0, style: { bottom: '-8%', left: '35%', width: '300px', transform: 'rotate(5deg)' }, blur: 2, brightness: 0.55, opacity: 0.6, speed: 0.016, className: 'hide-mobile' },
  { src: 1, style: { bottom: '-6%', right: '30%', width: '280px', transform: 'rotate(-5deg) scaleX(-1)' }, blur: 2, brightness: 0.55, opacity: 0.6, speed: 0.018, className: 'hide-mobile' },
];

// === LAYER 3: FRONT/CORNERS - sharp, grows from corners ===
const CORNER_LEAVES = [
  // Top-left corner cluster
  { 
    src: 2, 
    style: { top: '-3%', left: '-3%', width: '420px', transform: 'rotate(130deg)' },
    blur: 0, brightness: 0.75, opacity: 0.9,
    origin: 'top left',
    baseScale: 0.85,
    maxScale: 1.1,
  },
  { 
    src: 0, 
    style: { top: '5%', left: '-5%', width: '300px', transform: 'rotate(115deg) scaleX(-1)' },
    blur: 0.5, brightness: 0.7, opacity: 0.85,
    origin: 'top left',
    baseScale: 0.9,
    maxScale: 1.08,
    className: 'hide-mobile',
  },
  // Top-right corner cluster
  { 
    src: 1, 
    style: { top: '-3%', right: '-3%', width: '400px', transform: 'rotate(-130deg) scaleX(-1)' },
    blur: 0, brightness: 0.75, opacity: 0.9,
    origin: 'top right',
    baseScale: 0.85,
    maxScale: 1.1,
  },
  { 
    src: 3, 
    style: { top: '8%', right: '-4%', width: '280px', transform: 'rotate(-115deg)' },
    blur: 0.5, brightness: 0.7, opacity: 0.85,
    origin: 'top right',
    baseScale: 0.9,
    maxScale: 1.06,
    className: 'hide-mobile',
  },
  // Bottom-left corner
  { 
    src: 3, 
    style: { bottom: '-2%', left: '-3%', width: '380px', transform: 'rotate(50deg)' },
    blur: 0, brightness: 0.75, opacity: 0.88,
    origin: 'bottom left',
    baseScale: 0.88,
    maxScale: 1.08,
  },
  // Bottom-right corner
  { 
    src: 0, 
    style: { bottom: '-2%', right: '-3%', width: '360px', transform: 'rotate(-50deg) scaleX(-1)' },
    blur: 0, brightness: 0.75, opacity: 0.88,
    origin: 'bottom right',
    baseScale: 0.88,
    maxScale: 1.06,
  },
];

function BotanicalBackground() {
  const backLeafRefs = useRef([]);
  const midLeafRefs = useRef([]);
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
          
          // Back layer - subtle parallax
          backLeafRefs.current.forEach((leaf, index) => {
            if (leaf && BACK_LEAVES[index]) {
              const speed = BACK_LEAVES[index].speed;
              const yOffset = scrollY.current * speed;
              const baseTransform = BACK_LEAVES[index].style.transform || '';
              leaf.style.transform = `${baseTransform} translateY(${yOffset}px)`;
            }
          });
          
          // Mid layer - moderate parallax
          midLeafRefs.current.forEach((leaf, index) => {
            if (leaf && MID_LEAVES[index]) {
              const speed = MID_LEAVES[index].speed;
              const yOffset = scrollY.current * speed;
              const baseTransform = MID_LEAVES[index].style.transform || '';
              leaf.style.transform = `${baseTransform} translateY(${yOffset}px)`;
            }
          });
          
          // Corner leaves - scale/grow effect
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
      {/* Background layer */}
      <BackgroundContainer>
        <AmbientLight className="light1" />
        <AmbientLight className="light2" />
        <AmbientLight className="light3" />
        
        {/* BACK - atmospheric, blurred */}
        {BACK_LEAVES.map((config, index) => (
          <Leaf
            key={`back-${index}`}
            ref={el => backLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
            className={config.className || ''}
            style={{
              ...config.style,
              filter: `blur(${config.blur}px) brightness(${config.brightness})`,
              opacity: config.opacity,
            }}
            alt=""
            loading="lazy"
          />
        ))}
        
        {/* MID - medium depth */}
        {MID_LEAVES.map((config, index) => (
          <Leaf
            key={`mid-${index}`}
            ref={el => midLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
            className={config.className || ''}
            style={{
              ...config.style,
              filter: `blur(${config.blur}px) brightness(${config.brightness})`,
              opacity: config.opacity,
            }}
            alt=""
            loading="lazy"
          />
        ))}
        
        <Vignette />
      </BackgroundContainer>
      
      {/* Foreground - corner leaves that grow */}
      <ForegroundContainer>
        {CORNER_LEAVES.map((config, index) => (
          <Leaf
            key={`corner-${index}`}
            ref={el => cornerLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
            className={config.className || ''}
            style={{
              ...config.style,
              filter: `blur(${config.blur}px) brightness(${config.brightness})`,
              opacity: config.opacity,
              transformOrigin: config.origin,
            }}
            alt=""
            loading="lazy"
          />
        ))}
      </ForegroundContainer>
    </>
  );
}

export default BotanicalBackground;
