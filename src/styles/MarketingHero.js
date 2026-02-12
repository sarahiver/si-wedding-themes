// src/components/marketing/MarketingHero.js
// 1:1 Theme-Designs aus si-wedding-themes
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

// ============================================
// SHARED ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// EDITORIAL THEME - Magazine Bold mit Rot-Akzent
// ============================================
const letterReveal = keyframes`
  0% { opacity: 0; transform: translateY(100%) rotateX(-90deg); }
  100% { opacity: 1; transform: translateY(0) rotateX(0); }
`;

const EditorialSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  background: #0A0A0A;
`;

const EditorialBg = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%);
  }
`;

const EditorialContent = styled.div`
  position: relative;
  z-index: 10;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
  padding-bottom: clamp(3rem, 8vh, 6rem);
  max-width: 1400px;
`;

const EditorialTagline = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 0.8s;
`;

const EditorialHeadline = styled.h1`
  font-family: 'Oswald', 'Arial Narrow', sans-serif;
  font-size: clamp(3rem, 12vw, 10rem);
  font-weight: 700;
  line-height: 0.9;
  color: #FAFAFA;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.2em;
`;

const EditorialWord = styled.span`
  display: inline-flex;
  overflow: hidden;
  perspective: 1000px;
`;

const EditorialLetter = styled.span`
  display: inline-block;
  opacity: 0;
  transform-origin: bottom center;
  animation: ${letterReveal} 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: ${p => p.$delay}s;
  color: ${p => p.$accent ? '#C41E3A' : 'inherit'};
`;

const EditorialAmpersand = styled.span`
  display: inline-block;
  font-family: 'Source Serif 4', Georgia, serif;
  font-style: italic;
  font-size: 0.7em;
  color: #C41E3A;
  margin: 0 0.15em;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease forwards 1.2s;
`;

const EditorialDateLine = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 1.8s;
`;

const EditorialLine = styled.div`
  width: 60px;
  height: 2px;
  background: #C41E3A;
  transform: scaleX(0);
  transform-origin: left;
  animation: ${lineGrow} 0.6s ease forwards 2s;
`;

const EditorialDateText = styled.p`
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-style: italic;
  color: #FAFAFA;
`;

const EditorialCTA = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 2.2s;
  flex-wrap: wrap;
`;

const EditorialButton = styled.a`
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${p => p.$primary ? css`
    background: #C41E3A;
    color: #FAFAFA;
    border: none;
    &:hover { background: #a01830; }
  ` : css`
    background: transparent;
    color: #FAFAFA;
    border: 1px solid rgba(255,255,255,0.3);
    &:hover { border-color: #C41E3A; color: #C41E3A; }
  `}
`;

// ============================================
// BOTANICAL THEME - Dark Glassmorphism
// ============================================
const glassReveal = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const botanicalFloat1 = keyframes`
  0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
  25% { transform: translateY(-15px) translateX(5px) rotate(3deg); }
  50% { transform: translateY(-8px) translateX(-3px) rotate(-2deg); }
  75% { transform: translateY(-20px) translateX(8px) rotate(5deg); }
`;

const botanicalFloat2 = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(-5deg); }
`;

const BotanicalSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7rem 2rem 4rem;
  overflow: hidden;
  background: #040604;
`;

const BotanicalBgGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #030503 0%, #081208 40%, #050805 100%);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba(45, 90, 60, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(45, 90, 60, 0.1) 0%, transparent 50%);
  }
`;

const FloatingPlant = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '40px'};
  opacity: ${p => p.$opacity || 0.4};
  top: ${p => p.$top || 'auto'};
  left: ${p => p.$left || 'auto'};
  right: ${p => p.$right || 'auto'};
  bottom: ${p => p.$bottom || 'auto'};
  animation: ${p => p.$anim === 2 ? botanicalFloat2 : botanicalFloat1} ${p => p.$duration || '10s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 1;
`;

const GlassCard = styled.div`
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 32px;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.05) inset, 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.25);
  padding: clamp(2.5rem, 5vw, 4rem) clamp(2rem, 4vw, 5rem);
  max-width: 550px;
  width: 100%;
  text-align: center;
  opacity: 0;
  animation: ${glassReveal} 1.2s ease forwards 0.3s;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.25) 70%, transparent 100%);
  }
