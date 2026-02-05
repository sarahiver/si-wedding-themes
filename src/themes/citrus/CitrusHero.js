// src/themes/citrus/CitrusHero.js
// Hero Section with 3D Citrus Elements
import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { CitrusFruit, LimeSlice, Bubbles, Leaf } from './components/Citrus3D';
import { colors, fonts } from './GlobalStyles';

// ============================================
// 3D SCENE
// ============================================
function CitrusScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#FFF9E6" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#A4D233" />

      {/* Main Lime - Left */}
      <CitrusFruit
        position={[-4, 1, 0]}
        scale={1.8}
        color="#A4D233"
        speed={0.8}
        floatIntensity={0.3}
      />

      {/* Lemon - Right */}
      <CitrusFruit
        position={[4.5, -0.5, -1]}
        scale={1.5}
        color="#FFE135"
        speed={1.2}
        floatIntensity={0.4}
      />

      {/* Small Orange - Top Right */}
      <CitrusFruit
        position={[3, 2.5, -2]}
        scale={0.8}
        color="#FF9F1C"
        speed={1}
        floatIntensity={0.5}
      />

      {/* Lime Slice - Center Left */}
      <LimeSlice
        position={[-2, -1.5, 1]}
        scale={0.7}
        rotation={[0.3, 0.2, 0]}
      />

      {/* Lime Slice - Right */}
      <LimeSlice
        position={[2, 1, -1]}
        scale={0.5}
        rotation={[-0.2, 0.5, 0.3]}
      />

      {/* Leaves */}
      <Leaf position={[-3.5, 2.5, 0.5]} scale={0.5} rotation={[0, 0, -0.3]} />
      <Leaf position={[4, 1, 0]} scale={0.4} rotation={[0, 0, 0.5]} />
      <Leaf position={[-5, -1, -1]} scale={0.3} rotation={[0, 0, -0.8]} />

      {/* Bubbles */}
      <Bubbles count={15} />

      {/* Environment for reflections */}
      <Environment preset="sunset" />
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
const CitrusHero = ({ coupleNames = 'Anna & Max', date = '15. August 2026', tagline = 'Frisch verliebt' }) => {
  return (
    <HeroWrapper>
      {/* 3D Canvas Background */}
      <CanvasWrapper>
        <Canvas>
          <Suspense fallback={null}>
            <CitrusScene />
          </Suspense>
        </Canvas>
      </CanvasWrapper>

      {/* Content Overlay */}
      <ContentOverlay>
        <TaglineWrapper>
          <Tagline>{tagline}</Tagline>
        </TaglineWrapper>

        <NamesWrapper>
          <Names>{coupleNames}</Names>
        </NamesWrapper>

        <DateWrapper>
          <DateLabel>Save the Date</DateLabel>
          <WeddingDate>{date}</WeddingDate>
        </DateWrapper>

        <ScrollIndicator>
          <ScrollText>Scroll</ScrollText>
          <ScrollLine />
        </ScrollIndicator>
      </ContentOverlay>

      {/* Decorative Elements */}
      <DecoCorner $position="top-left" />
      <DecoCorner $position="top-right" />
      <DecoCorner $position="bottom-left" />
      <DecoCorner $position="bottom-right" />
    </HeroWrapper>
  );
};

export default CitrusHero;

// ============================================
// ANIMATIONS
// ============================================
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const scrollBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
`;

const growLine = keyframes`
  from { height: 0; }
  to { height: 60px; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  background: linear-gradient(180deg, ${colors.cream} 0%, ${colors.sand} 100%);
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ContentOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  pointer-events: none;
`;

const TaglineWrapper = styled.div`
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const Tagline = styled.p`
  font-family: ${fonts.accent};
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: ${colors.leafGreen};
  margin-bottom: 1rem;
`;

const NamesWrapper = styled.div`
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
  text-align: center;
`;

const Names = styled.h1`
  font-family: ${fonts.heading};
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 400;
  font-style: italic;
  color: ${colors.charcoal};
  letter-spacing: -0.02em;
  line-height: 1;
  text-shadow: 2px 2px 20px rgba(255, 255, 255, 0.8);

  @media (max-width: 600px) {
    font-size: clamp(2.5rem, 12vw, 4rem);
  }
`;

const DateWrapper = styled.div`
  margin-top: 2rem;
  text-align: center;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 0.6s;
  opacity: 0;
`;

const DateLabel = styled.p`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.lime};
  margin-bottom: 0.5rem;
`;

const WeddingDate = styled.p`
  font-family: ${fonts.heading};
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: ${colors.charcoal};
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 1s;
  opacity: 0;
`;

const ScrollText = styled.span`
  font-family: ${fonts.body};
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${colors.leafGreen};
  margin-bottom: 0.5rem;
  animation: ${scrollBounce} 2s ease-in-out infinite;
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 60px;
  background: ${colors.lime};
  animation: ${growLine} 1s ease forwards;
  animation-delay: 1.2s;
`;

const DecoCorner = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 5;

  ${({ $position }) => {
    switch ($position) {
      case 'top-left':
        return `
          top: 20px;
          left: 20px;
          border-top: 2px solid ${colors.lime};
          border-left: 2px solid ${colors.lime};
        `;
      case 'top-right':
        return `
          top: 20px;
          right: 20px;
          border-top: 2px solid ${colors.lime};
          border-right: 2px solid ${colors.lime};
        `;
      case 'bottom-left':
        return `
          bottom: 20px;
          left: 20px;
          border-bottom: 2px solid ${colors.lime};
          border-left: 2px solid ${colors.lime};
        `;
      case 'bottom-right':
        return `
          bottom: 20px;
          right: 20px;
          border-bottom: 2px solid ${colors.lime};
          border-right: 2px solid ${colors.lime};
        `;
      default:
        return '';
    }
  }}

  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
  }
`;
