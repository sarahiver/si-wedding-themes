import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:750px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,5vw,5rem);`;
const Eye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:var(--c-accent);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;
const QItem = styled.div`border-bottom:1px solid var(--c-border);`;
const QBtn = styled.button`width:100%;padding:1.3rem 0;display:flex;justify-content:space-between;align-items:center;
  background:none;border:none;cursor:pointer;text-align:left;gap:1rem;`;
const QT = styled.span`font-family:var(--font-d);font-size:1.15rem;font-weight:400;color:var(--c-text);`;
const QIcon = styled.span`font-size:1.2rem;color:var(--c-text-muted);transition:transform 0.3s;
  transform:rotate(${p=>p.$o?'45deg':'0'});flex-shrink:0;`;
const QA = styled.div`max-height:${p=>p.$o?'300px':'0'};overflow:hidden;transition:max-height 0.4s var(--ease);`;
const QAP = styled.p`font-size:0.85rem;line-height:1.9;color:var(--c-text-sec);padding-bottom:1.3rem;`;

const DEFS=[{question:'Gibt es Parkplätze?',answer:'Ja, direkt vor dem Schloss stehen ausreichend Parkplätze zur Verfügung.'},
{question:'Können Kinder mitkommen?',answer:'Wir feiern nur mit Erwachsenen – bitte seht dies als Einladung für einen freien Abend.'},
{question:'Was ist mit Allergien?',answer:'Bitte vermerkt eure Allergien in der RSVP-Nachricht.'}];

function FAQ(){
  const{content}=useWedding();const f=content?.faq||{};
  const items=f.questions?.length?f.questions:f.items?.length?f.items:DEFS;
  const[open,setOpen]=useState(null);
  const[ref,v]=useInView();
  return(
    <S id="faq" data-theme-light ref={ref}>
      <Wrap>
        <Hdr><Eye>Alles Wichtige</Eye><Title>{f.title||'Häufige Fragen'}</Title></Hdr>
        {items.map((q,i)=>(
          <QItem key={i}><QBtn onClick={()=>setOpen(open===i?null:i)}>
            <QT>{q.question||q.frage}</QT><QIcon $o={open===i}>+</QIcon></QBtn>
            <QA $o={open===i}><QAP>{q.answer||q.antwort}</QAP></QA></QItem>))}
      </Wrap>
    </S>);
}
export default FAQ;
