import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${p => p.$image});
  background-size: cover;
  background-position: center;
  filter: grayscale(100%) contrast(1.1);
  animation: ${fadeIn} 1.5s ease;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.4) 0%,
      rgba(0,0,0,0.3) 40%,
      rgba(0,0,0,0.5) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #FFFFFF;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  margin-bottom: 1.5rem;
  animation: ${slideUp} 1s ease 0.3s both;
`;

const Names = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 300;
  font-style: italic;
  color: #FFFFFF;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  line-height: 1;
  margin-bottom: 1.5rem;
  animation: ${slideUp} 1s ease 0.5s both;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-style: italic;
  color: #FFFFFF;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  margin-bottom: 0.5rem;
  animation: ${slideUp} 1s ease 0.7s both;
`;

const Location = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  animation: ${slideUp} 1s ease 0.8s both;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: ${slideUp} 1s ease 1.2s both;
  cursor: pointer;
`;

const ScrollText = styled.span`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; height: 40px; }
  50% { opacity: 1; height: 50px; }
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--luxe-gold), transparent);
  animation: ${pulse} 2s ease-in-out infinite;
`;

function Hero({ data }) {
  const config = data || {};
  const {
    name1 = 'Dave',
    name2 = 'Kalle',
    weddingDateDisplay = 'October 20, 2026',
    location = 'Château de Lumière',
    heroImage = 'https://res.cloudinary.com/si-weddings/image/upload/v1769072318/si_cooming_soon_luxe_hero_wowu9v.jpg',
  } = config;
  
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };
  
  return (
    <Section id="home">
      <BackgroundImage $image={heroImage} />
      
      <Content>
        <Eyebrow>Save the Date</Eyebrow>
        <Names>{name1} & {name2}</Names>
        <DateText>{weddingDateDisplay}</DateText>
        <Location>{location}</Location>
      </Content>
      
      <ScrollIndicator onClick={scrollToContent}>
        <ScrollText>Discover</ScrollText>
        <ScrollLine />
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
