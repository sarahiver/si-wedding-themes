// Luxe Gallery - Cinematic Grid with Lightbox
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const scaleReveal = keyframes`from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: scale(1); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-anthracite);`;
const Container = styled.div`max-width: var(--container-max); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const GridItem = styled.div`
  position: relative;
  aspect-ratio: ${p => p.$tall ? '3/4' : '1/1'};
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  animation: ${p => p.$visible ? css`${scaleReveal} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => 0.1 + p.$index * 0.05}s;
  
  &:nth-child(4n+1) { grid-row: span 2; aspect-ratio: 3/5; @media (max-width: 900px) { grid-row: span 1; aspect-ratio: 1/1; } }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--luxe-void);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::after { opacity: 0.3; }
  &:hover img { transform: scale(1.05); }
`;

const GridImage = styled.img`width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s var(--ease-out-expo);`;
const Placeholder = styled.div`width: 100%; height: 100%; background: var(--luxe-charcoal); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 2rem; font-style: italic; color: var(--luxe-graphite);`;

const Lightbox = styled.div`position: fixed; inset: 0; background: rgba(10, 10, 10, 0.97); z-index: 2000; display: flex; align-items: center; justify-content: center; opacity: ${p => p.$open ? 1 : 0}; visibility: ${p => p.$open ? 'visible' : 'hidden'}; transition: all 0.4s ease;`;
const LightboxImage = styled.img`max-width: 90%; max-height: 90vh; object-fit: contain;`;
const LightboxClose = styled.button`position: absolute; top: 2rem; right: 2rem; font-size: 2rem; color: var(--luxe-cream); &:hover { color: var(--luxe-gold); }`;
const LightboxNav = styled.button`position: absolute; top: 50%; transform: translateY(-50%); font-size: 2.5rem; color: var(--luxe-cream); padding: 1rem; &:hover { color: var(--luxe-gold); } &.prev { left: 1rem; } &.next { right: 1rem; }`;

function Gallery() {
  const { content } = useWedding();
  const data = content?.gallery || {};
  const title = data.title || 'Galerie';
  const images = data.images || Array(9).fill({ url: '', caption: '' });
  
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (i) => { if (images[i]?.url) { setLightbox({ open: true, index: i }); document.body.style.overflow = 'hidden'; } };
  const closeLightbox = () => { setLightbox({ ...lightbox, open: false }); document.body.style.overflow = ''; };
  const navigate = (dir) => setLightbox(prev => ({ ...prev, index: (prev.index + dir + images.length) % images.length }));

  useEffect(() => {
    const handleKey = (e) => { if (!lightbox.open) return; if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') navigate(-1); if (e.key === 'ArrowRight') navigate(1); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox.open]);

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header><Eyebrow $visible={visible}>Momente</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Grid>
          {images.map((img, i) => (
            <GridItem key={i} $visible={visible} $index={i} onClick={() => openLightbox(i)}>
              {img.url ? <GridImage src={img.url} alt={img.caption || `Bild ${i+1}`} /> : <Placeholder>✦</Placeholder>}
            </GridItem>
          ))}
        </Grid>
      </Container>
      
      <Lightbox $open={lightbox.open} onClick={closeLightbox}>
        {images[lightbox.index]?.url && <LightboxImage src={images[lightbox.index].url} alt="" onClick={e => e.stopPropagation()} />}
        <LightboxClose onClick={closeLightbox}>×</LightboxClose>
        <LightboxNav className="prev" onClick={e => { e.stopPropagation(); navigate(-1); }}>‹</LightboxNav>
        <LightboxNav className="next" onClick={e => { e.stopPropagation(); navigate(1); }}>›</LightboxNav>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
