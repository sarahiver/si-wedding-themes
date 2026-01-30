import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Cloudinary leaf PNGs
const LEAF_IMAGES = [
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
  z-index: 0;
  overflow: hidden;
  background: var(--bg-gradient);
  pointer-events: none;
`;

const AmbientLight = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  pointer-events: none;
`;

const Ambient1 = styled(AmbientLight)`
  width: 700px;
  height: 700px;
  top: -250px;
  left: -150px;
  background: radial-gradient(circle, rgba(25, 60, 35, 0.6) 0%, transparent 70%);
`;

const Ambient2 = styled(AmbientLight)`
  width: 600px;
  height: 600px;
  bottom: -150px;
  right: -150px;
  background: radial-gradient(circle, rgba(20, 55, 40, 0.5) 0%, transparent 70%);
`;

const Ambient3 = styled(AmbientLight)`
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(15, 45, 25, 0.3) 0%, transparent 70%);
`;

const Leaf = styled.div`
  position: absolute;
  pointer-events: none;
  will-change: transform;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  /* Back layer - most blurred */
  &.back img {
    filter: blur(8px) brightness(0.25) saturate(0.7);
  }
  
  /* Mid layer */
  &.mid img {
    filter: blur(3px) brightness(0.4) saturate(0.8);
  }
  
  /* Front layer - sharpest */
  &.front img {
    filter: blur(0) brightness(0.6) saturate(0.9);
  }
`;

const Leaf1 = styled(Leaf)`
  width: 450px;
  top: -50px;
  left: -100px;
  transform: rotate(-15deg);
  z-index: 3;
  
  @media (max-width: 768px) {
    width: 280px;
    left: -80px;
  }
`;

const Leaf2 = styled(Leaf)`
  width: 400px;
  top: 5%;
  right: -80px;
  transform: rotate(20deg) scaleX(-1);
  z-index: 1;
  
  @media (max-width: 768px) {
    width: 250px;
    right: -60px;
  }
`;

const Leaf3 = styled(Leaf)`
  width: 500px;
  bottom: -80px;
  left: -120px;
  transform: rotate(25deg);
  z-index: 3;
  
  @media (max-width: 768px) {
    width: 300px;
    left: -100px;
  }
`;

const Leaf4 = styled(Leaf)`
  width: 380px;
  bottom: 15%;
  right: -70px;
  transform: rotate(-30deg);
  z-index: 2;
  
  @media (max-width: 768px) {
    width: 230px;
    right: -50px;
  }
`;

const Leaf5 = styled(Leaf)`
  width: 320px;
  top: 35%;
  left: -90px;
  transform: rotate(5deg);
  z-index: 2;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Leaf6 = styled(Leaf)`
  width: 360px;
  top: 55%;
  right: -100px;
  transform: rotate(-20deg) scaleX(-1);
  z-index: 1;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%);
  z-index: 4;
  pointer-events: none;
`;

function BotanicalBackground() {
  const leaf1Ref = useRef(null);
  const leaf2Ref = useRef(null);
  const leaf3Ref = useRef(null);
  const leaf4Ref = useRef(null);
  const leaf5Ref = useRef(null);
  const leaf6Ref = useRef(null);
  
  useEffect(() => {
    const leaves = [
      { ref: leaf1Ref, speed: 0.015, baseTransform: 'rotate(-15deg)' },
      { ref: leaf2Ref, speed: 0.03, baseTransform: 'rotate(20deg) scaleX(-1)' },
      { ref: leaf3Ref, speed: 0.045, baseTransform: 'rotate(25deg)' },
      { ref: leaf4Ref, speed: 0.025, baseTransform: 'rotate(-30deg)' },
      { ref: leaf5Ref, speed: 0.035, baseTransform: 'rotate(5deg)' },
      { ref: leaf6Ref, speed: 0.02, baseTransform: 'rotate(-20deg) scaleX(-1)' },
    ];
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          leaves.forEach(({ ref, speed, baseTransform }) => {
            if (ref.current) {
              ref.current.style.transform = `${baseTransform} translateY(${scrollY * speed}px)`;
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BackgroundContainer>
      {/* Ambient lighting */}
      <Ambient1 />
      <Ambient2 />
      <Ambient3 />
      
      {/* Back layer (most blurred) */}
      <Leaf2 ref={leaf2Ref} className="back">
        <img src={LEAF_IMAGES[1]} alt="" loading="lazy" />
      </Leaf2>
      <Leaf6 ref={leaf6Ref} className="back">
        <img src={LEAF_IMAGES[5]} alt="" loading="lazy" />
      </Leaf6>
      
      {/* Mid layer */}
      <Leaf4 ref={leaf4Ref} className="mid">
        <img src={LEAF_IMAGES[3]} alt="" loading="lazy" />
      </Leaf4>
      <Leaf5 ref={leaf5Ref} className="mid">
        <img src={LEAF_IMAGES[4]} alt="" loading="lazy" />
      </Leaf5>
      
      {/* Front layer (sharpest) */}
      <Leaf1 ref={leaf1Ref} className="front">
        <img src={LEAF_IMAGES[0]} alt="" loading="lazy" />
      </Leaf1>
      <Leaf3 ref={leaf3Ref} className="front">
        <img src={LEAF_IMAGES[2]} alt="" loading="lazy" />
      </Leaf3>
      
      <Vignette />
    </BackgroundContainer>
  );
}

export default BotanicalBackground;
