import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

const fadeUp  = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}`;

function useInView(th=0.06){
  const r=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});
  if(r.current)o.observe(r.current);return()=>o.disconnect();},[th]);
  return[r,v];
}

const DEMO=[
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75',
  'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=75',
  'https://images.unsplash.com/photo-1591604329141-c2b78069a79c?w=800&q=75',
  'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=75',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=75',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=75',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=75',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=75',
];
/* Rotating jewel tone accent borders */
const BORDERS=['#C1392B','#C17F24','#8B6914','#C1392B','#C17F24','#8B6914','#C1392B','#C17F24'];

const S = styled.section`padding:var(--section-pad) clamp(1.5rem,5vw,4rem);background:var(--c-bg);position:relative;z-index:2;`;
const Inner = styled.div`max-width:var(--content-w);margin:0 auto;`;
const Hdr = styled.div`
  text-align:center;margin-bottom:clamp(2.5rem,4vw,4rem);
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} .8s var(--ease) forwards;`}
`;
const Eyebrow = styled.p`font-family:var(--font-s);font-size:clamp(1.3rem,2.5vw,1.7rem);color:var(--c-accent);margin-bottom:.4rem;`;
const H2      = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:400;color:var(--c-text);`;

const Grid = styled.div`
  display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;
  @media(max-width:900px){grid-template-columns:repeat(3,1fr);}
  @media(max-width:580px){grid-template-columns:repeat(2,1fr);gap:.4rem;}
`;
const Thumb = styled.div`
  position:relative;overflow:hidden;cursor:pointer;
  border-radius:var(--radius-sm);
  border:3px solid ${p=>BORDERS[p.$i%BORDERS.length]};
  aspect-ratio:${p=>p.$feat?'16/9':'1'};
  grid-column:${p=>p.$feat?'span 2':'span 1'};
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} .55s var(--ease) ${p.$i*.055}s forwards;`}
  img{width:100%;height:100%;object-fit:cover;transition:transform .5s var(--ease);}
  &:hover img{transform:scale(1.06);}
  &::after{content:'⤢';position:absolute;inset:0;background:rgba(193,57,43,.15);
    display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:white;
    opacity:0;transition:opacity .28s;} 
  &:hover::after{opacity:1;}
`;

/* Lightbox */
const LbO = styled.div`
  position:fixed;inset:0;z-index:1000;background:rgba(44,36,22,.93);
  display:flex;align-items:center;justify-content:center;padding:1.5rem;
  animation:${scaleIn} .28s var(--ease) forwards;cursor:zoom-out;
`;
const LbImg = styled.img`max-width:90vw;max-height:85vh;object-fit:contain;border-radius:var(--radius-sm);box-shadow:0 32px 80px rgba(0,0,0,.5);cursor:default;`;
const LbBtn = styled.button`
  position:fixed;top:50%;transform:translateY(-50%);
  ${p=>p.$d==='prev'?'left:1rem':'right:1rem'};
  background:rgba(250,246,240,.12);border:1px solid rgba(255,255,255,.18);
  color:white;width:44px;height:44px;border-radius:50%;font-size:1.3rem;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:background .2s;
  &:hover{background:rgba(193,57,43,.45);}
  @media(max-width:580px){display:none;}
`;
const LbClose = styled.button`
  position:fixed;top:1.2rem;right:1.2rem;
  background:rgba(250,246,240,.1);border:1px solid rgba(255,255,255,.18);
  color:white;width:40px;height:40px;border-radius:50%;font-size:1.1rem;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  &:hover{background:rgba(193,57,43,.45);}
`;
const LbCount = styled.p`
  position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);
  font-family:var(--font-b);font-size:.65rem;letter-spacing:.15em;color:rgba(255,255,255,.4);
`;

function Gallery(){
  const{content}=useWedding();
  /* Admin: gallery.images[]{url, caption} */
  const g=content?.gallery||{};
  const[ref,v]=useInView();
  const[modal,setModal]=useState(null);

  const rawImgs=g.images?.length?g.images:DEMO.map((url,i)=>({url,id:i}));
  const imgs=rawImgs.map(img=>typeof img==='string'?img:(img.url||img.thumbnail_url));

  useEffect(()=>{
    if(modal===null)return;
    const fn=e=>{
      if(e.key==='ArrowLeft')setModal(i=>(i-1+imgs.length)%imgs.length);
      if(e.key==='ArrowRight')setModal(i=>(i+1)%imgs.length);
      if(e.key==='Escape')setModal(null);
    };
    window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn);
  },[modal,imgs.length]);

  return(
    <S id="gallery" data-theme-light ref={ref}>
      <Inner>
        <Hdr $v={v}>
          <Eyebrow>unsere momente</Eyebrow>
          <H2>{g.title||'Galerie'}</H2>
        </Hdr>
        <Grid>
          {imgs.map((url,i)=>(
            <Thumb key={i} $i={i} $v={v} $feat={i===0} onClick={()=>setModal(i)}>
              <img src={optimizedUrl.thumb(url)} alt="" loading="lazy"/>
            </Thumb>
          ))}
        </Grid>
      </Inner>
      {modal!==null&&(
        <LbO onClick={()=>setModal(null)}>
          <LbImg src={optimizedUrl.hero(imgs[modal])} alt="" onClick={e=>e.stopPropagation()}/>
          <LbBtn $d="prev" onClick={e=>{e.stopPropagation();setModal(i=>(i-1+imgs.length)%imgs.length);}}>‹</LbBtn>
          <LbBtn $d="next" onClick={e=>{e.stopPropagation();setModal(i=>(i+1)%imgs.length);}}>›</LbBtn>
          <LbClose onClick={()=>setModal(null)}>×</LbClose>
          <LbCount>{modal+1} / {imgs.length}</LbCount>
        </LbO>
      )}
    </S>
  );
}
export default Gallery;
