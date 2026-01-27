import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 3rem;
  background: ${p => p.$scrolled ? 'rgba(255, 255, 255, 0.97)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(10px)' : 'none'};
  border-bottom: ${p => p.$scrolled ? '1px solid var(--luxe-border-light)' : 'none'};
  transition: all 0.4s var(--ease-elegant);
`;

const NavContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-style: italic;
  color: ${p => p.$scrolled ? 'var(--luxe-text-heading)' : '#FFFFFF'};
  text-shadow: ${p => p.$scrolled ? 'none' : '0 1px 3px rgba(0,0,0,0.3)'};
  transition: all 0.4s ease;
  
  &:hover { color: var(--luxe-gold); }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  
  @media (max-width: 768px) { display: none; }
`;

const NavLink = styled.a`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${p => p.$scrolled ? 'var(--luxe-text-light)' : '#FFFFFF'};
  text-shadow: ${p => p.$scrolled ? 'none' : '0 1px 3px rgba(0,0,0,0.3)'};
  transition: all 0.4s ease;
  
  &:hover { color: var(--luxe-gold); }
`;

const RSVPButton = styled.a`
  padding: 0.6rem 1.4rem;
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => p.$scrolled ? 'var(--luxe-text)' : '#FFFFFF'};
  border: 1px solid ${p => p.$scrolled ? 'var(--luxe-border)' : 'rgba(255,255,255,0.5)'};
  text-shadow: ${p => p.$scrolled ? 'none' : '0 1px 3px rgba(0,0,0,0.3)'};
  transition: all 0.4s ease;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
    text-shadow: none;
  }
`;

const MobileButton = styled.button`
  display: none;
  @media (max-width: 768px) { display: block; }
  
  span {
    display: block;
    width: 18px;
    height: 1px;
    background: ${p => p.$scrolled ? 'var(--luxe-text)' : '#FFFFFF'};
    margin: 5px 0;
    transition: background 0.4s ease;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 260px;
  background: var(--luxe-white);
  padding: 4rem 2rem;
  transform: translateX(${p => p.$isOpen ? '0' : '100%'});
  transition: transform 0.4s ease;
  z-index: 1001;
`;

const MobileLink = styled.a`
  display: block;
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--luxe-text);
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--luxe-border-light);
`;

function Navigation({ sections, config = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { name1 = 'Dave', name2 = 'Kalle' } = config;
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = sections || [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'Story' },
    { id: 'timeline', label: 'Schedule' },
    { id: 'location', label: 'Location' },
  ];
  
  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavContainer>
          <Logo href="#home" $scrolled={scrolled}>{name1.charAt(0)} & {name2.charAt(0)}</Logo>
          <NavLinks>
            {navItems.map(item => (
              <NavLink key={item.id} href={`#${item.id}`} $scrolled={scrolled}>{item.label}</NavLink>
            ))}
            <RSVPButton href="#rsvp" $scrolled={scrolled}>RSVP</RSVPButton>
          </NavLinks>
          <MobileButton onClick={() => setMobileOpen(true)} $scrolled={scrolled}>
            <span /><span />
          </MobileButton>
        </NavContainer>
      </Nav>
      
      <MobileMenu $isOpen={mobileOpen}>
        <button onClick={() => setMobileOpen(false)} style={{position:'absolute',top:'1rem',right:'1rem',fontSize:'1.5rem',color:'var(--luxe-text-light)'}}>×</button>
        {navItems.map(item => (
          <MobileLink key={item.id} href={`#${item.id}`} onClick={() => setMobileOpen(false)}>
            {item.label}
          </MobileLink>
        ))}
      </MobileMenu>
    </>
  );
}

export default Navigation;
