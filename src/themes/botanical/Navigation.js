import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInDown = keyframes`
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

const menuSlideIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

// Floating pill navigation - Apple Liquid Glass style
const NavPill = styled.nav`
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  
  /* Liquid Glass effect */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  animation: ${fadeInDown} 0.8s ease;
  transition: all 0.4s ease;
  
  /* Hover glow effect */
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 900px) {
    padding: 0.4rem;
    gap: 0;
  }
`;

const NavLink = styled.a`
  padding: 0.6rem 1rem;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 30px;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const RSVPButton = styled.a`
  padding: 0.6rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--bg-dark);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.02);
  }
  
  @media (max-width: 900px) {
    display: none;
  }
`;

// Burger menu button - always visible
const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MenuIcon = styled.div`
  width: 18px;
  height: 14px;
  position: relative;
  
  span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1px;
    transition: all 0.3s ease;
    
    &:nth-child(1) {
      top: 0;
      ${p => p.$open && css`
        top: 6px;
        transform: rotate(45deg);
      `}
    }
    
    &:nth-child(2) {
      top: 6px;
      ${p => p.$open && css`
        opacity: 0;
      `}
    }
    
    &:nth-child(3) {
      top: 12px;
      ${p => p.$open && css`
        top: 6px;
        transform: rotate(-45deg);
      `}
    }
  }
`;

// Mobile full-screen menu
const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(4, 6, 4, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 2rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;

  ${p => p.$open && css`
    opacity: 1;
    visibility: visible;
  `}
`;

const MobileMenuContent = styled.div`
  /* Liquid Glass card for menu */
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  padding: 2.5rem;
  min-width: 280px;
  max-height: calc(100vh - 4rem);
  max-height: calc(100dvh - 4rem);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin: auto;

  animation: ${p => p.$open ? menuSlideIn : 'none'} 0.4s ease;
`;

const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileMenuLink = styled.a`
  padding: 1rem 1.5rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const MobileRSVPButton = styled.a`
  display: block;
  margin-top: 1.5rem;
  padding: 1.1rem 2rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  color: var(--bg-dark);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

// ============================================
// COMPONENT
// ============================================

function Navigation() {
  const { isComponentActive, project } = useWedding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fixed items always visible in nav bar (if active)
  const fixedNavItems = [
    { id: 'countdown', label: 'Countdown', href: '#countdown' },
    { id: 'lovestory', label: 'Story', href: '#lovestory' },
  ];

  // Items for burger menu (excluding fixed nav items: countdown, lovestory, rsvp)
  const burgerNavItems = [
    { id: 'timeline', label: 'Ablauf', href: '#timeline' },
    { id: 'locations', label: 'Location', href: '#locations' },
    { id: 'directions', label: 'Anfahrt', href: '#directions' },
    { id: 'accommodations', label: 'Hotels', href: '#accommodations' },
    { id: 'dresscode', label: 'Dresscode', href: '#dresscode' },
    { id: 'gallery', label: 'Galerie', href: '#gallery' },
    { id: 'gifts', label: 'Geschenke', href: '#gifts' },
    { id: 'guestbook', label: 'Gästebuch', href: '#guestbook' },
    { id: 'musicwishes', label: 'Musik', href: '#musicwishes' },
    { id: 'photoupload', label: 'Fotos', href: '#photoupload' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
    { id: 'weddingabc', label: 'ABC', href: '#weddingabc' },
    { id: 'witnesses', label: 'Trauzeugen', href: '#witnesses' },
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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating pill navigation */}
      <NavPill>
        {/* Fixed visible items: Countdown, Love Story */}
        {visibleNavItems.map((link, i) => (
          <NavLink key={i} href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
            {link.label}
          </NavLink>
        ))}

        {/* RSVP button - always if active */}
        {isComponentActive('rsvp') && (
          <RSVPButton href="#rsvp" onClick={(e) => handleLinkClick(e, '#rsvp')}>RSVP</RSVPButton>
        )}

        {/* Burger menu button - always visible */}
        <MenuButton
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menü öffnen"
        >
          <MenuIcon $open={mobileMenuOpen}>
            <span />
            <span />
            <span />
          </MenuIcon>
        </MenuButton>
      </NavPill>

      {/* Burger menu overlay - shows ALL active components */}
      <MobileMenuOverlay $open={mobileMenuOpen} onClick={() => setMobileMenuOpen(false)}>
        <MobileMenuContent $open={mobileMenuOpen} onClick={e => e.stopPropagation()}>
          <MobileMenuLinks>
            {burgerMenuItems.map((link, i) => (
              <MobileMenuLink
                key={i}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </MobileMenuLink>
            ))}
          </MobileMenuLinks>
        </MobileMenuContent>
      </MobileMenuOverlay>
    </>
  );
}

export default Navigation;
