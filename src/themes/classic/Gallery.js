import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const imgReveal = keyframes`from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0); }`;

const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-cream);`;
const Wrap = styled.div`max-width: var(--content-w); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: clamp(4rem, 8vw, 6rem);`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  @media(max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media(max-width: 480px) { grid-template-columns: 1fr; }
`;
const ImgItem = styled.div`
  overflow: hidden; cursor: pointer;
  grid-column: ${p => p.$span || 'auto'};
  grid-row: ${p => p.$rowSpan || 'auto'};
  opacity: 0;
  ${p => p.$v && css`animation: ${imgReveal} 1s var(--ease) forwards; animation-delay: ${p.$d};`}
  img {
    width: 100%; height: 100%; object-fit: cover;
    filter: ${p => p.$bw ? 'grayscale(100%)' : 'none'};
    transition: all 0.6s ease;
  }
  &:hover img { filter: grayscale(0%); transform: scale(1.03); }
  @media(max-width: 768px) { grid-column: auto; grid-row: auto; }
`;

const LB = styled.div`position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; animation: ${fadeIn} 0.3s; cursor: pointer; img { max-width: 90vw; max-height: 90vh; object-fit: contain; }`;
const LBClose = styled.button`position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: rgba(255,255,255,0.6); font-size: 2rem; cursor: pointer; &:hover { color: #fff; }`;
const LBNav = styled.button`position: absolute; ${p => p.$dir === 'prev' ? 'left: 1rem' : 'right: 1rem'}; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--c-gold); font-size: 2.5rem; cursor: pointer; &:hover { color: #fff; }`;

const DEFAULTS = [
  'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg',
];

// Asymmetric layout pattern
const PATTERN = [
  { span: 'span 2', rowSpan: 'span 2', bw: true },
  { bw: false }, { bw: true },
  { bw: false }, { bw: true },
  { span: 'span 2', bw: false },
  { bw: true },
];

function Gallery() {
  const { content } = useWedding();
  const gd = content?.gallery || {};
  const ref = useRef(null); const [v, setV] = useState(false);
  const [lbIdx, setLbIdx] = useState(null);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);

  const images = gd.images?.length ? gd.images : DEFAULTS;
  const getUrl = img => typeof img === 'string' ? img : img.url || img.src;

  useEffect(() => { if (lbIdx !== null) { const h = e => { if (e.key==='Escape') setLbIdx(null); if (e.key==='ArrowRight') setLbIdx(i => (i+1)%images.length); if (e.key==='ArrowLeft') setLbIdx(i => (i-1+images.length)%images.length); }; window.addEventListener('keydown', h); document.body.style.overflow = 'hidden'; return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; }; } }, [lbIdx, images.length]);

  return (
    <S id="gallery" ref={ref}><Wrap>
      <Header><Eye $v={v}>Impressionen</Eye><Title $v={v}>{gd.title || 'Galerie'}</Title></Header>
      <Grid>
        {images.map((img, i) => { const p = PATTERN[i % PATTERN.length]; return (
          <ImgItem key={i} $v={v} $d={`${0.15 + (i%6)*0.12}s`} $span={p.span} $rowSpan={p.rowSpan} $bw={p.bw} onClick={() => setLbIdx(i)}>
            <img src={getUrl(img)} alt={`Gallery ${i+1}`} loading="lazy" />
          </ImgItem>
        ); })}
      </Grid>
    </Wrap>
    {lbIdx !== null && <LB onClick={() => setLbIdx(null)}>
      <LBClose onClick={() => setLbIdx(null)}>×</LBClose>
      <LBNav $dir="prev" onClick={e => { e.stopPropagation(); setLbIdx(i => (i-1+images.length)%images.length); }}>‹</LBNav>
      <img src={getUrl(images[lbIdx])} alt="" onClick={e => e.stopPropagation()} />
      <LBNav $dir="next" onClick={e => { e.stopPropagation(); setLbIdx(i => (i+1)%images.length); }}>›</LBNav>
    </LB>}
    </S>
  );
}
export default Gallery;
