import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const FooterSection = styled.footer`
  padding: clamp(4rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem);
  background: var(--editorial-black);
  text-align: center;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Names = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 15vw, 10rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.85;
  margin-bottom: 2rem;
`;

const Ampersand = styled.span`
  display: block;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.3em;
  color: var(--editorial-red);
  margin: 0.5rem 0;
`;

const Heart = styled.span`
  display: inline-block;
  font-size: 2rem;
  color: var(--editorial-red);
  animation: ${pulse} 1.5s ease infinite;
  margin-bottom: 2rem;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3rem;
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: var(--editorial-red);
  margin: 0 auto 3rem;
`;

const NavLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem 2rem;
  margin-bottom: 3rem;
`;

const NavLink = styled.a`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--editorial-red);
  }
`;

const BackToTop = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: var(--editorial-white);
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-bottom: 3rem;
  
  &:hover {
    background: var(--editorial-red);
    border-color: var(--editorial-red);
    transform: translateY(-3px);
  }
`;

const Copyright = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
`;

const PoweredBy = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--editorial-red);
  }
`;

// ============================================
// COMPONENT
// ============================================

function Footer() {
  const { coupleNames, weddingDate, isComponentActive } = useWedding();
  
  // Parse couple names
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Braut', 'Bräutigam'];
  const name1 = names[0] || 'Braut';
  const name2 = names[1] || 'Bräutigam';
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Navigation links
  const navItems = [
    { id: 'top', label: 'Start', always: true },
    { id: 'lovestory', label: 'Geschichte' },
    { id: 'timeline', label: 'Ablauf' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'contact', label: 'Kontakt' },
  ].filter(item => item.always || isComponentActive(item.id));

  return (
    <FooterSection>
      <Container>
        <Names>
          {name1}
          <Ampersand>&</Ampersand>
          {name2}
        </Names>
        
        <Heart>♥</Heart>
        
        <DateText>{formatDate(weddingDate)}</DateText>
        
        <Divider />
        
        <NavLinks>
          {navItems.map(item => (
            <NavLink key={item.id} href={`#${item.id}`}>
              {item.label}
            </NavLink>
          ))}
        </NavLinks>
        
        <BackToTop href="#top" aria-label="Nach oben">
          ↑
        </BackToTop>
        
        <Copyright>
          © {new Date().getFullYear()} {name1} & {name2}
        </Copyright>
        
        <PoweredBy href="https://siwedding.de" target="_blank" rel="noopener noreferrer">
          Powered by IverLasting
        </PoweredBy>
      </Container>
    </FooterSection>
  );
}

export default Footer;
