import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const letterReveal = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(100%) rotateX(-90deg);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) rotateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const FooterSection = styled.footer`
  position: relative;
  padding: clamp(6rem, 15vh, 12rem) clamp(1.5rem, 5vw, 4rem);
  background: var(--editorial-black);
  text-align: center;
  overflow: hidden;
`;

const BackgroundText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-headline);
  font-size: clamp(15rem, 40vw, 40rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.02);
  white-space: nowrap;
  pointer-events: none;
  z-index: 0;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
`;

const NamesSection = styled.div`
  margin-bottom: 3rem;
  overflow: hidden;
`;

const Names = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(4rem, 18vw, 14rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.85;
  
  .line {
    display: block;
    overflow: hidden;
  }
  
  .letter {
    display: inline-block;
    opacity: 0;
    
    ${p => p.$visible && css`
      animation: ${letterReveal} 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
    `}
  }
`;

const Ampersand = styled.span`
  display: block;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.25em;
  color: var(--editorial-red);
  margin: 0.5rem 0;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.8s;
  `}
`;

const Heart = styled.div`
  font-size: 2.5rem;
  color: var(--editorial-red);
  margin: 2rem 0;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards, ${pulse} 1.5s ease-in-out infinite;
    animation-delay: 1s, 1.8s;
  `}
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 3rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 1.2s;
  `}
`;

const Divider = styled.div`
  width: 80px;
  height: 3px;
  background: var(--editorial-red);
  margin: 0 auto 3rem;
  transform: scaleX(0);
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.8s ease forwards;
    animation-delay: 1.4s;
  `}
`;

const NavLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 2.5rem;
  margin-bottom: 3rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 1.5s;
  `}
`;

const NavLink = styled.a`
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--editorial-red);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: var(--editorial-white);
    
    &::after {
      width: 100%;
    }
  }
`;

const BackToTop = styled.a`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--editorial-white);
  text-decoration: none;
  margin-bottom: 4rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards, ${float} 2s ease-in-out infinite;
    animation-delay: 1.6s, 2.4s;
  `}
`;

const BackToTopIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  ${BackToTop}:hover & {
    background: var(--editorial-red);
    border-color: var(--editorial-red);
    transform: translateY(-5px);
  }
`;

const BackToTopText = styled.span`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

const Copyright = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 1.7s;
  `}
`;

const PoweredBy = styled.a`
  display: inline-block;
  margin-top: 1rem;
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.15);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--editorial-red);
  }
`;

const Hashtag = styled.p`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--editorial-red);
  margin-bottom: 2rem;
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 1.1s;
  `}
`;

// ============================================
// COMPONENT
// ============================================

function Footer() {
  const { coupleNames, weddingDate, isComponentActive, project } = useWedding();
  const hashtag = project?.hashtag;
  
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);
  
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Braut', 'Bräutigam'];
  const name1 = names[0]?.toUpperCase() || 'BRAUT';
  const name2 = names[1]?.toUpperCase() || 'BRÄUTIGAM';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const navItems = [
    { id: 'top', label: 'Start', always: true },
    { id: 'lovestory', label: 'Geschichte' },
    { id: 'timeline', label: 'Ablauf' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'gallery', label: 'Galerie' },
  ].filter(item => item.always || isComponentActive(item.id));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const renderName = (name, startDelay) => {
    return name.split('').map((letter, i) => (
      <span 
        key={i} 
        className="letter" 
        style={{ animationDelay: `${startDelay + i * 0.04}s` }}
      >
        {letter}
      </span>
    ));
  };

  return (
    <FooterSection ref={footerRef}>
      <BackgroundText>LOVE</BackgroundText>
      
      <Container>
        <NamesSection>
          <Names $visible={visible}>
            <span className="line">{renderName(name1, 0.2)}</span>
            <Ampersand $visible={visible}>&</Ampersand>
            <span className="line">{renderName(name2, 0.5)}</span>
          </Names>
        </NamesSection>
        
        <Heart $visible={visible}>♥</Heart>

        {hashtag && <Hashtag $visible={visible}>#{hashtag}</Hashtag>}

        <DateText $visible={visible}>{formatDate(weddingDate)}</DateText>
        
        <Divider $visible={visible} />
        
        <NavLinks $visible={visible}>
          {navItems.map(item => (
            <NavLink key={item.id} href={`#${item.id}`}>
              {item.label}
            </NavLink>
          ))}
        </NavLinks>
        
        <BackToTop href="#top" $visible={visible}>
          <BackToTopIcon>↑</BackToTopIcon>
          <BackToTopText>Nach oben</BackToTopText>
        </BackToTop>
        
        <Copyright $visible={visible}>
          © {new Date().getFullYear()} {names[0]} & {names[1]}
        </Copyright>
        
        <PoweredBy href="https://siwedding.de" target="_blank" rel="noopener noreferrer">
          Powered by IverLasting
        </PoweredBy>
      </Container>
    </FooterSection>
  );
}

export default Footer;
