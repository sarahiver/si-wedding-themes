// src/components/shared/ComingSoon.js
// Coming Soon Pages - Matches each Theme's Hero Design
import React, { useState, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// STABLE LOGIN MODAL (outside theme components)
// ============================================
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalBox = styled.div`
  background: #1a1a1a;
  border: 1px solid ${p => p.$accent};
  padding: 2.5rem;
  width: 90%;
  max-width: 340px;
  position: relative;
`;

const ModalTitle = styled.h3`
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: ${p => p.$accent};
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: ${p => p.$accent}; }
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${p => p.$accent};
  border: none;
  color: #FFFFFF;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ModalError = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Inter', -apple-system, sans-serif;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  &:hover { color: #FFFFFF; }
`;

function LoginModal({ show, onClose, onSubmit, accent, error, isLoading }) {
  const [password, setPassword] = useState('');
  
  if (!show) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };
  
  // Inline styles als Fallback falls styled-components nicht laden
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  };
  
  const boxStyle = {
    background: '#1a1a1a',
    border: `1px solid ${accent}`,
    padding: '2.5rem',
    width: '90%',
    maxWidth: '340px',
    position: 'relative',
  };
  
  const titleStyle = {
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: accent,
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
  };
  
  const inputStyle = {
    width: '100%',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  };
  
  const buttonStyle = {
    width: '100%',
    padding: '1rem',
    background: accent,
    border: 'none',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
  };
  
  const closeStyle = {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
    lineHeight: 1,
  };
  
  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: "'Inter', -apple-system, sans-serif",
  };
  
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={boxStyle} onClick={e => e.stopPropagation()}>
        <button style={closeStyle} onClick={onClose}>×</button>
        <h3 style={titleStyle}>Admin Vorschau</h3>
        <form onSubmit={handleSubmit}>
          {error && <div style={errorStyle}>{error}</div>}
          <input
            style={inputStyle}
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <button style={buttonStyle} type="submit" disabled={isLoading}>
            {isLoading ? '...' : 'Vorschau öffnen'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================
// BOTANICAL GLASS
// ============================================
const BotanicalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Montserrat:wght@300;400;500&display=swap');
`;

const BotanicalSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(160deg, #030503 0%, #081208 40%, #050805 100%);
  font-family: 'Cormorant Garamond', Georgia, serif;
`;

const BotanicalCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.25);
  padding: clamp(2.5rem, 5vw, 4rem) clamp(2rem, 4vw, 5rem);
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  }
`;

const BotanicalLogo = styled.div`
  font-family: 'Roboto', 'Arial Black', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -2px;
  color: #FFFFFF;
  margin-bottom: 2rem;
  cursor: pointer;
  user-select: none;
`;

const BotanicalEyebrow = styled.span`
  display: block;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-bottom: 1.5rem;
`;

const BotanicalNames = styled.h1`
  font-size: clamp(2.5rem, 10vw, 4.5rem);
  font-weight: 300;
  line-height: 1;
  color: rgba(255,255,255,0.95);
  margin: 0 0 1.5rem;
`;

const BotanicalAmp = styled.span`
  display: block;
  font-size: 0.35em;
  font-style: italic;
  color: rgba(255,255,255,0.55);
  margin: 0.4em 0;
`;

const BotanicalDate = styled.p`
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  color: rgba(255,255,255,0.95);
  letter-spacing: 0.05em;
  margin: 0;
`;

const BotanicalStatus = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-top: 2rem;
`;

const BotanicalComingSoon = ({ names, date, onLogoClick }) => (
  <>
    <BotanicalStyles />
    <BotanicalSection>
      <BotanicalCard>
        <BotanicalLogo onClick={onLogoClick}>S&I.</BotanicalLogo>
        <BotanicalEyebrow>Wir heiraten</BotanicalEyebrow>
        <BotanicalNames>
          {names[0]}<BotanicalAmp>&</BotanicalAmp>{names[1]}
        </BotanicalNames>
        {date && <BotanicalDate>{date}</BotanicalDate>}
        <BotanicalStatus>● Coming Soon</BotanicalStatus>
      </BotanicalCard>
    </BotanicalSection>
  </>
);

