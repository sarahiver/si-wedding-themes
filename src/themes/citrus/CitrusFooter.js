// src/themes/citrus/CitrusFooter.js
// Footer with citrus flair
import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { CitrusFruit, LimeSlice } from './components/Citrus3D';
import { colors, fonts } from './GlobalStyles';

// ============================================
// 3D SCENE
// ============================================
function FooterScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      {/* Floating citrus fruits */}
      <CitrusFruit position={[-4, 0, -2]} scale={0.8} color={colors.lime} speed={0.6} floatIntensity={0.3} />
      <CitrusFruit position={[4, 0.5, -1]} scale={0.6} color={colors.lemon} speed={0.8} floatIntensity={0.4} />
      <CitrusFruit position={[0, -1, -3]} scale={0.5} color={colors.orange} speed={0.5} floatIntensity={0.3} />
      <LimeSlice position={[-2, 1, 0]} scale={0.4} rotation={[0.3, 0.2, 0.1]} />
      <LimeSlice position={[3, -0.5, -1]} scale={0.3} rotation={[-0.2, 0.4, 0]} />
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
const CitrusFooter = ({
  coupleNames = 'Anna & Max',
  date = '15. August 2026',
  hashtag = '#AnnaundMax2026',
  email = 'hochzeit@example.de'
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      {/* 3D Background */}
      <CanvasBackground>
        <Canvas>
          <Suspense fallback={null}>
            <FooterScene />
          </Suspense>
        </Canvas>
      </CanvasBackground>

      <Container>
        {/* Main Section */}
        <MainSection>
          <Names>{coupleNames}</Names>
          <WeddingDate>{date}</WeddingDate>

          {hashtag && (
            <Hashtag>
              <span>{hashtag}</span>
            </Hashtag>
          )}
        </MainSection>

        {/* Contact */}
        <ContactSection>
          <ContactTitle>Fragen?</ContactTitle>
          <ContactEmail href={`mailto:${email}`}>
            {email}
          </ContactEmail>
        </ContactSection>

        {/* Divider */}
        <Divider>
          <DividerLine />
          <DividerIcon>🍋</DividerIcon>
          <DividerLine />
        </Divider>

        {/* Bottom */}
        <BottomSection>
          <Credits>
            Made with ❤️ and lots of 🍋
          </Credits>
          <PoweredBy>
            <span>Powered by</span>
            <SILogo href="https://sarahiver.com" target="_blank" rel="noopener noreferrer">
              S&I.
            </SILogo>
          </PoweredBy>
          <Copyright>
            © {currentYear} {coupleNames}
          </Copyright>
        </BottomSection>
      </Container>

      {/* Decorative Wave */}
      <WaveTop>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,0 L0,0 Z"
            fill={colors.cream}
          />
        </svg>
      </WaveTop>
    </FooterWrapper>
  );
};

export default CitrusFooter;

// ============================================
// ANIMATIONS
// ============================================
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const FooterWrapper = styled.footer`
  position: relative;
  padding: clamp(6rem, 15vh, 10rem) 2rem clamp(3rem, 8vh, 5rem);
  background: ${colors.leafGreen};
  color: ${colors.warmWhite};
  overflow: hidden;
`;

const WaveTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;

  svg {
    display: block;
    width: 100%;
    height: 60px;
  }
`;

const CanvasBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  text-align: center;
`;

const MainSection = styled.div`
  margin-bottom: 3rem;
`;

const Names = styled.h2`
  font-family: ${fonts.heading};
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 400;
  font-style: italic;
  margin-bottom: 0.5rem;
  animation: ${float} 4s ease-in-out infinite;
`;

const WeddingDate = styled.p`
  font-family: ${fonts.body};
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 300;
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const Hashtag = styled.div`
  display: inline-block;

  span {
    font-family: ${fonts.accent};
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    color: ${colors.lime};
    background: ${colors.warmWhite}20;
    padding: 0.5rem 1.5rem;
    border-radius: 30px;
    border: 2px solid ${colors.lime}50;
  }
`;

const ContactSection = styled.div`
  margin-bottom: 2rem;
`;

const ContactTitle = styled.p`
  font-family: ${fonts.body};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 0.5rem;
`;

const ContactEmail = styled.a`
  font-family: ${fonts.body};
  font-size: 1.1rem;
  color: ${colors.lime};
  border-bottom: 1px solid ${colors.lime}50;
  transition: all 0.3s ease;

  &:hover {
    color: ${colors.warmWhite};
    border-color: ${colors.warmWhite};
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 3rem 0;
`;

const DividerLine = styled.div`
  width: 80px;
  height: 1px;
  background: ${colors.warmWhite}30;
`;

const DividerIcon = styled.span`
  font-size: 1.5rem;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Credits = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9rem;
  opacity: 0.8;
`;

const PoweredBy = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${fonts.body};
  font-size: 0.8rem;
  opacity: 0.7;
`;

const SILogo = styled.a`
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: ${colors.warmWhite};
  background: ${colors.charcoal};
  padding: 0.3rem 0.6rem;
  letter-spacing: -0.05em;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.lime};
    color: ${colors.charcoal};
  }
`;

const Copyright = styled.p`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  opacity: 0.5;
  margin-top: 0.5rem;
`;
