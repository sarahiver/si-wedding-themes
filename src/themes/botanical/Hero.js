import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const drawLine = keyframes`
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: translateX(-50%) scaleY(1); }
  50% { opacity: 0.6; transform: translateX(-50%) scaleY(1.2); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  overflow: hidden;
`;

const CursorGlow = styled.div`
  position: fixed;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LineArt = styled.div`
  position: absolute;
  width: 180px;
  height: 320px;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  path, circle {
    fill: none;
    stroke: var(--zen-text);
    stroke-width: 0.5;
    opacity: 0.12;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: ${drawLine} 2.5s ease forwards;
    animation-delay: 0.5s;
  }
  
  &.left {
    left: 8%;
    top: 50%;
    transform: translateY(-50%);
  }
  
  &.right {
    right: 8%;
    top: 50%;
    transform: translateY(-50%) scaleX(-1);
  }
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--zen-text-light);
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 0.3s;
`;

const Names = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 12vw, 7rem);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--zen-text);
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 0.5s;
`;

const Ampersand = styled.span`
  display: block;
  font-size: 0.25em;
  font-style: italic;
  color: var(--zen-text-light);
  margin: 0.6em 0;
`;

const DateText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--zen-text-light);
  letter-spacing: 0.3em;
  margin-top: 3rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 0.9s;
`;

const Location = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 300;
  color: var(--zen-text-muted);
  letter-spacing: 0.2em;
  margin-top: 0.5rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 1.1s;
`;

const ScrollLine = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--zen-line), transparent);
  animation: ${pulse} 2s ease-in-out infinite;
  animation-delay: 2s;
`;

// ============================================
// COMPONENT
// ============================================

function Hero() {
  const { content, coupleNames, weddingDate } = useWedding();
  const hero = content?.hero || {};
  const glowRef = useRef(null);
  
  // Cursor glow effect
  useEffect(() => {
    let mx = 0, my = 0, gx = 0, gy = 0;
    
    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    
    const animate = () => {
      if (glowRef.current) {
        gx += (mx - gx) * 0.08;
        gy += (my - gy) * 0.08;
        glowRef.current.style.left = gx + 'px';
        glowRef.current.style.top = gy + 'px';
      }
      requestAnimationFrame(animate);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  // Parse couple names
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Anna', 'Thomas'];
  const name1 = names[0] || 'Anna';
  const name2 = names[1] || 'Thomas';
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} · ${month} · ${year}`;
  };

  return (
    <Section id="top">
      <CursorGlow ref={glowRef} />
      
      {/* Left botanical line art */}
      <LineArt className="left">
        <svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMid meet">
          <path d="
            M 50 200
            C 50 180, 48 160, 50 140
            C 52 120, 45 100, 50 80
            C 55 60, 50 40, 50 20
            M 50 140 C 40 130, 25 125, 15 130
            M 50 140 C 60 130, 75 125, 85 130
            M 50 100 C 35 95, 20 90, 10 95
            M 50 100 C 65 95, 80 90, 90 95
            M 50 60 C 40 55, 30 50, 20 55
            M 50 60 C 60 55, 70 50, 80 55
          "/>
          <circle cx="15" cy="130" r="3"/>
          <circle cx="85" cy="130" r="3"/>
          <circle cx="10" cy="95" r="2"/>
          <circle cx="90" cy="95" r="2"/>
          <circle cx="20" cy="55" r="2"/>
          <circle cx="80" cy="55" r="2"/>
          <circle cx="50" cy="18" r="4"/>
        </svg>
      </LineArt>
      
      {/* Right botanical line art (mirrored) */}
      <LineArt className="right">
        <svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMid meet">
          <path d="
            M 50 200
            C 50 180, 48 160, 50 140
            C 52 120, 45 100, 50 80
            C 55 60, 50 40, 50 20
            M 50 140 C 40 130, 25 125, 15 130
            M 50 140 C 60 130, 75 125, 85 130
            M 50 100 C 35 95, 20 90, 10 95
            M 50 100 C 65 95, 80 90, 90 95
            M 50 60 C 40 55, 30 50, 20 55
            M 50 60 C 60 55, 70 50, 80 55
          "/>
          <circle cx="15" cy="130" r="3"/>
          <circle cx="85" cy="130" r="3"/>
          <circle cx="10" cy="95" r="2"/>
          <circle cx="90" cy="95" r="2"/>
          <circle cx="20" cy="55" r="2"/>
          <circle cx="80" cy="55" r="2"/>
          <circle cx="50" cy="18" r="4"/>
        </svg>
      </LineArt>
      
      <Content>
        <Eyebrow>{hero.tagline || 'Wir heiraten'}</Eyebrow>
        <Names>
          {name1}
          <Ampersand>&</Ampersand>
          {name2}
        </Names>
        {weddingDate && <DateText>{formatDate(weddingDate)}</DateText>}
        {hero.location_short && <Location>{hero.location_short}</Location>}
      </Content>
      
      <ScrollLine />
    </Section>
  );
}

export default Hero;
