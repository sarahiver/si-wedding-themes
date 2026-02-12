// Classic Theme - Hero Section
// Full-screen hero with elegant overlay text, optional video background
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const scaleIn = keyframes`from { opacity: 0; transform: scale(1.1); } to { opacity: 1; transform: scale(1); }`;
const lineExpand = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;
const float = keyframes`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); }`;

// ============================================
// STYLED COMPONENTS
// ============================================
const Section = styled.section`
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--classic-charcoal);
`;

const BackgroundMedia = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  animation: ${scaleIn} 1.8s var(--ease-out-expo) forwards;
  animation-delay: 0.2s;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.05) 30%,
      rgba(0, 0, 0, 0.1) 60%,
      rgba(0, 0, 0, 0.45) 100%
    );
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${p => p.$position || 'center'};
`;

const BackgroundVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
`;

const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeUp} 0.8s var(--ease-out-expo) forwards;
  animation-delay: 0.8s;
`;

const NamesContainer = styled.div`
  margin-bottom: 1rem;
`;

const Name = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 300;
  color: #FFFFFF;
  line-height: 1;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  opacity: 0;
  animation: ${fadeUp} 1s var(--ease-out-expo) forwards;
  animation-delay: ${p => p.$delay || '1s'};
`;

const ScriptAnd = styled.span`
  display: block;
  font-family: var(--font-script);
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--classic-gold);
  margin: 0.3em 0;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: 1.3s;
`;

const Divider = styled.div`
  width: 80px;
  height: 1px;
  background: var(--classic-gold);
  margin: 2rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${lineExpand} 0.8s var(--ease-out-expo) forwards;
  animation-delay: 1.8s;
`;

const DateText = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 300;
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.05em;
  margin: 0;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards;
  animation-delay: 2s;
`;

const LocationText = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards;
  animation-delay: 2.2s;
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 3s;
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--classic-gold), transparent);
  animation: ${float} 2s ease-in-out infinite;
`;

const ScrollLabel = styled.span`
  font-family: var(--font-body);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

// ============================================
// COMPONENT
// ============================================
function Hero() {
  const { content, project, weddingDate } = useWedding();
  const hero = content?.hero || {};
  const videoRef = useRef(null);

  const name1 = project?.partner1_name || hero.name1 || 'Anna';
  const name2 = project?.partner2_name || hero.name2 || 'Max';
  const locationShort = hero.location_short || project?.location || null;
  const tagline = hero.tagline || 'Wir heiraten';

  const backgroundImage = hero.background_image ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80';
  const mobileBackgroundImage = hero.background_image_mobile || null;
  const backgroundVideo = hero.background_video || null;
  const imagePosition = hero.image_position || 'center';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Datum folgt';
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <Section id="top">
      <BackgroundMedia>
        {backgroundVideo && !isMobile ? (
          <BackgroundVideo
            ref={videoRef}
            autoPlay muted loop playsInline
            poster={backgroundImage}
          >
            <source src={backgroundVideo} type="video/mp4" />
          </BackgroundVideo>
        ) : (
          <BackgroundImage
            src={isMobile && mobileBackgroundImage ? mobileBackgroundImage : backgroundImage}
            alt=""
            $position={imagePosition}
            loading="eager"
          />
        )}
      </BackgroundMedia>

      <Content>
        <Eyebrow>{tagline}</Eyebrow>
        <NamesContainer>
          <Name $delay="1s">{name1}</Name>
          <ScriptAnd>&</ScriptAnd>
          <Name $delay="1.4s">{name2}</Name>
        </NamesContainer>
        <Divider />
        <DateText>{formatDate(weddingDate)}</DateText>
        {locationShort && <LocationText>{locationShort}</LocationText>}
      </Content>

      <ScrollHint>
        <ScrollLine />
        <ScrollLabel>Scroll</ScrollLabel>
      </ScrollHint>
    </Section>
  );
}

export default Hero;
