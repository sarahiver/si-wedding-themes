// Classic Theme - Navigation
import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = keyframes`from { transform: translateX(100%); } to { transform: translateX(0); }`;
const staggerIn = keyframes`from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); }`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem clamp(1.5rem, 5vw, 4rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s var(--ease-smooth);

  ${p => p.$scrolled && css`
    background: rgba(245, 240, 235, 0.95);
    backdrop-filter: blur(12px);
    padding: 1rem clamp(1.5rem, 5vw, 4rem);
    box-shadow: 0 1px 0 var(--classic-border);
  `}
`;

const Logo = styled.a`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: ${p => p.$scrolled ? 'var(--classic-charcoal)' : '#FFFFFF'};
  letter-spacing: 0.02em;
  transition: color 0.4s ease;
  text-decoration: none;
`;

const DesktopLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) { display: none; }
`;

const NavLink = styled.a`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => p.$scrolled ? 'var(--classic-text-light)' : 'rgba(255,255,255,0.7)'};
  transition: color 0.3s ease;
  text-decoration: none;

  &:hover {
    color: ${p => p.$scrolled ? 'var(--classic-charcoal)' : '#FFFFFF'};
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  width: 28px;
  height: 20px;
  position: relative;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) { display: block; }

  span {
    display: block;
    width: 100%;
    height: 1px;
    background: ${p => p.$open ? 'var(--classic-charcoal)' : (p.$scrolled ? 'var(--classic-charcoal)' : '#FFFFFF')};
    position: absolute;
    left: 0;
    transition: all 0.3s ease;

    &:nth-child(1) {
      top: ${p => p.$open ? '50%' : '0'};
      transform: ${p => p.$open ? 'rotate(45deg)' : 'none'};
    }
    &:nth-child(2) {
      top: 50%;
      opacity: ${p => p.$open ? 0 : 1};
    }
    &:nth-child(3) {
      top: ${p => p.$open ? '50%' : '100%'};
      transform: ${p => p.$open ? 'rotate(-45deg)' : 'none'};
    }
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  inset: 0;
  background: var(--classic-cream);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
`;

const MobileLink = styled.a`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--classic-charcoal);
  text-decoration: none;
  opacity: 0;
  animation: ${staggerIn} 0.5s var(--ease-out-expo) forwards;
  animation-delay: ${p => p.$delay}s;
  transition: color 0.3s ease;

  &:hover { color: var(--classic-gold); }
`;

// NAV ITEMS (maps component IDs to labels)
const NAV_LABELS = {
  hero: 'Home',
  countdown: 'Countdown',
  lovestory: 'Über Uns',
  timeline: 'Ablauf',
  locations: 'Locations',
  directions: 'Anfahrt',
  accommodations: 'Hotels',
  dresscode: 'Dresscode',
  rsvp: 'RSVP',
  gallery: 'Galerie',
  photoupload: 'Fotos',
  guestbook: 'Gästebuch',
  musicwishes: 'Musik',
  gifts: 'Geschenke',
  witnesses: 'Trauzeugen',
  faq: 'FAQ',
  weddingabc: 'ABC',
};

function Navigation() {
  const { project, content } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const coupleNames = project?.couple_names || 'Anna & Max';

  // Build nav items from active components
  const activeComponents = project?.active_components || ['hero', 'countdown', 'lovestory', 'rsvp'];
  const componentOrder = content?.component_order || activeComponents;
  const navItems = componentOrder
    .filter(id => activeComponents.includes(id) && NAV_LABELS[id] && id !== 'hero')
    .slice(0, 7)
    .map(id => ({ id, label: NAV_LABELS[id], href: `#${id === 'lovestory' ? 'lovestory' : id}` }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleClick = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Logo href="#top" $scrolled={scrolled} onClick={e => handleClick(e, '#top')}>
          {coupleNames}
        </Logo>

        <DesktopLinks>
          {navItems.map(item => (
            <NavLink key={item.id} href={item.href} $scrolled={scrolled}
              onClick={e => handleClick(e, item.href)}>
              {item.label}
            </NavLink>
          ))}
        </DesktopLinks>

        <Hamburger $scrolled={scrolled} $open={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </Hamburger>
      </Nav>

      {mobileOpen && (
        <MobileMenu>
          <MobileLink href="#top" $delay={0.1} onClick={e => handleClick(e, '#top')}>
            Home
          </MobileLink>
          {navItems.map((item, i) => (
            <MobileLink key={item.id} href={item.href} $delay={0.15 + i * 0.05}
              onClick={e => handleClick(e, item.href)}>
              {item.label}
            </MobileLink>
          ))}
        </MobileMenu>
      )}
    </>
  );
}

export default Navigation;
