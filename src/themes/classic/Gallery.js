import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const Section = styled.section`
  padding: clamp(5rem,12vh,10rem) clamp(2rem,6vw,6rem);
  background: var(--c-white); position: relative; z-index: 2;
`;
const Inner = styled.div`max-width: 1100px; margin: 0 auto;`;
const Hdr = styled.div`
  text-align: center; margin-bottom: clamp(3rem,6vw,5rem);
  opacity:0;
  ${p => p.$v && css`animation:${fadeUp} 0.8s var(--ease) forwards;`}
`;
const Eye = styled.p`font-size:0.45rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;

/* Magazine-style asymmetric grid */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
  @media(max-width:768px){ grid-template-columns: 1fr 1fr; }
  @media(max-width:500px){ grid-template-columns: 1fr; }
`;

const ImgWrap = styled.div`
  overflow: hidden; cursor: pointer;
  opacity:0;
  ${p => p.$v && css`animation:${fadeUp} 0.6s var(--ease) forwards; animation-delay:${p.$d};`}
  /* Alternating sizes for magazine feel */
  &:nth-child(1) { grid-column: span 5; }
  &:nth-child(2) { grid-column: span 4; }
  &:nth-child(3) { grid-column: span 3; }
  &:nth-child(4) { grid-column: span 3; }
  &:nth-child(5) { grid-column: span 5; }
  &:nth-child(6) { grid-column: span 4; }
  &:nth-child(n+7) { grid-column: span 4; }
  @media(max-width:768px){ &:nth-child(n) { grid-column: span 1; } }
  img {
    width: 100%; aspect-ratio: 4/5; object-fit: cover;
    filter: grayscale(30%);
    transition: all 0.5s var(--ease);
  }
  &:hover img { filter: grayscale(0%); transform: scale(1.02); }
`;

const LB = styled.div`
  position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.92);
  display:flex;align-items:center;justify-content:center;
  animation:${fadeIn} 0.3s ease;cursor:pointer;
  img{max-width:85vw;max-height:85vh;object-fit:contain;}
`;
const LBClose = styled.button`position:absolute;top:1.5rem;right:1.5rem;background:none;border:none;color:rgba(255,255,255,0.5);font-size:2rem;cursor:pointer;&:hover{color:#fff;}`;
const LBNav = styled.button`position:absolute;${p=>p.$d==='prev'?'left:1.5rem':'right:1.5rem'};top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,0.5);font-size:2rem;cursor:pointer;&:hover{color:#fff;}`;

const DEF = [
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/hr2mofharqklzu8yptxi.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/rg54tyya7phb75yg6dsk.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/uj61pv6uqigwyh5pidvi.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/gxmqpkk0ksnveevic9fp.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg',
];

function Gallery() {
  const { content } = useWedding();
  const gd = content?.gallery || {};
  const [ref, v] = useInView();
  const [lbIdx, setLbIdx] = useState(null);
  const title = gd.title || 'Galerie';
  const images = gd.images?.length ? gd.images : DEF;
  const getUrl = img => typeof img === 'string' ? img : img.url || img.src;

  useEffect(() => {
    if (lbIdx !== null) {
      const h = e => {
        if (e.key === 'Escape') setLbIdx(null);
        if (e.key === 'ArrowRight') setLbIdx(i => (i + 1) % images.length);
        if (e.key === 'ArrowLeft') setLbIdx(i => (i - 1 + images.length) % images.length);
      };
      window.addEventListener('keydown', h);
      document.body.style.overflow = 'hidden';
      return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
    }
  }, [lbIdx, images.length]);

  return (
    <Section id="gallery">
      <Inner>
        <Hdr ref={ref} $v={v}>
          <Eye>Impressionen</Eye>
          <Title>{title}</Title>
        </Hdr>
        <Grid>
          {images.map((img, i) => (
            <ImgWrap key={i} $v={v} $d={`${0.15 + (i % 6) * 0.08}s`} onClick={() => setLbIdx(i)}>
              <img src={getUrl(img)} alt={`Gallery ${i+1}`} loading="lazy" />
            </ImgWrap>
          ))}
        </Grid>
      </Inner>
      {lbIdx !== null && (
        <LB onClick={() => setLbIdx(null)}>
          <LBClose onClick={() => setLbIdx(null)}>×</LBClose>
          <LBNav $d="prev" onClick={e => { e.stopPropagation(); setLbIdx(i => (i-1+images.length)%images.length); }}>‹</LBNav>
          <img src={getUrl(images[lbIdx])} alt="" onClick={e => e.stopPropagation()} style={{filter:'none'}} />
          <LBNav $d="next" onClick={e => { e.stopPropagation(); setLbIdx(i => (i+1)%images.length); }}>›</LBNav>
        </LB>
      )}
    </Section>
  );
}
export default Gallery;
