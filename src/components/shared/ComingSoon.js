// src/components/shared/ComingSoon.js
// Coming Soon Pages - Design matches each Theme's Hero
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// SHARED LOGIN MODAL
// ============================================
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalBox = styled.div`
  background: ${p => p.$bg || '#1A1A1A'};
  border: 1px solid ${p => p.$accent || '#C41E3A'};
  padding: 2.5rem;
  width: 100%;
  max-width: 340px;
  position: relative;
`;

const ModalTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${p => p.$accent || '#C41E3A'};
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
  &:focus { outline: none; border-color: ${p => p.$accent || '#C41E3A'}; }
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${p => p.$accent || '#C41E3A'};
  border: none;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ModalError = styled.div`
  color: #FF4444;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  &:hover { color: #FFFFFF; }
`;

// ============================================
// BOTANICAL - Glasmorphism Card
// ============================================
const BotanicalComingSoon = ({ names, date, onLogoClick, children }) => {
  const glassReveal = keyframes`
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  `;

  const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    background: linear-gradient(135deg, #040a04 0%, #0f230f 50%, #040a04 100%);
    font-family: 'Cormorant Garamond', Georgia, serif;
  `;

  const GlassCard = styled.div`
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 32px;
    padding: clamp(2.5rem, 5vw, 4rem);
    max-width: 500px;
    text-align: center;
    animation: ${glassReveal} 1.2s ease forwards;
  `;

  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #FFFFFF;
    margin-bottom: 2rem;
    cursor: default;
    user-select: none;
  `;

  const Eyebrow = styled.span`
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 1.5rem;
  `;

  const NamesText = styled.h1`
    font-size: clamp(2.5rem, 10vw, 4rem);
    font-weight: 300;
    color: #FFFFFF;
    margin: 0 0 1.5rem;
    line-height: 1.2;
  `;

  const DateText = styled.p`
    font-size: clamp(1.1rem, 3vw, 1.4rem);
    color: #FFFFFF;
    letter-spacing: 0.05em;
    margin: 0 0 0.5rem;
  `;

  const Status = styled.p`
    font-family: 'Inter', sans-serif;
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #40916C;
    margin-top: 2rem;
  `;

  return (
    <Section>
      <GlassCard>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Eyebrow>Wir heiraten</Eyebrow>
        <NamesText>{names[0]} <span style={{fontStyle:'italic',fontSize:'0.5em',color:'rgba(255,255,255,0.4)'}}>&</span> {names[1]}</NamesText>
        {date && <DateText>{date}</DateText>}
        <Status>Coming Soon</Status>
      </GlassCard>
      {children}
    </Section>
  );
};

// ============================================
// EDITORIAL - Magazine Style
// ============================================
const EditorialComingSoon = ({ names, date, onLogoClick, children }) => {
  const letterReveal = keyframes`
    from { opacity: 0; transform: translateY(100%); }
    to { opacity: 1; transform: translateY(0); }
  `;
  const lineGrow = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;
  const slideUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

  const Section = styled.section`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(2rem, 5vw, 4rem);
    background: #0A0A0A;
    font-family: 'Inter', sans-serif;
    position: relative;
  `;

  const Grid = styled.div`
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 100px 100px;
  `;

  const Content = styled.div`position: relative; z-index: 1; max-width: 1000px;`;

  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #FFFFFF;
    margin-bottom: 3rem;
    cursor: default;
    user-select: none;
  `;

  const Tagline = styled.p`
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 1.5rem;
    animation: ${slideUp} 0.8s ease forwards;
  `;

  const Headline = styled.h1`
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(4rem, 15vw, 10rem);
    font-weight: 700;
    line-height: 0.9;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    margin: 0;
  `;

  const Name1 = styled.span`
    display: inline-block;
    animation: ${letterReveal} 0.8s ease forwards;
  `;

  const Ampersand = styled.span`
    display: inline-block;
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
    font-size: 0.5em;
    color: #C41E3A;
    margin: 0 0.2em;
  `;

  const Name2 = styled.span`
    display: inline-block;
    color: #C41E3A;
    animation: ${letterReveal} 0.8s ease forwards;
    animation-delay: 0.3s;
  `;

  const DateLine = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 2.5rem;
    animation: ${slideUp} 0.8s ease forwards;
    animation-delay: 0.8s;
    opacity: 0;
  `;

  const Line = styled.div`
    width: 60px;
    height: 2px;
    background: #C41E3A;
    transform-origin: left;
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 1s;
  `;

  const DateText = styled.p`
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1rem, 2vw, 1.4rem);
    font-style: italic;
    color: #FFFFFF;
  `;

  const Status = styled.p`
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-top: 1rem;
    animation: ${slideUp} 0.8s ease forwards;
    animation-delay: 1.2s;
    opacity: 0;
  `;

  return (
    <Section>
      <Grid />
      <Content>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Tagline>Wir sagen Ja</Tagline>
        <Headline>
          <Name1>{names[0].toUpperCase()}</Name1>
          <Ampersand>&</Ampersand>
          <Name2>{names[1].toUpperCase()}</Name2>
        </Headline>
        <DateLine>
          <Line />
          <DateText>{date || 'Datum folgt'}</DateText>
        </DateLine>
        <Status>Coming Soon</Status>
      </Content>
      {children}
    </Section>
  );
};

// ============================================
// CONTEMPORARY - Playful Geometric
// ============================================
const ContemporaryComingSoon = ({ names, date, onLogoClick, children }) => {
  const float = keyframes`
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(10px, -15px) rotate(5deg); }
  `;
  const slideUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

  const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FAFAFA;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 2rem;
  `;

  const FloatingCircle = styled.div`
    position: absolute;
    border: 3px solid #1a1a1a;
    border-radius: 50%;
    background: ${p => p.$color};
    width: ${p => p.$size}px;
    height: ${p => p.$size}px;
    animation: ${float} ${p => p.$dur}s ease-in-out infinite;
    animation-delay: ${p => p.$del}s;
  `;

  const FloatingSquare = styled.div`
    position: absolute;
    border: 3px solid #1a1a1a;
    background: ${p => p.$color};
    width: ${p => p.$size}px;
    height: ${p => p.$size}px;
    animation: ${float} ${p => p.$dur}s ease-in-out infinite;
    animation-delay: ${p => p.$del}s;
  `;

  const Content = styled.div`
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 600px;
  `;

  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #1a1a1a;
    margin-bottom: 2rem;
    cursor: default;
    user-select: none;
  `;

  const Eyebrow = styled.div`
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #FF6B6B;
    margin-bottom: 1rem;
    animation: ${slideUp} 0.6s ease forwards;
  `;

  const NamesWrap = styled.h1`
    font-size: clamp(3.5rem, 12vw, 7rem);
    font-weight: 700;
    line-height: 0.95;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    margin: 0 0 2rem;
    animation: ${slideUp} 0.7s ease forwards;
    animation-delay: 0.1s;
  `;

  const FirstName = styled.span`display: block; color: #FF6B6B;`;
  const SecondName = styled.span`display: block; color: #1a1a1a;`;
  const Amp = styled.span`display: block; font-size: 0.4em; color: #999;`;

  const InfoBadge = styled.div`
    display: inline-flex;
    font-size: 0.9rem;
    font-weight: 700;
    padding: 0.75rem 1.25rem;
    background: #FFE66D;
    color: #1a1a1a;
    border: 3px solid #1a1a1a;
    box-shadow: 4px 4px 0 #1a1a1a;
    animation: ${slideUp} 0.5s ease forwards;
    animation-delay: 0.3s;
    opacity: 0;
  `;

  const Status = styled.div`
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #FFFFFF;
    background: #FF6B6B;
    padding: 0.75rem 2rem;
    border: 3px solid #1a1a1a;
    box-shadow: 4px 4px 0 #1a1a1a;
    margin-top: 1.5rem;
    animation: ${slideUp} 0.5s ease forwards;
    animation-delay: 0.4s;
    opacity: 0;
  `;

  return (
    <Section>
      <FloatingCircle $color="#FF6B6B" $size={100} $dur={10} $del={0} style={{top:'10%',left:'5%'}} />
      <FloatingCircle $color="#7B68EE" $size={60} $dur={8} $del={1} style={{top:'60%',left:'10%'}} />
      <FloatingSquare $color="#FFE66D" $size={70} $dur={12} $del={0.5} style={{top:'20%',right:'15%'}} />
      <FloatingSquare $color="#7B68EE" $size={50} $dur={9} $del={2} style={{bottom:'25%',left:'20%'}} />
      
      <Content>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Eyebrow>Wir heiraten</Eyebrow>
        <NamesWrap>
          <FirstName>{names[0]}</FirstName>
          <Amp>&</Amp>
          <SecondName>{names[1]}</SecondName>
        </NamesWrap>
        {date && <InfoBadge>{date}</InfoBadge>}
        <Status>Coming Soon</Status>
      </Content>
      {children}
    </Section>
  );
};

// ============================================
// LUXE - Cinematic Elegant
// ============================================
const LuxeComingSoon = ({ names, date, onLogoClick, children }) => {
  const revealText = keyframes`from { transform: translateY(110%); } to { transform: translateY(0); }`;
  const expandLine = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;
  const slideUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

  const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #0a0a0a 0%, #1c1c1c 100%);
    font-family: 'Cormorant Garamond', Georgia, serif;
    padding: 2rem;
  `;

  const Content = styled.div`text-align: center; max-width: 800px;`;

  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #D4AF37;
    margin-bottom: 3rem;
    cursor: default;
    user-select: none;
  `;

  const EyebrowText = styled.span`
    display: inline-block;
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: #D4AF37;
    margin-bottom: 2rem;
    animation: ${slideUp} 0.8s ease forwards;
    animation-delay: 0.5s;
    opacity: 0;
  `;

  const NameLine = styled.div`overflow: hidden;`;
  const NameText = styled.h1`
    font-size: clamp(4rem, 15vw, 10rem);
    font-weight: 300;
    font-style: italic;
    color: #F5F0E6;
    line-height: 0.9;
    letter-spacing: -0.03em;
    margin: 0;
    transform: translateY(110%);
    animation: ${revealText} 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: ${p => p.$delay || '0.6s'};
  `;

  const AmpText = styled.span`
    display: block;
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-style: italic;
    color: #D4AF37;
    margin: 1rem 0;
    animation: ${slideUp} 0.8s ease forwards;
    animation-delay: 0.9s;
    opacity: 0;
  `;

  const Divider = styled.div`
    width: 80px;
    height: 1px;
    background: #D4AF37;
    margin: 2.5rem auto;
    transform-origin: center;
    transform: scaleX(0);
    animation: ${expandLine} 1s ease forwards;
    animation-delay: 1.3s;
  `;

  const DateText = styled.p`
    font-size: clamp(1.25rem, 3vw, 2rem);
    font-style: italic;
    color: #F5F0E6;
    margin: 0;
    animation: ${slideUp} 0.8s ease forwards;
    animation-delay: 1.5s;
    opacity: 0;
  `;

  const Status = styled.p`
    font-family: 'Inter', sans-serif;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(245,240,230,0.5);
    margin-top: 2rem;
    animation: ${slideUp} 0.8s ease forwards;
    animation-delay: 1.7s;
    opacity: 0;
  `;

  return (
    <Section>
      <Content>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <EyebrowText>Wir heiraten</EyebrowText>
        <NameLine><NameText $delay="0.6s">{names[0]}</NameText></NameLine>
        <AmpText>&</AmpText>
        <NameLine><NameText $delay="0.75s">{names[1]}</NameText></NameLine>
        <Divider />
        <DateText>{date || 'Datum folgt'}</DateText>
        <Status>Coming Soon</Status>
      </Content>
      {children}
    </Section>
  );
};

// ============================================
// NEON - Glitch & Glow
// ============================================
const NeonComingSoon = ({ names, date, onLogoClick, children }) => {
  const glitch = keyframes`
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-3px, 3px); }
    40% { transform: translate(-3px, -3px); }
    60% { transform: translate(3px, 3px); }
    80% { transform: translate(3px, -3px); }
  `;
  const flicker = keyframes`0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.7; } 94% { opacity: 1; }`;
  const pulse = keyframes`0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; }`;
  const scanline = keyframes`0% { top: -100%; } 100% { top: 100%; }`;

  const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0f;
    font-family: 'Space Grotesk', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 2rem;
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
  `;

  const GlowOrb = styled.div`
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: ${pulse} 4s ease-in-out infinite;
  `;

  const Scanline = styled.div`
    position: absolute;
    left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent);
    animation: ${scanline} 6s linear infinite;
  `;

  const Corner = styled.div`
    position: absolute;
    width: 80px;
    height: 80px;
    border: 1px solid rgba(0,255,255,0.2);
  `;

  const Content = styled.div`position: relative; z-index: 2; text-align: center;`;

  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0,255,255,0.5);
    margin-bottom: 2rem;
    cursor: default;
    user-select: none;
  `;

  const Eyebrow = styled.div`
    font-size: 0.9rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0,255,255,0.5);
    margin-bottom: 30px;
  `;

  const NamesText = styled.h1`
    font-size: clamp(4rem, 15vw, 10rem);
    font-weight: 700;
    line-height: 0.9;
    color: #fff;
    text-transform: uppercase;
    position: relative;
    margin: 0 0 30px;
  `;

  const Amp = styled.span`
    display: block;
    font-size: 0.4em;
    font-style: italic;
    color: #ff00ff;
    text-shadow: 0 0 20px rgba(255,0,255,0.5);
    animation: ${flicker} 4s ease-in-out infinite;
    margin: 20px 0;
  `;

  const DateText = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    color: #00ffff;
    text-shadow: 0 0 15px rgba(0,255,255,0.5);
    letter-spacing: 0.2em;
    margin-bottom: 30px;
  `;

  const Status = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 0.85rem;
    color: #00ff88;
    border: 1px solid rgba(0,255,136,0.3);
    padding: 15px 30px;
  `;

  return (
    <Section>
      <Grid />
      <GlowOrb style={{width:400,height:400,background:'rgba(0,255,255,0.3)',top:-100,left:-100}} />
      <GlowOrb style={{width:300,height:300,background:'rgba(255,0,255,0.3)',bottom:-50,right:-50,animationDelay:'2s'}} />
      <Scanline />
      <Corner style={{top:30,left:30,borderRight:'none',borderBottom:'none'}} />
      <Corner style={{top:30,right:30,borderLeft:'none',borderBottom:'none'}} />
      <Corner style={{bottom:30,left:30,borderRight:'none',borderTop:'none'}} />
      <Corner style={{bottom:30,right:30,borderLeft:'none',borderTop:'none'}} />
      
      <Content>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Eyebrow>// The Wedding Of //</Eyebrow>
        <NamesText>
          {names[0]}
          <Amp>&</Amp>
          {names[1]}
        </NamesText>
        {date && <DateText>{date}</DateText>}
        <Status>Wedding.exe loading...</Status>
      </Content>
      {children}
    </Section>
  );
};