// ============================================
// EDITORIAL - Magazine Style
// ============================================
const EditorialStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;1,400&family=Inter:wght@300;400;500&display=swap');
`;

const letterReveal = keyframes`
  from { opacity: 0; transform: translateY(100%) rotateX(-90deg); }
  to { opacity: 1; transform: translateY(0) rotateX(0); }
`;
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const lineGrow = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const EditorialSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4rem);
  background: #0A0A0A;
  font-family: 'Inter', -apple-system, sans-serif;
  position: relative;
`;

const EditorialGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 100px 100px;
`;

const EditorialContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
`;

const EditorialLogo = styled.div`
  font-family: 'Roboto', 'Arial Black', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -2px;
  color: #FFFFFF;
  margin-bottom: 3rem;
  cursor: pointer;
  user-select: none;
`;

const EditorialTagline = styled.p`
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  margin-bottom: 1.5rem;
  animation: ${slideUp} 0.8s ease forwards;
`;

const EditorialHeadline = styled.h1`
  font-family: 'Oswald', 'Arial Narrow', sans-serif;
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 700;
  line-height: 0.9;
  color: #FAFAFA;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.15em;
`;

const EditorialWord = styled.span`
  display: inline-flex;
  overflow: hidden;
  perspective: 1000px;
`;

const EditorialLetter = styled.span`
  display: inline-block;
  animation: ${letterReveal} 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: ${p => p.$delay}s;
  color: ${p => p.$accent ? '#C41E3A' : '#FAFAFA'};
`;

const EditorialAmp = styled.span`
  font-family: 'Source Serif 4', Georgia, serif;
  font-style: italic;
  font-size: 0.5em;
  color: #C41E3A;
  margin: 0 0.1em;
`;

const EditorialDateLine = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.5s;
`;

const EditorialLine = styled.div`
  width: 60px;
  height: 2px;
  background: #C41E3A;
  transform-origin: left;
  transform: scaleX(0);
  animation: ${lineGrow} 0.6s ease forwards;
  animation-delay: 1.7s;
`;

const EditorialDate = styled.p`
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-style: italic;
  color: #FAFAFA;
  margin: 0;
`;

const EditorialStatus = styled.p`
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-top: 1rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 2s;
`;

const EditorialComingSoon = ({ names, date, onLogoClick }) => {
  const renderWord = (text, startDelay, accent = false) => (
    <EditorialWord>
      {text.toUpperCase().split('').map((letter, i) => (
        <EditorialLetter key={i} $delay={startDelay + i * 0.04} $accent={accent}>
          {letter}
        </EditorialLetter>
      ))}
    </EditorialWord>
  );

  return (
    <>
      <EditorialStyles />
      <EditorialSection>
        <EditorialGrid />
        <EditorialContent>
          <EditorialLogo onClick={onLogoClick}>S&I.</EditorialLogo>
          <EditorialTagline>Wir sagen Ja</EditorialTagline>
          <EditorialHeadline>
            {renderWord(names[0], 0.3)}
            <EditorialAmp>&</EditorialAmp>
            {renderWord(names[1], 0.8, true)}
          </EditorialHeadline>
          <EditorialDateLine>
            <EditorialLine />
            <EditorialDate>{date || 'Datum folgt'}</EditorialDate>
          </EditorialDateLine>
          <EditorialStatus>Coming Soon</EditorialStatus>
        </EditorialContent>
      </EditorialSection>
    </>
  );
};

// ============================================
// CONTEMPORARY - Playful Geometric
// ============================================
const ContemporaryStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
`;

const float = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(10px, -15px) rotate(5deg); }
`;

const ContemporarySection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAFAFA;
  font-family: 'DM Sans', -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
  padding: 2rem;
`;

const ContemporaryShape = styled.div`
  position: absolute;
  border: 3px solid #1a1a1a;
  background: ${p => p.$bg};
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: ${p => p.$circle ? '50%' : '0'};
  animation: ${float} ${p => p.$dur}s ease-in-out infinite;
  animation-delay: ${p => p.$del}s;
  z-index: 0;
`;

const ContemporaryContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 600px;
`;

const ContemporaryLogo = styled.div`
  font-family: 'Roboto', 'Arial Black', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -2px;
  color: #1a1a1a;
  margin-bottom: 2rem;
  cursor: pointer;
  user-select: none;
`;

const ContemporaryEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FF6B6B;
  margin-bottom: 1.5rem;
  
  &::after {
    content: '';
    width: 60px;
    height: 3px;
    background: #FF6B6B;
  }
`;

const ContemporaryNames = styled.h1`
  font-size: clamp(3.5rem, 12vw, 7rem);
  font-weight: 700;
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  margin: 0 0 2rem;
`;

const ContemporaryName = styled.span`
  display: block;
  color: ${p => p.$first ? '#FF6B6B' : '#1a1a1a'};
`;

const ContemporaryAmp = styled.span`
  display: block;
  font-size: 0.4em;
  color: #999;
  margin: 0.3em 0;
`;

const ContemporaryBadge = styled.div`
  display: inline-flex;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.75rem 1.25rem;
  background: #FFE66D;
  color: #1a1a1a;
  border: 3px solid #1a1a1a;
  box-shadow: 4px 4px 0 #1a1a1a;
  margin-bottom: 1.5rem;
`;

const ContemporaryStatus = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #FFFFFF;
  background: #FF6B6B;
  padding: 0.875rem 2rem;
  border: 3px solid #1a1a1a;
  box-shadow: 4px 4px 0 #1a1a1a;
`;

const ContemporaryComingSoon = ({ names, date, onLogoClick }) => (
  <>
    <ContemporaryStyles />
    <ContemporarySection>
      <ContemporaryShape $bg="#FF6B6B" $size={100} $circle $dur={10} $del={0} style={{top:'10%',left:'5%'}} />
      <ContemporaryShape $bg="#7B68EE" $size={60} $circle $dur={8} $del={1} style={{top:'60%',left:'8%'}} />
      <ContemporaryShape $bg="#FFE66D" $size={70} $dur={12} $del={0.5} style={{top:'15%',right:'10%'}} />
      <ContemporaryShape $bg="#7B68EE" $size={50} $dur={9} $del={2} style={{bottom:'20%',left:'15%'}} />
      <ContemporaryShape $bg="#FF6B6B" $size={40} $circle $dur={11} $del={1.5} style={{bottom:'30%',right:'8%'}} />
      
      <ContemporaryContent>
        <ContemporaryLogo onClick={onLogoClick}>S&I.</ContemporaryLogo>
        <ContemporaryEyebrow>Wir heiraten</ContemporaryEyebrow>
        <ContemporaryNames>
          <ContemporaryName $first>{names[0]}</ContemporaryName>
          <ContemporaryAmp>&</ContemporaryAmp>
          <ContemporaryName>{names[1]}</ContemporaryName>
        </ContemporaryNames>
        {date && <ContemporaryBadge>{date}</ContemporaryBadge>}
        <div><ContemporaryStatus>Coming Soon</ContemporaryStatus></div>
      </ContemporaryContent>
    </ContemporarySection>
  </>
);

// ============================================
// LUXE - Cinematic Elegant
// ============================================
const LuxeStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400&display=swap');
`;

const revealText = keyframes`from { transform: translateY(110%); } to { transform: translateY(0); }`;
const expandLine = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const LuxeSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0a0a0a 0%, #151515 100%);
  font-family: 'Cormorant Garamond', Georgia, serif;
  padding: 2rem;
`;

const LuxeContent = styled.div`
  text-align: center;
  max-width: 900px;
`;

const LuxeLogo = styled.div`
  font-family: 'Roboto', 'Arial Black', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -2px;
  color: #D4AF37;
  margin-bottom: 3rem;
  cursor: pointer;
  user-select: none;
`;

const LuxeEyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #D4AF37;
  margin-bottom: 2rem;
`;

const LuxeNameLine = styled.div`overflow: hidden;`;