`;

const BotanicalEyebrow = styled.span`
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards 0.8s;
`;

const BotanicalNames = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 10vw, 4.5rem);
  font-weight: 300;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards 1s;
`;

const BotanicalAmpersand = styled.span`
  display: block;
  font-size: 0.35em;
  font-style: italic;
  color: rgba(255, 255, 255, 0.55);
  margin: 0.4em 0;
`;

const BotanicalDate = styled.p`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.05em;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards 1.2s;
`;

const BotanicalLocation = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 0.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards 1.4s;
`;

const BotanicalButton = styled.a`
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  transition: all 0.4s ease;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards 1.6s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }
`;

// ============================================
// CONTEMPORARY THEME - Neobrutalism
// ============================================
const floatAnim = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(10px, -15px) rotate(5deg); }
`;

const spinAnim = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounceAnim = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const expandAnim = keyframes`
  from { width: 0; }
  to { width: 60px; }
`;

const ContemporarySection = styled.section`
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  background: #FAFAFA;
`;

const ContemporaryLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5rem);
  position: relative;
  z-index: 2;
  
  @media (max-width: 968px) {
    min-height: 100vh;
    padding: 6rem 2rem 4rem;
  }
`;

const ContemporaryRight = styled.div`
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #FF6B6B 0%, #9B5DE5 50%, #4ECDC4 100%);
  
  @media (max-width: 968px) {
    position: absolute;
    inset: 0;
    opacity: 0.1;
  }
`;

const FloatingCircle = styled.div`
  position: absolute;
  width: ${p => p.$size || '80px'};
  height: ${p => p.$size || '80px'};
  background: ${p => p.$color || '#FF6B6B'};
  border: 3px solid #0D0D0D;
  border-radius: 50%;
  animation: ${floatAnim} ${p => p.$duration || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 0;
`;

const FloatingSquare = styled.div`
  position: absolute;
  width: ${p => p.$size || '60px'};
  height: ${p => p.$size || '60px'};
  background: ${p => p.$color || '#FFE66D'};
  border: 3px solid #0D0D0D;
  animation: ${floatAnim} ${p => p.$duration || '10s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 0;
`;

const SpinningRing = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  border: 4px solid ${p => p.$color || '#4ECDC4'};
  border-radius: 50%;
  animation: ${spinAnim} ${p => p.$duration || '20s'} linear infinite;
  z-index: 0;
  @media (max-width: 768px) { display: none; }
`;

const ContemporaryEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FF6B6B;
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  
  &::after {
    content: '';
    height: 3px;
    background: #FF6B6B;
    animation: ${p => p.$visible ? expandAnim : 'none'} 0.8s ease forwards 0.3s;
  }
`;

const ContemporaryName = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 700;
  line-height: 0.95;
  color: ${p => p.$first ? '#FF6B6B' : '#0D0D0D'};
  text-transform: uppercase;
  letter-spacing: -0.03em;
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? fadeUp : 'none'} 0.7s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
`;

const ContemporaryAmpersand = styled.span`
  display: inline-block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  color: #A3A3A3;
  margin: 0 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.5s ease 0.3s;
`;

const ContemporaryBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  font-weight: 700;
  padding: 0.75rem 1.25rem;
  background: ${p => p.$color || '#FFE66D'};
  color: #0D0D0D;
  border: 3px solid #0D0D0D;
  box-shadow: 6px 6px 0 #0D0D0D;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.5s ease;
  transition-delay: ${p => p.$delay || '0s'};
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 8px 8px 0 #0D0D0D;
  }
`;

const ContemporaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border: 3px solid #0D0D0D;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${p => p.$primary ? css`
    color: #FAFAFA;
    background: #FF6B6B;
    box-shadow: 6px 6px 0 #0D0D0D;
    &:hover { transform: translate(-4px, -4px); box-shadow: 8px 8px 0 #0D0D0D; }
  ` : css`
    color: #0D0D0D;
    background: #FAFAFA;
    box-shadow: 4px 4px 0 #0D0D0D;
    &:hover { transform: translate(-3px, -3px); box-shadow: 6px 6px 0 #0D0D0D; background: #4ECDC4; }
  `}
`;

const ContemporaryScroll = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  color: #737373;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  animation: ${bounceAnim} 2s ease-in-out infinite;
  z-index: 10;
  @media (max-width: 968px) { display: none; }
`;

// ============================================
// LUXE THEME - Cinematic Dark Luxury
// ============================================
const revealText = keyframes`
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
`;

const expandLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const luxeFloatAnim = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const LuxeSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0A0A0A;
`;

const LuxeBgMedia = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.5) 50%, rgba(10, 10, 10, 0.8) 100%);
  }
