import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-white);`;
const Wrap = styled.div`max-width: 750px; margin: 0 auto;`;
const Hdr = styled.div`text-align: center; margin-bottom: 3.5rem;`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Ttl = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const Item = styled.div`border-bottom: 1px solid var(--c-border); opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.6s var(--ease) forwards; animation-delay: ${p.$d};`}`;
const Q = styled.button`width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; background: none; border: none; text-align: left; font-family: var(--font-display); font-size: 1.2rem; font-weight: 400; color: var(--c-text); cursor: pointer; &:hover { color: var(--c-gold-dark); }`;
const Arrow = styled.span`font-size: 1.2rem; color: var(--c-gold); transition: transform 0.3s; transform: ${p => p.$o ? 'rotate(45deg)' : 'rotate(0)'};`;
const A = styled.div`max-height: ${p => p.$o ? '500px' : '0'}; overflow: hidden; transition: max-height 0.4s ease; p { font-size: 0.85rem; font-weight: 300; color: var(--c-text-sec); line-height: 1.9; padding-bottom: 1.5rem; }`;
const DEFS=[{q:'Dürfen wir jemanden mitbringen?',a:'Bitte habt Verständnis, dass wir nur die eingeladenen Personen berücksichtigen können.'},{q:'Gibt es vegetarische Optionen?',a:'Selbstverständlich! Bitte gebt uns bei der RSVP Bescheid.'},{q:'Kann ich Fotos machen?',a:'Bitte verzichtet während der Trauung auf Fotos. Danach gerne!'},{q:'Gibt es Parkplätze?',a:'Ja, direkt am Veranstaltungsort stehen Parkplätze zur Verfügung.'}];
function FAQ(){const{content}=useWedding();const f=content?.faq||{};const[ref,v]=[useRef(null),null];const[vis,setVis]=useState(false);const[oIdx,setO]=useState(null);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);const faqs=f.items?.length?f.items:DEFS;return(<S id="faq" ref={ref}><Wrap><Hdr><Eye $v={vis}>Gut zu wissen</Eye><Ttl $v={vis}>{f.title||'Häufige Fragen'}</Ttl></Hdr>{faqs.map((faq,i)=>(<Item key={i} $v={vis} $d={`${0.3+i*0.08}s`}><Q onClick={()=>setO(oIdx===i?null:i)}>{faq.q||faq.question||faq.frage}<Arrow $o={oIdx===i}>+</Arrow></Q><A $o={oIdx===i}><p>{faq.a||faq.answer||faq.antwort}</p></A></Item>))}</Wrap></S>);}
export default FAQ;
