// Botanical Navigation - Organic Floating Style
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  transition: all 0.4s var(--ease-nature);
  
  ${p => p.$scrolled && css`
    background: rgba(250, 248, 243, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow-soft);
    padding: 0.75rem 2rem;
  `}
`;

const NavContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.a`
  font-family: var(--font-handwritten);
  font-size: ${p => p.$scrolled ? '1.5rem' : '1.75rem'};
  font-weight: 600;
  color: ${p => p.$scrolled ? 'var(--green-forest)' : 'var(--bg-cream)'};
  text-shadow: ${p => p.$scrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.2)'};
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--green-fern);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: ${p => p.$scrolled ? 'var(--text-medium)' : 'var(--bg-cream)'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  text-shadow: ${p => p.$scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.15)'};
  
  &:hover {
    background: ${p => p.$scrolled ? 'var(--bg-fog)' : 'rgba(255,255,255,0.15)'};
    color: ${p => p.$scrolled ? 'var(--green-forest)' : 'var(--bg-cream)'};
  }
`;

const CTAButton = styled.a`
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: ${p => p.$scrolled ? 'var(--bg-cream)' : 'var(--green-forest)'};
  background: ${p => p.$scrolled ? 'var(--green-fern)' : 'var(--bg-cream)'};
  padding: 0.6rem 1.25rem;
  border-radius: 25px;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-soft);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

// Mobile Menu Button
const MenuButton = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  background: ${p => p.$scrolled ? 'var(--bg-fog)' : 'rgba(255,255,255,0.15)'};
  border: none;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  span {
    font-size: 1.25rem;
  }
`;

// Mobile Menu
const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${p => p.$open ? 'flex' : 'none'};
    position: fixed;
    inset: 0;
    background: var(--bg-cream);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    z-index: 999;
    animation: ${fadeIn} 0.3s ease;
  }
`;

const MobileNavLink = styled.a`
  font-family: var(--font-handwritten);
  font-size: 2rem;
  color: var(--green-forest);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--green-fern);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 50px;
  height: 50px;
  background: var(--bg-fog);
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--green-mint);
    transform: rotate(90deg);
  }
`;

function Navigation() {
  const { project } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const coupleNames = project?.couple_names || 'Emma & Oliver';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#story', label: 'Geschichte' },
    { href: '#timeline', label: 'Ablauf' },
    { href: '#gallery', label: 'Galerie' },
    { href: '#faq', label: 'FAQ' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavContainer>
          <Logo href="#hero" $scrolled={scrolled}>
            {coupleNames}
          </Logo>
          
          <NavLinks>
            {navItems.map(item => (
              <NavLink key={item.href} href={item.href} $scrolled={scrolled}>
                {item.label}
              </NavLink>
            ))}
            <CTAButton href="#rsvp" $scrolled={scrolled}>
              Zusagen
            </CTAButton>
          </NavLinks>
          
          <MenuButton $scrolled={scrolled} onClick={() => setMobileMenuOpen(true)}>
            <span>☰</span>
          </MenuButton>
        </NavContainer>
      </Nav>
      
      <MobileMenu $open={mobileMenuOpen}>
        <CloseButton onClick={closeMobileMenu}>×</CloseButton>
        {navItems.map(item => (
          <MobileNavLink key={item.href} href={item.href} onClick={closeMobileMenu}>
            {item.label}
          </MobileNavLink>
        ))}
        <MobileNavLink href="#rsvp" onClick={closeMobileMenu} style={{ color: 'var(--green-fern)' }}>
          🌿 Zusagen
        </MobileNavLink>
      </MobileMenu>
    </>
  );
}

export default Navigation;
