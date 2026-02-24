// Editorial ArchivePage - Magazine Style mit Dashboard-Daten
// Zeigt: Hero + Danke, Archiv-Galerie (Paar-Fotos), PhotoUpload (Gäste laden hoch)
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
import EditorialGlobalStyles from './GlobalStyles';
import PhotoUpload from './PhotoUpload';
import Footer from './Footer';

// ============================================
// ANIMATIONS
// ============================================

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const letterReveal = keyframes`
  0% { opacity: 0; transform: translateY(100%); }
  100% { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Page = styled.div`
  min-height: 100vh;
  background: var(--editorial-black);
`;

const HeroSection = styled.section`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${p => p.$image ? `url(${p.$image})` : 'none'};
  background-size: cover;
  background-position: center;
  filter: grayscale(100%);
  opacity: 0;
  animation: ${fadeIn} 1.5s ease forwards;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  padding: 4rem clamp(1.5rem, 5vw, 4rem);
  max-width: 900px;
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
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.5s;
`;

const HeroTitle = styled.h1`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 12vw, 10rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.85;
  margin-bottom: 2rem;
  overflow: hidden;
  
  .letter {
    display: inline-block;
    opacity: 0;
    animation: ${letterReveal} 0.5s ease forwards;
  }
`;

const ThankYouText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.5s;
`;

const DateLocation = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.8s;
`;

const Section = styled.section`
  padding: clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem);
  background: ${p => p.$light ? 'var(--editorial-white)' : 'var(--editorial-black)'};
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const SectionEyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const SectionTitle = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: ${p => p.$light ? 'var(--editorial-black)' : 'var(--editorial-white)'};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}
`;

const SectionSubtitle = styled.p`
  font-family: var(--font-body);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 500px;
  margin: 0 auto;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.4s;`}
`;

// Archiv-Galerie Grid (eigene Bilder vom Paar)
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.3s;`}
  
  @media (max-width: 1000px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
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
    filter: grayscale(100%);
    transition: all 0.5s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: var(--editorial-red);
  margin: 2rem auto;
  transform: scaleX(0);
  ${p => p.$visible && css`animation: ${lineGrow} 0.6s ease forwards; animation-delay: 0.3s;`}
`;

// ============================================
// COMPONENT
// ============================================

function ArchivePage() {
  const { content, project, weddingDate } = useWedding();
  const heroData = content?.hero || {};
  const archiveData = content?.archive || {};
  
  // Namen
  const name1 = project?.partner1_name || 'Braut';
  const name2 = project?.partner2_name || 'Bräutigam';
  const location = project?.location || heroData.location_short || '';
  
  // Archive-Content
  const thankYouTitle = archiveData.thank_you_title || 'Danke!';
  const thankYouText = archiveData.thank_you_text || 'Danke, dass ihr diesen besonderen Tag mit uns gefeiert habt.';
  const heroImage = archiveData.hero_image || heroData.background_image;
  
  // Archiv-Galerie Bilder (EIGENE, nicht normale gallery)
  const archiveGalleryImages = archiveData.gallery_images || [];
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  // Visibility states
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

  // Animate title letters
  const renderAnimatedTitle = (text) => {
    let delay = 0.8;
    return text.split('').map((letter, i) => (
      <span key={i} className="letter" style={{ animationDelay: `${delay + i * 0.04}s` }}>
        {letter === ' ' ? '\u00A0' : letter}
      </span>
    ));
  };

  return (
    <>
      <EditorialGlobalStyles />
      <Page>
        {/* Hero mit Danke */}
        <HeroSection>
          <HeroBackground $image={optimizedUrl.hero(heroImage)} />
          <HeroContent>
            <Eyebrow>{thankYouTitle}</Eyebrow>
            <HeroTitle>
              {renderAnimatedTitle(`${name1} & ${name2}`)}
            </HeroTitle>
            <ThankYouText>{thankYouText}</ThankYouText>
            {(formatDate(weddingDate) || location) && (
              <DateLocation>
                {formatDate(weddingDate)}{formatDate(weddingDate) && location && ' · '}{location}
              </DateLocation>
            )}
          </HeroContent>
        </HeroSection>
        
        {/* Archiv-Galerie (Paar-Fotos) */}
        {archiveGalleryImages.length > 0 && (
          <Section $light ref={galleryRef}>
            <Container>
              <SectionHeader>
                <SectionEyebrow $visible={galleryVisible}>Erinnerungen</SectionEyebrow>
                <SectionTitle $visible={galleryVisible} $light>Galerie</SectionTitle>
              </SectionHeader>
              
              <GalleryGrid $visible={galleryVisible}>
                {archiveGalleryImages.map((img, i) => (
                  <GalleryItem key={i}>
                    <img 
                      src={optimizedUrl.thumb(typeof img === 'string' ? img : img.url)}
                      alt={`Hochzeitsfoto ${i + 1}`} 
                      loading="lazy"
                    />
                  </GalleryItem>
                ))}
              </GalleryGrid>
            </Container>
          </Section>
        )}
        
        {/* PhotoUpload für Gäste - Fotos werden NICHT angezeigt, nur hochgeladen */}
        <Section ref={uploadRef}>
          <Container>
            <SectionHeader>
              <SectionEyebrow $visible={uploadVisible}>Eure Momente</SectionEyebrow>
              <SectionTitle $visible={uploadVisible}>Fotos teilen</SectionTitle>
              <Divider $visible={uploadVisible} />
              <SectionSubtitle $visible={uploadVisible}>
                Habt ihr Fotos von unserer Hochzeit? Teilt sie mit uns!
              </SectionSubtitle>
            </SectionHeader>
            
            <PhotoUpload />
          </Container>
        </Section>
        
        <Footer />
      </Page>
    </>
  );
}

export default ArchivePage;
