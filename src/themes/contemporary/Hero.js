// Hero.js - Contemporary Theme (Supabase integrated)
import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -15px) rotate(5deg); }
  50% { transform: translate(-10px, -25px) rotate(-3deg); }
  75% { transform: translate(-15px, 10px) rotate(3deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(-15px, -15px); }
  66% { transform: translate(10px, -20px); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const expand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Section = styled.section`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const LeftPanel = styled.div`
  background: var(--white, #fff);
  padding: 8rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  
  @media (max-width: 900px) {
    padding: 6rem 2rem;
  }
`;

const RightPanel = styled.div`
  background: ${p => p.$bgImage 
    ? `url(${p.$bgImage}) center/cover` 
    : 'linear-gradient(135deg, var(--coral, #FF6B6B) 0%, var(--mint, #4ECDC4) 100%)'};
  position: relative;
  min-height: 100vh;
  
  @media (max-width: 900px) {
    min-height: 50vh;
    order: -1;
  }
`;

const FloatingCircle1 = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  background: var(--coral, #FF6B6B);
  border-radius: 50%;
  top: 15%;
  right: 20%;
  animation: ${float1} 8s ease-in-out infinite;
`;

const FloatingSquare = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid var(--dark, #1a1a1a);
  bottom: 25%;
  right: 15%;
  animation: ${float2} 6s ease-in-out infinite;
  transform: rotate(15deg);
`;

const FloatingCircle2 = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: var(--yellow, #FFE66D);
  border-radius: 50%;
  top: 50%;
  right: 35%;
  animation: ${float1} 10s ease-in-out infinite reverse;
`;

const FloatingDiamond = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background: var(--mint, #4ECDC4);
  transform: rotate(45deg);
  bottom: 15%;
  left: 10%;
  animation: ${float2} 7s ease-in-out infinite;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  
  span {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--dark, #1a1a1a);
  }
  
  .line {
    flex: 1;
    height: 2px;
    background: var(--coral, #FF6B6B);
    animation: ${expand} 0.6s ease forwards;
    animation-delay: 0.8s;
    transform-origin: left;
    transform: scaleX(0);
  }
`;

const NamesWrapper = styled.div`
  margin-bottom: 2.5rem;
`;

const NameLine1 = styled.h1`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 400;
  color: var(--coral, #FF6B6B);
  line-height: 1;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
  
  .highlight {
    background: linear-gradient(transparent 60%, var(--yellow, #FFE66D) 60%);
    padding: 0 0.2em;
  }
`;

const Ampersand = styled.span`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(2rem, 6vw, 3.5rem);
  color: var(--gray, #999);
  display: block;
  margin: 0.5rem 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const NameLine2 = styled.h1`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 400;
  color: var(--dark, #1a1a1a);
  line-height: 1;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.6s;
  opacity: 0;
`;

const LocationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--white, #fff);
  border: 2px solid var(--coral, #FF6B6B);
  padding: 0.6rem 1.2rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.7s;
  opacity: 0;
  
  span {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--dark, #1a1a1a);
  }
`;

const DateBadge = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark, #1a1a1a);
  color: var(--white, #fff);
  padding: 1.5rem 3rem;
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(1.2rem, 4vw, 2rem);
  font-weight: 400;
  z-index: 10;
  
  @media (max-width: 900px) {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    margin-top: 2rem;
    text-align: center;
  }
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.8s;
  opacity: 0;
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--coral, #FF6B6B);
  color: var(--white, #fff);
  padding: 1rem 2rem;
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--dark, #1a1a1a);
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: var(--dark, #1a1a1a);
  padding: 1rem 2rem;
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  border: 2px solid var(--dark, #1a1a1a);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--dark, #1a1a1a);
    color: var(--white, #fff);
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--dark, #1a1a1a);
  }
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const ScrollDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--coral, #FF6B6B);
`;

function Hero() {
  const { content, coupleNames, weddingDate } = useWedding();
  const hero = content?.hero || {};
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  // Parse names from Supabase
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Sophie', 'Max'];
  const name1 = names[0] || 'Sophie';
  const name2 = names[1] || 'Max';
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '15. August 2025';
    return new Date(dateStr).toLocaleDateString('de-DE', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });
  };
  const date = formatDate(weddingDate);
  const location = hero.location_short || 'Berlin';

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        setScrollY(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Section ref={sectionRef} id="hero">
      <LeftPanel>
        <FloatingCircle1 />
        <FloatingSquare />
        <FloatingCircle2 />
        
        <Eyebrow>
          <span>{hero.tagline || "We're getting married"}</span>
          <div className="line" />
        </Eyebrow>
        
        <NamesWrapper>
          <NameLine1><span className="highlight">{name1}</span></NameLine1>
          <Ampersand>&</Ampersand>
          <NameLine2>{name2}</NameLine2>
        </NamesWrapper>
        
        <LocationBadge>
          <span>📍</span>
          <span>{location}</span>
        </LocationBadge>
        
        <CTAGroup>
          <PrimaryButton href="#rsvp">Jetzt zusagen →</PrimaryButton>
          <SecondaryButton href="#story">Unsere Story</SecondaryButton>
        </CTAGroup>
        
        <ScrollIndicator>
          <ScrollDot />
          <span>Scroll to explore</span>
        </ScrollIndicator>
      </LeftPanel>
      
      <RightPanel $bgImage={hero.background_image}>
        <FloatingDiamond />
        <DateBadge>{date}</DateBadge>
      </RightPanel>
    </Section>
  );
}

export default Hero;
