import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

// Forest background - optimized
const FOREST_BG = 'https://res.cloudinary.com/si-weddings/image/upload/q_auto,f_auto/v1769793086/forest-6761846_1920_dumcnj.jpg';

// Cloudinary leaf images - different sizes for mobile/desktop
const LEAVES_DESKTOP = [
  'https://res.cloudinary.com/si-weddings/image/upload/w_600,q_auto,f_auto/v1769789868/pngwing.com_6_xo6v3t.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_600,q_auto,f_auto/v1769789866/pngwing.com_3_tz1fk6.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_600,q_auto,f_auto/v1769789866/pngwing.com_4_ugo8hl.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_600,q_auto,f_auto/v1769789865/pngwing.com_2_sxhekf.png',
];

const LEAVES_MOBILE = [
  'https://res.cloudinary.com/si-weddings/image/upload/w_300,q_auto,f_auto/v1769789868/pngwing.com_6_xo6v3t.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_300,q_auto,f_auto/v1769789866/pngwing.com_3_tz1fk6.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_300,q_auto,f_auto/v1769789866/pngwing.com_4_ugo8hl.png',
  'https://res.cloudinary.com/si-weddings/image/upload/w_300,q_auto,f_auto/v1769789865/pngwing.com_2_sxhekf.png',
];

// ===========================================
// STYLED COMPONENTS
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

const BackLeavesLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
`;

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

const ForegroundLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  pointer-events: none;
`;

const HeroLeafLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 500;
  overflow: hidden;
  pointer-events: none;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

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
    
    @media (max-width: 768px) {
      width: 300px;
      height: 300px;
      top: -100px;
      left: -80px;
    }
  }
  
  &.light2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(40, 90, 35, 0.4) 0%, transparent 70%);
    bottom: -150px;
    right: -100px;
    opacity: 0.5;
    
    @media (max-width: 768px) {
      width: 250px;
      height: 250px;
      bottom: -80px;
      right: -60px;
    }
  }
  
  &.light3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(25, 65, 35, 0.35) 0%, transparent 70%);
    top: 35%;
    left: 20%;
    opacity: 0.4;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  &.light4 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(35, 75, 40, 0.3) 0%, transparent 70%);
    top: 60%;
    right: 15%;
    opacity: 0.4;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const Leaf = styled.img`
  position: absolute;
  pointer-events: none;
  will-change: transform;
`;

// ===========================================
// LEAF CONFIGURATIONS
// ===========================================

