// Neon ArchivePage - Cyberpunk Archive mit Supabase-Daten
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import PhotoUpload from './PhotoUpload';
import Footer from './Footer';

const NeonGlobalStyles = createGlobalStyle`
  :root {
    --neon-cyan: #00ffff;
    --neon-pink: #ff00ff;
    --neon-green: #00ff88;
    --neon-purple: #b347ff;
    --neon-bg: #0a0a0f;
  }
`;

// Animations
const glowPulse = keyframes`
  0%, 100% { text-shadow: 0 0 10px currentColor, 0 0 20px currentColor; }
  50% { text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor; }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.7; }
  94% { opacity: 1; }
  96% { opacity: 0.8; }
  97% { opacity: 1; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Page = styled.div`
  min-height: 100vh;
  background: var(--neon-bg);
  position: relative;
  overflow: hidden;
`;

const GridOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
`;

const Scanline = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.1), transparent);
  animation: ${scanline} 8s linear infinite;
  pointer-events: none;
  z-index: 1;
`;

const FloatingHeart = styled.div`
  position: fixed;
  font-size: 2rem;
  color: var(--neon-pink);
  opacity: 0.3;
  animation: ${float} ${p => p.$duration || '4s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  text-shadow: 0 0 20px var(--neon-pink);
  z-index: 0;
  pointer-events: none;
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 5vw;
  position: relative;
  z-index: 2;
`;

const HeroContent = styled.div`
  max-width: 900px;
`;

const Badge = styled.div`
  display: inline-block;
  padding: 10px 25px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid var(--neon-green);
  color: var(--neon-green);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  margin-bottom: 30px;
  animation: ${glowPulse} 2s infinite;
  &::before { content: '✓ '; }
`;

const HeroTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  animation: ${flicker} 4s infinite;
  
  span {
    color: var(--neon-cyan);
    text-shadow: 0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan);
  }
`;

const ThankYouText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto 30px;
`;

const DateLocation = styled.p`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  color: var(--neon-pink);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

// Section
const Section = styled.section`
  padding: clamp(4rem, 8vw, 8rem) 5vw;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeUp} 0.8s ease forwards;`}
  
  span {
    color: var(--neon-cyan);
    text-shadow: 0 0 15px var(--neon-cyan);
  }
`;

const SectionSubtitle = styled.p`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: var(--neon-pink);
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeUp} 0.8s ease forwards; animation-delay: 0.1s;`}
`;

// Gallery Grid
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeUp} 0.8s ease forwards; animation-delay: 0.2s;`}
  
  @media (max-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.3);
  
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
    transition: all 0.5s ease;
    filter: saturate(0.8);
  }
  
  &:hover {
    border-color: var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    
    img {
      transform: scale(1.05);
      filter: saturate(1.2);
    }
  }
`;

// Component
function ArchivePage() {
  const { content, project, weddingDate } = useWedding();
  const archiveData = content?.archive || {};
  const heroData = content?.hero || {};
  
  // Daten aus Supabase
  const name1 = project?.partner1_name || 'Alex';
  const name2 = project?.partner2_name || 'Jordan';
  const location = project?.location || heroData.location_short || '';
  const thankYouTitle = archiveData.thank_you_title || 'Danke!';
  const thankYouText = archiveData.thank_you_text || 'Ein herzliches Dankeschön an alle, die diesen besonderen Tag mit uns gefeiert haben!';
  
  // Archiv-Galerie Bilder
  const archiveGalleryImages = archiveData.gallery_images || [];
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
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
      <NeonGlobalStyles />
      <Page>
        <GridOverlay />
        <Scanline />
        
        {/* Floating Hearts */}
        <FloatingHeart style={{ top: '20%', left: '10%' }} $duration="4s" $delay="0s">♥</FloatingHeart>
        <FloatingHeart style={{ top: '30%', right: '15%' }} $duration="5s" $delay="1s">♥</FloatingHeart>
        <FloatingHeart style={{ top: '60%', left: '5%' }} $duration="3.5s" $delay="0.5s">♥</FloatingHeart>
        <FloatingHeart style={{ top: '70%', right: '8%' }} $duration="4.5s" $delay="1.5s">♥</FloatingHeart>
        
        {/* Hero */}
        <HeroSection>
          <HeroContent>
            <Badge>{thankYouTitle}</Badge>
            <HeroTitle>
              <span>{name1}</span> & <span>{name2}</span>
            </HeroTitle>
            <ThankYouText>{thankYouText}</ThankYouText>
            {(formatDate(weddingDate) || location) && (
              <DateLocation>
                {formatDate(weddingDate)}{formatDate(weddingDate) && location && ' • '}{location}
              </DateLocation>
            )}
          </HeroContent>
        </HeroSection>
        
        {/* Archiv-Galerie */}
        {archiveGalleryImages.length > 0 && (
          <Section ref={galleryRef}>
            <SectionHeader>
              <SectionTitle $visible={galleryVisible}>
                <span>//</span> Galerie
              </SectionTitle>
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
          </Section>
        )}
        
        {/* PhotoUpload für Gäste */}
        <Section ref={uploadRef} style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
          <SectionHeader>
            <SectionTitle $visible={uploadVisible}>
              <span>//</span> Eure Fotos
            </SectionTitle>
            <SectionSubtitle $visible={uploadVisible}>Teilt eure Erinnerungen mit uns</SectionSubtitle>
          </SectionHeader>
          <PhotoUpload />
        </Section>
        
        <Footer />
      </Page>
    </>
  );
}

export default ArchivePage;