const LuxeName = styled.h1`
  font-size: clamp(4rem, 15vw, 11rem);
  font-weight: 300;
  font-style: italic;
  color: #F5F0E6;
  line-height: 0.85;
  letter-spacing: -0.02em;
  margin: 0;
  transform: translateY(110%);
  animation: ${revealText} 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: ${p => p.$delay};
`;

const LuxeAmp = styled.div`
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-style: italic;
  color: #D4AF37;
  margin: 0.75rem 0;
  overflow: hidden;
  
  span {
    display: inline-block;
    transform: translateY(110%);
    animation: ${revealText} 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: 0.9s;
  }
`;

const LuxeDivider = styled.div`
  width: 80px;
  height: 1px;
  background: #D4AF37;
  margin: 2.5rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${expandLine} 1s ease forwards;
  animation-delay: 1.4s;
`;

const LuxeDate = styled.p`
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-style: italic;
  color: #F5F0E6;
  margin: 0;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.6s;
`;

const LuxeStatus = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(245,240,230,0.4);
  margin-top: 2rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 1.8s;
`;

const LuxeComingSoon = ({ names, date, onLogoClick }) => (
  <>
    <LuxeStyles />
    <LuxeSection>
      <LuxeContent>
        <LuxeLogo onClick={onLogoClick}>S&I.</LuxeLogo>
        <LuxeEyebrow>Wir heiraten</LuxeEyebrow>
        <LuxeNameLine><LuxeName $delay="0.5s">{names[0]}</LuxeName></LuxeNameLine>
        <LuxeAmp><span>&</span></LuxeAmp>
        <LuxeNameLine><LuxeName $delay="0.7s">{names[1]}</LuxeName></LuxeNameLine>
        <LuxeDivider />
        <LuxeDate>{date || 'Datum folgt'}</LuxeDate>
        <LuxeStatus>Coming Soon</LuxeStatus>
      </LuxeContent>
    </LuxeSection>
  </>
);

// ============================================
// NEON - Cyberpunk Glitch
// ============================================
const NeonStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
`;

const glitchAnim = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;
const neonFlicker = keyframes`
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0.6; }
`;
const pulseGlow = keyframes`0%, 100% { opacity: 0.3; } 50% { opacity: 0.5; }`;
const scanlineMove = keyframes`0% { top: -100%; } 100% { top: 100%; }`;

const NeonSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0f;
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
  padding: 2rem;
`;

const NeonGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center top;
`;

const NeonGlow = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: ${pulseGlow} 4s ease-in-out infinite;
`;

const NeonScanline = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(0,255,255,0.2), transparent);
  animation: ${scanlineMove} 6s linear infinite;
  pointer-events: none;
`;

const NeonCorner = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border: 1px solid rgba(0,255,255,0.15);
`;

const NeonContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const NeonLogo = styled.div`
  font-family: 'Roboto', 'Arial Black', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -2px;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.3);
  margin-bottom: 2rem;
  cursor: pointer;
  user-select: none;
`;

const NeonEyebrow = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0,255,255,0.5);
  margin-bottom: 2rem;
  &::before, &::after { content: '//'; margin: 0 1rem; color: #ff00ff; }
`;

const NeonNames = styled.h1`
  font-size: clamp(3.5rem, 14vw, 9rem);
  font-weight: 700;
  line-height: 0.9;
  color: #fff;
  text-transform: uppercase;
  margin: 0 0 2rem;
  position: relative;
  
  &::before, &::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0; right: 0;
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

const NeonAmp = styled.span`
  display: block;
  font-size: 0.35em;
  font-weight: 300;
  font-style: italic;
  color: #ff00ff;
  text-shadow: 0 0 15px rgba(255,0,255,0.6);
  animation: ${neonFlicker} 3s ease-in-out infinite;
  margin: 0.5em 0;
`;

const NeonDate = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: #00ffff;
  text-shadow: 0 0 15px rgba(0,255,255,0.5);
  letter-spacing: 0.15em;
  margin-bottom: 2rem;
`;

const NeonStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: #00ff88;
  border: 1px solid rgba(0,255,136,0.3);
  padding: 1rem 2rem;
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00ff88;
    box-shadow: 0 0 10px #00ff88;
    animation: ${pulseGlow} 1.5s ease-in-out infinite;
  }
