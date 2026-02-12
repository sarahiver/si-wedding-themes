import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const stagger = keyframes`from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); }`;

const Nav = styled.nav`
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 1.5rem clamp(1.5rem, 5vw, 4rem);
  display: flex; justify-content: space-between; align-items: center;
  transition: all 0.4s var(--ease);
  ${p => p.$scrolled && css`
    background: rgba(255,255,255,0.97); backdrop-filter: blur(12px);
    padding: 1rem clamp(1.5rem, 5vw, 4rem);
    box-shadow: 0 1px 0 rgba(0,0,0,0.06);
  `}
`;
const Logo = styled.a`
  font-family: var(--font-display); font-size: 1.4rem; font-weight: 400;
  color: ${p => p.$s ? 'var(--c-text)' : '#FFFFFF'};
  letter-spacing: 0.02em; text-decoration: none; transition: color 0.4s;
`;
const Links = styled.div`display: flex; gap: 2rem; @media(max-width:768px){display:none;}`;
const Link = styled.a`
  font-family: var(--font-body); font-size: 0.6rem; font-weight: 400;
  letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
  color: ${p => p.$s ? 'var(--c-text-muted)' : 'rgba(255,255,255,0.6)'};
  transition: color 0.3s;
  &:hover { color: ${p => p.$s ? 'var(--c-text)' : '#fff'}; }
`;
const Burger = styled.button`
  display: none; background: none; border: none; width: 26px; height: 18px;
  position: relative; z-index: 1001; @media(max-width:768px){display:block;}
  span { display: block; width: 100%; height: 1px; position: absolute; left: 0;
    background: ${p => p.$open ? 'var(--c-text)' : (p.$s ? 'var(--c-text)' : '#fff')};
    transition: all 0.3s;
    &:nth-child(1) { top: ${p => p.$open ? '50%' : '0'}; transform: ${p => p.$open ? 'rotate(45deg)' : 'none'}; }
    &:nth-child(2) { top: 50%; opacity: ${p => p.$open ? 0 : 1}; }
    &:nth-child(3) { top: ${p => p.$open ? '50%' : '100%'}; transform: ${p => p.$open ? 'rotate(-45deg)' : 'none'}; }
  }
`;
const Mobile = styled.div`
  position: fixed; inset: 0; background: var(--c-white); z-index: 999;
  display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
`;
const MLink = styled.a`
  font-family: var(--font-display); font-size: 2rem; font-weight: 300; color: var(--c-text);
  text-decoration: none; opacity: 0; animation: ${stagger} 0.5s var(--ease) forwards;
  animation-delay: ${p => p.$d}s; &:hover { color: var(--c-gold); }
`;

const NAV_LABELS = { countdown:'Countdown', lovestory:'Über Uns', timeline:'Ablauf', locations:'Locations', directions:'Anfahrt', accommodations:'Hotels', dresscode:'Dresscode', rsvp:'RSVP', gallery:'Galerie', photoupload:'Fotos', guestbook:'Gästebuch', musicwishes:'Musik', gifts:'Geschenke', witnesses:'Trauzeugen', faq:'FAQ', weddingabc:'ABC' };

function Navigation() {
  const { project, content } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const names = project?.couple_names || 'Anna & Max';
  const active = project?.active_components || ['hero','countdown','lovestory','rsvp'];
  const order = content?.component_order || active;
  const items = order.filter(id => active.includes(id) && NAV_LABELS[id]).slice(0, 7).map(id => ({ id, label: NAV_LABELS[id], href: `#${id}` }));

  useEffect(() => { const h = () => setScrolled(window.scrollY > 80); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  const click = useCallback((e, href) => { e.preventDefault(); setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); }, []);

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Logo href="#top" $s={scrolled} onClick={e => click(e, '#top')}>{names}</Logo>
        <Links>{items.map(i => <Link key={i.id} href={i.href} $s={scrolled} onClick={e => click(e, i.href)}>{i.label}</Link>)}</Links>
        <Burger $s={scrolled} $open={open} onClick={() => setOpen(!open)} aria-label="Menu"><span/><span/><span/></Burger>
      </Nav>
      {open && <Mobile>{items.map((i, idx) => <MLink key={i.id} href={i.href} $d={0.1 + idx * 0.05} onClick={e => click(e, i.href)}>{i.label}</MLink>)}</Mobile>}
    </>
  );
}
export default Navigation;