// ============================================
// VIDEO - Cinematic Fullscreen
// ============================================
const VideoComingSoon = ({ names, date, onLogoClick, children }) => {
  const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
  const lineExpand = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

  const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000000;
    font-family: 'Inter', sans-serif;
    position: relative;
    padding: 2rem;
  `;

  const CinemaBar = styled.div`
    position: absolute;
    left: 0; right: 0;
    height: 12vh;
    background: #000;
  `;

  const Scanlines = styled.div`
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.015) 2px,
      rgba(255, 255, 255, 0.015) 4px
    );
    pointer-events: none;
  `;

  const Content = styled.div`text-align: center; position: relative; z-index: 1; max-width: 800px;`;

  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #E50914;
    margin-bottom: 3rem;
    cursor: default;
    user-select: none;
  `;

  const Eyebrow = styled.p`
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #E50914;
    margin-bottom: 2rem;
    animation: ${fadeUp} 0.8s ease forwards;
    animation-delay: 0.3s;
    opacity: 0;
  `;

  const NameText = styled.h1`
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(3rem, 12vw, 7rem);
    font-weight: 700;
    text-transform: uppercase;
    color: #FFFFFF;
    line-height: 0.95;
    margin: 0;
    animation: ${fadeUp} 0.8s ease forwards;
    animation-delay: ${p => p.$delay || '0.5s'};
    opacity: 0;
  `;

  const Amp = styled.span`
    display: block;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-style: italic;
    color: #E50914;
    margin: 1rem 0;
    animation: ${fadeUp} 0.8s ease forwards;
    animation-delay: 0.7s;
    opacity: 0;
  `;

  const Divider = styled.div`
    width: 80px;
    height: 1px;
    background: #E50914;
    margin: 2rem auto;
    transform-origin: center;
    transform: scaleX(0);
    animation: ${lineExpand} 0.8s ease forwards;
    animation-delay: 1s;
  `;

  const DateText = styled.p`
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-style: italic;
    color: #FFFFFF;
    margin: 0;
    animation: ${fadeUp} 0.8s ease forwards;
    animation-delay: 1.2s;
    opacity: 0;
  `;

  const Status = styled.p`
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-top: 2rem;
    animation: ${fadeUp} 0.8s ease forwards;
    animation-delay: 1.4s;
    opacity: 0;
  `;

  return (
    <Section>
      <CinemaBar style={{top:0}} />
      <CinemaBar style={{bottom:0}} />
      <Scanlines />
      <Content>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Eyebrow>A Wedding Film</Eyebrow>
        <NameText $delay="0.5s">{names[0]}</NameText>
        <Amp>&</Amp>
        <NameText $delay="0.9s">{names[1]}</NameText>
        <Divider />
        <DateText>{date || 'Datum folgt'}</DateText>
        <Status>Coming Soon</Status>
      </Content>
      {children}
    </Section>
  );
};

