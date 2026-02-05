import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import styled from 'styled-components';

// Forest background - optimized
const FOREST_BG = 'https://res.cloudinary.com/si-weddings/image/upload/q_auto,f_auto,w_1920/v1769793086/forest-6761846_1920_dumcnj.jpg';

// Cloudinary leaf images - optimized sizes
const LEAVES_DESKTOP = [
  'https://res.cloudinary.com/si-weddings/image/upload/w_400,q_auto,f_auto/v1769789868/pngwing.com_6_xo6v3t.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_400,q_auto,f_auto/v1769789866/pngwing.com_3_tz1fk6.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_400,q_auto,f_auto/v1769789866/pngwing.com_4_ugo8hl.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_400,q_auto,f_auto/v1769789865/pngwing.com_2_sxhekf.png',
];

const LEAVES_MOBILE = [
  'https://res.cloudinary.com/si-weddings/image/upload/w_200,q_auto,f_auto/v1769789868/pngwing.com_6_xo6v3t.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_200,q_auto,f_auto/v1769789866/pngwing.com_3_tz1fk6.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_200,q_auto,f_auto/v1769789866/pngwing.com_4_ugo8hl.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_200,q_auto,f_auto/v1769789865/pngwing.com_2_sxhekf.png',
];

// ===========================================
// STYLED COMPONENTS - MAX GPU OPTIMIZATION
// ===========================================

const BackgroundLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  transform: translate3d(0,0,0);
  will-change: transform;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url(${FOREST_BG}) center/cover no-repeat;
    filter: brightness(0.2) saturate(0.6);
    transform: translate3d(0,0,0);
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom,
      rgba(2, 8, 2, 0.5) 0%,
      rgba(2, 8, 2, 0.1) 30%,
      rgba(2, 8, 2, 0.1) 70%,
      rgba(2, 8, 2, 0.6) 100%
    );
  }
`;

const LeafLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${p => p.$zIndex || 2};
  pointer-events: none;
  transform: translate3d(0,0,0);
  contain: strict;
`;

const Vignette = styled.div`
  position: fixed;
  inset: 0;
  z-index: 4;
  background: radial-gradient(
    ellipse 65% 65% at 50% 50%,
    transparent 5%,
    rgba(2, 8, 2, 0.4) 50%,
    rgba(2, 8, 2, 0.85) 100%
  );
  pointer-events: none;
  transform: translate3d(0,0,0);
`;

const AmbientLight = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  
  &.light1 {
    width: 400px;
    height: 400px;
    background: rgba(30, 80, 45, 0.3);
    box-shadow: 0 0 150px 150px rgba(30, 80, 45, 0.2);
    top: -200px;
    left: -150px;
    @media (max-width: 768px) { width: 200px; height: 200px; box-shadow: 0 0 80px 80px rgba(30, 80, 45, 0.15); }
  }
  
  &.light2 {
    width: 350px;
    height: 350px;
    background: rgba(40, 90, 35, 0.25);
    box-shadow: 0 0 120px 120px rgba(40, 90, 35, 0.15);
    bottom: -150px;
    right: -100px;
    @media (max-width: 768px) { width: 180px; height: 180px; box-shadow: 0 0 60px 60px rgba(40, 90, 35, 0.1); }
  }