`;

const LuxeBgImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1A1A1D 0%, #0A0A0A 100%);
  background-size: cover;
  background-position: center;
  opacity: ${p => p.$loaded ? 1 : 0};
  transform: scale(${p => p.$loaded ? 1 : 1.2});
  transition: opacity 1.5s ease, transform 8s ease-out;
`;

const LuxeContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 5%;
  max-width: 1000px;
`;

const LuxeEyebrow = styled.div`
  overflow: hidden;
  margin-bottom: 2rem;
`;

const LuxeEyebrowText = styled.span`
  display: inline-block;
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #C9A962;
  opacity: 0;
  transform: translateY(20px);
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none'};
  animation-delay: 0.5s;
`;

const LuxeNameLine = styled.div`
  overflow: hidden;
`;

const LuxeName = styled.h1`
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 300;
  font-style: italic;
  color: #F8F6F3;
  line-height: 0.9;
  letter-spacing: -0.03em;
  transform: translateY(110%);
  animation: ${p => p.$visible ? css`${revealText} 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none'};
  animation-delay: ${p => p.$delay || '0s'};
`;

const LuxeAmpersand = styled.div`
  overflow: hidden;
  margin: 1rem 0;
`;

const LuxeAmpersandText = styled.span`
  display: inline-block;
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-style: italic;
  color: #C9A962;
  transform: translateY(110%);
  animation: ${p => p.$visible ? css`${revealText} 1s cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none'};
  animation-delay: 0.9s;
`;

const LuxeDivider = styled.div`
  width: 80px;
  height: 1px;
  background: #C9A962;
  margin: 2.5rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${p => p.$visible ? css`${expandLine} 1s cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none'};
  animation-delay: 1.3s;
`;

const LuxeInfo = styled.div`
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1s ease forwards` : 'none'};
  animation-delay: 1.5s;
`;

const LuxeDateText = styled.p`
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-style: italic;
  color: #F8F6F3;
  margin-bottom: 0.5rem;
`;

const LuxeLocationText = styled.p`
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #E8E6E1;
`;

const LuxeScroll = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1s ease forwards` : 'none'};
  animation-delay: 2s;
  z-index: 10;
`;

const LuxeScrollText = styled.span`
  font-family: 'Outfit', sans-serif;
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #E8E6E1;
  animation: ${luxeFloatAnim} 3s ease-in-out infinite;
`;

const LuxeScrollLine = styled.div`
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, #C9A962, transparent);
`;

// ============================================
// NEON THEME - Cyberpunk Glow
// ============================================
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

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
`;

const neonFloatAnim = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const NeonSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0a0f;
`;

const NeonGrid = styled.div`
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
  
  &:nth-child(2) {
    width: 400px;
    height: 400px;
    background: rgba(0,255,255,0.3);
    top: -100px;
    left: -100px;
  }
  
  &:nth-child(3) {
    width: 300px;
    height: 300px;
    background: rgba(255,0,255,0.3);
    bottom: -50px;
    right: -50px;
    animation-delay: 2s;
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

const NeonFloatingShape = styled.div`
  position: absolute;
  border: 1px solid rgba(0,255,255,0.3);
  animation: ${neonFloatAnim} ${p => 6 + (p.$delay || 0)}s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s;
  
  ${p => p.$shape === 'square' && css`width: 60px; height: 60px;`}
  ${p => p.$shape === 'circle' && css`width: 40px; height: 40px; border-radius: 50%;`}
  ${p => p.$shape === 'diamond' && css`width: 50px; height: 50px; transform: rotate(45deg);`}
`;

const CornerDecor = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0,255,255,0.2);
  
  &:nth-child(5) { top: 30px; left: 30px; border-right: none; border-bottom: none; }
  &:nth-child(6) { top: 30px; right: 30px; border-left: none; border-bottom: none; }
  &:nth-child(7) { bottom: 30px; left: 30px; border-right: none; border-top: none; }
  &:nth-child(8) { bottom: 30px; right: 30px; border-left: none; border-top: none; }
