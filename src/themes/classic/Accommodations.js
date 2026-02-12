import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}


const Sec = styled.section`display:grid;grid-template-columns:1fr 1fr;min-height:80vh;${p=>p.$rev?'direction:rtl;':''}@media(max-width:900px){grid-template-columns:1fr;direction:ltr;}& > *{direction:ltr;}`;
const ImgSide = styled.div`position:relative;overflow:hidden;@media(max-width:900px){height:50vh;} img{width:100%;height:100%;object-fit:cover;filter:grayscale(15%);}`;
const AccentImg = styled.div`position:absolute;bottom:-2rem;${p=>p.$rev?'left:-1.5rem':'right:-1.5rem'};width:40%;border:6px solid white;box-shadow:0 15px 40px rgba(0,0,0,0.12);z-index:3;overflow:hidden;@media(max-width:900px){bottom:-1rem;${p=>p.$rev?'left:1rem':'right:1rem'};width:35%;} img{width:100%;aspect-ratio:1;object-fit:cover;filter:none;}`;
const TxtSide = styled.div`display:flex;flex-direction:column;justify-content:center;padding:clamp(3rem,6vw,6rem);`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;line-height:1.2;margin-bottom:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const P = styled.p`font-size:0.82rem;line-height:2;color:var(--c-text-sec);max-width:440px;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.24s;`}`;

const Hotel = styled.div`margin-top:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.6s var(--ease) forwards;animation-delay:${p.$d};`}`;
const HName = styled.p`font-family:var(--font-d);font-size:1.1rem;font-weight:400;color:var(--c-text);`;
const HMeta = styled.p`font-size:0.72rem;color:var(--c-text-muted);`;
const DEFS=[{name:'Hotel am Schlosspark',description:'5 Min. entfernt',price:'ab 120 € / Nacht'},{name:'Boutique Hotel Gartenblick',description:'10 Min. entfernt',price:'ab 95 € / Nacht'}];

function Accommodations(){const{content}=useWedding();const a=content?.accommodations||{};const[ref,v]=useInView();const hotels=a.hotels?.length?a.hotels:DEFS;
return(<Sec id="accommodations" ref={ref}><ImgSide><img src={a.image||'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg'} alt="" loading="lazy"/>{(a.accent_image||true)&&<AccentImg><img src={a.accent_image||'https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg'} alt="" loading="lazy"/></AccentImg>}</ImgSide><TxtSide><Eye $v={v}>Übernachten</Eye><Title $v={v}>{a.title||'Hotels'}</Title><P $v={v}>{a.description||'Wir haben Zimmerkontingente reserviert.'}</P>{hotels.map((h,i)=>(<Hotel key={i} $v={v} $d={`${0.4+i*0.12}s`}><HName>{h.name||h.titel}</HName><HMeta>{[h.description||h.beschreibung,h.price].filter(Boolean).join(' · ')}</HMeta></Hotel>))}</TxtSide></Sec>);}
export default Accommodations;
