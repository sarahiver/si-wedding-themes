import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${p => p.$scrolled ? 'rgba(255,255,255,0.95)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 2rem;
    right: 2rem;
    height: 1px;
    background: #000;
    transform: scaleX(${p => p.$scrolled ? 1 : 0});
    transition: transform 0.3s ease;
  }
`;

const Logo = styled.a`
  font-family: 'Instrument Serif', serif;
  font-size: 1.4rem;
  color: #000;
  letter-spacing: -0.02em;
  text-decoration: none;
  span { font-style: italic; }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2.5rem;
  @media (max-width: 768px) { display: none; }
`;

const NavLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #333;
  text-decoration: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #000;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover::after { transform: scaleX(1); }
`;

const DateBadge = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e5e5;
  @media (max-width: 768px) { display: none; }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  @media (max-width: 768px) { display: block; }
`;

const MobileMenu = styled.div`
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  transform: ${p => p.$open ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.4s ease;
`;

const MobileNavLink = styled.a`
  font-family: 'Instrument Serif', serif;
  font-size: 2rem;
  color: #000;
  text-decoration: none;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
`;

function Navigation() {
  const { coupleNames, weddingDate, isComponentActive } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse names for logo
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Name', 'Name'];
  const logoText = `${names[0]} & ${names[1]}`;

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Build nav links based on active components
  const navLinks = [
    isComponentActive('lovestory') && { href: '#story', label: 'Story' },
    isComponentActive('timeline') && { href: '#timeline', label: 'Ablauf' },
    isComponentActive('locations') && { href: '#location', label: 'Location' },
    isComponentActive('rsvp') && { href: '#rsvp', label: 'RSVP' },
    isComponentActive('faq') && { href: '#faq', label: 'FAQ' },
  ].filter(Boolean);

  return (
    <>
      <Header $scrolled={scrolled}>
        <Logo href="#top">
          {names[0]} <span>&</span> {names[1]}
        </Logo>
        
        <Nav>
          {navLinks.map(link => (
            <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
          ))}
        </Nav>
        
        <DateBadge>{formatDate(weddingDate)}</DateBadge>
        
        <MobileMenuBtn onClick={() => setMobileOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </MobileMenuBtn>
      </Header>

      <MobileMenu $open={mobileOpen}>
        <CloseBtn onClick={() => setMobileOpen(false)}>×</CloseBtn>
        {navLinks.map(link => (
          <MobileNavLink 
            key={link.href} 
            href={link.href}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </MobileNavLink>
        ))}
      </MobileMenu>
    </>
  );
}

export default Navigation;
