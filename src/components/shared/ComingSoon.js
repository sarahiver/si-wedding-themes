// src/components/shared/ComingSoon.js
// Theme-spezifische Coming Soon Pages
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// BOTANICAL - Glasmorphism mit Pflanzen
// ============================================
const BotanicalComingSoon = ({ names, date, colors, onLogoClick, children }) => {
  const float = keyframes`
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  `;
  
  const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #0D1F17 0%, #1B4332 50%, #0D1F17 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    font-family: 'Cormorant Garamond', Georgia, serif;
  `;
  
  const LeafSVG = styled.div`
    position: absolute;
    opacity: 0.1;
    color: #40916C;
    font-size: ${p => p.$size || '200px'};
    animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
    animation-delay: ${p => p.$delay || '0s'};
    top: ${p => p.$top};
    left: ${p => p.$left};
    right: ${p => p.$right};
    bottom: ${p => p.$bottom};
  `;
  
  const GlassCard = styled.div`
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 4rem 3rem;
    text-align: center;
    position: relative;
    z-index: 1;
    max-width: 500px;
  `;
  
  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #FFFFFF;
    margin-bottom: 2rem;
    cursor: default;
    user-select: none;
  `;
  
  const Names = styled.h1`
    font-size: clamp(2.5rem, 8vw, 3.5rem);
    font-weight: 300;
    color: #FFFFFF;
    margin: 0 0 1rem;
    letter-spacing: 0.1em;
    span { color: #40916C; }
  `;
  
  const Divider = styled.div`
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #40916C, transparent);
    margin: 1.5rem auto;
  `;
  
  const Status = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #40916C;
    margin-bottom: 1.5rem;
  `;
  
  const Message = styled.p`
    font-size: 1.1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 2rem;
    font-style: italic;
  `;
  
  const DateDisplay = styled.div`
    font-size: 1.3rem;
    color: #40916C;
    letter-spacing: 0.1em;
  `;

  return (
    <Container>
      <LeafSVG $top="10%" $left="5%" $size="180px" $duration="8s">🌿</LeafSVG>
      <LeafSVG $top="60%" $right="10%" $size="150px" $duration="7s" $delay="1s">🌿</LeafSVG>
      <LeafSVG $bottom="15%" $left="15%" $size="120px" $duration="9s" $delay="2s">🍃</LeafSVG>
      
      <GlassCard>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Names>{names[0]} <span>&</span> {names[1]}</Names>
        <Divider />
        <Status>● Coming Soon</Status>
        <Message>
          Unsere Hochzeits-Website erblüht bald.<br />
          Schaut wieder vorbei!
        </Message>
        {date && <DateDisplay>{date}</DateDisplay>}
      </GlassCard>
      {children}
    </Container>
  );
};

// ============================================
// EDITORIAL - Magazin Style
// ============================================
const EditorialComingSoon = ({ names, date, colors, onLogoClick, children }) => {
  const Container = styled.div`
    min-height: 100vh;
    background: #0A0A0A;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    font-family: 'Inter', -apple-system, sans-serif;
  `;
  
  const Grid = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 100px 100px;
  `;
  
  const Content = styled.div`
    text-align: center;
    position: relative;
    z-index: 1;
    max-width: 700px;
  `;
  
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
  
  const Label = styled.div`
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    color: #C41E3A;
    margin-bottom: 1rem;
  `;
  
  const Names = styled.h1`
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(4rem, 15vw, 8rem);
    font-weight: 400;
    color: #FFFFFF;
    margin: 0;
    line-height: 0.9;
    letter-spacing: -0.02em;
    
    span {
      display: block;
      font-size: 0.4em;
      color: #C41E3A;
      letter-spacing: 0.1em;
      margin: 0.5rem 0;
    }
  `;
  
  const Line = styled.div`
    width: 1px;
    height: 80px;
    background: #C41E3A;
    margin: 2rem auto;
  `;
  
  const Status = styled.div`
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 1rem;
  `;
  
  const DateDisplay = styled.div`
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-style: italic;
    color: #FFFFFF;
  `;

  return (
    <Container>
      <Grid />
      <Content>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Label>Hochzeit</Label>
        <Names>
          {names[0]}
          <span>&</span>
          {names[1]}
        </Names>
        <Line />
        <Status>Coming Soon</Status>
        {date && <DateDisplay>{date}</DateDisplay>}
      </Content>
      {children}
    </Container>
  );
};

