import { useWedding } from '../../context/WeddingContext';
// src/components/Gallery.js
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Section = styled.section`
  padding: 150px 5%;
  background: #FAF8F5;
  position: relative;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.5);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #1A1A1A;

  span {
    font-style: italic;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 250px);
  gap: 15px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 200px);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: scale(${p => p.$visible ? 1 : 0.9});
  transition: all 0.6s ease ${p => p.$delay}s;

  &:nth-child(1) {
    grid-column: span 2;
    grid-row: span 2;
  }

  &:nth-child(5) {
    grid-column: span 2;
  }

  @media (max-width: 700px) {
    &:nth-child(1), &:nth-child(5) {
      grid-column: span 1;
      grid-row: span 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(26, 26, 26, 0);
    transition: background 0.3s ease;
  }

  &:hover::after {
    background: rgba(26, 26, 26, 0.3);
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
`;

const ViewIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  font-size: 1.5rem;

  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: ${fadeIn} 0.3s ease;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #FFFFFF;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$direction === 'prev' ? 'left: 30px;' : 'right: 30px;'}
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #FFFFFF;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LightboxCounter = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
`;

function Gallery() {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
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
      if (e.key === 'ArrowRight') setCurrentImage(prev => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentImage(prev => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Placeholder images - replace with actual wedding photos
  const images = [
    'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
    'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
    'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
    'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
    'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
    'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
    'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
    'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
  ];

  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Galerie</Eyebrow>
          <Title>Unsere schönsten <span>Momente</span></Title>
        </Header>

        <GalleryGrid>
          {images.map((image, index) => (
            <GalleryItem 
              key={index} 
              $visible={isVisible}
              $delay={0.1 + index * 0.05}
              onClick={() => openLightbox(index)}
            >
              <Image src={image} alt={`Galerie Bild ${index + 1}`} />
              <ViewIcon>+</ViewIcon>
            </GalleryItem>
          ))}
        </GalleryGrid>
      </Container>

      {lightboxOpen && (
        <Lightbox onClick={closeLightbox}>
          <LightboxClose onClick={closeLightbox}>×</LightboxClose>
          <LightboxNav 
            $direction="prev" 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage(prev => (prev - 1 + images.length) % images.length);
            }}
          >
            ←
          </LightboxNav>
          <LightboxImage 
            src={images[currentImage]} 
            alt="Lightbox"
            onClick={(e) => e.stopPropagation()}
          />
          <LightboxNav 
            $direction="next"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage(prev => (prev + 1) % images.length);
            }}
          >
            →
          </LightboxNav>
          <LightboxCounter>{currentImage + 1} / {images.length}</LightboxCounter>
        </Lightbox>
      )}
    </Section>
  );
}

export default Gallery;
