import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);text-align:center;`;
const Eye = styled.p`font-family:var(--font-b);font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Grid = styled.div`display:flex;justify-content:center;gap:clamp(2.5rem,6vw,5rem);flex-wrap:wrap;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.2s;`}`;
const Num = styled.div`font-family:var(--font-d);font-size:clamp(3.5rem,9vw,6rem);font-weight:300;color:var(--c-text);line-height:1;`;
const Lbl = styled.div`font-family:var(--font-b);font-size:0.5rem;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;color:var(--c-text-muted);margin-top:0.5rem;`;

function Countdown(){const{content,weddingDate}=useWedding();const cd=content?.countdown||{};const[ref,v]=useInView();const[t,setT]=useState({d:0,h:0,m:0,s:0});const target=cd.target_date||weddingDate||'2026-08-15T14:00:00';
useEffect(()=>{const calc=()=>{const diff=Math.max(0,new Date(target)-new Date());setT({d:Math.floor(diff/864e5),h:Math.floor((diff%864e5)/36e5),m:Math.floor((diff%36e5)/6e4),s:Math.floor((diff%6e4)/1e3)});}; calc();const id=setInterval(calc,1000);return()=>clearInterval(id);},[target]);
return(<S id="countdown" data-theme-light ref={ref}><Eye $v={v}>{cd.title||'Bald ist es soweit'}</Eye><Grid $v={v}><div><Num>{t.d}</Num><Lbl>Tage</Lbl></div><div><Num>{t.h}</Num><Lbl>Stunden</Lbl></div><div><Num>{t.m}</Num><Lbl>Minuten</Lbl></div>{cd.show_seconds!==false&&<div><Num>{t.s}</Num><Lbl>Sekunden</Lbl></div>}</Grid></S>);}
export default Countdown;