// ============================================
// CONTEMPORARY - Geometrisch mit Gold
// ============================================
const ContemporaryComingSoon = ({ names, date, colors, onLogoClick, children }) => {
  const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;
  
  const Container = styled.div`
    min-height: 100vh;
    background: #1A1A1A;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    font-family: 'Montserrat', -apple-system, sans-serif;
  `;
  
  const GeometricRing = styled.div`
    position: absolute;
    width: 600px;
    height: 600px;
    border: 1px solid rgba(212, 175, 55, 0.1);
    border-radius: 50%;
    animation: ${rotate} 60s linear infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: -5px;
      left: 50%;
      width: 10px;
      height: 10px;
      background: #D4AF37;
      border-radius: 50%;
    }
  `;
  
  const Content = styled.div`
    text-align: center;
    position: relative;
    z-index: 1;
    padding: 3rem;
    border: 1px solid rgba(212, 175, 55, 0.3);
    max-width: 450px;
  `;
  
  const Corner = styled.div`
    position: absolute;
    width: 30px;
    height: 30px;
    border-color: #D4AF37;
    border-style: solid;
    ${p => p.$pos === 'tl' && 'top: -1px; left: -1px; border-width: 2px 0 0 2px;'}
    ${p => p.$pos === 'tr' && 'top: -1px; right: -1px; border-width: 2px 2px 0 0;'}
    ${p => p.$pos === 'bl' && 'bottom: -1px; left: -1px; border-width: 0 0 2px 2px;'}
    ${p => p.$pos === 'br' && 'bottom: -1px; right: -1px; border-width: 0 2px 2px 0;'}
  `;
  
  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #D4AF37;
    margin-bottom: 2rem;
    cursor: default;
    user-select: none;
  `;
  
  const Names = styled.h1`
    font-size: clamp(2rem, 6vw, 3rem);
    font-weight: 300;
    color: #FFFFFF;
    margin: 0 0 0.5rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    
    span { color: #D4AF37; }
  `;
  
  const Subtitle = styled.div`
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 2rem;
  `;
  
  const Status = styled.div`
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #1A1A1A;
    background: #D4AF37;
    padding: 0.5rem 1.5rem;
    margin-bottom: 2rem;
  `;
  
  const DateDisplay = styled.div`
    font-size: 1rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.6);
  `;

  return (
    <Container>
      <GeometricRing />
      <Content>
        <Corner $pos="tl" />
        <Corner $pos="tr" />
        <Corner $pos="bl" />
        <Corner $pos="br" />
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Names>{names[0]} <span>&</span> {names[1]}</Names>
        <Subtitle>Hochzeit</Subtitle>
        <Status>Coming Soon</Status>
        {date && <DateDisplay>{date}</DateDisplay>}
      </Content>
      {children}
    </Container>
  );
};

// ============================================
// LUXE - Elegant mit Ornamenten
// ============================================
const LuxeComingSoon = ({ names, date, colors, onLogoClick, children }) => {
  const shimmer = keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  `;
  
  const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(180deg, #0F0F0F 0%, #1C1C1C 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    font-family: 'Cormorant Garamond', Georgia, serif;
  `;
  
  const Frame = styled.div`
    border: 1px solid rgba(212, 175, 55, 0.2);
    padding: 4rem 3rem;
    position: relative;
    max-width: 500px;
    text-align: center;
    
    &::before, &::after {
      content: '✦';
      position: absolute;
      color: #D4AF37;
      font-size: 1.5rem;
    }
    &::before { top: -0.75rem; left: 50%; transform: translateX(-50%); }
    &::after { bottom: -0.75rem; left: 50%; transform: translateX(-50%); }
  `;
  
  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #D4AF37;
    margin-bottom: 2rem;
    cursor: default;
    user-select: none;
  `;
  
  const Ornament = styled.div`
    font-size: 0.8rem;
    color: #D4AF37;
    letter-spacing: 0.5em;
    margin-bottom: 1rem;
  `;
  
  const Names = styled.h1`
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 300;
    font-style: italic;
    color: #FFFFFF;
    margin: 0;
    line-height: 1.2;
    
    span {
      display: block;
      font-size: 0.5em;
      color: #D4AF37;
      font-style: normal;
      letter-spacing: 0.3em;
      margin: 0.5rem 0;
    }
  `;
  
  const Divider = styled.div`
    width: 150px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #D4AF37, transparent);
    margin: 2rem auto;
  `;
  
  const Status = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 1.5rem;
  `;
  
  const DateDisplay = styled.div`
    font-size: 1.3rem;
    font-style: italic;
    background: linear-gradient(90deg, #D4AF37, #F5E6A3, #D4AF37);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${shimmer} 3s linear infinite;
  `;

  return (
    <Container>
      <Frame>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Ornament>— ✦ —</Ornament>
        <Names>
          {names[0]}
          <span>&</span>
          {names[1]}
        </Names>
        <Divider />
        <Status>Coming Soon</Status>
        {date && <DateDisplay>{date}</DateDisplay>}
      </Frame>
      {children}
    </Container>
  );
};

// ============================================
// NEON - Glow Effekte
// ============================================
const NeonComingSoon = ({ names, date, colors, onLogoClick, children }) => {
  const flicker = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  `;
  
  const glow = keyframes`
    0%, 100% { text-shadow: 0 0 10px #FF006E, 0 0 20px #FF006E, 0 0 40px #FF006E; }
    50% { text-shadow: 0 0 20px #FF006E, 0 0 40px #FF006E, 0 0 80px #FF006E; }
  `;
  
  const Container = styled.div`
    min-height: 100vh;
    background: #0D0D0D;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, sans-serif;
  `;
  
  const Grid = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(rgba(255, 0, 110, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 0, 110, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    perspective: 500px;
    transform: rotateX(60deg);
    transform-origin: center top;
  `;
  
  const Content = styled.div`
    text-align: center;
    position: relative;
    z-index: 1;
  `;
  
  const Logo = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -2px;
    color: #FF006E;
    margin-bottom: 2rem;
    cursor: default;
    user-select: none;
    text-shadow: 0 0 10px #FF006E;
  `;
  
  const Names = styled.h1`
    font-size: clamp(3rem, 12vw, 6rem);
    font-weight: 800;
    color: #FFFFFF;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    animation: ${glow} 2s ease-in-out infinite;
    
    span {
      color: #FF006E;
      display: inline-block;
      margin: 0 0.2em;
    }
  `;
  
  const Status = styled.div`
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #0D0D0D;
    background: #FF006E;
    padding: 0.75rem 2rem;
    margin: 2rem 0;
    animation: ${flicker} 3s ease-in-out infinite;
  `;
  
  const DateDisplay = styled.div`
    font-size: 1.2rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.2em;
  `;

  return (
    <Container>
      <Grid />
      <Content>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Names>{names[0]} <span>&</span> {names[1]}</Names>
        <Status>Coming Soon</Status>
        {date && <DateDisplay>{date}</DateDisplay>}
      </Content>
      {children}
    </Container>
  );
};

// ============================================
// VIDEO - Cinematisch
// ============================================
const VideoComingSoon = ({ names, date, colors, onLogoClick, children }) => {
  const scanline = keyframes`
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  `;
  
  const Container = styled.div`
    min-height: 100vh;
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, sans-serif;
  `;
  
  const Scanlines = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.02) 2px,
      rgba(255, 255, 255, 0.02) 4px
    );
    pointer-events: none;
  `;
  
  const ScanBeam = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(180deg, transparent, rgba(229, 9, 20, 0.1), transparent);
    animation: ${scanline} 4s linear infinite;
    pointer-events: none;
  `;
  
  const Content = styled.div`
    text-align: center;
    position: relative;
    z-index: 1;
    padding: 3rem;
  `;
  
  const CinematicBars = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    height: 15vh;
    background: #000;
    ${p => p.$top ? 'top: 0;' : 'bottom: 0;'}
  `;
  
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
  
  const Subtitle = styled.div`
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 1rem;
  `;
  
  const Names = styled.h1`
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(3rem, 10vw, 5rem);
    font-weight: 400;
    color: #FFFFFF;
    margin: 0;
    letter-spacing: 0.05em;
    
    span {
      color: #E50914;
      margin: 0 0.1em;
    }
  `;
  
  const Line = styled.div`
    width: 100px;
    height: 2px;
    background: #E50914;
    margin: 2rem auto;
  `;
  
  const Status = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    color: #E50914;
    margin-bottom: 1.5rem;
  `;
  
  const DateDisplay = styled.div`
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
  `;

  return (
    <Container>
      <CinematicBars $top />
      <CinematicBars />
      <Scanlines />
      <ScanBeam />
      <Content>
        <Logo onClick={onLogoClick}>S&I.</Logo>
        <Subtitle>A Wedding Film</Subtitle>
        <Names>{names[0]} <span>&</span> {names[1]}</Names>
        <Line />
        <Status>● Coming Soon</Status>
        {date && <DateDisplay>{date}</DateDisplay>}
      </Content>
      {children}
    </Container>
  );
};

// ============================================
// LOGIN MODAL (shared)
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoginModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const LoginBox = styled.div`
  background: #1A1A1A;
  border: 1px solid ${p => p.$accent};
  padding: 2rem;
  width: 100%;
  max-width: 320px;
  position: relative;
`;

const LoginTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${p => p.$accent};
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const LoginInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${p => p.$accent};
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: ${p => p.$accent};
  border: none;
  color: #FFFFFF;
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const LoginError = styled.div`
  color: #FF4444;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  &:hover { color: #FFFFFF; }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const THEME_ACCENTS = {
  botanical: '#40916C',
  editorial: '#C41E3A',
  contemporary: '#D4AF37',
  luxe: '#D4AF37',
  neon: '#FF006E',
  video: '#E50914',
};

export default function ComingSoon({ onAdminAccess }) {
  const { project, theme, coupleNames, weddingDate } = useWedding();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const accent = THEME_ACCENTS[theme] || THEME_ACCENTS.editorial;
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

  const LoginModalComponent = showLogin && (
    <LoginModal onClick={() => setShowLogin(false)}>
      <LoginBox $accent={accent} onClick={e => e.stopPropagation()}>
        <CloseButton onClick={() => setShowLogin(false)}>×</CloseButton>
        <LoginTitle $accent={accent}>Admin Vorschau</LoginTitle>
        <form onSubmit={handleLogin}>
          {error && <LoginError>{error}</LoginError>}
          <LoginInput
            $accent={accent}
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <LoginButton $accent={accent} type="submit" disabled={isLoading}>
            {isLoading ? '...' : 'Vorschau öffnen'}
          </LoginButton>
        </form>
      </LoginBox>
    </LoginModal>
  );

  const props = { names, date: formattedDate, onLogoClick: handleLogoClick, children: LoginModalComponent };

  switch (theme) {
    case 'botanical': return <BotanicalComingSoon {...props} />;
    case 'editorial': return <EditorialComingSoon {...props} />;
    case 'contemporary': return <ContemporaryComingSoon {...props} />;
    case 'luxe': return <LuxeComingSoon {...props} />;
    case 'neon': return <NeonComingSoon {...props} />;
    case 'video': return <VideoComingSoon {...props} />;
    default: return <EditorialComingSoon {...props} />;
  }
}
