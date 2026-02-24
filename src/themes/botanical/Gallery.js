import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const imageReveal = keyframes`
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.1s;
  `}
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  
  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 2rem;
    margin: 0 -1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const GalleryItem = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  background: rgba(255, 255, 255, 0.05);
  
  /* Create varying heights for masonry effect */
  &:nth-child(5n+1) { grid-row: span 2; }
  &:nth-child(7n+4) { grid-row: span 2; }
  
  ${p => p.$visible && css`
    animation: ${imageReveal} 0.6s ease forwards;
    animation-delay: ${0.1 + p.$index * 0.05}s;
  `}
  
  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  
  &:nth-child(5n+1)::before,
  &:nth-child(7n+4)::before {
    padding-top: 200%;
  }
  
  @media (max-width: 500px) {
    flex-shrink: 0;
    width: 70vw;
    max-width: 280px;
    scroll-snap-align: start;
    
    &:nth-child(5n+1),
    &:nth-child(7n+4) {
      grid-row: span 1;
    }
    
    &::before,
    &:nth-child(5n+1)::before,
    &:nth-child(7n+4)::before {
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
  filter: brightness(0.85);
  transition: all 0.5s ease;
  
  ${GalleryItem}:hover & {
    filter: brightness(1);
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  
  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

const ImageCaption = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 6, 4, 0.98);
  backdrop-filter: blur(30px);
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
  border-radius: 8px;
  opacity: 0;
  
  ${p => p.$loaded && css`
    animation: ${fadeIn} 0.3s ease forwards;
  `}
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: var(--text-light);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$prev ? 'left: 2rem;' : 'right: 2rem;'}
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: var(--text-light);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    ${p => p.$prev ? 'left: 1rem;' : 'right: 1rem;'}
  }
`;

const LightboxCounter = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--text-muted);
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
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--text-muted);
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
  const [imageLoaded, setImageLoaded] = useState(false);
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
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setImageLoaded(false);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    setImageLoaded(false);
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
                  src={optimizedUrl.thumb(image.url || image)}
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
        <LightboxNav 
          $prev 
          onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
        >
          ←
        </LightboxNav>
        <LightboxImage
          src={optimizedUrl.card(items[lightboxIndex]?.url || items[lightboxIndex])}
          alt=""
          onClick={(e) => e.stopPropagation()}
          onLoad={() => setImageLoaded(true)}
          $loaded={imageLoaded}
        />
        <LightboxNav 
          onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
        >
          →
        </LightboxNav>
        <LightboxCounter>
          {lightboxIndex + 1} / {items.length}
        </LightboxCounter>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
