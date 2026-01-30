import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Forest background - optimized
const FOREST_BG = 'https://res.cloudinary.com/si-weddings/image/upload/q_auto,f_auto/v1769793086/forest-6761846_1920_dumcnj.jpg';

// Cloudinary leaf images - optimized with auto format & quality
const LEAVES = [
  'https://res.cloudinary.com/si-weddings/image/upload/w_600,q_auto,f_auto/v1769789868/pngwing.com_6_xo6v3t.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_600,q_auto,f_auto/v1769789866/pngwing.com_3_tz1fk6.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_600,q_auto,f_auto/v1769789866/pngwing.com_4_ugo8hl.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_600,q_auto,f_auto/v1769789865/pngwing.com_2_sxhekf.png',
];

// ===========================================
// LAYER 1: Forest Background (z-index: 1)
// ===========================================
const BackgroundLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url(${FOREST_BG}) center/cover no-repeat;
    filter: brightness(0.2) saturate(0.6);
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(to bottom,
        rgba(2, 8, 2, 0.5) 0%,
        rgba(2, 8, 2, 0.1) 30%,
        rgba(2, 8, 2, 0.1) 70%,
        rgba(2, 8, 2, 0.6) 100%
      );
  }
`;

// ===========================================
// LAYER 2: Back Leaves (z-index: 2)
// ===========================================
const BackLeavesLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
`;

// ===========================================
// LAYER 3: Mid Leaves + Vignette (z-index: 3)
// ===========================================
const MidLeavesLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3;
  overflow: hidden;
  pointer-events: none;
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 65% 65% at 50% 50%,
    transparent 5%,
    rgba(2, 8, 2, 0.4) 50%,
    rgba(2, 8, 2, 0.85) 100%
  );
  pointer-events: none;
`;

// ===========================================
// LAYER 4: Content sits here (z-index: 10)
// ===========================================

// ===========================================
// LAYER 5: Foreground Leaves (z-index: 100)
// ===========================================
const ForegroundLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  pointer-events: none;
`;

// ===========================================
// LAYER 6: Hero Leaf - behind Nav, over content (z-index: 500)
// ===========================================
const HeroLeafLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 500;
  overflow: hidden;
  pointer-events: none;
`;

// Ambient lighting
const AmbientLight = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  
  &.light1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(30, 80, 45, 0.5) 0%, transparent 70%);
    top: -200px;
    left: -150px;
    opacity: 0.6;
  }
  
  &.light2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(40, 90, 35, 0.4) 0%, transparent 70%);
    bottom: -150px;
    right: -100px;
    opacity: 0.5;
  }
  
  &.light3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(25, 65, 35, 0.35) 0%, transparent 70%);
    top: 35%;
    left: 20%;
    opacity: 0.4;
  }
  
  &.light4 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(35, 75, 40, 0.3) 0%, transparent 70%);
    top: 60%;
    right: 15%;
    opacity: 0.4;
  }
`;

// Leaf styles
const Leaf = styled.img`
  position: absolute;
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: 768px) {
    &.hide-mobile { display: none; }
  }
`;

