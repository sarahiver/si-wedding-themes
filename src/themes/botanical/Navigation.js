import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s ease;
  background: ${p => p.$scrolled ? 'rgba(250, 250, 248, 0.95)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(10px)' : 'none'};
  border-bottom: ${p => p.$scrolled ? '1px solid var(--zen-line-light)' : '1px solid transparent'};
`;

const Logo = styled.a`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--zen-text);
  letter-spacing: 0.05em;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--zen-text-light);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--zen-text);
    opacity: 1;
  }
`;

const MenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  span {
    width: 20px;
    height: 1px;
    background: var(--zen-text);
    transition: all 0.3s ease;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  inset: 0;
  background: var(--zen-bg);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

const MobileLink = styled.a`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--zen-text);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  font-size: 1.5rem;
  color: var(--zen-text);
`;

function Navigation() {
  const { coupleNames, isComponentActive } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['A', 'T'];
  const initials = `${names[0]?.[0] || 'A'} & ${names[1]?.[0] || 'T'}`;
  
  const navItems = [
    { id: 'countdown', label: 'Countdown', href: '#countdown' },
    { id: 'lovestory', label: 'Geschichte', href: '#lovestory' },
    { id: 'timeline', label: 'Ablauf', href: '#timeline' },
    { id: 'rsvp', label: 'Zusagen', href: '#rsvp' },
    { id: 'gallery', label: 'Galerie', href: '#gallery' },
  ].filter(item => isComponentActive(item.id));

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Logo href="#top">{initials}</Logo>
        
        <NavLinks>
          {navItems.map(item => (
            <NavLink key={item.id} href={item.href}>{item.label}</NavLink>
          ))}
        </NavLinks>
        
        <MenuButton onClick={() => setMobileOpen(true)}>
          <span /><span /><span />
        </MenuButton>
      </Nav>
      
      <MobileMenu $open={mobileOpen}>
        <CloseButton onClick={() => setMobileOpen(false)}>×</CloseButton>
        {navItems.map(item => (
          <MobileLink 
            key={item.id} 
            href={item.href}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </MobileLink>
        ))}
      </MobileMenu>
    </>
  );
}

export default Navigation;
