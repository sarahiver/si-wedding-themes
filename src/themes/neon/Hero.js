import { useWedding } from '../../context/WeddingContext';
// src/components/Hero.js - Neon Theme
import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const glitchAnim = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  80% { transform: translate(3px, -3px); }
`;

const neonFlicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.7; }
  94% { opacity: 1; }
  97% { opacity: 0.9; }
`;

const scanlineAnim = keyframes`
  0% { top: -100%; }
  100% { top: 100%; }
`;

const floatAnim = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0a0f;
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center top;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 1s ease;
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: ${pulseGlow} 4s ease-in-out infinite;
  
  &:nth-child(1) {
    width: 400px;
    height: 400px;
    background: rgba(0,255,255,0.3);
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    width: 300px;
    height: 300px;
    background: rgba(255,0,255,0.3);
    bottom: -50px;
    right: -50px;
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    width: 200px;
    height: 200px;
    background: rgba(0,255,136,0.2);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 1s;
  }
`;

const Scanline = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent);
  animation: ${scanlineAnim} 6s linear infinite;
  pointer-events: none;
`;

const FloatingShape = styled.div`
  position: absolute;
  border: 1px solid rgba(0,255,255,0.3);
  animation: ${floatAnim} ${p => 6 + p.$delay}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
  
  ${p => p.$shape === 'square' && css`
    width: 60px;
    height: 60px;
  `}
  
  ${p => p.$shape === 'circle' && css`
    width: 40px;
    height: 40px;
    border-radius: 50%;
  `}
  
  ${p => p.$shape === 'diamond' && css`
    width: 50px;
    height: 50px;
    transform: rotate(45deg);
  `}
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 5%;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0,255,255,0.5);
  margin-bottom: 30px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  
  &::before, &::after {
    content: '//';
    margin: 0 15px;
    color: #ff00ff;
  }
`;

const Names = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 700;
  line-height: 0.9;
  color: #fff;
  text-transform: uppercase;
  position: relative;
  margin-bottom: 30px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '50px'});
  transition: all 1s ease 0.2s;
  
  /* Glitch Layers */
  &::before, &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  
  &::before {
    color: #00ffff;
    z-index: -1;
    animation: ${glitchAnim} 3s ease-in-out infinite;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  }
  
  &::after {
    color: #ff00ff;
    z-index: -2;
    animation: ${glitchAnim} 3s ease-in-out infinite reverse;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  }
`;

const Ampersand = styled.span`
  display: block;
  font-size: 0.4em;
  font-weight: 300;
  font-style: italic;
  color: #ff00ff;
  text-shadow: 0 0 20px rgba(255,0,255,0.5);
  animation: ${neonFlicker} 4s ease-in-out infinite;
  margin: 20px 0;
`;

const DateDisplay = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #00ffff;
  text-shadow: 0 0 15px rgba(0,255,255,0.5);
  letter-spacing: 0.2em;
  margin-bottom: 20px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease 0.4s;
`;

const Location = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.1em;
  margin-bottom: 50px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease 0.5s;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: #00ff88;
  border: 1px solid rgba(0,255,136,0.3);
  padding: 15px 30px;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.8s ease 0.6s;
  
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00ff88;
    box-shadow: 0 0 10px #00ff88;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.4);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 1s ease 1s;
  
  &::after {
    content: '';
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, #00ffff, transparent);
    animation: ${scanlineAnim} 2s ease-in-out infinite;
  }
`;

const CornerDecor = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0,255,255,0.2);
  
  &:nth-child(1) {
    top: 30px;
    left: 30px;
    border-right: none;
    border-bottom: none;
  }
  
  &:nth-child(2) {
    top: 30px;
    right: 30px;
    border-left: none;
    border-bottom: none;
  }
  
  &:nth-child(3) {
    bottom: 30px;
    left: 30px;
    border-right: none;
    border-top: none;
  }
  
  &:nth-child(4) {
    bottom: 30px;
    right: 30px;
    border-left: none;
    border-top: none;
  }
`;

function Hero({
  name1 = "Alex",
  name2 = "Jordan",
  date = "15.08.2025",
  location = "Berlin, Germany",
  eyebrow = "The Wedding Of"
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const fullNames = `${name1} & ${name2}`;

  return (
    <Section ref={sectionRef} id="hero">
      <Grid $visible={visible} />
      
      <GlowOrb />
      <GlowOrb />
      <GlowOrb />
      
      <Scanline />
      
      <FloatingShape $shape="square" $delay={0} style={{ top: '15%', left: '10%' }} />
      <FloatingShape $shape="circle" $delay={1} style={{ top: '25%', right: '15%' }} />
      <FloatingShape $shape="diamond" $delay={2} style={{ bottom: '20%', left: '20%' }} />
      <FloatingShape $shape="circle" $delay={0.5} style={{ bottom: '30%', right: '10%' }} />
      
      <CornerDecor />
      <CornerDecor />
      <CornerDecor />
      <CornerDecor />
      
      <Content>
        <Eyebrow $visible={visible}>{eyebrow}</Eyebrow>
        
        <Names $visible={visible} data-text={fullNames}>
          {name1}
          <Ampersand>&</Ampersand>
          {name2}
        </Names>
        
        <DateDisplay $visible={visible}>{date}</DateDisplay>
        <Location $visible={visible}>{location}</Location>
        
        <StatusBadge $visible={visible}>
          Wedding.exe is loading...
        </StatusBadge>
      </Content>
      
      <ScrollIndicator $visible={visible}>
        Scroll to explore
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
