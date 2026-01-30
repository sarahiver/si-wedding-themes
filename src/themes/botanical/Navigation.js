import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  transition: all 0.4s ease;
  animation: ${fadeIn} 0.8s ease forwards;
  
  ${p => p.$scrolled && css`
    background: rgba(4, 6, 4, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.75rem 2rem;
  `}
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  font-weight: 400;
  color: var(--text-light);
  letter-spacing: 0.02em;
  
  span {
    font-style: italic;
    color: var(--text-muted);
    margin: 0 0.3em;
    font-size: 0.8em;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  position: relative;
  padding: 0.5rem 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--text-light);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: var(--text-light);
    
    &::after {
      width: 100%;
    }
  }
`;

const RSVPButton = styled.a`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--bg-dark);
  background: var(--text-light);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255,255,255,0.15);
  }
`;

// Mobile menu
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  width: 32px;
  height: 24px;
  position: relative;
  cursor: pointer;
  
  @media (max-width: 900px) {
    display: block;
  }
  
  span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--text-light);
    transition: all 0.3s ease;
    
    &:nth-child(1) {
      top: ${p => p.$open ? '11px' : '0'};
      transform: ${p => p.$open ? 'rotate(45deg)' : 'none'};
    }
    
    &:nth-child(2) {
      top: 11px;
      opacity: ${p => p.$open ? '0' : '1'};
    }
    
    &:nth-child(3) {
      bottom: ${p => p.$open ? '11px' : '0'};
      transform: ${p => p.$open ? 'rotate(-45deg)' : 'none'};
    }
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 6, 4, 0.98);
  backdrop-filter: blur(30px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  opacity: ${p => p.$open ? '1' : '0'};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.4s ease;
  padding: 2rem;
`;

const MobileNavLink = styled.a`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  
  ${p => p.$visible && css`
    opacity: 1;
    transform: translateY(0);
    transition-delay: ${p.$index * 0.05}s;
  `}
  
  &:hover {
    color: var(--text-muted);
  }
`;

const MobileRSVPButton = styled(RSVPButton)`
  margin-top: 1rem;
  font-size: 0.8rem;
  padding: 1rem 2rem;
`;

// ============================================
// COMPONENT
// ============================================

function Navigation() {
  const { coupleNames, isComponentActive } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Anna', 'Thomas'];
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'lovestory', label: 'Geschichte', href: '#lovestory' },
    { id: 'timeline', label: 'Ablauf', href: '#timeline' },
    { id: 'locations', label: 'Location', href: '#locations' },
    { id: 'gallery', label: 'Galerie', href: '#gallery' },
  ].filter(item => isComponentActive(item.id));

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavContainer>
          <Logo href="#top">
            {names[0]}<span>&</span>{names[1]}
          </Logo>
          
          <NavLinks>
            {navItems.map(item => (
              <NavLink key={item.id} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            {isComponentActive('rsvp') && (
              <RSVPButton href="#rsvp">Zusagen</RSVPButton>
            )}
          </NavLinks>
          
          <MobileMenuButton 
            $open={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </MobileMenuButton>
        </NavContainer>
      </Nav>
      
      <MobileMenu $open={mobileMenuOpen}>
        {navItems.map((item, i) => (
          <MobileNavLink 
            key={item.id}
            href={item.href}
            $visible={mobileMenuOpen}
            $index={i}
            onClick={handleMobileLinkClick}
          >
            {item.label}
          </MobileNavLink>
        ))}
        {isComponentActive('rsvp') && (
          <MobileRSVPButton href="#rsvp" onClick={handleMobileLinkClick}>
            Zusagen
          </MobileRSVPButton>
        )}
      </MobileMenu>
    </>
  );
}

export default Navigation;
