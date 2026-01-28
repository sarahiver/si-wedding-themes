import { useWedding } from '../../context/WeddingContext';
// src/components/Hero.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 20px;
  max-width: 900px;
  animation: ${fadeIn} 1.5s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 30px;
  animation: ${fadeInUp} 1s ease 0.2s both;
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 300;
  font-style: italic;
  color: #FFFFFF;
  line-height: 1.1;
  margin-bottom: 25px;
  animation: ${fadeInUp} 1s ease 0.4s both;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 50px;
  animation: ${fadeInUp} 1s ease 0.6s both;
`;

const DateButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #1A1A1A;
  background: #B8976A;
  padding: 20px 45px;
  transition: all 0.4s ease;
  animation: ${fadeInUp} 1s ease 0.8s both;

  &:hover {
    background: #D4AF37;
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(184, 151, 106, 0.3);
  }

  span {
    width: 1px;
    height: 15px;
    background: rgba(26, 26, 26, 0.3);
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: ${fadeInUp} 1s ease 1.2s both;
  z-index: 2;
`;

const ScrollText = styled.span`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
`;

const ScrollArrow = styled.div`
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
  margin: 0 auto;
  position: relative;
  animation: ${float} 2s ease-in-out infinite;

  &::after {
    content: '↓';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
`;

function Hero() {
  const [loaded, setLoaded] = useState(false);

  // Wedding date - replace with actual date
  const weddingDate = "21. Juni 2025";
  const coupleName = "Sarah & Max";

  return (
    <Section id="hero">
      <Video 
        autoPlay 
        muted 
        loop 
        playsInline
        onLoadedData={() => setLoaded(true)}
      >
        <source 
          src="https://res.cloudinary.com/si-weddings/video/upload/v1769070616/si_comming_soon_video_hero_xga2ia.mp4" 
          type="video/mp4" 
        />
      </Video>
      <VideoOverlay />

      <Content>
        <Eyebrow>Wir heiraten</Eyebrow>
        <Title>{coupleName}</Title>
        <Subtitle>die so einzigartig sind wie eure Liebe</Subtitle>
        <DateButton href="#rsvp">
          Save the Date
          <span />
          {weddingDate}
        </DateButton>
      </Content>

      <ScrollIndicator>
        <ScrollText>Entdecken</ScrollText>
        <ScrollArrow />
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