`;

const NeonComingSoon = ({ names, date, onLogoClick }) => {
  const fullText = `${names[0]} & ${names[1]}`;
  return (
    <>
      <NeonStyles />
      <NeonSection>
        <NeonGrid />
        <NeonGlow style={{width:400,height:400,background:'rgba(0,255,255,0.25)',top:'-10%',left:'-10%'}} />
        <NeonGlow style={{width:300,height:300,background:'rgba(255,0,255,0.25)',bottom:'-5%',right:'-5%',animationDelay:'2s'}} />
        <NeonScanline />
        <NeonCorner style={{top:30,left:30,borderRight:'none',borderBottom:'none'}} />
        <NeonCorner style={{top:30,right:30,borderLeft:'none',borderBottom:'none'}} />
        <NeonCorner style={{bottom:30,left:30,borderRight:'none',borderTop:'none'}} />
        <NeonCorner style={{bottom:30,right:30,borderLeft:'none',borderTop:'none'}} />
        
        <NeonContent>
          <NeonLogo onClick={onLogoClick}>S&I.</NeonLogo>
          <NeonEyebrow>The Wedding Of</NeonEyebrow>
          <NeonNames data-text={fullText}>
            {names[0]}<NeonAmp>&</NeonAmp>{names[1]}
          </NeonNames>
          {date && <NeonDate>{date}</NeonDate>}
          <NeonStatus>Wedding.exe loading...</NeonStatus>
        </NeonContent>
      </NeonSection>
    </>
  );
};

// ============================================
// VIDEO - Cinematic Film Style
// ============================================
const VideoStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
`;

const videoFadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const videoFadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const videoLineExpand = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const VideoSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0A0A0A;
  font-family: 'Inter', -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
`;

const VideoGrain = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
`;

const VideoContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 5;
  max-width: 800px;
  padding: 2rem;
`;

const VideoLogo = styled.div`
  font-family: 'Roboto', 'Arial Black', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.06em;
  color: #6B8CAE;
  margin-bottom: 3rem;
  cursor: pointer;
  user-select: none;
  opacity: 0;
  animation: ${videoFadeIn} 0.8s ease forwards;
`;

const VideoEyebrow = styled.p`
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #6B8CAE;
  margin: 0 0 2rem;
  opacity: 0;
  animation: ${videoFadeUp} 0.8s ease forwards;
  animation-delay: 0.3s;
`;

const VideoName = styled.h1`
  font-family: 'Manrope', sans-serif;
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #FFFFFF;
  line-height: 0.95;
  margin: 0;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  opacity: 0;
  animation: ${videoFadeIn} 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: ${p => p.$delay};
`;

const VideoAmp = styled.span`
  display: block;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-style: italic;
  font-weight: 400;
  color: #6B8CAE;
  margin: 1rem 0;
  opacity: 0;
  animation: ${videoFadeIn} 0.8s ease forwards;
  animation-delay: 0.7s;
`;

const VideoDivider = styled.div`
  width: 80px;
  height: 1px;
  background: #6B8CAE;
  margin: 2rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${videoLineExpand} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 1.1s;
`;

const VideoDate = styled.p`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  color: #FFFFFF;
  margin: 0 0 0.5rem;
  opacity: 0;
  animation: ${videoFadeUp} 0.8s ease forwards;
  animation-delay: 1.3s;
`;

const VideoLocation = styled.p`
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #B0B0B0;
  opacity: 0;
  animation: ${videoFadeUp} 0.8s ease forwards;
  animation-delay: 1.4s;
`;

const VideoStatus = styled.p`
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(107, 140, 174, 0.4);
  margin-top: 2.5rem;
  opacity: 0;
  animation: ${videoFadeUp} 0.8s ease forwards;
  animation-delay: 1.6s;
