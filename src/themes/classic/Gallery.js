import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Hdr = styled.div`text-align:center;margin-bottom:3rem;`;
const Eye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:var(--c-accent);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;

/* Flexbox masonry - no fixed grid, smaller previews, thin white borders */
const Grid = styled.div`
  max-width:var(--content-w);margin:0 auto;
  display:flex;flex-wrap:wrap;gap:4px;justify-content:center;
`;
const Item = styled.div`
  flex:0 0 auto;width:${p=>p.$w||'180px'};overflow:hidden;
  border:3px solid white;box-shadow:0 4px 15px rgba(0,0,0,0.05);
  cursor:pointer;transition:all 0.4s;
  &:hover{box-shadow:0 8px 25px rgba(0,0,0,0.1);transform:translateY(-2px);}
  img{width:100%;aspect-ratio:${p=>p.$ratio||'1'};object-fit:cover;
    filter:grayscale(100%);transition:filter 0.5s, transform 0.5s;}
  &:hover img{filter:grayscale(0%);transform:scale(1.04);}
`;
const Modal = styled.div`position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.9);
  display:flex;align-items:center;justify-content:center;padding:2rem;cursor:pointer;
  opacity:${p=>p.$o?1:0};pointer-events:${p=>p.$o?'auto':'none'};transition:opacity 0.3s;
  img{max-width:90%;max-height:90vh;object-fit:contain;}`;

const DIMS=[{w:'220px',r:'4/5'},{w:'170px',r:'1'},{w:'200px',r:'3/4'},{w:'160px',r:'1'},{w:'240px',r:'4/3'},{w:'180px',r:'3/4'},{w:'190px',r:'1'}];
const DIMGS=[
  'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg',
];

function Gallery(){
  const{content}=useWedding();const g=content?.gallery||{};const[ref,v]=useInView();
  const[modal,setModal]=useState(null);
  const images=g.images?.length?g.images:DIMGS.map((url,i)=>({url,id:i}));
  return(
    <S id="gallery" data-theme-light ref={ref}>
      <Hdr><Eye>Impressionen</Eye><Title>{g.title||'Galerie'}</Title></Hdr>
      <Grid>
        {images.map((img,i)=>{const d=DIMS[i%DIMS.length];const url=typeof img==='string'?img:img.url||img.thumbnail_url;
          return(<Item key={img.id||i} $w={d.w} $ratio={d.r} onClick={()=>setModal(url)}>
            <img src={url} alt="" loading="lazy"/></Item>);})}
      </Grid>
      <Modal $o={!!modal} onClick={()=>setModal(null)}>{modal&&<img src={modal} alt=""/>}</Modal>
    </S>);
}
export default Gallery;
