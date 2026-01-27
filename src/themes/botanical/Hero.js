import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const floatSlow = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -20px) rotate(5deg); }
  50% { transform: translate(-10px, -35px) rotate(-3deg); }
  75% { transform: translate(-20px, -15px) rotate(2deg); }
`;

const floatMedium = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-20px, -25px) rotate(-8deg); }
  66% { transform: translate(15px, -40px) rotate(5deg); }
`;

const floatFast = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  50% { transform: translate(10px, -30px) rotate(10deg) scale(1.05); }
`;

const sway = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const growLine = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg, 
    var(--cream) 0%, 
    var(--cream-dark) 50%,
    var(--cream) 100%
  );
`;

// Floating Botanical Elements
const Leaf = styled.div`
  position: absolute;
  width: ${p => p.size || 60}px;
  height: ${p => p.size || 60}px;
  opacity: ${p => p.opacity || 0.6};
  top: ${p => p.top};
  left: ${p => p.left};
  right: ${p => p.right};
  bottom: ${p => p.bottom};
  animation: ${p => 
    p.animation === 'slow' ? floatSlow : 
    p.animation === 'fast' ? floatFast : 
    floatMedium
  } ${p => p.duration || 8}s ease-in-out infinite;
  animation-delay: ${p => p.delay || 0}s;
  pointer-events: none;
  z-index: 1;
  will-change: transform;
  
  svg {
    width: 100%;
    height: 100%;
    fill: ${p => p.color || 'var(--sage)'};
    filter: drop-shadow(0 4px 8px rgba(139, 157, 131, 0.2));
  }
`;

const Flower = styled.div`
  position: absolute;
  width: ${p => p.size || 40}px;
  height: ${p => p.size || 40}px;
  opacity: ${p => p.opacity || 0.5};
  top: ${p => p.top};
  left: ${p => p.left};
  right: ${p => p.right};
  bottom: ${p => p.bottom};
  animation: ${floatSlow} ${p => p.duration || 10}s ease-in-out infinite;
  animation-delay: ${p => p.delay || 0}s;
  pointer-events: none;
  z-index: 1;
  will-change: transform;
  
  svg {
    width: 100%;
    height: 100%;
    fill: ${p => p.color || 'var(--blush)'};
    filter: drop-shadow(0 4px 8px rgba(232, 213, 213, 0.3));
  }
`;

const Branch = styled.div`
  position: absolute;
  width: ${p => p.size || 200}px;
  height: auto;
  opacity: 0.1;
  top: ${p => p.top};
  left: ${p => p.left};
  right: ${p => p.right};
  transform-origin: bottom center;
  animation: ${sway} ${p => p.duration || 6}s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
  
  svg {
    width: 100%;
    height: auto;
    fill: var(--sage-dark);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 2rem;
  max-width: 900px;
  animation: ${breathe} 8s ease-in-out infinite;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 0.2s;
`;

const Names = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(3.5rem, 12vw, 8rem);
  font-weight: 400;
  color: var(--forest);
  line-height: 1.1;
  margin-bottom: 2rem;
  
  .line {
    display: block;
    opacity: 0;
    animation: ${fadeInUp} 1.2s ease forwards;
  }
  
  .line-1 { animation-delay: 0.4s; }
  
  .ampersand { 
    animation-delay: 0.6s;
    font-style: italic;
    color: var(--sage);
    font-size: 0.5em;
    display: inline-block;
    margin: 0 0.3em;
    vertical-align: middle;
  }
  
  .line-2 { animation-delay: 0.8s; }
`;

const Ornament = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 2rem 0;
  opacity: 0;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 1s;
  
  .leaf {
    width: 30px;
    height: 30px;
    fill: var(--sage);
    animation: ${sway} 4s ease-in-out infinite;
  }
  
  .line {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--sage), transparent);
  }
`;

