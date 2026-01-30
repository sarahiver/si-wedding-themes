import React, { useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';

// Forest background - optimized
const FOREST_BG = 'https://res.cloudinary.com/si-weddings/image/upload/q_auto,f_auto/v1769793086/forest-6761846_1920_dumcnj.jpg';

// Cloudinary leaf images - smaller for better performance
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
// STYLED COMPONENTS - GPU OPTIMIZED
// ===========================================

const BackgroundLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  transform: translateZ(0);
  
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

const LeafLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${p => p.$zIndex || 2};
  overflow: hidden;
  pointer-events: none;
  transform: translateZ(0);
  contain: layout style paint;
  
  @media (max-width: 768px) {
    &.hide-mobile { display: none; }
  }
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
  transform: translateZ(0);
`;

const AmbientLight = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transform: translateZ(0);
  
  &.light1 {
    width: 400px;
    height: 400px;
    background: rgba(30, 80, 45, 0.3);
    box-shadow: 0 0 150px 150px rgba(30, 80, 45, 0.2);
    top: -200px;
    left: -150px;
    
    @media (max-width: 768px) {
      width: 200px;
      height: 200px;
      box-shadow: 0 0 80px 80px rgba(30, 80, 45, 0.15);
    }
  }
  
  &.light2 {
    width: 350px;
    height: 350px;
    background: rgba(40, 90, 35, 0.25);
    box-shadow: 0 0 120px 120px rgba(40, 90, 35, 0.15);
    bottom: -150px;
    right: -100px;
    
    @media (max-width: 768px) {
      width: 180px;
      height: 180px;
      box-shadow: 0 0 60px 60px rgba(40, 90, 35, 0.1);
    }
  }
`;

const Leaf = styled.img`
  position: absolute;
  pointer-events: none;
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

// ===========================================
// LEAF CONFIGURATIONS
// ===========================================

// Desktop: 16 leaves
const LEAVES_CONFIG_DESKTOP = [
  // Back layer - 4 leaves
  { src: 0, layer: 2, style: { top: '-12%', left: '-5%', width: '350px' }, rotate: 170, scaleX: -1, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.008 },
  { src: 1, layer: 2, style: { top: '-10%', right: '-5%', width: '330px' }, rotate: -170, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.01 },
  { src: 2, layer: 2, style: { bottom: '-15%', left: '5%', width: '380px' }, rotate: -8, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.007 },
  { src: 3, layer: 2, style: { bottom: '-12%', right: '0%', width: '350px' }, rotate: 10, scaleX: -1, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.009 },
  
  // Mid layer - 4 leaves
  { src: 0, layer: 3, style: { top: '25%', left: '-5%', width: '280px' }, rotate: 92, blur: 1, brightness: 0.55, opacity: 0.7, speed: 0.015 },
  { src: 1, layer: 3, style: { top: '55%', right: '-5%', width: '270px' }, rotate: -92, blur: 1, brightness: 0.55, opacity: 0.7, speed: 0.016 },
  { src: 2, layer: 3, style: { top: '70%', left: '-4%', width: '260px' }, rotate: 88, scaleY: -1, blur: 1, brightness: 0.55, opacity: 0.65, speed: 0.014 },
  { src: 3, layer: 3, style: { top: '35%', right: '-4%', width: '250px' }, rotate: -88, scaleY: -1, blur: 1, brightness: 0.55, opacity: 0.65, speed: 0.017 },
  
  // Foreground corners - TOP (smaller, same as before)
  { src: 2, layer: 100, style: { top: '-2%', left: '-2%', width: '400px' }, rotate: 130, blur: 0, brightness: 0.8, opacity: 0.95, origin: 'top left', baseScale: 0.88, maxScale: 1.08 },
  { src: 1, layer: 100, style: { top: '-2%', right: '-2%', width: '380px' }, rotate: -130, scaleX: -1, blur: 0, brightness: 0.8, opacity: 0.95, origin: 'top right', baseScale: 0.88, maxScale: 1.08 },
  
  // Foreground SIDES - BIGGER
  { src: 0, layer: 100, style: { top: '35%', left: '-3%', width: '380px' }, rotate: 95, blur: 0, brightness: 0.75, opacity: 0.88, origin: 'left center', baseScale: 0.85, maxScale: 1.06 },
  { src: 3, layer: 100, style: { top: '40%', right: '-3%', width: '360px' }, rotate: -95, blur: 0, brightness: 0.75, opacity: 0.88, origin: 'right center', baseScale: 0.85, maxScale: 1.06 },
  
  // Foreground BOTTOM - BIGGER
  { src: 3, layer: 100, style: { bottom: '-2%', left: '-3%', width: '480px' }, rotate: 50, blur: 0, brightness: 0.8, opacity: 0.92, origin: 'bottom left', baseScale: 0.85, maxScale: 1.1 },
  { src: 0, layer: 100, style: { bottom: '-2%', right: '-3%', width: '450px' }, rotate: -50, scaleX: -1, blur: 0, brightness: 0.8, opacity: 0.92, origin: 'bottom right', baseScale: 0.85, maxScale: 1.1 },
];

// Mobile: 6 leaves - corners bigger (except top)
const LEAVES_CONFIG_MOBILE = [
  // Top corners - smaller
  { src: 2, layer: 100, style: { top: '-3%', left: '-3%', width: '180px' }, rotate: 130, blur: 0, brightness: 0.8, opacity: 0.9, origin: 'top left', baseScale: 0.92, maxScale: 1.05 },
  { src: 1, layer: 100, style: { top: '-3%', right: '-3%', width: '170px' }, rotate: -130, scaleX: -1, blur: 0, brightness: 0.8, opacity: 0.9, origin: 'top right', baseScale: 0.92, maxScale: 1.05 },
  
  // Bottom corners - BIGGER
  { src: 3, layer: 100, style: { bottom: '-3%', left: '-4%', width: '220px' }, rotate: 50, blur: 0, brightness: 0.8, opacity: 0.88, origin: 'bottom left', baseScale: 0.9, maxScale: 1.06 },
  { src: 0, layer: 100, style: { bottom: '-3%', right: '-4%', width: '210px' }, rotate: -50, scaleX: -1, blur: 0, brightness: 0.8, opacity: 0.88, origin: 'bottom right', baseScale: 0.9, maxScale: 1.06 },
  
  // Sides
  { src: 0, layer: 3, style: { top: '30%', left: '-5%', width: '140px' }, rotate: 95, blur: 2, brightness: 0.5, opacity: 0.6, speed: 0.008 },
  { src: 1, layer: 3, style: { top: '50%', right: '-5%', width: '130px' }, rotate: -95, blur: 2, brightness: 0.5, opacity: 0.6, speed: 0.01 },
];

// Hero leaf config
const HERO_LEAF = {
  src: 2,
  initialTop: -350,
  brightness: 0.85,
  opacity: 0.92,
  speed: 0.12,
  fadeStart: 200,
  fadeEnd: 600,
};

function BotanicalBackground() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const leafRefs = useRef([]);
  const heroLeafRef = useRef(null);
  const rafId = useRef(null);
  const lastScrollY = useRef(0);

  const LEAVES_CONFIG = useMemo(() => 
    isMobile ? LEAVES_CONFIG_MOBILE : LEAVES_CONFIG_DESKTOP
  , [isMobile]);
  
  const LEAVES = useMemo(() => 
    isMobile ? LEAVES_MOBILE : LEAVES_DESKTOP
  , [isMobile]);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    
    const updateLeaves = () => {
      const scrollY = lastScrollY.current;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      leafRefs.current.forEach((leaf, index) => {
        if (!leaf) return;
        const config = LEAVES_CONFIG[index];
        if (!config) return;
        
        if (config.speed) {
          const y = scrollY * config.speed;
          leaf.style.transform = `translate3d(0, ${y}px, 0) rotate(${config.rotate}deg)${config.scaleX ? ' scaleX(-1)' : ''}${config.scaleY ? ' scaleY(-1)' : ''}`;
        } else if (config.baseScale) {
          const scale = config.baseScale + (scrollProgress * (config.maxScale - config.baseScale));
          leaf.style.transform = `translate3d(0, 0, 0) rotate(${config.rotate}deg) scale(${scale})${config.scaleX ? ' scaleX(-1)' : ''}${config.scaleY ? ' scaleY(-1)' : ''}`;
        }
      });
      
      if (heroLeafRef.current && !isMobile) {
        const y = -(scrollY * HERO_LEAF.speed);
        heroLeafRef.current.style.transform = `translate3d(-50%, ${y}px, 0) rotate(180deg)`;
        
        let opacity = HERO_LEAF.opacity;
        if (scrollY > HERO_LEAF.fadeStart) {
          const fadeProgress = Math.min((scrollY - HERO_LEAF.fadeStart) / (HERO_LEAF.fadeEnd - HERO_LEAF.fadeStart), 1);
          opacity = HERO_LEAF.opacity * (1 - fadeProgress);
        }
        heroLeafRef.current.style.opacity = opacity;
      }
      
      rafId.current = null;
    };
    
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updateLeaves);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile, LEAVES_CONFIG]);

  const getInitialTransform = (config) => {
    let transform = `translate3d(0, 0, 0) rotate(${config.rotate}deg)`;
    if (config.baseScale) transform += ` scale(${config.baseScale})`;
    if (config.scaleX) transform += ' scaleX(-1)';
    if (config.scaleY) transform += ' scaleY(-1)';
    return transform;
  };

  return (
    <>
      <BackgroundLayer>
        <AmbientLight className="light1" />
        <AmbientLight className="light2" />
      </BackgroundLayer>
      
      {[2, 3, 100].map(zIndex => (
        <LeafLayer key={zIndex} $zIndex={zIndex}>
          {LEAVES_CONFIG.filter(c => c.layer === zIndex).map((config, i) => {
            const globalIndex = LEAVES_CONFIG.findIndex(c => c === config);
            return (
              <Leaf
                key={`${zIndex}-${i}`}
                ref={el => leafRefs.current[globalIndex] = el}
                src={LEAVES[config.src]}
                style={{
                  ...config.style,
                  transform: getInitialTransform(config),
                  transformOrigin: config.origin || 'center',
                  filter: `blur(${config.blur || 0}px) brightness(${config.brightness})`,
                  opacity: config.opacity,
                }}
                alt=""
                loading="lazy"
                decoding="async"
              />
            );
          })}
        </LeafLayer>
      ))}
      
      <Vignette />
      
      {!isMobile && (
        <LeafLayer $zIndex={500}>
          <Leaf
            ref={heroLeafRef}
            src={LEAVES_DESKTOP[HERO_LEAF.src]}
            style={{
              top: `${HERO_LEAF.initialTop}px`,
              left: '50%',
              width: '400px',
              transform: 'translate3d(-50%, 0, 0) rotate(180deg)',
              filter: `brightness(${HERO_LEAF.brightness})`,
              opacity: HERO_LEAF.opacity,
            }}
            alt=""
            loading="eager"
            decoding="async"
          />
        </LeafLayer>
      )}
    </>
  );
}

export default BotanicalBackground;
