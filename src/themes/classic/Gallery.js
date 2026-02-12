import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Section = styled.section`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: var(--classic-white);`;
const Header = styled.div`text-align: center; max-width: 600px; margin: 0 auto 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.6rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; color: var(--classic-charcoal);`;

const Grid = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  column-count: 3;
  column-gap: 1rem;
  @media (max-width: 768px) { column-count: 2; }
  @media (max-width: 480px) { column-count: 1; }
`;

const Item = styled.div`
  break-inside: avoid;
  margin-bottom: 1rem;
  cursor: pointer;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$delay}s;
  
  img {
    width: 100%;
    display: block;
    transition: transform 0.6s ease;
  }
  &:hover img { transform: scale(1.03); }
`;

const Lightbox = styled.div`
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.95);
  display: flex; align-items: center; justify-content: center;
  animation: ${fadeIn} 0.3s ease;
  cursor: pointer;
  padding: 2rem;
  
  img { max-width: 90%; max-height: 90vh; object-fit: contain; }
`;

const Close = styled.button`
  position: absolute; top: 1.5rem; right: 1.5rem;
  background: none; border: none;
  color: white; font-size: 1.5rem; cursor: pointer;
`;

const NavBtn = styled.button`
  position: absolute; top: 50%; transform: translateY(-50%);
  ${p => p.$dir === 'prev' ? 'left: 1rem;' : 'right: 1rem;'}
  background: rgba(255,255,255,0.1); border: none;
  color: white; font-size: 1.5rem; width: 48px; height: 48px;
  cursor: pointer; border-radius: 50%;
  transition: background 0.3s ease;
  &:hover { background: rgba(255,255,255,0.2); }
`;

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
];

function Gallery() {
  const { content } = useWedding();
  const gal = content?.gallery || {};
  const images = gal.images?.length > 0 ? gal.images : DEFAULT_IMAGES.map(url => ({ url }));
  const [lightbox, setLightbox] = useState(null);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const nav = (dir) => {
    setLightbox(prev => {
      const next = prev + dir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  return (
    <Section id="gallery" ref={ref}>
      <Header>
        <Eyebrow>{gal.eyebrow || 'Galerie'}</Eyebrow>
        <Title>{gal.title || 'Unsere schönsten Momente'}</Title>
      </Header>
      <Grid>
        {images.map((img, i) => (
          <Item key={i} $visible={visible} $delay={i * 0.08} onClick={() => setLightbox(i)}>
            <img src={typeof img === 'string' ? img : img.url} alt={img.alt || `Foto ${i + 1}`} loading="lazy" />
          </Item>
        ))}
      </Grid>
      {lightbox !== null && (
        <Lightbox onClick={() => setLightbox(null)}>
          <Close onClick={() => setLightbox(null)}>✕</Close>
          <NavBtn $dir="prev" onClick={e => { e.stopPropagation(); nav(-1); }}>‹</NavBtn>
          <img src={typeof images[lightbox] === 'string' ? images[lightbox] : images[lightbox].url} alt="" onClick={e => e.stopPropagation()} />
          <NavBtn $dir="next" onClick={e => { e.stopPropagation(); nav(1); }}>›</NavBtn>
        </Lightbox>
      )}
    </Section>
  );
}

export default Gallery;
