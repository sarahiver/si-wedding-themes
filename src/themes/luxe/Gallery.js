// Luxe Gallery - Cinematic Grid + Mobile Carousel with Lightbox
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const scaleReveal = keyframes`from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: scale(1); }`;

const Section = styled.section`overflow: hidden; padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-anthracite);`;
const Container = styled.div`max-width: var(--container-max); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 calc(-1 * var(--section-padding-x));
    padding: 0 var(--section-padding-x);
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const GridItem = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  animation: ${p => p.$visible ? css`${scaleReveal} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => 0.1 + p.$index * 0.05}s;

  &:nth-child(4n+1) { grid-row: span 2; aspect-ratio: 3/5; }
  @media (max-width: 900px) { &:nth-child(4n+1) { grid-row: span 1; aspect-ratio: 1/1; } }

  @media (max-width: 768px) {
    flex: 0 0 80vw;
    max-width: 80vw;
    aspect-ratio: 3/4 !important;
    scroll-snap-align: center;
    grid-row: span 1 !important;
  }

  &::after { content: ''; position: absolute; inset: 0; background: var(--luxe-void); opacity: 0; transition: opacity 0.4s ease; }
  &:hover::after { opacity: 0.3; }
  &:hover img { transform: scale(1.05); }
`;

const GridImage = styled.img`width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s var(--ease-out-expo);`;
const Placeholder = styled.div`width: 100%; height: 100%; background: var(--luxe-charcoal); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 2rem; font-style: italic; color: var(--luxe-graphite);`;

const ScrollDots = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }
`;
const Dot = styled.span`width: 6px; height: 6px; border-radius: 50%; background: ${p => p.$active ? 'var(--luxe-gold)' : 'var(--luxe-graphite)'}; transition: background 0.3s ease;`;

const Lightbox = styled.div`position: fixed; inset: 0; background: rgba(10,10,10,0.97); z-index: 2000; display: flex; align-items: center; justify-content: center; opacity: ${p => p.$open ? 1 : 0}; visibility: ${p => p.$open ? 'visible' : 'hidden'}; transition: all 0.4s ease;`;
const LightboxImage = styled.img`max-width: 90%; max-height: 90vh; object-fit: contain;`;
const LightboxClose = styled.button`position: absolute; top: 2rem; right: 2rem; font-size: 2rem; color: var(--luxe-cream); &:hover { color: var(--luxe-gold); }`;
const LightboxNav = styled.button`position: absolute; top: 50%; transform: translateY(-50%); font-size: 2.5rem; color: var(--luxe-cream); padding: 1rem; &:hover { color: var(--luxe-gold); } &.prev { left: 1rem; } &.next { right: 1rem; }`;
const LightboxCounter = styled.div`position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.2em; color: var(--luxe-slate);`;

function Gallery() {
  const { content } = useWedding();
  const data = content?.gallery || {};
  const title = data.title || 'Galerie';

  const defaultImages = [
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', caption: 'Verlobung' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', caption: 'Unser Moment' },
    { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', caption: 'Zusammen' },
    { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', caption: 'Unterwegs' },
    { url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800', caption: 'Am Meer' },
    { url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800', caption: 'Der Antrag' },
  ];

  const rawImages = Array.isArray(data.images) && data.images.length > 0 ? data.images : defaultImages;
  const images = rawImages.map(img => typeof img === 'string' ? { url: img, caption: '' } : img);

  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const child = el.firstChild;
      if (!child) return;
      const itemW = child.offsetWidth + 12;
      setActiveSlide(Math.round(el.scrollLeft / itemW));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const getImageUrl = (img) => img?.url || img || '';
  const openLightbox = (i) => { if (getImageUrl(images[i])) { setLightbox({ open: true, index: i }); document.body.style.overflow = 'hidden'; } };
  const closeLightbox = () => { setLightbox(prev => ({ ...prev, open: false })); document.body.style.overflow = ''; };
  const nav = (dir) => setLightbox(prev => ({ ...prev, index: (prev.index + dir + images.length) % images.length }));

  useEffect(() => {
    const handleKey = (e) => { if (!lightbox.open) return; if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') nav(-1); if (e.key === 'ArrowRight') nav(1); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox.open]);

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header><Eyebrow $visible={visible}>Momente</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Grid ref={scrollRef}>
          {images.map((img, i) => {
            const url = getImageUrl(img);
            return (
              <GridItem key={i} $visible={visible} $index={i} onClick={() => openLightbox(i)}>
                {url ? <GridImage src={url} alt={img.caption || `Bild ${i+1}`} loading="lazy" /> : <Placeholder>✦</Placeholder>}
              </GridItem>
            );
          })}
        </Grid>
        <ScrollDots>
          {images.map((_, i) => <Dot key={i} $active={i === activeSlide} />)}
        </ScrollDots>
      </Container>

      <Lightbox $open={lightbox.open} onClick={closeLightbox}>
        {getImageUrl(images[lightbox.index]) && <LightboxImage src={getImageUrl(images[lightbox.index])} alt="" onClick={e => e.stopPropagation()} />}
        <LightboxClose onClick={closeLightbox}>×</LightboxClose>
        <LightboxNav className="prev" onClick={e => { e.stopPropagation(); nav(-1); }}>‹</LightboxNav>
        <LightboxNav className="next" onClick={e => { e.stopPropagation(); nav(1); }}>›</LightboxNav>
        <LightboxCounter>{lightbox.index + 1} / {images.length}</LightboxCounter>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
