import { useWedding } from '../../context/WeddingContext';
// src/components/Navigation.js - Neon Theme
import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

const glitchAnim = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

const neonFlicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.7; }
  94% { opacity: 1; }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${p => p.$scrolled ? 'rgba(10,10,15,0.95)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(20px)' : 'none'};
  border-bottom: 1px solid ${p => p.$scrolled ? 'rgba(0,255,255,0.2)' : 'transparent'};
  transition: all 0.4s ease;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0,255,255,0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation: ${neonFlicker} 4s ease-in-out infinite;
  
  span {
    color: #ff00ff;
    text-shadow: 0 0 10px rgba(255,0,255,0.5);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  position: relative;
  transition: all 0.3s ease;
  
  &::before {
    content: '>';
    position: absolute;
    left: -15px;
    opacity: 0;
    color: #00ffff;
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0,255,255,0.5);
    
    &::before {
      opacity: 1;
      left: -20px;
    }
  }
`;

const RSVPButton = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0a0a0f;
  background: #00ffff;
  padding: 12px 30px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 0 20px rgba(0,255,255,0.4);
  transition: all 0.3s ease;
  
  &:hover {
    background: #ff00ff;
    box-shadow: 0 0 30px rgba(255,0,255,0.5);
    transform: translateY(-2px);
  }
`;

// Mobile Menu
const MenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  padding: 10px;
  z-index: 1001;
  
  @media (max-width: 968px) {
    display: flex;
  }
  
  span {
    width: 30px;
    height: 2px;
    background: #00ffff;
    box-shadow: 0 0 10px rgba(0,255,255,0.5);
    transition: all 0.3s ease;
    
    ${p => p.$open && css`
      &:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
        background: #ff00ff;
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
        background: #ff00ff;
      }
    `}
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10,10,15,0.98);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  
  /* Grid Background */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
  }
`;

const MobileLink = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
    animation: ${glitchAnim} 0.3s ease;
  }
  
  &::before {
    content: attr(data-text);
    position: absolute;
    left: 2px;
    top: 2px;
    color: #ff00ff;
    opacity: 0;
    z-index: -1;
  }
  
  &:hover::before {
    opacity: 0.5;
  }
`;

function Navigation() {
  const { coupleNames, isInNavigation, project } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // All possible nav items
  const allNavItems = [
    { id: 'lovestory', label: 'Story', href: '#story' },
    { id: 'timeline', label: 'Timeline', href: '#timeline' },
    { id: 'locations', label: 'Location', href: '#locations' },
    { id: 'directions', label: 'Anfahrt', href: '#directions' },
    { id: 'accommodations', label: 'Hotels', href: '#accommodations' },
    { id: 'dresscode', label: 'Dresscode', href: '#dresscode' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'gifts', label: 'Gifts', href: '#gifts' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
    { id: 'witnesses', label: 'Contact', href: '#witnesses' },
  ];

  // Filter by nav_components and sort by component_order
  const componentOrder = project?.component_order || [];
  const navItems = allNavItems
    .filter(item => isInNavigation(item.id))
    .sort((a, b) => {
      const indexA = componentOrder.indexOf(a.id);
      const indexB = componentOrder.indexOf(b.id);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const displayName = coupleNames || 'Alex & Jordan';
  const names = displayName.split(/\s*[&+]\s*/);

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Container>
          <Logo href="#">
            {names[0]} <span>&</span> {names[1]}
          </Logo>
          
          <NavLinks>
            {navItems.map((item, i) => (
              <NavLink key={i} href={item.href}>{item.label}</NavLink>
            ))}
            {isInNavigation('rsvp') && <RSVPButton href="#rsvp">RSVP</RSVPButton>}
          </NavLinks>
          
          <MenuButton $open={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
            <span />
            <span />
            <span />
          </MenuButton>
        </Container>
      </Nav>
      
      <MobileMenu $open={mobileOpen}>
        {navItems.map((item, i) => (
          <MobileLink
            key={i}
            href={item.href}
            data-text={item.label}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </MobileLink>
        ))}
        {isInNavigation('rsvp') && (
          <RSVPButton href="#rsvp" onClick={() => setMobileOpen(false)}>
            RSVP Now
          </RSVPButton>
        )}
      </MobileMenu>
    </>
  );
}

export default Navigation;