// ============================================
// THEME CONFIG
// ============================================
const THEME_CONFIG = {
  botanical: { Component: BotanicalComingSoon, accent: '#40916C', bg: '#0D1F17' },
  editorial: { Component: EditorialComingSoon, accent: '#C41E3A', bg: '#0A0A0A' },
  contemporary: { Component: ContemporaryComingSoon, accent: '#FF6B6B', bg: '#1a1a1a' },
  luxe: { Component: LuxeComingSoon, accent: '#D4AF37', bg: '#0a0a0a' },
  neon: { Component: NeonComingSoon, accent: '#00ffff', bg: '#0a0a0f' },
  video: { Component: VideoComingSoon, accent: '#E50914', bg: '#000000' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ComingSoon({ onAdminAccess }) {
  const { project, theme, coupleNames, weddingDate } = useWedding();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const config = THEME_CONFIG[theme] || THEME_CONFIG.editorial;
  const ThemeComponent = config.Component;

  const names = coupleNames?.split('&').map(n => n.trim()) || ['Name', 'Name'];
  const formattedDate = weddingDate 
    ? new Date(weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      setShowLogin(true);
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password === project?.admin_password) {
      sessionStorage.setItem(`admin_preview_${project.id}`, 'true');
      setShowLogin(false);
      if (onAdminAccess) onAdminAccess();
      else window.location.reload();
    } else {
      setError('Falsches Passwort');
    }
    setIsLoading(false);
  };

  const LoginModalEl = showLogin && (
    <ModalOverlay onClick={() => setShowLogin(false)}>
      <ModalBox $accent={config.accent} $bg={config.bg} onClick={e => e.stopPropagation()}>
        <ModalClose onClick={() => setShowLogin(false)}>x</ModalClose>
        <ModalTitle $accent={config.accent}>Admin Vorschau</ModalTitle>
        <form onSubmit={handleLogin}>
          {error && <ModalError>{error}</ModalError>}
          <ModalInput
            $accent={config.accent}
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <ModalButton $accent={config.accent} type="submit" disabled={isLoading}>
            {isLoading ? '...' : 'Vorschau oeffnen'}
          </ModalButton>
        </form>
      </ModalBox>
    </ModalOverlay>
  );

  return (
    <ThemeComponent names={names} date={formattedDate} onLogoClick={handleLogoClick}>
      {LoginModalEl}
    </ThemeComponent>
  );
}