`;

const VideoComingSoon = ({ names, date, onLogoClick }) => (
  <>
    <VideoStyles />
    <VideoSection>
      <VideoGrain />
      <VideoContent>
        <VideoLogo onClick={onLogoClick}>S&I.</VideoLogo>
        <VideoEyebrow>Wir heiraten</VideoEyebrow>
        <VideoName $delay="0.5s">{names[0]}</VideoName>
        <VideoAmp>&</VideoAmp>
        <VideoName $delay="0.9s">{names[1]}</VideoName>
        <VideoDivider />
        <VideoDate>{date || 'Datum folgt'}</VideoDate>
        <VideoLocation>Berlin</VideoLocation>
        <VideoStatus>Coming Soon</VideoStatus>
      </VideoContent>
    </VideoSection>
  </>
);

// ============================================
// MAIN COMPONENT – Einheitliche S&I. Coming Soon
// ============================================
// Zeigt KEINE Paar-Infos (Namen, Datum etc.)
// Nur S&I. Branding + CTA auf sarahiver.com
// Triple-Click auf Logo öffnet Admin-Login

const csFadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const csFadeUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const csLineGrow = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;
const csPulse = keyframes`0%, 100% { opacity: 0.4; } 50% { opacity: 1; }`;

const CSPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0A0A0A;
  position: relative;
  overflow: hidden;
`;

const CSGrain = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
`;

const CSContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 600px;
`;

const CSLogo = styled.div`
  font-family: 'Roboto', 'Arial Black', sans-serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  color: #FFFFFF;
  margin-bottom: 2rem;
  cursor: pointer;
  user-select: none;
  opacity: 0;
  animation: ${csFadeIn} 1s ease forwards;
`;

const CSLine = styled.div`
  width: 60px;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto 2rem;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${csLineGrow} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.5s;
`;

const CSHeadline = styled.h1`
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin: 0 0 0.75rem;
  opacity: 0;
  animation: ${csFadeUp} 0.8s ease forwards;
  animation-delay: 0.7s;
`;

const CSSubline = styled.p`
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
  margin: 0 0 2.5rem;
  opacity: 0;
  animation: ${csFadeUp} 0.8s ease forwards;
  animation-delay: 0.9s;
`;

const CSCTA = styled.a`
  display: inline-block;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #FFFFFF;
  text-decoration: none;
  padding: 1rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${csFadeUp} 0.8s ease forwards;
  animation-delay: 1.1s;

  &:hover {
    background: #FFFFFF;
    color: #0A0A0A;
    border-color: #FFFFFF;
  }
`;

const CSStatus = styled.p`
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.15);
  margin-top: 3rem;
  opacity: 0;
  animation: ${csFadeIn} 0.8s ease forwards;
  animation-delay: 1.4s;
`;

const CSStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
`;

export default function ComingSoon({ onAdminAccess }) {
  const { project, slug } = useWedding();
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = useCallback(() => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowLogin(true);
        return 0;
      }
      setTimeout(() => setClickCount(0), 1000);
      return newCount;
    });
  }, []);

  const handleLogin = useCallback(async (password) => {
    setError('');
    setIsLoading(true);

    try {
      const { verifyPreviewPassword } = await import('../../lib/supabase');
      const result = await verifyPreviewPassword(slug, password);
      
      if (result.success) {
        sessionStorage.setItem(`admin_preview_${project.id}`, 'true');
        setShowLogin(false);
        if (onAdminAccess) onAdminAccess();
        else window.location.reload();
      } else {
        setError('Falsches Passwort');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  }, [project, onAdminAccess, slug]);

  return (
    <>
      <CSStyles />
      <CSPage>
        <CSGrain />
        <CSContent>
          <CSLogo onClick={handleLogoClick}>S&I.</CSLogo>
          <CSLine />
          <CSHeadline>Hier entsteht eine wunderschöne Hochzeitswebsite.</CSHeadline>
          <CSSubline>Individuelle Designs, RSVP, Gästeliste & mehr – handgemacht für euren großen Tag.</CSSubline>
          <CSCTA href="https://sarahiver.com" target="_blank" rel="noopener noreferrer">
            Themes entdecken
          </CSCTA>
          <CSStatus>Coming Soon</CSStatus>
        </CSContent>
      </CSPage>
      <LoginModal 
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSubmit={handleLogin}
        accent="#FFFFFF"
        error={error}
        isLoading={isLoading}
      />
    </>
  );
}
