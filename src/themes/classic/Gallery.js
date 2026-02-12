import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-cream);position:relative;z-index:2;`;
const Hdr = styled.div`text-align:center;margin-bottom:3.5rem;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:280px;gap:0.75rem;@media(max-width:900px){grid-template-columns:1fr 1fr;grid-auto-rows:200px;}@media(max-width:600px){grid-template-columns:1fr;}`;
const Item = styled.div`overflow:hidden;cursor:pointer;grid-column:${p=>p.$gc||'auto'};grid-row:${p=>p.$gr||'auto'};@media(max-width:900px){grid-column:auto;grid-row:auto;} img{width:100%;height:100%;object-fit:cover;filter:${p=>p.$bw?'grayscale(100%)':'none'};transition:transform 0.6s,filter 0.6s;} &:hover img{transform:scale(1.04);filter:grayscale(0%);}`;
const LB = styled.div`position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;animation:${fadeIn} 0.3s;cursor:pointer; img{max-width:90vw;max-height:90vh;object-fit:contain;}`;
const LBX = styled.button`position:absolute;top:1.5rem;right:1.5rem;background:none;border:none;color:rgba(255,255,255,0.5);font-size:2rem;&:hover{color:white;}`;
const LBN = styled.button`position:absolute;${p=>p.$d==='prev'?'left:1rem':'right:1rem'};top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,0.4);font-size:2.5rem;&:hover{color:white;}`;
const PATTERN = [{gc:'1/5',gr:'1/3',bw:true},{gc:'5/8',bw:false},{gc:'8/10',bw:true},{gc:'10/13',bw:false},{gc:'5/7',bw:false},{gc:'7/10',bw:true},{gc:'10/13',bw:false}];
const DEFS = ['https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg','https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg','https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg','https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg','https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg','https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg','https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg'];

function Gallery() {
  const { content } = useWedding();
  const gd = content?.gallery || {};
  const [ref,v] = useInView();
  const [lb,setLb] = useState(null);
  const images = gd.images?.length ? gd.images : DEFS;
  const url = img => typeof img === 'string' ? img : img.url||img.src;
  useEffect(()=>{if(lb!==null){const h=e=>{if(e.key==='Escape')setLb(null);if(e.key==='ArrowRight')setLb(i=>(i+1)%images.length);if(e.key==='ArrowLeft')setLb(i=>(i-1+images.length)%images.length);};window.addEventListener('keydown',h);document.body.style.overflow='hidden';return()=>{window.removeEventListener('keydown',h);document.body.style.overflow='';};}},[lb,images.length]);
  return (
    <S id="gallery" ref={ref}>
      <Hdr><Eye $v={v}>Impressionen</Eye><Title $v={v}>{gd.title||'Galerie'}</Title></Hdr>
      <Grid>{images.map((img,i)=>{const p=PATTERN[i%PATTERN.length];return <Item key={i} $gc={p.gc} $gr={p.gr} $bw={p.bw} onClick={()=>setLb(i)}><img src={url(img)} alt="" loading="lazy"/></Item>;})}</Grid>
      {lb!==null&&<LB onClick={()=>setLb(null)}><LBX onClick={()=>setLb(null)}>×</LBX><LBN $d="prev" onClick={e=>{e.stopPropagation();setLb(i=>(i-1+images.length)%images.length);}}>‹</LBN><img src={url(images[lb])} alt="" onClick={e=>e.stopPropagation()}/><LBN $d="next" onClick={e=>{e.stopPropagation();setLb(i=>(i+1)%images.length);}}>›</LBN></LB>}
    </S>
  );
}
export default Gallery;
