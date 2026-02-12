import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const stagger = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const Nav = styled.nav`
  position:fixed;top:0;left:0;right:0;z-index:1000;
  display:flex;justify-content:space-between;align-items:center;
  padding:2rem clamp(2rem,5vw,4rem);pointer-events:none;
  transition:all 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
  ${p => p.$scrolled && css`
    background:rgba(255,255,255,0.96);
    backdrop-filter:blur(12px);
    padding:1.2rem clamp(2rem,5vw,4rem);
    box-shadow:0 1px 0 rgba(0,0,0,0.06);
  `}
`;
const Logo = styled.a`
  pointer-events:auto;font-family:var(--font-b);font-size:0.6rem;font-weight:400;
  letter-spacing:0.3em;text-transform:uppercase;text-decoration:none;
  transition:color 0.4s;
  color:${p => p.$scrolled ? 'var(--c-text)' : 'rgba(255,255,255,0.85)'};
`;
const Links = styled.div`display:flex;gap:2.5rem;@media(max-width:900px){display:none;}`;
const Link = styled.a`
  pointer-events:auto;font-family:var(--font-b);font-size:0.55rem;font-weight:300;
  letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;
  transition:color 0.3s;
  color:${p => p.$scrolled ? 'var(--c-text-sec)' : 'rgba(255,255,255,0.6)'};
  &:hover{color:${p => p.$scrolled ? 'var(--c-text)' : 'rgba(255,255,255,1)'};}
`;
const Burger = styled.button`display:none;pointer-events:auto;background:none;border:none;width:24px;height:16px;position:relative;cursor:pointer;z-index:1001;@media(max-width:900px){display:block;}
  span{display:block;width:100%;height:1px;position:absolute;left:0;transition:all 0.3s;
    background:${p => p.$o ? 'var(--c-text)' : (p.$scrolled ? 'var(--c-text)' : 'rgba(255,255,255,0.8)')};
    &:nth-child(1){top:${p=>p.$o?'50%':'0'};transform:${p=>p.$o?'rotate(45deg)':'none'};}
    &:nth-child(2){top:50%;opacity:${p=>p.$o?0:1};}
    &:nth-child(3){top:${p=>p.$o?'50%':'100%'};transform:${p=>p.$o?'rotate(-45deg)':'none'};}
  }`;
const Mobile = styled.div`position:fixed;inset:0;background:var(--c-cream);z-index:999;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:1.5rem;animation:${fadeIn} 0.3s ease;`;
const MLink = styled.a`font-family:var(--font-d);font-size:2rem;font-weight:300;color:var(--c-text);text-decoration:none;opacity:0;animation:${stagger} 0.5s forwards;animation-delay:${p=>p.$d}s;&:hover{color:var(--c-text-muted);}`;

const NAV_LABELS = {countdown:'Countdown',lovestory:'Über Uns',timeline:'Ablauf',locations:'Locations',directions:'Anfahrt',accommodations:'Hotels',dresscode:'Dresscode',rsvp:'RSVP',gallery:'Galerie',photoupload:'Fotos',guestbook:'Gästebuch',musicwishes:'Musik',gifts:'Geschenke',witnesses:'Trauzeugen',faq:'FAQ',weddingabc:'ABC'};

function Navigation() {
  const { project, content } = useWedding();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const names = project?.couple_names || 'Anna & Max';
  const active = project?.active_components || ['hero','countdown','lovestory','rsvp'];
  const order = project?.component_order || active;
  const navItems = order.filter(id => active.includes(id) && NAV_LABELS[id]).slice(0,8).map(id => ({id, label:NAV_LABELS[id], href:`#${id}`}));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  const click = useCallback((e, href) => { e.preventDefault(); setOpen(false); const el = document.querySelector(href); if (el) el.scrollIntoView({behavior:'smooth'}); }, []);

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Logo href="#top" $scrolled={scrolled} onClick={e => click(e,'#top')}>{names}</Logo>
        <Links>{navItems.map(n => <Link key={n.id} href={n.href} $scrolled={scrolled} onClick={e => click(e,n.href)}>{n.label}</Link>)}</Links>
        <Burger $scrolled={scrolled} $o={open} onClick={() => setOpen(!open)} aria-label="Menu"><span/><span/><span/></Burger>
      </Nav>
      {open && <Mobile><MLink href="#top" $d={0.1} onClick={e => click(e,'#top')}>Home</MLink>{navItems.map((n,i) => <MLink key={n.id} href={n.href} $d={0.15+i*0.05} onClick={e => click(e,n.href)}>{n.label}</MLink>)}</Mobile>}
    </>
  );
}
export default Navigation;
