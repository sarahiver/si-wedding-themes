// Contemporary Gallery - Morphing Bars with Lightbox
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

const morph1 = keyframes`
  0%, 100% { 
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: translateY(0) rotate(0deg);
  }
  25% { 
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% { 
    border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%;
    transform: translateY(-10px) rotate(2deg);
  }
  75% { 
    border-radius: 40% 30% 60% 50% / 60% 50% 40% 30%;
  }
`;

const morph2 = keyframes`
  0%, 100% { 
    border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%;
    transform: translateY(0) rotate(0deg);
  }
  33% { 
    border-radius: 60% 40% 40% 60% / 40% 60% 40% 60%;
    transform: translateY(-8px) rotate(-1deg);
  }
  66% { 
    border-radius: 30% 70% 50% 50% / 50% 50% 50% 50%;
    transform: translateY(5px) rotate(1deg);
  }
`;

const morph3 = keyframes`
  0%, 100% { 
    border-radius: 50% 50% 40% 60% / 40% 60% 50% 50%;
    transform: translateY(0) rotate(0deg);
  }
  50% { 
    border-radius: 70% 30% 60% 40% / 60% 40% 60% 40%;
    transform: translateY(-12px) rotate(-2deg);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--gray-100);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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

const BarsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 3vw, 2rem);
  min-height: 500px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    min-height: auto;
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--purple)'];
const animations = [morph1, morph2, morph3];

const Bar = styled.div`
  width: clamp(150px, 25vw, 280px);
  height: clamp(350px, 50vh, 500px);
  background: ${p => p.$hasImages 
    ? `linear-gradient(180deg, ${colors[p.$index % 3]} 0%, ${colors[(p.$index + 1) % 3]} 100%)`
    : colors[p.$index % 3]};
  border: 4px solid var(--black);
  box-shadow: 8px 8px 0 var(--black);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${p => animations[p.$index % 3]} ${p => 8 + p.$index * 2}s ease-in-out infinite;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 12px 12px 0 var(--black);
  }
  
  @media (max-width: 768px) {
    width: 90%;
    max-width: 300px;
    height: 250px;
  }
`;

const BarContent = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: ${p => `repeat(${Math.min(p.$count, 4)}, 1fr)`};
  gap: 4px;
  padding: 4px;
`;

const ImageSlot = styled.div`
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'rgba(0,0,0,0.1)'};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    z-index: 1;
  }
`;

const PlaceholderContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--white);
  text-shadow: 2px 2px 0 var(--black);
`;

const PlaceholderEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const PlaceholderText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const BarLabel = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--black);
  color: var(--white);
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border: 6px solid var(--white);
  box-shadow: 0 0 60px rgba(255,255,255,0.1);
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: var(--coral);
  border: 4px solid var(--white);
  color: var(--white);
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--white);
    color: var(--black);
    transform: rotate(90deg);
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 80px;
  background: var(--white);
  border: 4px solid var(--black);
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${p => p.$direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  
  &:hover {
    background: var(--yellow);
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: 600px) {
    width: 50px;
    height: 60px;
    ${p => p.$direction === 'prev' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
  }
`;

const LightboxCounter = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--black);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  border: 3px solid var(--white);
`;

function Gallery() {
  const { content } = useWedding();
  const galleryData = content?.gallery || {};
  
  const title = galleryData.title || 'Galerie';
  const images = galleryData.images || [];
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Split images into 3 bars
  const imagesPerBar = Math.ceil(images.length / 3);
  const bars = [
    images.slice(0, imagesPerBar),
    images.slice(imagesPerBar, imagesPerBar * 2),
    images.slice(imagesPerBar * 2),
  ];

  const placeholders = [
    { emoji: '📸', text: 'Memories' },
    { emoji: '💕', text: 'Love' },
    { emoji: '✨', text: 'Magic' },
  ];

  const openLightbox = (barIndex, imageIndex) => {
    if (images.length === 0) return;
    const globalIndex = barIndex * imagesPerBar + imageIndex;
    setCurrentIndex(globalIndex);
    setLightboxOpen(true);
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

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, currentIndex]);

  return (
    <Section id="gallery">
      <Container>
        <Header>
          <Eyebrow>📸 Unsere Momente</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <BarsContainer>
          {bars.map((barImages, barIndex) => (
            <Bar 
              key={barIndex} 
              $index={barIndex}
              $hasImages={barImages.length > 0}
            >
              {barImages.length > 0 ? (
                <BarContent $count={barImages.length}>
                  {barImages.slice(0, 4).map((img, imgIndex) => (
                    <ImageSlot 
                      key={imgIndex}
                      $image={optimizedUrl.thumb(img.url || img)}
                      onClick={() => openLightbox(barIndex, imgIndex)}
                    />
                  ))}
                </BarContent>
              ) : (
                <PlaceholderContent>
                  <PlaceholderEmoji>{placeholders[barIndex].emoji}</PlaceholderEmoji>
                  <PlaceholderText>{placeholders[barIndex].text}</PlaceholderText>
                </PlaceholderContent>
              )}
              {barImages.length > 4 && (
                <BarLabel>+{barImages.length - 4} mehr</BarLabel>
              )}
            </Bar>
          ))}
        </BarsContainer>
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
