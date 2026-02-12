import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:750px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:3.5rem;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const Item = styled.div`border-bottom:1px solid var(--c-border);`;
const Q = styled.button`width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.5rem 0;background:none;border:none;text-align:left;font-family:var(--font-d);font-size:1.2rem;font-weight:400;color:var(--c-text);&:hover{color:var(--c-text-muted);}`;
const Ar = styled.span`font-size:1.2rem;color:var(--c-text-muted);transition:transform 0.3s;transform:${p=>p.$o?'rotate(45deg)':'none'};`;
const A = styled.div`max-height:${p=>p.$o?'500px':'0'};overflow:hidden;transition:max-height 0.4s ease; p{font-size:0.82rem;color:var(--c-text-sec);line-height:1.9;padding-bottom:1.5rem;}`;
const DEFS=[{q:'D\u00FCrfen wir jemanden mitbringen?',a:'Bitte habt Verst\u00E4ndnis, dass wir nur die eingeladenen Personen ber\u00FCcksichtigen k\u00F6nnen.'},{q:'Gibt es vegetarische Optionen?',a:'Selbstverst\u00E4ndlich! Bitte gebt uns bei der RSVP Bescheid.'},{q:'Kann ich Fotos machen?',a:'Bitte verzichtet w\u00E4hrend der Trauung auf Fotos. Danach gerne!'}];
function FAQ(){const{content}=useWedding();const f=content?.faq||{};const[ref,v]=useInView();const[oIdx,setO]=useState(null);const faqs=f.items?.length?f.items:DEFS;
return(<S id="faq" ref={ref}><Wrap><Hdr><Eye $v={v}>Gut zu wissen</Eye><Title $v={v}>{f.title||'H\u00E4ufige Fragen'}</Title></Hdr>{faqs.map((faq,i)=><Item key={i}><Q onClick={()=>setO(oIdx===i?null:i)}>{faq.q||faq.question||faq.frage}<Ar $o={oIdx===i}>+</Ar></Q><A $o={oIdx===i}><p>{faq.a||faq.answer||faq.antwort}</p></A></Item>)}</Wrap></S>);}
export default FAQ;