const DateText = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.3rem, 3vw, 2rem);
  font-style: italic;
  color: var(--text);
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 1.2s;
`;

const Location = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-light);
  opacity: 0;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 1.4s;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 1.8s;
  cursor: pointer;
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateX(-50%) translateY(-5px);
  }
  
  span {
    font-family: 'Lato', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--sage-dark);
    margin-bottom: 1rem;
  }
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 50px;
  background: linear-gradient(180deg, var(--sage), transparent);
  transform-origin: top;
  animation: ${growLine} 1s ease forwards;
  animation-delay: 2s;
`;

// Parallax Background Layer
const ParallaxLayer = styled.div`
  position: absolute;
  inset: 0;
  transform: translateY(${p => p.offset}px);
  transition: transform 0.1s ease-out;
  pointer-events: none;
`;

// ═══════════════════════════════════════════════════════════════════════════
// SVG COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const LeafSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z M50 20 C50 20 50 80 50 80" 
      strokeWidth="2" stroke="currentColor" fill="currentColor" opacity="0.3"/>
  </svg>
);

const FlowerSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="15" />
    <ellipse cx="50" cy="20" rx="12" ry="20" />
    <ellipse cx="50" cy="80" rx="12" ry="20" />
    <ellipse cx="20" cy="50" rx="20" ry="12" />
    <ellipse cx="80" cy="50" rx="20" ry="12" />
  </svg>
);

const SmallLeafSVG = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="leaf">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Hero({
  name1 = 'Olivia',
  name2 = 'Benjamin',
  date = '21. Juni 2025',
  location = 'Botanischer Garten, München',
  eyebrow = 'Wir heiraten',
}) {
  const [leaves, setLeaves] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  // Generate random floating elements
  useEffect(() => {
    const newLeaves = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      size: 30 + Math.random() * 60,
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 90}%`,
      duration: 8 + Math.random() * 8,
      delay: Math.random() * 4,
      opacity: 0.25 + Math.random() * 0.45,
      animation: ['slow', 'medium', 'fast'][Math.floor(Math.random() * 3)],
    }));
    
    const newFlowers = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 20 + Math.random() * 35,
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 90}%`,
      duration: 10 + Math.random() * 6,
      delay: Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.35,
    }));
    
    setLeaves(newLeaves);
    setFlowers(newFlowers);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setParallaxOffset(scrollY * 0.3);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById('countdown');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="top">
      <ParallaxLayer offset={parallaxOffset * 0.5}>
        {/* Corner Branches */}
        <Branch size={280} top="-8%" left="-8%" duration={8}>
          <LeafSVG />
        </Branch>
        <Branch size={220} top="-5%" right="-5%" duration={7} style={{ transform: 'scaleX(-1)' }}>
          <LeafSVG />
        </Branch>
      </ParallaxLayer>

      <ParallaxLayer offset={parallaxOffset * 0.2}>
        {/* Floating Leaves */}
        {leaves.map(leaf => (
          <Leaf key={`leaf-${leaf.id}`} {...leaf}>
            <LeafSVG />
          </Leaf>
        ))}
      </ParallaxLayer>
      
      <ParallaxLayer offset={parallaxOffset * 0.1}>
        {/* Floating Flowers */}
        {flowers.map(flower => (
          <Flower key={`flower-${flower.id}`} {...flower} color="var(--blush)">
            <FlowerSVG />
          </Flower>
        ))}
      </ParallaxLayer>
      
      <Content>
        <Eyebrow>{eyebrow}</Eyebrow>
        
        <Names>
          <span className="line line-1">{name1}</span>
          <span className="line ampersand">&</span>
          <span className="line line-2">{name2}</span>
        </Names>
        
        <Ornament>
          <div className="line" />
          <SmallLeafSVG />
          <div className="line" />
        </Ornament>
        
        <DateText>{date}</DateText>
        <Location>{location}</Location>
      </Content>
      
      <ScrollIndicator onClick={scrollToContent}>
        <span>Entdecken</span>
        <ScrollLine />
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