`;

const NeonContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 5%;
`;

const NeonEyebrow = styled.div`
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

const NeonNames = styled.h1`
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

const NeonAmpersand = styled.span`
  display: block;
  font-size: 0.4em;
  font-weight: 300;
  font-style: italic;
  color: #ff00ff;
  text-shadow: 0 0 20px rgba(255,0,255,0.5);
  animation: ${neonFlicker} 4s ease-in-out infinite;
  margin: 20px 0;
`;

const NeonDate = styled.div`
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

const NeonLocation = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.1em;
  margin-bottom: 50px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease 0.5s;
`;

const NeonButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: #00ff88;
  border: 1px solid rgba(0,255,136,0.3);
  padding: 15px 30px;
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00ff88;
    box-shadow: 0 0 10px #00ff88;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  }
  
  &:hover {
    background: rgba(0,255,136,0.1);
    box-shadow: 0 0 20px rgba(0,255,136,0.3);
  }
`;

// ============================================
// VIDEO THEME - Horizontal Cinematic S/W
// ============================================
const VideoSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0A0A0A;
`;

const VideoBg = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%);
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(107, 140, 174, 0.1) 0%, transparent 70%);
  }
`;

const VideoContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 5%;
`;

const VideoEyebrow = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #6B8CAE;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` : 'none'};
  animation-delay: 0.3s;
`;

const VideoNames = styled.h1`
  font-family: 'Manrope', sans-serif;
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #FFFFFF;
  line-height: 0.95;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` : 'none'};
  animation-delay: ${p => p.$delay || '0.5s'};
`;

const VideoAmpersand = styled.span`
  display: block;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-style: italic;
  font-weight: 400;
  color: #6B8CAE;
  margin: 1rem 0;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 0.8s ease forwards` : 'none'};
  animation-delay: 0.7s;
`;

const VideoDivider = styled.div`
  width: 80px;
  height: 1px;
  background: #6B8CAE;
  margin: 2rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${p => p.$visible ? css`${lineGrow} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` : 'none'};
  animation-delay: 1s;
`;

const VideoDateText = styled.p`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.2s;
`;

const VideoLocationText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #B0B0B0;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.4s;
`;

const VideoCTA = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.6s;
`;

const VideoButton = styled.a`
  font-family: 'Manrope', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${p => p.$primary ? css`
    background: transparent;
    color: #FFFFFF;
    border: 1px solid #6B8CAE;
    &:hover { background: #6B8CAE; }
  ` : css`
    background: transparent;
    color: #B0B0B0;
    border: 1px solid rgba(255,255,255,0.2);
    &:hover { border-color: #6B8CAE; color: #6B8CAE; }
  `}
