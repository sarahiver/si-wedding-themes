import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp  = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

function useInView(th=0.06){
  const r=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});
  if(r.current)o.observe(r.current);return()=>o.disconnect();},[th]);
  return[r,v];
}

/* Admin fields: title, events[]{time, title, description} */
const DEFAULTS=[
  {time:'13:00',title:'Standesamt',description:'Die offizielle Trauung'},
  {time:'15:00',title:'Sektempfang',description:'Willkommen & Anstoßen'},
  {time:'17:00',title:'Freie Trauung',description:'Unser Ja-Wort unter freiem Himmel'},
  {time:'19:00',title:'Abendessen',description:'Festliches Dinner'},
  {time:'22:00',title:'Party',description:'Tanzen bis in den Morgen'},
];

const S = styled.section`
  padding:var(--section-pad) clamp(1.5rem,5vw,4rem);
  background:var(--c-bg-warm);position:relative;overflow:hidden;z-index:2;
  &::after{content:'';position:absolute;bottom:-60px;left:-60px;width:280px;height:280px;
    background:radial-gradient(circle,rgba(193,57,43,.05) 0%,transparent 70%);border-radius:50%;pointer-events:none;}
`;
const Hdr = styled.div`
  text-align:center;margin-bottom:clamp(3rem,5vw,4.5rem);
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} .8s var(--ease) forwards;`}
`;
const Eyebrow = styled.p`font-family:var(--font-s);font-size:clamp(1.3rem,2.5vw,1.7rem);color:var(--c-accent);margin-bottom:.4rem;`;
const H2      = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:400;color:var(--c-text);`;

/* Grid: alternating cards above/below a center line */
const Track = styled.div`
  max-width:var(--content-w);margin:0 auto;
  position:relative;
  &::before{content:'';position:absolute;top:50%;left:0;right:0;height:1px;
    background:var(--c-border-warm);transform:translateY(-50%);z-index:0;
    @media(max-width:650px){display:none;}}
  @media(max-width:650px){display:flex;flex-direction:column;gap:1rem;}
`;
const Items = styled.div`
  display:grid;grid-template-columns:repeat(${p=>p.$n},1fr);gap:1.25rem;position:relative;z-index:1;
  @media(max-width:650px){grid-template-columns:1fr;gap:.75rem;}
`;
const Item = styled.div`
  display:flex;flex-direction:column;align-items:center;
  padding-top:${p=>p.$even?'55%':'0'};
  opacity:0;${p=>p.$v&&css`animation:${slideUp} .65s var(--ease) ${p.$i*.09}s forwards;`}
  @media(max-width:650px){padding-top:0;flex-direction:row;align-items:flex-start;gap:.75rem;}
`;
const Dot = styled.div`
  width:11px;height:11px;border-radius:50%;
  background:var(--c-accent);border:3px solid var(--c-bg-warm);
  box-shadow:0 0 0 1px var(--c-accent);
  margin:.6rem 0;flex-shrink:0;
  @media(max-width:650px){margin:.25rem 0 0;}
`;
const Card = styled.div`
  background:var(--c-cream);border-radius:var(--radius-sm);
  padding:1.1rem .9rem;text-align:center;width:100%;
  border:1px solid var(--c-border);
  transition:transform .3s var(--ease),box-shadow .3s;
  &:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(44,36,22,.09);}
  @media(max-width:650px){text-align:left;flex:1;}
`;
const CTime  = styled.p`font-family:var(--font-b);font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--c-accent);margin-bottom:.4rem;font-weight:500;`;
const CTitle = styled.h3`font-family:var(--font-d);font-size:clamp(.9rem,1.5vw,1.05rem);font-weight:500;color:var(--c-text);margin-bottom:.3rem;`;
const CDesc  = styled.p`font-family:var(--font-b);font-size:.78rem;color:var(--c-text-muted);line-height:1.6;`;

function Timeline(){
  const{content}=useWedding();
  const tl=content?.timeline||{};
  const[ref,v]=useInView();
  /* Admin: tl.events[]{time, title, description} */
  const items=tl.events?.length?tl.events:DEFAULTS;
  const n=Math.min(items.length,6);

  return(
    <S id="timeline" data-theme-light ref={ref}>
      <Hdr $v={v}>
        <Eyebrow>der tag gehört uns</Eyebrow>
        <H2>{tl.title||'Tagesablauf'}</H2>
      </Hdr>
      <Track>
        <Items $n={n}>
          {items.slice(0,6).map((it,i)=>(
            <Item key={i} $even={i%2===1} $v={v} $i={i}>
              {i%2===0&&<Card><CTime>{it.time}</CTime><CTitle>{it.title}</CTitle>{it.description&&<CDesc>{it.description}</CDesc>}</Card>}
              <Dot/>
              {i%2===1&&<Card><CTime>{it.time}</CTime><CTitle>{it.title}</CTitle>{it.description&&<CDesc>{it.description}</CDesc>}</Card>}
            </Item>
          ))}
        </Items>
      </Track>
    </S>
  );
}
export default Timeline;
