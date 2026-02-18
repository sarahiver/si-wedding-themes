import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Nav = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(1rem, 2.5vw, 1.5rem) clamp(1.5rem, 4vw, 3rem);
  transition: background 0.5s var(--ease), padding 0.4s var(--ease), box-shadow 0.4s;
  background: ${p => p.$solid ? 'rgba(250, 246, 240, 0.96)' : 'transparent'};
  backdrop-filter: ${p => p.$solid ? 'blur(12px)' : 'none'};
  box-shadow: ${p => p.$solid ? '0 1px 0 var(--c-border)' : 'none'};
`;

const Logo = styled.a`
  font-family: var(--font-s);
  font-size: clamp(1.3rem, 3vw, 1.7rem);
  color: ${p => p.$light ? 'rgba(255,255,255,0.9)' : 'var(--c-text)'};
  transition: color 0.4s;
  letter-spacing: 0.02em;
  &:hover { opacity: 0.75; }
`;

const BurgerBtn = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  z-index: 101;

  span {
    display: block;
    height: 1.5px;
    background: ${p => p.$light ? 'rgba(255,255,255,0.85)' : 'var(--c-text)'};
    transition: background 0.4s, transform 0.3s, opacity 0.3s;
    transform-origin: center;
  }

  /* Open state */
  ${p => p.$open && `
    span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
  `}
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity 0.35s var(--ease);
  padding: 2rem;
`;

const OverlayLogo = styled.div`
  font-family: var(--font-s);
  font-size: clamp(2rem, 6vw, 3rem);
  color: var(--c-accent);
  margin-bottom: 2.5rem;
  opacity: ${p => p.$open ? 1 : 0};
  transform: translateY(${p => p.$open ? 0 : '16px'});
  transition: opacity 0.4s 0.1s var(--ease), transform 0.4s 0.1s var(--ease);
`;

const NavItem = styled.a`
  font-family: var(--font-d);
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-style: italic;
  color: var(--c-text);
  opacity: ${p => p.$open ? 0.75 : 0};
  transform: translateY(${p => p.$open ? 0 : '20px'});
  transition:
    opacity 0.4s ${p => 0.1 + p.$i * 0.05}s var(--ease),
    transform 0.4s ${p => 0.1 + p.$i * 0.05}s var(--ease),
    color 0.2s;
  padding: 0.6rem 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0.5rem; left: 0; right: 100%;
    height: 1px;
    background: var(--c-accent);
    transition: right 0.3s var(--ease);
  }
  &:hover {
    color: var(--c-accent);
    opacity: 1;
    &::after { right: 0; }
  }
`;

const OverlayDivider = styled.div`
  width: 40px;
  height: 1px;
  background: var(--c-border-warm);
  margin: 1rem auto;
`;

function Navigation() {
  const { project, isComponentActive } = useWedding();
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cn = project?.couple_names || 'Lena & Jonas';

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 60);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const labelMap = {
    lovestory: 'Unsere Geschichte', timeline: 'Ablauf', locations: 'Location',
    directions: 'Anfahrt', accommodations: 'Unterkünfte', rsvp: 'RSVP',
    gallery: 'Galerie', guestbook: 'Gästebuch', musicwishes: 'Musikwünsche',
    photoupload: 'Fotos hochladen', gifts: 'Geschenke', dresscode: 'Dresscode',
    faq: 'FAQ', weddingabc: 'ABC', witnesses: 'Trauzeugen',
  };

  const defaultOrder = ['lovestory', 'timeline', 'locations', 'directions', 'accommodations', 'rsvp', 'gallery', 'guestbook', 'musicwishes', 'photoupload', 'gifts', 'dresscode', 'faq'];
  const order = project?.component_order || defaultOrder;
  const navItems = order
    .filter(id => labelMap[id] && isComponentActive(id))
    .map(id => ({ id, label: labelMap[id], href: `#${id}` }));

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, mobileOpen ? 350 : 0);
  };

  const isLight = !solid && !mobileOpen;

  return (
    <>
      <Nav $solid={solid || mobileOpen}>
        <Logo $light={isLight} href="#" onClick={e => scrollTo(e, '#top')}>
          {cn}
        </Logo>
        <BurgerBtn
          $light={isLight}
          $open={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          <span /><span /><span />
        </BurgerBtn>
      </Nav>

      <Overlay $open={mobileOpen}>
        <OverlayLogo $open={mobileOpen}>{cn}</OverlayLogo>
        <OverlayDivider />
        {navItems.map((item, i) => (
          <NavItem
            key={item.id}
            href={item.href}
            $open={mobileOpen}
            $i={i}
            onClick={e => scrollTo(e, item.href)}
          >
            {item.label}
          </NavItem>
        ))}
      </Overlay>
    </>
  );
}

export default Navigation;
