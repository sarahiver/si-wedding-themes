import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const imageReveal = keyframes`
  from { 
    opacity: 0;
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  }
  to { 
    opacity: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-black);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 2rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  
  /* Create varying heights for masonry effect */
  &:nth-child(4n+1) { grid-row: span 2; }
  &:nth-child(6n+3) { grid-row: span 2; }
  
  ${p => p.$visible && css`
    animation: ${imageReveal} 0.8s ease forwards;
    animation-delay: ${0.1 + p.$index * 0.05}s;
  `}
  
  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  
  &:nth-child(4n+1)::before,
  &:nth-child(6n+3)::before {
    padding-top: 200%;
  }
  
  @media (max-width: 768px) {
    flex-shrink: 0;
    width: 75vw;
    max-width: 300px;
    scroll-snap-align: start;
    
    &:nth-child(4n+1),
    &:nth-child(6n+3) {
      grid-row: span 1;
    }
    
    &::before,
    &:nth-child(4n+1)::before,
    &:nth-child(6n+3)::before {
      padding-top: 120%;
    }
  }
`;

const GalleryImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: all 0.5s ease;
  
  ${GalleryItem}:hover & {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  
  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

const ImageCaption = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--editorial-white);
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
  padding: 2rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  ${p => p.$open && css`
    opacity: 1;
    visibility: visible;
  `}
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: transparent;
  border: 2px solid var(--editorial-white);
  color: var(--editorial-white);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--editorial-red);
    border-color: var(--editorial-red);
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$prev ? 'left: 2rem;' : 'right: 2rem;'}
  width: 50px;
  height: 50px;
  background: transparent;
  border: 2px solid var(--editorial-white);
  color: var(--editorial-white);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--editorial-red);
    border-color: var(--editorial-red);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const EmptyIcon = styled.span`
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
`;

// ============================================
// COMPONENT
// ============================================

function Gallery() {
  const { content } = useWedding();
  const galleryData = content?.gallery || {};
  
  const title = galleryData.title || 'Galerie';
  const images = galleryData.images || [];
  
  const [visible, setVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sectionRef = useRef(null);

  const defaultImages = [
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', caption: 'Verlobung' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', caption: 'Unser Moment' },
    { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', caption: 'Zusammen' },
    { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', caption: 'Unterwegs' },
    { url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800', caption: 'Am Meer' },
    { url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800', caption: 'Der Antrag' },
    { url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800', caption: 'Glücklich' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', caption: 'Wir zwei' },
  ];

  const items = images.length > 0 ? images : defaultImages;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    setLightboxIndex(prev => {
      const newIndex = prev + direction;
      if (newIndex < 0) return items.length - 1;
      if (newIndex >= items.length) return 0;
      return newIndex;
    });
  };

  return (
    <Section id="gallery" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Erinnerungen</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        {items.length > 0 ? (
          <GalleryGrid>
            {items.map((image, i) => (
              <GalleryItem 
                key={i} 
                $visible={visible} 
                $index={i}
                onClick={() => openLightbox(i)}
              >
                <GalleryImage 
                  src={image.url || image} 
                  alt={image.caption || `Bild ${i + 1}`} 
                  loading="lazy"
                />
                {image.caption && (
                  <ImageOverlay>
                    <ImageCaption>{image.caption}</ImageCaption>
                  </ImageOverlay>
                )}
              </GalleryItem>
            ))}
          </GalleryGrid>
        ) : (
          <EmptyState $visible={visible}>
            <EmptyIcon>📷</EmptyIcon>
            <EmptyText>Fotos folgen bald...</EmptyText>
          </EmptyState>
        )}
      </Container>
      
      <Lightbox $open={lightboxOpen} onClick={closeLightbox}>
        <LightboxClose onClick={closeLightbox}>×</LightboxClose>
        <LightboxNav $prev onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}>←</LightboxNav>
        <LightboxImage 
          src={items[lightboxIndex]?.url || items[lightboxIndex]} 
          alt="" 
          onClick={(e) => e.stopPropagation()}
        />
        <LightboxNav onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}>→</LightboxNav>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