const BACK_LEAVES_DESKTOP = [
  { src: 0, style: { top: '-15%', left: '-5%', width: '400px', transform: 'rotate(170deg) scaleX(-1)' }, blur: 6, brightness: 0.35, opacity: 0.5, speed: 0.006 },
  { src: 1, style: { top: '-12%', right: '0%', width: '380px', transform: 'rotate(165deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.008 },
  { src: 2, style: { top: '-8%', left: '30%', width: '320px', transform: 'rotate(175deg)' }, blur: 6, brightness: 0.35, opacity: 0.45, speed: 0.005 },
  { src: 3, style: { top: '15%', left: '-15%', width: '420px', transform: 'rotate(100deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.007 },
  { src: 0, style: { top: '45%', left: '-12%', width: '380px', transform: 'rotate(85deg) scaleY(-1)' }, blur: 6, brightness: 0.35, opacity: 0.45, speed: 0.006 },
  { src: 1, style: { top: '75%', left: '-10%', width: '350px', transform: 'rotate(95deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.008 },
  { src: 2, style: { top: '20%', right: '-15%', width: '400px', transform: 'rotate(-95deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.007 },
  { src: 3, style: { top: '50%', right: '-12%', width: '370px', transform: 'rotate(-85deg) scaleY(-1)' }, blur: 6, brightness: 0.35, opacity: 0.45, speed: 0.006 },
  { src: 0, style: { top: '80%', right: '-10%', width: '340px', transform: 'rotate(-90deg)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.008 },
  { src: 1, style: { bottom: '-18%', left: '5%', width: '420px', transform: 'rotate(-10deg)' }, blur: 6, brightness: 0.35, opacity: 0.5, speed: 0.005 },
  { src: 2, style: { bottom: '-15%', right: '0%', width: '400px', transform: 'rotate(12deg) scaleX(-1)' }, blur: 5, brightness: 0.4, opacity: 0.5, speed: 0.007 },
  { src: 3, style: { bottom: '-12%', left: '40%', width: '350px', transform: 'rotate(-5deg)' }, blur: 6, brightness: 0.35, opacity: 0.45, speed: 0.006 },
];

const BACK_LEAVES_MOBILE = [
  { src: 0, style: { top: '-8%', left: '-8%', width: '180px', transform: 'rotate(140deg)' }, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.004 },
  { src: 1, style: { top: '-8%', right: '-8%', width: '170px', transform: 'rotate(-140deg) scaleX(-1)' }, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.005 },
  { src: 2, style: { bottom: '-10%', left: '-5%', width: '200px', transform: 'rotate(40deg)' }, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.004 },
  { src: 3, style: { bottom: '-10%', right: '-5%', width: '190px', transform: 'rotate(-40deg) scaleX(-1)' }, blur: 4, brightness: 0.4, opacity: 0.5, speed: 0.005 },
];

const MID_LEAVES_DESKTOP = [
  { src: 2, style: { top: '-6%', left: '15%', width: '300px', transform: 'rotate(175deg)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.014 },
  { src: 3, style: { top: '-5%', right: '20%', width: '280px', transform: 'rotate(170deg) scaleX(-1)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.016 },
  { src: 0, style: { top: '25%', left: '-5%', width: '320px', transform: 'rotate(92deg)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.015 },
  { src: 1, style: { top: '55%', left: '-4%', width: '300px', transform: 'rotate(88deg) scaleY(-1)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.013 },
  { src: 2, style: { top: '30%', right: '-5%', width: '310px', transform: 'rotate(-92deg)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.016 },
  { src: 3, style: { top: '60%', right: '-4%', width: '290px', transform: 'rotate(-88deg) scaleY(-1)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.014 },
  { src: 0, style: { bottom: '-6%', left: '25%', width: '320px', transform: 'rotate(8deg)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.015 },
  { src: 1, style: { bottom: '-5%', right: '20%', width: '300px', transform: 'rotate(-8deg) scaleX(-1)' }, blur: 2, brightness: 0.55, opacity: 0.7, speed: 0.017 },
];

const MID_LEAVES_MOBILE = [
  { src: 0, style: { top: '20%', left: '-6%', width: '160px', transform: 'rotate(95deg)' }, blur: 1, brightness: 0.55, opacity: 0.65, speed: 0.01 },
  { src: 1, style: { top: '50%', right: '-6%', width: '150px', transform: 'rotate(-95deg)' }, blur: 1, brightness: 0.55, opacity: 0.65, speed: 0.012 },
];

const FOREGROUND_LEAVES_DESKTOP = [
  { src: 2, style: { top: '-2%', left: '-2%', width: '450px', transform: 'rotate(130deg)' }, blur: 0, brightness: 0.8, opacity: 0.95, origin: 'top left', baseScale: 0.85, maxScale: 1.12 },
  { src: 0, style: { top: '3%', left: '-4%', width: '320px', transform: 'rotate(110deg) scaleX(-1)' }, blur: 0, brightness: 0.75, opacity: 0.9, origin: 'top left', baseScale: 0.9, maxScale: 1.08 },
  { src: 3, style: { top: '10%', left: '0%', width: '250px', transform: 'rotate(125deg)' }, blur: 0.5, brightness: 0.7, opacity: 0.85, origin: 'top left', baseScale: 0.92, maxScale: 1.05 },
  { src: 1, style: { top: '-2%', right: '-2%', width: '430px', transform: 'rotate(-130deg) scaleX(-1)' }, blur: 0, brightness: 0.8, opacity: 0.95, origin: 'top right', baseScale: 0.85, maxScale: 1.12 },
  { src: 3, style: { top: '5%', right: '-3%', width: '300px', transform: 'rotate(-115deg)' }, blur: 0, brightness: 0.75, opacity: 0.9, origin: 'top right', baseScale: 0.9, maxScale: 1.06 },
  { src: 2, style: { top: '12%', right: '0%', width: '240px', transform: 'rotate(-120deg) scaleX(-1)' }, blur: 0.5, brightness: 0.7, opacity: 0.85, origin: 'top right', baseScale: 0.92, maxScale: 1.04 },
  { src: 0, style: { top: '40%', left: '-2%', width: '280px', transform: 'rotate(95deg)' }, blur: 0, brightness: 0.75, opacity: 0.88, origin: 'left center', baseScale: 0.9, maxScale: 1.06 },
  { src: 1, style: { top: '65%', left: '-1%', width: '260px', transform: 'rotate(85deg) scaleY(-1)' }, blur: 0, brightness: 0.75, opacity: 0.85, origin: 'left center', baseScale: 0.92, maxScale: 1.05 },
  { src: 2, style: { top: '45%', right: '-2%', width: '270px', transform: 'rotate(-95deg)' }, blur: 0, brightness: 0.75, opacity: 0.88, origin: 'right center', baseScale: 0.9, maxScale: 1.06 },
  { src: 3, style: { top: '70%', right: '-1%', width: '250px', transform: 'rotate(-85deg) scaleY(-1)' }, blur: 0, brightness: 0.75, opacity: 0.85, origin: 'right center', baseScale: 0.92, maxScale: 1.04 },
  { src: 3, style: { bottom: '-1%', left: '-2%', width: '400px', transform: 'rotate(50deg)' }, blur: 0, brightness: 0.8, opacity: 0.92, origin: 'bottom left', baseScale: 0.88, maxScale: 1.1 },
  { src: 1, style: { bottom: '5%', left: '-1%', width: '280px', transform: 'rotate(65deg) scaleY(-1)' }, blur: 0, brightness: 0.75, opacity: 0.85, origin: 'bottom left', baseScale: 0.92, maxScale: 1.05 },
  { src: 0, style: { bottom: '-1%', right: '-2%', width: '380px', transform: 'rotate(-50deg) scaleX(-1)' }, blur: 0, brightness: 0.8, opacity: 0.92, origin: 'bottom right', baseScale: 0.88, maxScale: 1.1 },
  { src: 2, style: { bottom: '5%', right: '-1%', width: '260px', transform: 'rotate(-60deg)' }, blur: 0, brightness: 0.75, opacity: 0.85, origin: 'bottom right', baseScale: 0.92, maxScale: 1.04 },
];

const FOREGROUND_LEAVES_MOBILE = [
  { src: 2, style: { top: '-3%', left: '-3%', width: '200px', transform: 'rotate(130deg)' }, blur: 0, brightness: 0.8, opacity: 0.9, origin: 'top left', baseScale: 0.9, maxScale: 1.08 },
  { src: 1, style: { top: '-3%', right: '-3%', width: '190px', transform: 'rotate(-130deg) scaleX(-1)' }, blur: 0, brightness: 0.8, opacity: 0.9, origin: 'top right', baseScale: 0.9, maxScale: 1.08 },
  { src: 3, style: { bottom: '-2%', left: '-3%', width: '180px', transform: 'rotate(50deg)' }, blur: 0, brightness: 0.8, opacity: 0.88, origin: 'bottom left', baseScale: 0.92, maxScale: 1.06 },
  { src: 0, style: { bottom: '-2%', right: '-3%', width: '170px', transform: 'rotate(-50deg) scaleX(-1)' }, blur: 0, brightness: 0.8, opacity: 0.88, origin: 'bottom right', baseScale: 0.92, maxScale: 1.06 },
];

// Hero leaf - higher position, slower fade
const HERO_LEAF = {
  src: 2,
  initialTop: -350, // Higher - mostly hidden
  blur: 0,
  brightness: 0.85,
  opacity: 0.92,
  speed: 0.12,
  fadeStart: 200, // Start fading later
  fadeEnd: 600,   // Fade out slower
};

function BotanicalBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const backLeafRefs = useRef([]);
  const midLeafRefs = useRef([]);
  const fgLeafRefs = useRef([]);
  const heroLeafRef = useRef(null);
  const scrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const LEAVES = isMobile ? LEAVES_MOBILE : LEAVES_DESKTOP;
  const BACK_LEAVES = isMobile ? BACK_LEAVES_MOBILE : BACK_LEAVES_DESKTOP;
  const MID_LEAVES = isMobile ? MID_LEAVES_MOBILE : MID_LEAVES_DESKTOP;
  const FOREGROUND_LEAVES = isMobile ? FOREGROUND_LEAVES_MOBILE : FOREGROUND_LEAVES_DESKTOP;

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const scrollProgress = Math.min(scrollY.current / Math.max(maxScroll, 1), 1);
          
          backLeafRefs.current.forEach((leaf, index) => {
            if (leaf && BACK_LEAVES[index]) {
              const speed = BACK_LEAVES[index].speed;
              const yOffset = scrollY.current * speed;
              const baseTransform = BACK_LEAVES[index].style.transform || '';
              leaf.style.transform = `${baseTransform} translateY(${yOffset}px)`;
            }
          });
          
          midLeafRefs.current.forEach((leaf, index) => {
            if (leaf && MID_LEAVES[index]) {
              const speed = MID_LEAVES[index].speed;
              const yOffset = scrollY.current * speed;
              const baseTransform = MID_LEAVES[index].style.transform || '';
              leaf.style.transform = `${baseTransform} translateY(${yOffset}px)`;
            }
          });
          
          fgLeafRefs.current.forEach((leaf, index) => {
            if (leaf && FOREGROUND_LEAVES[index]) {
              const config = FOREGROUND_LEAVES[index];
              const baseTransform = config.style.transform || '';
              const scale = config.baseScale + (scrollProgress * (config.maxScale - config.baseScale));
              leaf.style.transform = `${baseTransform} scale(${scale})`;
            }
          });
          
          // Hero leaf - scrolls UP and out, slower fade
          if (heroLeafRef.current && !isMobile) {
            const yOffset = scrollY.current * HERO_LEAF.speed;
            const newTop = HERO_LEAF.initialTop - yOffset;
            heroLeafRef.current.style.top = `${newTop}px`;
            
            // Slower fade out
            let opacity = HERO_LEAF.opacity;
            if (scrollY.current > HERO_LEAF.fadeStart) {
              const fadeProgress = (scrollY.current - HERO_LEAF.fadeStart) / (HERO_LEAF.fadeEnd - HERO_LEAF.fadeStart);
              opacity = Math.max(0, HERO_LEAF.opacity * (1 - fadeProgress));
            }
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
  }, [isMobile, BACK_LEAVES, MID_LEAVES, FOREGROUND_LEAVES]);

  return (
    <>
      <BackgroundLayer>
        <AmbientLight className="light1" />
        <AmbientLight className="light2" />
        <AmbientLight className="light3" />
        <AmbientLight className="light4" />
      </BackgroundLayer>
      
      <BackLeavesLayer>
        {BACK_LEAVES.map((config, index) => (
          <Leaf
            key={`back-${index}`}
            ref={el => backLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
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
      
      <MidLeavesLayer>
        {MID_LEAVES.map((config, index) => (
          <Leaf
            key={`mid-${index}`}
            ref={el => midLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
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
      
      <ForegroundLayer>
        {FOREGROUND_LEAVES.map((config, index) => (
          <Leaf
            key={`fg-${index}`}
            ref={el => fgLeafRefs.current[index] = el}
            src={LEAVES[config.src]}
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
      
      <HeroLeafLayer>
        <Leaf
          ref={heroLeafRef}
          src={LEAVES_DESKTOP[HERO_LEAF.src]}
          style={{
            top: `${HERO_LEAF.initialTop}px`,
            left: '50%',
            width: '450px',
            transform: 'translateX(-50%) rotate(180deg)',
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
