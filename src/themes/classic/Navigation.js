import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Nav = styled.nav`
  position:fixed;top:0;left:0;right:0;z-index:100;
  display:flex;justify-content:space-between;align-items:center;
  padding:1.8rem clamp(2rem,5vw,4rem);
  pointer-events:none;transition:padding 0.4s;
  /* NIE einen Hintergrund */
  background:transparent !important;
  & * { pointer-events:auto; }
`;
const Logo = styled.a`
  font-family:var(--font-b);font-size:0.6rem;font-weight:400;
  letter-spacing:0.3em;text-transform:uppercase;
  color:${p=>p.$dark?'rgba(0,0,0,0.5)':'rgba(255,255,255,0.7)'};
  transition:color 0.4s;
`;
const Links = styled.div`
  display:flex;gap:2.5rem;
  @media(max-width:900px){display:none;}
  a {
    font-family:var(--font-b);font-size:0.55rem;font-weight:300;
    letter-spacing:0.15em;text-transform:uppercase;
    color:${p=>p.$dark?'rgba(0,0,0,0.35)':'rgba(255,255,255,0.5)'};
    transition:color 0.3s;
    &:hover{color:${p=>p.$dark?'rgba(0,0,0,0.7)':'rgba(255,255,255,0.9)'};}
  }
`;
const Burger = styled.button`
  display:none;background:none;border:none;cursor:pointer;padding:0.5rem;
  @media(max-width:900px){display:flex;flex-direction:column;gap:5px;}
  span{display:block;width:22px;height:1px;background:${p=>p.$dark?'rgba(0,0,0,0.4)':'rgba(255,255,255,0.6)'};transition:all 0.3s;}
`;
const MobileMenu = styled.div`
  position:fixed;inset:0;z-index:99;background:rgba(255,255,255,0.97);
  backdrop-filter:blur(20px);display:flex;flex-direction:column;
  justify-content:center;align-items:center;gap:2rem;
  opacity:${p=>p.$open?1:0};pointer-events:${p=>p.$open?'auto':'none'};transition:opacity 0.4s;
  a{font-family:var(--font-d);font-size:1.8rem;font-weight:300;color:var(--c-text);
    opacity:0.6;transition:opacity 0.3s;&:hover{opacity:1;}}
`;
const CloseBtn = styled.button`
  position:absolute;top:2rem;right:2rem;background:none;border:none;
  font-size:1.5rem;color:var(--c-text);cursor:pointer;opacity:0.4;
`;

function Navigation() {
  const { project, isComponentActive } = useWedding();
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cn = project?.couple_names || 'Anna & Max';

  useEffect(() => {
    const update = () => {
      const y = window.scrollY + 60;
      const lightSections = document.querySelectorAll('[data-theme-light]');
      let overLight = false;
      lightSections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top < 60 && r.bottom > 60) overLight = true;
      });
      // Also check if scrolled past hero
      if (y > window.innerHeight * 0.8) overLight = true;
      setDark(overLight);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  const navItems = [
    { id: 'lovestory', label: 'Über Uns', href: '#lovestory' },
    { id: 'timeline', label: 'Ablauf', href: '#timeline' },
    { id: 'locations', label: 'Location', href: '#locations' },
    { id: 'rsvp', label: 'RSVP', href: '#rsvp' },
    { id: 'gallery', label: 'Galerie', href: '#gallery' },
  ].filter(item => isComponentActive(item.id));

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Nav>
        <Logo $dark={dark} href="#" onClick={e => scrollTo(e, '#hero')}>{cn}</Logo>
        <Links $dark={dark}>
          {navItems.map(item => (
            <a key={item.id} href={item.href} onClick={e => scrollTo(e, item.href)}>{item.label}</a>
          ))}
        </Links>
        <Burger $dark={dark} onClick={() => setMobileOpen(true)}>
          <span /><span /><span />
        </Burger>
      </Nav>
      <MobileMenu $open={mobileOpen}>
        <CloseBtn onClick={() => setMobileOpen(false)}>×</CloseBtn>
        {navItems.map(item => (
          <a key={item.id} href={item.href} onClick={e => scrollTo(e, item.href)}>{item.label}</a>
        ))}
      </MobileMenu>
    </>
  );
}
export default Navigation;
