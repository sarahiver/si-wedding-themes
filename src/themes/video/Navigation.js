import { useWedding } from '../../context/WeddingContext';
// src/components/Navigation.js
import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 25px 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: all 0.4s ease;
  animation: ${fadeIn} 1s ease;

  ${p => p.$scrolled && css`
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 40px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  `}

  @media (max-width: 768px) {
    padding: 20px;
    ${p => p.$scrolled && css`padding: 15px 20px;`}
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;

  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => p.$scrolled ? '#FFFFFF' : 'rgba(255,255,255,0.9)'};
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 1px;
    background: #B8976A;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #B8976A;
    &::after {
      width: 100%;
    }
  }
`;

const CTAButton = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1A1A1A;
  background: #B8976A;
  padding: 14px 28px;
  transition: all 0.3s ease;

  &:hover {
    background: #D4AF37;
    transform: translateY(-2px);
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  z-index: 1001;

  span {
    width: 28px;
    height: 2px;
    background: #FFFFFF;
    transition: all 0.3s ease;

    ${p => p.$open && css`
      &:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
      }
    `}
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: #1A1A1A;
  padding: 100px 40px 40px;
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MobileNavLink = styled.a`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  color: #FFFFFF;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;

  &:hover {
    color: #B8976A;
    padding-left: 20px;
  }
`;

const MobileCTA = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1A1A1A;
  background: #B8976A;
  padding: 18px 30px;
  text-align: center;
  margin-top: auto;
  transition: all 0.3s ease;

  &:hover {
    background: #D4AF37;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 998;
`;

function Navigation() {
  const { project, isComponentActive } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fixed items always visible in nav bar (if active)
  const fixedNavItems = [
    { id: 'countdown', label: 'Countdown', href: '#countdown' },
    { id: 'lovestory', label: 'Story', href: '#story' },
  ];

  // Items for burger menu (excluding fixed nav items: countdown, lovestory, rsvp)
  const burgerNavItems = [
    { id: 'timeline', label: 'Tagesablauf', href: '#timeline' },
    { id: 'locations', label: 'Location', href: '#locations' },
    { id: 'directions', label: 'Anfahrt', href: '#directions' },
    { id: 'accommodations', label: 'Hotels', href: '#accommodations' },
    { id: 'dresscode', label: 'Dresscode', href: '#dresscode' },
    { id: 'gallery', label: 'Galerie', href: '#gallery' },
    { id: 'gifts', label: 'Geschenke', href: '#gifts' },
    { id: 'guestbook', label: 'Gästebuch', href: '#guestbook' },
    { id: 'musicwishes', label: 'Musik', href: '#music' },
    { id: 'photoupload', label: 'Fotos', href: '#photos' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
    { id: 'weddingabc', label: 'ABC', href: '#abc' },
    { id: 'witnesses', label: 'Trauzeugen', href: '#witnesses' },
    { id: 'contact', label: 'Kontakt', href: '#contact' },
  ];

  // Fixed nav items (visible in bar) - only if component is active
  const visibleNavItems = fixedNavItems.filter(item => isComponentActive(item.id));

  // Burger menu items - active components (excluding static nav items) sorted by component_order
  const componentOrder = project?.component_order || [];
  const burgerMenuItems = burgerNavItems
    .filter(item => isComponentActive(item.id))
    .sort((a, b) => {
      const indexA = componentOrder.indexOf(a.id);
      const indexB = componentOrder.indexOf(b.id);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavLinks>
          {/* Fixed visible items: Countdown, Love Story */}
          {visibleNavItems.map(item => (
            <NavLink key={item.href} href={item.href} $scrolled={scrolled} onClick={(e) => handleLinkClick(e, item.href)}>
              {item.label}
            </NavLink>
          ))}
          {isComponentActive('rsvp') && <CTAButton href="#rsvp" onClick={(e) => handleLinkClick(e, '#rsvp')}>Jetzt zusagen</CTAButton>}
        </NavLinks>

        <MobileMenuButton $open={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
          <span />
          <span />
          <span />
        </MobileMenuButton>
      </Nav>

      <Overlay $open={mobileOpen} onClick={() => setMobileOpen(false)} />
      
      <MobileMenu $open={mobileOpen}>
        {burgerMenuItems.map(item => (
          <MobileNavLink
            key={item.href}
            href={item.href}
            onClick={(e) => handleLinkClick(e, item.href)}
          >
            {item.label}
          </MobileNavLink>
        ))}
      </MobileMenu>
    </>
  );
}

export default Navigation;