`;

// ===========================================
// LEAF CONFIGURATIONS
// ===========================================

const LEAVES_CONFIG_DESKTOP = [
  // Back layer - 4
  { src: 0, layer: 2, top: '-12%', left: '-5%', width: 350, rotate: 170, scaleX: -1, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.008 },
  { src: 1, layer: 2, top: '-10%', right: '-5%', width: 330, rotate: -170, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.01 },
  { src: 2, layer: 2, bottom: '-15%', left: '5%', width: 380, rotate: -8, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.007 },
  { src: 3, layer: 2, bottom: '-12%', right: '0%', width: 350, rotate: 10, scaleX: -1, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.009 },
  // Mid layer - 4
  { src: 0, layer: 3, top: '25%', left: '-5%', width: 280, rotate: 92, blur: 1, brightness: 0.55, opacity: 0.7, speed: 0.015 },
  { src: 1, layer: 3, top: '55%', right: '-5%', width: 270, rotate: -92, blur: 1, brightness: 0.55, opacity: 0.7, speed: 0.016 },
  { src: 2, layer: 3, top: '70%', left: '-4%', width: 260, rotate: 88, scaleY: -1, blur: 1, brightness: 0.55, opacity: 0.65, speed: 0.014 },
  { src: 3, layer: 3, top: '35%', right: '-4%', width: 250, rotate: -88, scaleY: -1, blur: 1, brightness: 0.55, opacity: 0.65, speed: 0.017 },
  // Foreground - 6 (statisch, kein Skalieren, nur minimale Parallax-Bewegung)
  { src: 2, layer: 100, top: '-5%', left: '-8%', width: 320, rotate: 130, blur: 0, brightness: 0.8, opacity: 0.95, speed: 0.003 },
  { src: 1, layer: 100, top: '-5%', right: '-8%', width: 300, rotate: -130, scaleX: -1, blur: 0, brightness: 0.8, opacity: 0.95, speed: 0.004 },
  { src: 0, layer: 100, top: '35%', left: '-10%', width: 300, rotate: 95, blur: 0, brightness: 0.75, opacity: 0.88, speed: 0.002 },
  { src: 3, layer: 100, top: '40%', right: '-10%', width: 280, rotate: -95, blur: 0, brightness: 0.75, opacity: 0.88, speed: 0.003 },
  { src: 3, layer: 100, bottom: '-8%', left: '-10%', width: 380, rotate: 50, blur: 0, brightness: 0.8, opacity: 0.92, speed: 0.002 },
  { src: 0, layer: 100, bottom: '-8%', right: '-10%', width: 360, rotate: -50, scaleX: -1, blur: 0, brightness: 0.8, opacity: 0.92, speed: 0.003 },
];

const LEAVES_CONFIG_MOBILE = [
  // Statisch an den Ecken, kein Skalieren
  { src: 2, layer: 100, top: '-5%', left: '-8%', width: 140, rotate: 130, blur: 0, brightness: 0.8, opacity: 0.9, speed: 0.002 },
  { src: 1, layer: 100, top: '-5%', right: '-8%', width: 130, rotate: -130, scaleX: -1, blur: 0, brightness: 0.8, opacity: 0.9, speed: 0.002 },
  { src: 3, layer: 100, bottom: '-5%', left: '-10%', width: 170, rotate: 50, blur: 0, brightness: 0.8, opacity: 0.88, speed: 0.001 },
  { src: 0, layer: 100, bottom: '-5%', right: '-10%', width: 160, rotate: -50, scaleX: -1, blur: 0, brightness: 0.8, opacity: 0.88, speed: 0.001 },
  // Hintergrund-Blätter
  { src: 0, layer: 3, top: '30%', left: '-8%', width: 120, rotate: 95, blur: 2, brightness: 0.5, opacity: 0.6, speed: 0.004 },
  { src: 1, layer: 3, top: '50%', right: '-8%', width: 110, rotate: -95, blur: 2, brightness: 0.5, opacity: 0.6, speed: 0.005 },
];

const HERO_LEAF = { src: 2, initialTop: -350, brightness: 0.85, opacity: 0.92, speed: 0.12, fadeStart: 200, fadeEnd: 600 };

// Memoized leaf component - prevents re-renders
const LeafImage = memo(({ src, style, leafRef }) => (
  <img
    ref={leafRef}
    src={src}
    alt=""
    loading="lazy"
    decoding="async"
    style={{
      position: 'absolute',
      pointerEvents: 'none',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      ...style,
    }}
  />
));

function BotanicalBackground() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const leafRefs = useRef([]);
  const heroLeafRef = useRef(null);
  const rafId = useRef(null);
  const lastScrollY = useRef(0);
  const maxScrollRef = useRef(1);

  const LEAVES_CONFIG = useMemo(() => isMobile ? LEAVES_CONFIG_MOBILE : LEAVES_CONFIG_DESKTOP, [isMobile]);
  const LEAVES = useMemo(() => isMobile ? LEAVES_MOBILE : LEAVES_DESKTOP, [isMobile]);

  // Debounced resize
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        if (mobile !== isMobile) setIsMobile(mobile);
        maxScrollRef.current = Math.max(1, document.body.scrollHeight - window.innerHeight);
      }, 200);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => { window.removeEventListener('resize', handleResize); clearTimeout(timeout); };
  }, [isMobile]);

  // Calculate max scroll once on mount and after images load
  useEffect(() => {
    const updateMaxScroll = () => {
      maxScrollRef.current = Math.max(1, document.body.scrollHeight - window.innerHeight);
    };
    updateMaxScroll();
    window.addEventListener('load', updateMaxScroll);
    return () => window.removeEventListener('load', updateMaxScroll);
  }, []);

  // Optimized scroll handler - pure transform updates
  useEffect(() => {
    const updateLeaves = () => {
      const scrollY = lastScrollY.current;
      const configs = LEAVES_CONFIG;
      const refs = leafRefs.current;
      
      for (let i = 0; i < configs.length; i++) {
        const leaf = refs[i];
        if (!leaf) continue;
        const c = configs[i];

        // Alle Blätter: nur minimale Parallax-Bewegung
        const yOffset = c.speed ? scrollY * c.speed : 0;
        leaf.style.transform = `translate3d(0,${yOffset}px,0) rotate(${c.rotate}deg)${c.scaleX ? ' scaleX(-1)' : ''}${c.scaleY ? ' scaleY(-1)' : ''}`;
      }
      
      // Hero leaf
      const hero = heroLeafRef.current;
      if (hero && !isMobile) {
        hero.style.transform = `translate3d(-50%,${-scrollY * HERO_LEAF.speed}px,0) rotate(180deg)`;
        if (scrollY > HERO_LEAF.fadeStart) {
          hero.style.opacity = Math.max(0, HERO_LEAF.opacity * (1 - (scrollY - HERO_LEAF.fadeStart) / (HERO_LEAF.fadeEnd - HERO_LEAF.fadeStart)));
        }
      }
      
      rafId.current = null;
    };
    
    const onScroll = () => {
      lastScrollY.current = window.scrollY;
      if (!rafId.current) rafId.current = requestAnimationFrame(updateLeaves);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile, LEAVES_CONFIG]);

  // Build style object for leaf
  const getLeafStyle = (c) => ({
    top: c.top, bottom: c.bottom, left: c.left, right: c.right,
    width: `${c.width}px`,
    transform: `translate3d(0,0,0) rotate(${c.rotate}deg)${c.scaleX ? ' scaleX(-1)' : ''}${c.scaleY ? ' scaleY(-1)' : ''}`,
    filter: c.blur ? `blur(${c.blur}px) brightness(${c.brightness})` : `brightness(${c.brightness})`,
    opacity: c.opacity,
  });

  return (
    <>
      <BackgroundLayer>
        <AmbientLight className="light1" />
        <AmbientLight className="light2" />
      </BackgroundLayer>
      
      {[2, 3, 100].map(z => (
        <LeafLayer key={z} $zIndex={z}>
          {LEAVES_CONFIG.map((c, i) => c.layer === z && (
            <LeafImage
              key={i}
              src={LEAVES[c.src]}
              style={getLeafStyle(c)}
              leafRef={el => leafRefs.current[i] = el}
            />
          ))}
        </LeafLayer>
      ))}
      
      <Vignette />
      
      {!isMobile && (
        <LeafLayer $zIndex={500}>
          <img
            ref={heroLeafRef}
            src={LEAVES_DESKTOP[HERO_LEAF.src]}
            alt=""
            loading="eager"
            decoding="async"
            style={{
              position: 'absolute',
              top: HERO_LEAF.initialTop,
              left: '50%',
              width: 400,
              transform: 'translate3d(-50%,0,0) rotate(180deg)',
              filter: `brightness(${HERO_LEAF.brightness})`,
              opacity: HERO_LEAF.opacity,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
            }}
          />
        </LeafLayer>
      )}
    </>
  );
}

export default memo(BotanicalBackground);
