import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:clamp(4rem,8vh,6rem) clamp(2rem,5vw,5rem) 0;background:var(--c-white);position:relative;z-index:2;`;
const Hdr = styled.div`max-width:var(--content-w);margin:0 auto 3rem;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-size:clamp(2rem,4vw,3rem);font-weight:300;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const Row = styled.div`display:flex;gap:0;width:100vw;margin-left:calc(-1 * clamp(2rem,5vw,5rem));opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.25s;`}@media(max-width:768px){flex-wrap:wrap;width:100%;margin-left:0;}`;
const Item = styled.div`flex:1;position:relative;overflow:hidden;border-right:1px solid rgba(255,255,255,0.08);&:last-child{border:none;} img{width:100%;aspect-ratio:3/4;object-fit:cover;filter:grayscale(40%) brightness(0.45);transition:all 0.5s;} &:hover img{filter:grayscale(0%) brightness(0.5);} @media(max-width:768px){flex:0 0 50%;}@media(max-width:500px){flex:0 0 100%;}`;
const Overlay = styled.div`position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;background:linear-gradient(transparent 40%,rgba(0,0,0,0.5) 100%);`;
const Time = styled.p`font-family:var(--font-d);font-size:clamp(1.5rem,3vw,2.5rem);font-weight:300;color:white;line-height:1;margin-bottom:0.3rem;`;
const ITitle = styled.p`font-family:var(--font-d);font-size:clamp(0.9rem,1.5vw,1.15rem);font-weight:400;color:rgba(255,255,255,0.9);margin-bottom:0.15rem;`;
const IDesc = styled.p`font-size:0.6rem;color:rgba(255,255,255,0.4);`;
const DEF_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg';
const DEFS=[{time:'14:00',title:'Empfang',description:'Sektempfang im Garten',image:DEF_IMG},{time:'15:00',title:'Trauung',description:'Freie Trauung'},{time:'16:30',title:'Kaffee & Kuchen',description:'Hochzeitstorte'},{time:'18:30',title:'Dinner',description:'4-Gänge-Menü'},{time:'21:00',title:'Party',description:'Eröffnungstanz'}];

function Timeline(){const{content}=useWedding();const tl=content?.timeline||{};const[ref,v]=useInView();const items=tl.items?.length?tl.items:DEFS;
return(<S id="timeline" ref={ref}><Hdr><Eye $v={v}>Der große Tag</Eye><Title $v={v}>{tl.title||'Tagesablauf'}</Title></Hdr><Row $v={v}>{items.map((it,i)=>(<Item key={i}><img src={it.image||DEF_IMG} alt={it.title} loading="lazy"/><Overlay><Time>{it.time||it.zeit}</Time><ITitle>{it.title||it.titel}</ITitle>{(it.description||it.beschreibung)&&<IDesc>{it.description||it.beschreibung}</IDesc>}</Overlay></Item>))}</Row></S>);}
export default Timeline;
