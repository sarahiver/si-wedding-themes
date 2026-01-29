// Botanical Gallery - Organic Pebble Mosaic
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const morph = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  33% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  66% { border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%; }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(180deg, var(--bg-cream) 0%, var(--bg-moss) 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--text-light);
  max-width: 500px;
  margin: 1rem auto 0;
`;

// Organic pebble shapes for different positions
const pebbleShapes = [
  '60% 40% 50% 50% / 50% 50% 40% 60%',
  '50% 50% 40% 60% / 60% 40% 50% 50%',
  '40% 60% 60% 40% / 50% 50% 50% 50%',
  '55% 45% 45% 55% / 45% 55% 55% 45%',
  '65% 35% 40% 60% / 55% 45% 50% 50%',
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    
    /* Make every 4th item span 2 columns */
    > *:nth-child(4n+1) {
      grid-column: span 2;
      
      @media (max-width: 900px) {
        grid-column: span 1;
      }
    }
  }
`;

const ImageCard = styled.div`
  position: relative;
  aspect-ratio: ${p => p.$large ? '16/9' : '1'};
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover` 
    : `linear-gradient(135deg, var(--green-mint) 0%, var(--green-sage) 100%)`};
  border-radius: ${p => pebbleShapes[p.$index % pebbleShapes.length]};
  cursor: pointer;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: all 0.5s var(--ease-nature);
  animation: ${breathe} ${p => 6 + (p.$index % 3)}s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.2}s;
  
  &:hover {
    transform: scale(1.03) translateY(-5px);
    box-shadow: var(--shadow-deep);
    border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
    
    .overlay {
      opacity: 1;
    }
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    0deg,
    rgba(45, 94, 54, 0.7) 0%,
    transparent 50%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: inherit;
`;

const ViewButton = styled.span`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--bg-cream);
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(5px);
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.3);
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 3rem;
  color: var(--green-forest);
  opacity: 0.6;
  
  span {
    font-family: var(--font-body);
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(29, 43, 26, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
  padding: 2rem;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--bg-cream);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--green-forest);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(90deg) scale(1.1);
    background: var(--green-mint);
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--bg-cream);
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${p => p.$direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  
  &:hover {
    background: var(--green-mint);
    color: var(--green-forest);
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: 600px) {
    ${p => p.$direction === 'prev' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
    width: 40px;
    height: 40px;
  }
`;

const LightboxCounter = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--bg-cream);
  background: rgba(0,0,0,0.3);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
`;

function Gallery() {
  const { content } = useWedding();
  const galleryData = content?.gallery || {};
  
  const title = galleryData.title || 'Galerie';
  const images = galleryData.images || [];
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const placeholders = [
    { emoji: '📸', text: 'Foto 1' },
    { emoji: '💕', text: 'Foto 2' },
    { emoji: '🌿', text: 'Foto 3' },
    { emoji: '🌸', text: 'Foto 4' },
    { emoji: '✨', text: 'Foto 5' },
    { emoji: '🦋', text: 'Foto 6' },
  ];

  const displayImages = images.length > 0 
    ? images 
    : placeholders.map((p, i) => ({ placeholder: true, ...p, index: i }));

  const openLightbox = (index) => {
    if (images.length > 0) {
      setCurrentIndex(index);
      setLightboxOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

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
    <Section id="gallery">
      <Container>
        <Header>
          <Eyebrow>📸 Erinnerungen</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>Momente, die wir für immer festhalten möchten</Subtitle>
        </Header>
        
        <Grid>
          {displayImages.map((item, index) => (
            <ImageCard 
              key={index}
              $index={index}
              $image={item.url || item.image}
              $large={index % 4 === 0}
              onClick={() => openLightbox(index)}
            >
              {item.placeholder ? (
                <Placeholder>
                  {item.emoji}
                  <span>{item.text}</span>
                </Placeholder>
              ) : (
                <ImageOverlay className="overlay">
                  <ViewButton>Ansehen 🌿</ViewButton>
                </ImageOverlay>
              )}
            </ImageCard>
          ))}
        </Grid>
      </Container>
      
      {lightboxOpen && images.length > 0 && (
        <Lightbox onClick={closeLightbox}>
          <LightboxClose onClick={closeLightbox}>×</LightboxClose>
          <LightboxNav $direction="prev" onClick={goPrev}>←</LightboxNav>
          <LightboxImage 
            src={images[currentIndex]?.url || images[currentIndex]} 
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <LightboxNav $direction="next" onClick={goNext}>→</LightboxNav>
          <LightboxCounter>{currentIndex + 1} / {images.length}</LightboxCounter>
        </Lightbox>
      )}
    </Section>
  );
}

export default Gallery;
