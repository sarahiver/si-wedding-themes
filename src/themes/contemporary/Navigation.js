// Navigation.js - Contemporary Theme (Supabase integrated)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${p => p.$scrolled ? 'rgba(255,255,255,0.95)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const Logo = styled.a`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 1.3rem;
  color: var(--dark, #1a1a1a);
  text-decoration: none;
  
  span {
    color: var(--coral, #FF6B6B);
    font-weight: 600;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dark, #1a1a1a);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--coral, #FF6B6B);
  }
`;

const RSVPButton = styled.a`
  background: var(--coral, #FF6B6B);
  color: white;
  padding: 0.7rem 1.5rem;
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--dark, #1a1a1a);
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

function Navigation() {
  const { coupleNames, isComponentActive } = useWedding();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Sophie', 'Max'];

  const navLinks = [
    isComponentActive('lovestory') && { href: '#story', label: 'Story' },
    isComponentActive('locations') && { href: '#location', label: 'Location' },
    isComponentActive('timeline') && { href: '#timeline', label: 'Ablauf' },
    isComponentActive('gallery') && { href: '#gallery', label: 'Galerie' },
    isComponentActive('faq') && { href: '#faq', label: 'FAQ' },
  ].filter(Boolean);

  return (
    <Header $scrolled={scrolled}>
      <Logo href="#hero">
        {names[0]} <span>&</span> {names[1]}
      </Logo>
      
      <Nav>
        {navLinks.map(link => (
          <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
        ))}
      </Nav>
      
      {isComponentActive('rsvp') && <RSVPButton href="#rsvp">RSVP</RSVPButton>}
      
      <MobileMenuBtn>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </MobileMenuBtn>
    </Header>
  );
}

export default Navigation;
