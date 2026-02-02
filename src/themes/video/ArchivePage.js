// Video ArchivePage - Hero (Danke) + Archiv-Galerie + PhotoUpload + Footer
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import VideoGlobalStyles from './GlobalStyles';
import Hero from './Hero';
import PhotoUpload from './PhotoUpload';
import Footer from './Footer';
import { useWedding } from '../../context/WeddingContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Section = styled.section`
  padding: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 4rem);
  background: var(--video-black);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--video-white);
  margin-bottom: 0.5rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeUp} 0.8s ease forwards;`}
`;

const SectionSubtitle = styled.p`
  font-family: var(--font-accent);
  font-size: 1rem;
  font-style: italic;
  color: var(--video-silver);
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeUp} 0.8s ease forwards; animation-delay: 0.1s;`}
`;

// Archiv-Galerie Grid
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeIn} 1s ease forwards; animation-delay: 0.2s;`}
  
  @media (max-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  
  &:nth-child(5n+1) {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
    transition: all 0.5s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

// Component
function ArchivePage() {
  const { content } = useWedding();
  const archiveData = content?.archive || {};
  
  // Archiv-Galerie Bilder (EIGENE, nicht normale gallery)
  const archiveGalleryImages = archiveData.gallery_images || [];
  
  // Visibility
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const galleryRef = useRef(null);
  const uploadRef = useRef(null);

  useEffect(() => {
    const observers = [];
    
    if (galleryRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setGalleryVisible(true); },
        { threshold: 0.1 }
      );
      obs.observe(galleryRef.current);
      observers.push(obs);
    }
    
    if (uploadRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setUploadVisible(true); },
        { threshold: 0.1 }
      );
      obs.observe(uploadRef.current);
      observers.push(obs);
    }
    
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  return (
    <>
      <VideoGlobalStyles />
      <Hero isArchive={true} />
      
      {/* Archiv-Galerie (Paar-Fotos) */}
      {archiveGalleryImages.length > 0 && (
        <Section ref={galleryRef}>
          <Container>
            <SectionHeader>
              <SectionTitle $visible={galleryVisible}>Galerie</SectionTitle>
              <SectionSubtitle $visible={galleryVisible}>Unsere schönsten Momente</SectionSubtitle>
            </SectionHeader>
            
            <GalleryGrid $visible={galleryVisible}>
              {archiveGalleryImages.map((img, i) => (
                <GalleryItem key={i}>
                  <img 
                    src={typeof img === 'string' ? img : img.url} 
                    alt={`Hochzeitsfoto ${i + 1}`} 
                    loading="lazy"
                  />
                </GalleryItem>
              ))}
            </GalleryGrid>
          </Container>
        </Section>
      )}
      
      {/* PhotoUpload für Gäste */}
      <Section ref={uploadRef} style={{ background: 'var(--video-charcoal, #1a1a1a)' }}>
        <Container>
          <SectionHeader>
            <SectionTitle $visible={uploadVisible}>Eure Fotos</SectionTitle>
            <SectionSubtitle $visible={uploadVisible}>Teilt eure Erinnerungen mit uns</SectionSubtitle>
          </SectionHeader>
          <PhotoUpload />
        </Container>
      </Section>
      
      <Footer />
    </>
  );
}

export default ArchivePage;
