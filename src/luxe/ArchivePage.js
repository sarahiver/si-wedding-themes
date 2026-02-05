// Luxe ArchivePage - Elegant Archive mit Supabase-Daten
// Zeigt: Hero + Danke, Archiv-Galerie (Paar-Fotos), PhotoUpload (Gäste laden hoch)
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import LuxeGlobalStyles from './GlobalStyles';
import PhotoUpload from './PhotoUpload';
import Footer from './Footer';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const revealText = keyframes`
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
`;

const expandLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// Styled Components
const Page = styled.div`
  min-height: 100vh;
  background: var(--luxe-void);
`;

const HeroSection = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background: ${p => p.$image ? `url(${p.$image})` : 'linear-gradient(135deg, var(--luxe-charcoal) 0%, var(--luxe-void) 100%)'};
  background-size: cover;
  background-position: center;
  opacity: 0.4;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.8) 100%);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
`;

const GoldLine = styled.div`
  width: 60px;
  height: 1px;
  background: var(--luxe-gold);
  margin: 0 auto 2rem;
  transform-origin: center;
  animation: ${expandLine} 1s var(--ease-out-expo) forwards;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${slideUp} 0.8s ease forwards;
  animation-delay: 0.3s;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 10vw, 6rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-cream);
  line-height: 1;
  margin-bottom: 1.5rem;
  overflow: hidden;
  
  span {
    display: inline-block;
    transform: translateY(110%);
    animation: ${revealText} 1.2s var(--ease-out-expo) forwards;
    animation-delay: 0.5s;
  }
`;

const ThankYouText = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-style: italic;
  color: var(--luxe-pearl);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 0.8s;
`;

const DateLocation = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-pearl);
  opacity: 0;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 1s;
`;

const Section = styled.section`
  padding: clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem);
  background: ${p => p.$alt ? 'var(--luxe-charcoal)' : 'var(--luxe-void)'};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-cream);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${slideUp} 0.8s ease forwards;`}
`;

const SectionSubtitle = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  opacity: 0;
  ${p => p.$visible && css`animation: ${slideUp} 0.8s ease forwards; animation-delay: 0.15s;`}
`;

// Archiv-Galerie (eigene Bilder)
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeIn} 1s ease forwards; animation-delay: 0.3s;`}
  
  @media (max-width: 1000px) { grid-template-columns: repeat(3, 1fr); }
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
    transition: transform 0.6s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

// Component
function ArchivePage() {
  const { content, project, weddingDate } = useWedding();
  const heroData = content?.hero || {};
  const archiveData = content?.archive || {};
  
  // Namen
  const name1 = project?.partner1_name || 'Alexandra';
  const name2 = project?.partner2_name || 'Benjamin';
  const location = project?.location || heroData.location || '';
  
  // Archive-Content
  const thankYouTitle = archiveData.thank_you_title || 'Danke!';
  const thankYouText = archiveData.thank_you_text || 'Danke, dass ihr diesen besonderen Tag mit uns gefeiert habt.';
  const backgroundImage = archiveData.hero_image || heroData.background_image;
  
  // Archiv-Galerie Bilder (EIGENE, nicht normale gallery)
  const archiveGalleryImages = archiveData.gallery_images || [];
  
  // Format date
  const formattedDate = weddingDate 
    ? new Date(weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  
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

  return (
    <>
      <LuxeGlobalStyles />
      <Page>
        {/* Hero */}
        <HeroSection>
          <HeroBackground $image={backgroundImage} />
          <HeroContent>
            <GoldLine />
            <Eyebrow>{thankYouTitle}</Eyebrow>
            <Title><span>{name1} & {name2}</span></Title>
            <ThankYouText>{thankYouText}</ThankYouText>
            {(formattedDate || location) && (
              <DateLocation>
                {formattedDate}{formattedDate && location && ' · '}{location}
              </DateLocation>
            )}
          </HeroContent>
        </HeroSection>

        {/* Archiv-Galerie (Paar-Fotos) */}
        {archiveGalleryImages.length > 0 && (
          <Section ref={galleryRef}>
            <SectionHeader>
              <SectionTitle $visible={galleryVisible}>Unsere Erinnerungen</SectionTitle>
              <SectionSubtitle $visible={galleryVisible}>Momente unserer Feier</SectionSubtitle>
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
        <Section $alt ref={uploadRef}>
          <SectionHeader>
            <SectionTitle $visible={uploadVisible}>Eure Fotos</SectionTitle>
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