// === BACK LEAVES - deep, blurred, slow ===
const BACK_LEAVES = [
  { src: 0, style: { top: '-15%', left: '-5%', width: '400px', transform: 'rotate(170deg) scaleX(-1)' }, blur: 6, brightness: 0.35, opacity: 0.5, speed: 0.006 },
  { src: 1, style: { top: '-12%', right: '0%', width: '380px', transform: 'rotate(165deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.008 },
  { src: 2, style: { top: '-8%', left: '30%', width: '320px', transform: 'rotate(175deg)' }, blur: 6, brightness: 0.35, opacity: 0.45, speed: 0.005, className: 'hide-mobile' },
  { src: 3, style: { top: '15%', left: '-15%', width: '420px', transform: 'rotate(100deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.007 },
  { src: 0, style: { top: '45%', left: '-12%', width: '380px', transform: 'rotate(85deg) scaleY(-1)' }, blur: 6, brightness: 0.35, opacity: 0.45, speed: 0.006 },
  { src: 1, style: { top: '75%', left: '-10%', width: '350px', transform: 'rotate(95deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.008, className: 'hide-mobile' },
  { src: 2, style: { top: '20%', right: '-15%', width: '400px', transform: 'rotate(-95deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.007 },
  { src: 3, style: { top: '50%', right: '-12%', width: '370px', transform: 'rotate(-85deg) scaleY(-1)' }, blur: 6, brightness: 0.35, opacity: 0.45, speed: 0.006 },
  { src: 0, style: { top: '80%', right: '-10%', width: '340px', transform: 'rotate(-90deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.008, className: 'hide-mobile' },
  { src: 1, style: { bottom: '-18%', left: '5%', width: '420px', transform: 'rotate(-10deg)' }, blur: 6, brightness: 0.35, opacity: 0.5, speed: 0.005 },
  { src: 2, style: { bottom: '-15%', right: '0%', width: '400px', transform: 'rotate(12deg) scaleX(-1)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.007 },
  { src: 3, style: { bottom: '-12%', left: '40%', width: '350px', transform: 'rotate(-5deg)' }, blur: 6, brightness: 0.35, opacity: 0.45, speed: 0.006, className: 'hide-mobile' },
];

// === MID LEAVES - medium depth ===
const MID_LEAVES = [
  { src: 2, style: { top: '-6%', left: '15%', width: '300px', transform: 'rotate(175deg)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.014 },
  { src: 3, style: { top: '-5%', right: '20%', width: '280px', transform: 'rotate(170deg) scaleX(-1)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.016, className: 'hide-mobile' },
  { src: 0, style: { top: '25%', left: '-5%', width: '320px', transform: 'rotate(92deg)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.015 },
  { src: 1, style: { top: '55%', left: '-4%', width: '300px', transform: 'rotate(88deg) scaleY(-1)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.013 },
  { src: 2, style: { top: '30%', right: '-5%', width: '310px', transform: 'rotate(-92deg)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.016 },
  { src: 3, style: { top: '60%', right: '-4%', width: '290px', transform: 'rotate(-88deg) scaleY(-1)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.014 },
  { src: 0, style: { bottom: '-6%', left: '25%', width: '320px', transform: 'rotate(8deg)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.015, className: 'hide-mobile' },
  { src: 1, style: { bottom: '-5%', right: '20%', width: '300px', transform: 'rotate(-8deg) scaleX(-1)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.017, className: 'hide-mobile' },
];

// === FOREGROUND LEAVES - sharp, over content, grows from edges ===
const FOREGROUND_LEAVES = [
  // Top-left cluster
  { 
    src: 2, 
    style: { top: '-2%', left: '-2%', width: '450px', transform: 'rotate(130deg)' },
    blur: 0, brightness: 0.8, opacity: 0.95,
    origin: 'top left', baseScale: 0.85, maxScale: 1.12,
  },
  { 
    src: 0, 
    style: { top: '3%', left: '-4%', width: '320px', transform: 'rotate(110deg) scaleX(-1)' },
    blur: 0, brightness: 0.75, opacity: 0.9,
    origin: 'top left', baseScale: 0.9, maxScale: 1.08,
  },
  { 
    src: 3, 
    className: 'hide-mobile',
    style: { top: '10%', left: '0%', width: '250px', transform: 'rotate(125deg)' },
    blur: 0.5, brightness: 0.7, opacity: 0.85,
    origin: 'top left', baseScale: 0.92, maxScale: 1.05,
  },
  
  // Top-right cluster
  { 
    src: 1, 
    style: { top: '-2%', right: '-2%', width: '430px', transform: 'rotate(-130deg) scaleX(-1)' },
    blur: 0, brightness: 0.8, opacity: 0.95,
    origin: 'top right', baseScale: 0.85, maxScale: 1.12,
  },
  { 
    src: 3, 
    style: { top: '5%', right: '-3%', width: '300px', transform: 'rotate(-115deg)' },
    blur: 0, brightness: 0.75, opacity: 0.9,
    origin: 'top right', baseScale: 0.9, maxScale: 1.06,
  },
  { 
    src: 2, 
    className: 'hide-mobile',
    style: { top: '12%', right: '0%', width: '240px', transform: 'rotate(-120deg) scaleX(-1)' },
    blur: 0.5, brightness: 0.7, opacity: 0.85,
    origin: 'top right', baseScale: 0.92, maxScale: 1.04,
  },
  
  // Left side
  { 
    src: 0, 
    style: { top: '40%', left: '-2%', width: '280px', transform: 'rotate(95deg)' },
    blur: 0, brightness: 0.75, opacity: 0.88,
    origin: 'left center', baseScale: 0.9, maxScale: 1.06,
  },
  { 
    src: 1, 
    className: 'hide-mobile',
    style: { top: '65%', left: '-1%', width: '260px', transform: 'rotate(85deg) scaleY(-1)' },
    blur: 0, brightness: 0.75, opacity: 0.85,
    origin: 'left center', baseScale: 0.92, maxScale: 1.05,
  },
  
  // Right side
  { 
    src: 2, 
    style: { top: '45%', right: '-2%', width: '270px', transform: 'rotate(-95deg)' },
    blur: 0, brightness: 0.75, opacity: 0.88,
    origin: 'right center', baseScale: 0.9, maxScale: 1.06,
  },
  { 
    src: 3, 
    className: 'hide-mobile',
    style: { top: '70%', right: '-1%', width: '250px', transform: 'rotate(-85deg) scaleY(-1)' },
    blur: 0, brightness: 0.75, opacity: 0.85,
    origin: 'right center', baseScale: 0.92, maxScale: 1.04,
  },
  
  // Bottom-left cluster
  { 
    src: 3, 
    style: { bottom: '-1%', left: '-2%', width: '400px', transform: 'rotate(50deg)' },
    blur: 0, brightness: 0.8, opacity: 0.92,
    origin: 'bottom left', baseScale: 0.88, maxScale: 1.1,
  },
  { 
    src: 1, 
    className: 'hide-mobile',
    style: { bottom: '5%', left: '-1%', width: '280px', transform: 'rotate(65deg) scaleY(-1)' },
    blur: 0, brightness: 0.75, opacity: 0.85,
    origin: 'bottom left', baseScale: 0.92, maxScale: 1.05,
  },
  
  // Bottom-right cluster
  { 
    src: 0, 
    style: { bottom: '-1%', right: '-2%', width: '380px', transform: 'rotate(-50deg) scaleX(-1)' },
    blur: 0, brightness: 0.8, opacity: 0.92,
    origin: 'bottom right', baseScale: 0.88, maxScale: 1.1,
  },
  { 
    src: 2, 
    className: 'hide-mobile',
    style: { bottom: '5%', right: '-1%', width: '260px', transform: 'rotate(-60deg)' },
    blur: 0, brightness: 0.75, opacity: 0.85,
    origin: 'bottom right', baseScale: 0.92, maxScale: 1.04,
  },
];

// === HERO LEAF - behind nav, scrolls out very slowly ===
const HERO_LEAF = {
  src: 1,
  style: { top: '-5%', left: '50%', width: '500px', transform: 'translateX(-50%) rotate(180deg)' },
  blur: 0, brightness: 0.85, opacity: 0.9,
  speed: 0.08, // Very slow scroll out
};

function BotanicalBackground() {
  const backLeafRefs = useRef([]);
  const midLeafRefs = useRef([]);
  const fgLeafRefs = useRef([]);
  const heroLeafRef = useRef(null);
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
          
          // Foreground - scale/grow effect
          fgLeafRefs.current.forEach((leaf, index) => {
            if (leaf && FOREGROUND_LEAVES[index]) {
              const config = FOREGROUND_LEAVES[index];
              const baseTransform = config.style.transform || '';
              const scale = config.baseScale + (scrollProgress * (config.maxScale - config.baseScale));
              leaf.style.transform = `${baseTransform} scale(${scale})`;
            }
          });
          
          // Hero leaf - scrolls out slowly upward
          if (heroLeafRef.current) {
            const yOffset = scrollY.current * HERO_LEAF.speed;
            heroLeafRef.current.style.transform = `translateX(-50%) rotate(180deg) translateY(-${yOffset}px)`;
            // Fade out as it scrolls
            const opacity = Math.max(0, HERO_LEAF.opacity - (scrollProgress * 1.5));
            heroLeafRef.current.style.opacity = opacity;
          }
          
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* LAYER 1: Forest Background */}
      <BackgroundLayer>
        <AmbientLight className="light1" />
        <AmbientLight className="light2" />
        <AmbientLight className="light3" />
        <AmbientLight className="light4" />
      </BackgroundLayer>
      
      {/* LAYER 2: Back Leaves */}
      <BackLeavesLayer>
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
      </BackLeavesLayer>
      
      {/* LAYER 3: Mid Leaves + Vignette */}
      <MidLeavesLayer>
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
      </MidLeavesLayer>
      
      {/* LAYER 4: Content (z-index: 10) - rendered elsewhere */}
      
      {/* LAYER 5: Foreground Leaves */}
      <ForegroundLayer>
        {FOREGROUND_LEAVES.map((config, index) => (
          <Leaf
            key={`fg-${index}`}
            ref={el => fgLeafRefs.current[index] = el}
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
      </ForegroundLayer>
      
      {/* LAYER 6: Hero Leaf - behind Nav (z-index 500), over content */}
      <HeroLeafLayer>
        <Leaf
          ref={heroLeafRef}
          src={LEAVES[HERO_LEAF.src]}
          style={{
            ...HERO_LEAF.style,
            filter: `blur(${HERO_LEAF.blur}px) brightness(${HERO_LEAF.brightness})`,
            opacity: HERO_LEAF.opacity,
          }}
          alt=""
          loading="eager"
        />
      </HeroLeafLayer>
    </>
  );
}

export default BotanicalBackground;
