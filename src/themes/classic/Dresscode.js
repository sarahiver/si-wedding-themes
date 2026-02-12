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

const scaleIn = keyframes`from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}`;
const Swatches = styled.div`display:flex;gap:0.75rem;margin-top:1.5rem;`;
const Swatch = styled.div`width:40px;height:40px;border-radius:50%;background:${p=>p.$c};box-shadow:0 3px 10px rgba(0,0,0,0.08);opacity:0;${p=>p.$v&&css`animation:${scaleIn} 0.4s var(--ease) forwards;animation-delay:${p.$d};`}`;
function Dresscode(){const{content}=useWedding();const d=content?.dresscode||{};const[ref,v]=useInView();const colors=d.colors||['#2C2C2C','#999999','#8B7355','#D4C5B5','#7A8B6F'];
return(<Sec id="dresscode" ref={ref}><ImgSide><img src={d.image||'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg'} alt="" loading="lazy"/>{(d.accent_image||true)&&<AccentImg><img src={d.accent_image||'https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg'} alt="" loading="lazy"/></AccentImg>}</ImgSide><TxtSide><Eye $v={v}>Kleiderordnung</Eye><Title $v={v}>{d.title||'Dresscode'}</Title><P $v={v}>{d.description||'Wir freuen uns über elegante Garderobe in gedeckten, warmen Farben. Bitte vermeidet Weiß und Creme.'}</P><Swatches>{colors.map((c,i)=>(<Swatch key={i} $c={c} $v={v} $d={`${0.4+i*0.08}s`}/>))}</Swatches></TxtSide></Sec>);}
export default Dresscode;
