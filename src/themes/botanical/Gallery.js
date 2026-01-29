// Botanical Gallery - Clean minimal grid
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--forest-main);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 900px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-mist);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--cream);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImageCard = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover` 
    : 'var(--forest-light)'};
  cursor: ${p => p.$image ? 'pointer' : 'default'};
  transition: transform 0.4s var(--ease-smooth), opacity 0.4s ease;
  
  &:hover {
    transform: ${p => p.$image ? 'scale(1.02)' : 'none'};
  }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--forest-mist);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease;
  padding: 2rem;
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
  color: var(--cream);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$direction === 'prev' ? 'left: 1rem;' : 'right: 1rem;'}
  width: 50px;
  height: 50px;
  background: transparent;
  color: var(--cream);
  font-size: 2rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

function Gallery() {
  const { content } = useWedding();
  const galleryData = content?.gallery || {};
  
  const title = galleryData.title || 'Galerie';
  const images = galleryData.images || [];
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 
    ? images 
    : Array(6).fill(null);

  const openLightbox = (index) => {
    if (images.length > 0) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const goPrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, currentIndex]);

  return (
    <Section id="gallery" data-section="gallery">
      <Content>
        <Header>
          <Eyebrow>Erinnerungen</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {displayImages.map((img, index) => (
            <ImageCard 
              key={index}
              $image={img?.url || img}
              onClick={() => openLightbox(index)}
            >
              {!img && <Placeholder>Foto {index + 1}</Placeholder>}
            </ImageCard>
          ))}
        </Grid>
      </Content>
      
      {lightboxOpen && images.length > 0 && (
        <Lightbox onClick={closeLightbox}>
          <LightboxClose onClick={closeLightbox}>×</LightboxClose>
          {images.length > 1 && (
            <>
              <LightboxNav $direction="prev" onClick={goPrev}>‹</LightboxNav>
              <LightboxNav $direction="next" onClick={goNext}>›</LightboxNav>
            </>
          )}
          <LightboxImage 
            src={images[currentIndex]?.url || images[currentIndex]} 
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
        </Lightbox>
      )}
    </Section>
  );
}

export default Gallery;
