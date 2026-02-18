import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}`;

function useInView(th = 0.06) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [th]);
  return [r, v];
}

const DEMO = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75',
  'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=75',
  'https://images.unsplash.com/photo-1591604329141-c2b78069a79c?w=800&q=75',
  'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=75',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=75',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=75',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=75',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=75',
];

/* Accent border colors — rotating through jewel tones */
const ACCENTS = ['#C1392B', '#C17F24', '#8B6914', '#C1392B', '#C17F24', '#8B6914', '#C1392B', '#C17F24'];

const S = styled.section`
  padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem);
  background: var(--c-bg);
  position: relative;
  z-index: 2;
`;

const Inner = styled.div`
  max-width: var(--content-w);
  margin: 0 auto;
`;

const Hdr = styled.div`
  text-align: center;
  margin-bottom: clamp(2.5rem, 4vw, 4rem);
  opacity: 0;
  ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}
`;

const Eyebrow = styled.p`
  font-family: var(--font-s);
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  color: var(--c-accent);
  margin-bottom: 0.4rem;
`;

const H2 = styled.h2`
  font-family: var(--font-d);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  color: var(--c-text);
`;

/* Masonry-style grid */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;

  @media (max-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
`;

/* First item spans 2 columns — feature image */
const Thumb = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: var(--radius-sm);
  /* Colored accent border — Boho character */
  border: 3px solid ${p => ACCENTS[p.$i % ACCENTS.length]};
  aspect-ratio: ${p => p.$feature ? '16/9' : '1'};
  grid-column: ${p => p.$feature ? 'span 2' : 'span 1'};
  opacity: 0;
  ${p => p.$v && css`animation: ${fadeUp} 0.6s var(--ease) ${p.$i * 0.06}s forwards;`}

  img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.5s var(--ease);
  }

  &:hover img { transform: scale(1.06); }

  /* Hover overlay */
  &::after {
    content: '⤢';
    position: absolute;
    inset: 0;
    background: rgba(193,57,43,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover::after { opacity: 1; }
`;

/* Lightbox */
const LbOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(44, 36, 22, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: ${scaleIn} 0.3s var(--ease) forwards;
  cursor: zoom-out;
`;

const LbImg = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  cursor: default;
`;

const LbNav = styled.button`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$dir === 'prev' ? 'left: 1.5rem;' : 'right: 1.5rem;'}
  background: rgba(250,246,240,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  width: 48px; height: 48px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
  &:hover { background: rgba(193,57,43,0.5); }

  @media (max-width: 600px) { display: none; }
`;

const LbClose = styled.button`
  position: fixed;
  top: 1.5rem; right: 1.5rem;
  background: rgba(250,246,240,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  width: 44px; height: 44px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
  &:hover { background: rgba(193,57,43,0.5); }
`;

const LbCounter = styled.p`
  position: fixed;
  bottom: 2rem; left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-b);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.5);
`;

function Gallery() {
  const { content } = useWedding();
  const g = content?.gallery || {};
  const [ref, v] = useInView();
  const [modal, setModal] = useState(null); // index

  const rawImages = g.images?.length ? g.images : DEMO.map((url, i) => ({ url, id: i }));
  const images = rawImages.map(img => typeof img === 'string' ? img : img.url || img.thumbnail_url);

  const openModal = (i) => setModal(i);
  const closeModal = () => setModal(null);
  const prev = () => setModal(i => (i - 1 + images.length) % images.length);
  const next = () => setModal(i => (i + 1) % images.length);

  useEffect(() => {
    if (modal === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  return (
    <S id="gallery" data-theme-light ref={ref}>
      <Inner>
        <Hdr $v={v}>
          <Eyebrow>unsere momente</Eyebrow>
          <H2>{g.title || 'Galerie'}</H2>
        </Hdr>

        <Grid>
          {images.map((url, i) => (
            <Thumb
              key={i}
              $i={i}
              $v={v}
              $feature={i === 0}
              onClick={() => openModal(i)}
            >
              <img src={url} alt="" loading="lazy" />
            </Thumb>
          ))}
        </Grid>
      </Inner>

      {modal !== null && (
        <LbOverlay onClick={closeModal}>
          <LbImg src={images[modal]} alt="" onClick={e => e.stopPropagation()} />
          <LbNav $dir="prev" onClick={e => { e.stopPropagation(); prev(); }}>‹</LbNav>
          <LbNav $dir="next" onClick={e => { e.stopPropagation(); next(); }}>›</LbNav>
          <LbClose onClick={closeModal}>×</LbClose>
          <LbCounter>{modal + 1} / {images.length}</LbCounter>
        </LbOverlay>
      )}
    </S>
  );
}

export default Gallery;
