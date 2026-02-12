import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const stagger = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const Nav = styled.nav`
  position:fixed;top:0;left:0;right:0;z-index:1000;
  display:flex;justify-content:space-between;align-items:center;
  padding:2rem clamp(2rem,5vw,4rem);pointer-events:none;transition:padding 0.4s;
`;
const Logo = styled.a`pointer-events:auto;font-family:var(--font-b);font-size:0.6rem;font-weight:400;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.7);text-decoration:none;transition:color 0.4s;`;
const Links = styled.div`display:flex;gap:2.5rem;@media(max-width:768px){display:none;}`;
const Link = styled.a`pointer-events:auto;font-family:var(--font-b);font-size:0.55rem;font-weight:300;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.45);text-decoration:none;transition:color 0.3s;&:hover{color:rgba(255,255,255,0.85);}`;
const Burger = styled.button`display:none;pointer-events:auto;background:none;border:none;width:24px;height:16px;position:relative;@media(max-width:768px){display:block;}
  span{display:block;width:100%;height:1px;position:absolute;left:0;background:rgba(255,255,255,0.6);transition:all 0.3s;
    &:nth-child(1){top:${p=>p.$o?'50%':'0'};transform:${p=>p.$o?'rotate(45deg)':'none'};}
    &:nth-child(2){top:50%;opacity:${p=>p.$o?0:1};}
    &:nth-child(3){top:${p=>p.$o?'50%':'100%'};transform:${p=>p.$o?'rotate(-45deg)':'none'};}
  }`;
const Mobile = styled.div`position:fixed;inset:0;background:var(--c-cream);z-index:999;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:1.5rem;animation:${fadeIn} 0.3s ease;`;
const MLink = styled.a`font-family:var(--font-d);font-size:2rem;font-weight:300;color:var(--c-text);text-decoration:none;opacity:0;animation:${stagger} 0.5s var(--ease) forwards;animation-delay:${p=>p.$d}s;&:hover{color:var(--c-text-muted);}`;

const NAV_LABELS = {countdown:'Countdown',lovestory:'Über Uns',timeline:'Ablauf',locations:'Locations',directions:'Anfahrt',accommodations:'Hotels',dresscode:'Dresscode',rsvp:'RSVP',gallery:'Galerie',photoupload:'Fotos',guestbook:'Gästebuch',musicwishes:'Musik',gifts:'Geschenke',witnesses:'Trauzeugen',faq:'FAQ',weddingabc:'ABC'};

function Navigation() {
  const { project, content } = useWedding();
  const [open, setOpen] = useState(false);
  const names = project?.couple_names || 'Anna & Max';
  const active = project?.active_components || [];
  const order = content?.component_order || active;
  const items = order.filter(id => active.includes(id) && NAV_LABELS[id]).slice(0,7).map(id => ({id, label:NAV_LABELS[id], href:`#${id}`}));
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const click = useCallback((e, href) => { e.preventDefault(); setOpen(false); document.querySelector(href)?.scrollIntoView({behavior:'smooth'}); }, []);
  return (
    <>
      <Nav>
        <Logo href="#top" onClick={e => click(e,'#top')}>{names}</Logo>
        <Links>{items.map(i => <Link key={i.id} href={i.href} onClick={e => click(e,i.href)}>{i.label}</Link>)}</Links>
        <Burger $o={open} onClick={() => setOpen(!open)} aria-label="Menu"><span/><span/><span/></Burger>
      </Nav>
      {open && <Mobile>{items.map((i,idx) => <MLink key={i.id} href={i.href} $d={0.1+idx*0.05} onClick={e=>click(e,i.href)}>{i.label}</MLink>)}</Mobile>}
    </>
  );
}
export default Navigation;
