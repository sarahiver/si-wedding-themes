import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Grid = styled.div`max-width:var(--content-w);margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:center;@media(max-width:900px){grid-template-columns:1fr;gap:3rem;}`;
const ImgStack = styled.div`position:relative;height:650px;@media(max-width:900px){height:420px;}@media(max-width:600px){height:350px;}`;
const ImgBack = styled.div`position:absolute;top:0;left:0;width:62%;overflow:hidden;border:8px solid white;box-shadow:0 20px 50px rgba(0,0,0,0.1);opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;`} img{width:100%;aspect-ratio:3/4;object-fit:cover;filter:grayscale(100%);}`;
const ImgFront = styled.div`position:absolute;bottom:0;right:0;width:52%;overflow:hidden;z-index:2;border:8px solid white;box-shadow:0 25px 60px rgba(0,0,0,0.12);opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;animation-delay:0.2s;`} img{width:100%;aspect-ratio:4/5;object-fit:cover;}`;
const Txt = styled.div`padding-left:5rem;@media(max-width:900px){padding-left:0;}`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-size:clamp(2rem,4vw,3rem);font-weight:300;line-height:1.2;margin-bottom:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.15s;`}`;
const P = styled.p`font-size:0.82rem;line-height:2;color:var(--c-text-sec);max-width:420px;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.3s;`}`;
const Sig = styled.div`font-family:var(--font-s);font-size:2.5rem;color:var(--c-text-muted);margin-top:2rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.4s;`}`;
const DIV_IMG1 = 'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg';
const DIV_IMG2 = 'https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg';

function LoveStory(){const{content,project}=useWedding();const ls=content?.lovestory||{};const[ref,v]=useInView(0.1);const cn=project?.couple_names||'Anna & Max';const img1=ls.image_back||ls.stories?.[0]?.image||DIV_IMG1;const img2=ls.image_front||ls.stories?.[1]?.image||DIV_IMG2;const title=ls.title||'Wie ein Blick alles veränderte';const sub=ls.subtitle||'Unsere Geschichte';const text=ls.text||ls.stories?.[0]?.text||'Was als zufällige Begegnung begann, entwickelte sich schnell zu einer tiefen Verbindung. Gemeinsam haben wir die Welt entdeckt und gelernt, dass wir füreinander bestimmt sind.';
return(<S id="lovestory" ref={ref}><Grid><ImgStack><ImgBack $v={v}><img src={img1} alt="" loading="lazy"/></ImgBack><ImgFront $v={v}><img src={img2} alt="" loading="lazy"/></ImgFront></ImgStack><Txt><Eye $v={v}>{sub}</Eye><Title $v={v}>{title}</Title><P $v={v}>{text}</P><Sig $v={v}>{cn}</Sig></Txt></Grid></S>);}
export default LoveStory;
