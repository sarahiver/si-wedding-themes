// Luxe Gallery - Elegant Masonry-Style Grid
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-white);
`;

const Container = styled.div`
  max-width: var(--container-width);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: 0;
  animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-black);
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  aspect-ratio: ${p => p.$tall ? '3/4' : p.$wide ? '4/3' : '1/1'};
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards;
  animation-delay: ${p => 0.1 + p.$index * 0.08}s;
  
  /* Make some items span 2 rows */
  &:nth-child(4n + 1) {
    grid-row: span 2;
    aspect-ratio: 3/5;
    
    @media (max-width: 768px) {
      grid-row: span 1;
      aspect-ratio: 1/1;
    }
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &:hover div {
    opacity: 1;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: var(--luxe-sand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 2rem;
  color: var(--luxe-taupe);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: var(--luxe-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const OverlayIcon = styled.span`
  color: var(--luxe-white);
  font-size: 1.5rem;
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.4s ease;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 2rem;
  color: var(--luxe-white);
  
  &:hover {
    color: var(--luxe-gold);
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: var(--luxe-white);
  padding: 1rem;
  
  &:hover {
    color: var(--luxe-gold);
  }
  
  &.prev { left: 1rem; }
  &.next { right: 1rem; }
`;

function Gallery() {
  const { content } = useWedding();
  const galleryData = content?.gallery || {};
  
  const title = galleryData.title || 'Galerie';
  const images = galleryData.images || [];
  
  const [visible, setVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);

  const defaultImages = Array(9).fill({ url: '', caption: '' });
  const galleryImages = images.length > 0 ? images : defaultImages;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigate = (dir) => {
    setCurrentIndex(prev => (prev + dir + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen]);

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Momente</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <GalleryGrid>
          {galleryImages.map((img, i) => (
            <GalleryItem 
              key={i} 
              $visible={visible} 
              $index={i}
              onClick={() => img.url && openLightbox(i)}
            >
              {img.url ? (
                <GalleryImage src={img.url} alt={img.caption || `Bild ${i + 1}`} />
              ) : (
                <Placeholder>✦</Placeholder>
              )}
              {img.url && (
                <Overlay>
                  <OverlayIcon>+</OverlayIcon>
                </Overlay>
              )}
            </GalleryItem>
          ))}
        </GalleryGrid>
      </Container>
      
      <Lightbox $open={lightboxOpen} onClick={closeLightbox}>
        {galleryImages[currentIndex]?.url && (
          <LightboxImage 
            src={galleryImages[currentIndex].url} 
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <LightboxClose onClick={closeLightbox}>×</LightboxClose>
        <LightboxNav className="prev" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>‹</LightboxNav>
        <LightboxNav className="next" onClick={(e) => { e.stopPropagation(); navigate(1); }}>›</LightboxNav>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
