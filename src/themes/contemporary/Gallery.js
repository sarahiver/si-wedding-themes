// Contemporary Gallery - Brutalist Grid
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--gray-100);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)', 'var(--pink)'];

const ImageCard = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : colors[p.$index % colors.length]};
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: var(--shadow-xl);
  }
  
  &:nth-child(5n + 1) {
    grid-row: span 2;
    
    @media (max-width: 600px) {
      grid-row: span 1;
    }
  }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  border: 4px solid var(--white);
  box-shadow: var(--shadow-xl);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--coral);
  border: 3px solid var(--white);
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  
  &:hover {
    background: var(--white);
    color: var(--black);
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: var(--white);
  border: 3px solid var(--black);
  font-size: 1.5rem;
  cursor: pointer;
  
  ${p => p.$direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  
  &:hover {
    background: var(--yellow);
  }
  
  @media (max-width: 600px) {
    ${p => p.$direction === 'prev' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
    width: 40px;
    height: 40px;
  }
`;

function Gallery() {
  const { content } = useWedding();
  const galleryData = content?.gallery || {};
  
  const title = galleryData.title || 'Galerie';
  const images = galleryData.images || [];
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const placeholders = ['📸', '💕', '🎉', '💒', '🥂', '🎊', '✨', '💐'];
  
  const displayImages = images.length > 0 
    ? images 
    : placeholders.map((emoji, i) => ({ emoji, index: i }));

  const openLightbox = (index) => {
    if (images.length > 0) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => setLightboxOpen(false);
  
  const goNext = () => setCurrentIndex((currentIndex + 1) % images.length);
  const goPrev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  // Keyboard navigation
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
          <Eyebrow>📸 Unsere Momente</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {displayImages.map((item, index) => (
            <ImageCard 
              key={index} 
              $index={index}
              $image={item.url}
              onClick={() => openLightbox(index)}
            >
              {!item.url && <Placeholder>{item.emoji}</Placeholder>}
            </ImageCard>
          ))}
        </Grid>
      </Container>
      
      {lightboxOpen && images.length > 0 && (
        <Lightbox onClick={closeLightbox}>
          <CloseButton onClick={closeLightbox}>×</CloseButton>
          <NavButton $direction="prev" onClick={(e) => { e.stopPropagation(); goPrev(); }}>←</NavButton>
          <LightboxImage 
            src={images[currentIndex]?.url} 
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <NavButton $direction="next" onClick={(e) => { e.stopPropagation(); goNext(); }}>→</NavButton>
        </Lightbox>
      )}
    </Section>
  );
}

export default Gallery;
