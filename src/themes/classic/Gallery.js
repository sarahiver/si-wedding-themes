import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Hdr = styled.div`text-align:center;margin-bottom:3rem;`;
const Eye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:var(--c-accent);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;

/* Grid with proper spacing, never touching screen edges */
const Grid = styled.div`
  max-width:var(--content-w,1200px);margin:0 auto;
  display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;
  @media(max-width:768px){grid-template-columns:repeat(2,1fr);}
  @media(max-width:500px){grid-template-columns:1fr;}
`;
const Item = styled.div`
  overflow:hidden;border:3px solid white;box-shadow:0 4px 15px rgba(0,0,0,0.06);
  cursor:pointer;transition:all 0.4s;
  &:hover{box-shadow:0 8px 25px rgba(0,0,0,0.1);transform:translateY(-2px);}
  img{width:100%;aspect-ratio:${p=>p.$ratio||'4/3'};object-fit:cover;
    filter:grayscale(100%);transition:filter 0.5s, transform 0.5s;}
  &:hover img{filter:grayscale(0%);transform:scale(1.03);}
`;
/* Feature image spanning 2 cols */
const FeatureItem = styled(Item)`
  grid-column:span 2;
  @media(max-width:500px){grid-column:span 1;}
  img{aspect-ratio:16/9;}
`;

const Modal = styled.div`position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.92);
  display:flex;align-items:center;justify-content:center;padding:2rem;cursor:pointer;
  opacity:${p=>p.$o?1:0};pointer-events:${p=>p.$o?'auto':'none'};transition:opacity 0.3s;
  img{max-width:90%;max-height:90vh;object-fit:contain;border:6px solid white;}`;

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
        {images.map((img,i)=>{
          const url=typeof img==='string'?img:img.url||img.thumbnail_url;
          const isFeature=i===0;
          const Comp=isFeature?FeatureItem:Item;
          return(<Comp key={img.id||i} $ratio={isFeature?'16/9':'4/3'} onClick={()=>setModal(url)}>
            <img src={optimizedUrl.thumb(url)} alt="" loading="lazy"/></Comp>);
        })}
      </Grid>
      <Modal $o={!!modal} onClick={()=>setModal(null)}>{modal&&<img src={optimizedUrl.card(modal)} alt=""/>}</Modal>
    </S>);
}
export default Gallery;