`;

// ============================================
// ANIMATED WORD COMPONENT (Editorial)
// ============================================
const AnimatedWord = ({ text, startDelay = 0, accent = false }) => (
  <EditorialWord>
    {text.split('').map((letter, i) => (
      <EditorialLetter key={i} $delay={startDelay + i * 0.05} $accent={accent}>
        {letter === ' ' ? '\u00A0' : letter}
      </EditorialLetter>
    ))}
  </EditorialWord>
);

// ============================================
// MAIN COMPONENT
// ============================================
const MarketingHero = () => {
  const { currentTheme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDesigns = () => {
    document.getElementById('themes')?.scrollIntoView({ behavior: 'smooth' });
  };

  // EDITORIAL
  if (currentTheme === 'editorial') {
    return (
      <EditorialSection>
        <EditorialBg />
        <EditorialContent>
          <EditorialTagline>Premium Hochzeitswebsites</EditorialTagline>
          <EditorialHeadline>
            <AnimatedWord text="EINZIGARTIG" startDelay={0.5} />
            <EditorialAmpersand>&</EditorialAmpersand>
            <AnimatedWord text="INDIVIDUELL" startDelay={0.9} accent />
          </EditorialHeadline>
          <EditorialDateLine>
            <EditorialLine />
            <EditorialDateText>Eure Geschichte, digital erzählt</EditorialDateText>
          </EditorialDateLine>
          <EditorialCTA>
            <EditorialButton $primary onClick={scrollToContact}>Jetzt anfragen</EditorialButton>
            <EditorialButton onClick={scrollToDesigns}>Designs entdecken</EditorialButton>
          </EditorialCTA>
        </EditorialContent>
      </EditorialSection>
    );
  }

  // BOTANICAL
  if (currentTheme === 'botanical') {
    return (
      <BotanicalSection>
        <BotanicalBgGradient />
        <FloatingPlant $top="8%" $left="5%" $size="60px" $anim={1} $duration="12s" $opacity={0.4}>🌿</FloatingPlant>
        <FloatingPlant $top="15%" $right="8%" $size="45px" $anim={2} $duration="10s" $delay="1s" $opacity={0.5}>🍃</FloatingPlant>
        <FloatingPlant $top="55%" $left="6%" $size="35px" $anim={2} $duration="14s" $delay="2s" $opacity={0.3}>🌸</FloatingPlant>
        <FloatingPlant $top="65%" $right="10%" $size="50px" $anim={1} $duration="11s" $delay="0.5s" $opacity={0.45}>🌺</FloatingPlant>
        <FloatingPlant $bottom="12%" $left="15%" $size="40px" $anim={2} $duration="9s" $delay="1.5s" $opacity={0.35}>🍀</FloatingPlant>
        <FloatingPlant $bottom="20%" $right="5%" $size="55px" $anim={1} $duration="11s" $opacity={0.4}>🌾</FloatingPlant>
        
        <GlassCard>
          <BotanicalEyebrow>Premium Hochzeitswebsites</BotanicalEyebrow>
          <BotanicalNames>
            Individuell
            <BotanicalAmpersand>&</BotanicalAmpersand>
            Einzigartig
          </BotanicalNames>
          <BotanicalDate>Eure Geschichte, liebevoll gestaltet</BotanicalDate>
          <BotanicalLocation>Hamburg · Deutschland</BotanicalLocation>
          <BotanicalButton onClick={scrollToContact}>Jetzt starten</BotanicalButton>
        </GlassCard>
      </BotanicalSection>
    );
  }

  // CONTEMPORARY
  if (currentTheme === 'contemporary') {
    return (
      <ContemporarySection>
        <ContemporaryLeft>
          <FloatingCircle $color="#FF6B6B" $size="100px" style={{ top: '10%', left: '5%' }} $duration="10s" />
          <FloatingCircle $color="#4ECDC4" $size="60px" style={{ top: '60%', left: '10%' }} $duration="8s" $delay="1s" />
          <FloatingSquare $color="#FFE66D" $size="70px" style={{ top: '20%', right: '15%' }} $duration="12s" $delay="0.5s" />
          <FloatingSquare $color="#9B5DE5" $size="50px" style={{ bottom: '25%', left: '20%' }} $duration="9s" $delay="2s" />
          <SpinningRing $color="#FF6B6B" $size="120px" style={{ bottom: '10%', right: '5%' }} $duration="25s" />
          
          <ContemporaryEyebrow $visible={visible}>Hochzeitswebsites</ContemporaryEyebrow>
          
          <div style={{ marginBottom: '2rem' }}>
            <ContemporaryName $visible={visible} $delay="0.1s" $first>MAKE IT</ContemporaryName>
            <ContemporaryAmpersand $visible={visible}>&</ContemporaryAmpersand>
            <ContemporaryName $visible={visible} $delay="0.2s">COUNT</ContemporaryName>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <ContemporaryBadge $visible={visible} $delay="0.4s" $color="#FFE66D">
              <span>✨</span> Einzigartige Designs
            </ContemporaryBadge>
            <ContemporaryBadge $visible={visible} $delay="0.5s" $color="#4ECDC4">
              <span>🚀</span> ab 1.290€
            </ContemporaryBadge>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <ContemporaryButton $primary onClick={scrollToContact}>
              Jetzt anfragen →
            </ContemporaryButton>
            <ContemporaryButton onClick={scrollToDesigns}>
              Designs entdecken
            </ContemporaryButton>
          </div>
        </ContemporaryLeft>
        
        <ContemporaryRight />
        
        <ContemporaryScroll>
          Scroll
          <span style={{ fontSize: '1.2rem', color: '#FF6B6B' }}>↓</span>
        </ContemporaryScroll>
      </ContemporarySection>
    );
  }

  // LUXE
  if (currentTheme === 'luxe') {
    return (
      <LuxeSection>
        <LuxeBgMedia>
          <LuxeBgImage $loaded={loaded} />
        </LuxeBgMedia>
        
        <LuxeContent>
          <LuxeEyebrow>
            <LuxeEyebrowText $visible={visible}>Premium Hochzeitswebsites</LuxeEyebrowText>
          </LuxeEyebrow>
          
          <div style={{ marginBottom: '3rem' }}>
            <LuxeNameLine>
              <LuxeName $visible={visible} $delay="0.6s">Zeitlose</LuxeName>
            </LuxeNameLine>
            <LuxeAmpersand>
              <LuxeAmpersandText $visible={visible}>&</LuxeAmpersandText>
            </LuxeAmpersand>
            <LuxeNameLine>
              <LuxeName $visible={visible} $delay="0.75s">Eleganz</LuxeName>
            </LuxeNameLine>
          </div>
          
          <LuxeDivider $visible={visible} />
          
          <LuxeInfo $visible={visible}>
            <LuxeDateText>Eure Geschichte, cinematisch erzählt</LuxeDateText>
            <LuxeLocationText>Hamburg · Deutschland</LuxeLocationText>
          </LuxeInfo>
        </LuxeContent>
        
        <LuxeScroll $visible={visible}>
          <LuxeScrollText>Entdecken</LuxeScrollText>
          <LuxeScrollLine />
        </LuxeScroll>
      </LuxeSection>
    );
  }

  // NEON
  if (currentTheme === 'neon') {
    const fullText = "NEXT LEVEL WEDDING";
    return (
      <NeonSection>
        <NeonGrid $visible={visible} />
        <GlowOrb />
        <GlowOrb />
        <Scanline />
        
        <NeonFloatingShape $shape="square" $delay={0} style={{ top: '15%', left: '10%' }} />
        <NeonFloatingShape $shape="circle" $delay={1} style={{ top: '25%', right: '15%' }} />
        <NeonFloatingShape $shape="diamond" $delay={2} style={{ bottom: '20%', left: '20%' }} />
        <NeonFloatingShape $shape="circle" $delay={0.5} style={{ bottom: '30%', right: '10%' }} />
        
        <CornerDecor />
        <CornerDecor />
        <CornerDecor />
        <CornerDecor />
        
        <NeonContent>
          <NeonEyebrow $visible={visible}>Premium Websites</NeonEyebrow>
          
          <NeonNames $visible={visible} data-text={fullText}>
            NEXT LEVEL
            <NeonAmpersand>&</NeonAmpersand>
            WEDDING
          </NeonNames>
          
          <NeonDate $visible={visible}>Digitale Hochzeits-Experience</NeonDate>
          <NeonLocation $visible={visible}>der nächsten Generation</NeonLocation>
          
          <NeonButton $visible={visible} onClick={scrollToContact}>
            Website.exe starten...
          </NeonButton>
        </NeonContent>
      </NeonSection>
    );
  }

  // VIDEO (Default)
  return (
    <VideoSection>
      <VideoBg />
      <VideoContent>
        <VideoEyebrow $visible={visible}>Premium Hochzeitswebsites</VideoEyebrow>
        <VideoNames $visible={visible} $delay="0.5s">Individuelle</VideoNames>
        <VideoAmpersand $visible={visible}>&</VideoAmpersand>
        <VideoNames $visible={visible} $delay="0.9s">Hochzeitswebsites</VideoNames>
        <VideoDivider $visible={visible} />
        <VideoDateText $visible={visible}>Eure Geschichte, cinematisch erzählt</VideoDateText>
        <VideoLocationText $visible={visible}>Einzigartige Designs · ab 1.290€</VideoLocationText>
        <VideoCTA $visible={visible}>
          <VideoButton $primary onClick={scrollToContact}>Jetzt anfragen</VideoButton>
          <VideoButton onClick={scrollToDesigns}>Designs entdecken</VideoButton>
        </VideoCTA>
      </VideoContent>
    </VideoSection>
  );
};

export default MarketingHero;
