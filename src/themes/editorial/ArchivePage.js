// Editorial ArchivePage - Magazine Style mit Dashboard-Daten
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import EditorialGlobalStyles from './GlobalStyles';
import Gallery from './Gallery';
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

// Hero Section
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
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
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

// Section
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

// Danke Section
const ThankYouSection = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const ThankYouMessage = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const Signature = styled.p`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
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
  
  // Namen aus project
  const name1 = project?.partner1_name || 'Braut';
  const name2 = project?.partner2_name || 'Bräutigam';
  const location = project?.location || heroData.location_short || '';
  
  // Archive-spezifische Daten aus Dashboard
  const thankYouTitle = archiveData.thank_you_title || 'Danke!';
  const thankYouText = archiveData.thank_you_text || 'Danke, dass ihr diesen besonderen Tag mit uns gefeiert habt. Die Erinnerungen werden uns für immer begleiten.';
  // Hero-Bild: Archive eigenes Bild, sonst normales Hero-Bild
  const heroImage = archiveData.hero_image || heroData.background_image;
  
  // Was wird angezeigt? (aus Dashboard Checkboxen)
  const showGallery = archiveData.gallery_active !== false;
  // Gästebuch und PhotoUpload werden hier NICHT angezeigt - nur im Admin als Download
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Visibility states
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const galleryRef = useRef(null);
  const thankYouRef = useRef(null);

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
    
    if (thankYouRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setThankYouVisible(true); },
        { threshold: 0.2 }
      );
      obs.observe(thankYouRef.current);
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
        {/* Hero mit Danke-Titel */}
        <HeroSection>
          <HeroBackground $image={heroImage} />
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
        
        {/* Galerie - Fotos vom Paar hochgeladen */}
        {showGallery && (
          <Section $light ref={galleryRef}>
            <Container>
              <SectionHeader>
                <SectionEyebrow $visible={galleryVisible}>Erinnerungen</SectionEyebrow>
                <SectionTitle $visible={galleryVisible} $light>Galerie</SectionTitle>
              </SectionHeader>
              <Gallery />
            </Container>
          </Section>
        )}
        
        {/* Danke Section am Ende */}
        <Section ref={thankYouRef}>
          <Container>
            <ThankYouSection $visible={thankYouVisible}>
              <SectionEyebrow $visible={thankYouVisible}>Von Herzen</SectionEyebrow>
              <SectionTitle $visible={thankYouVisible}>Danke</SectionTitle>
              <Divider $visible={thankYouVisible} />
              <ThankYouMessage>{thankYouText}</ThankYouMessage>
              <Signature>{name1} & {name2}</Signature>
            </ThankYouSection>
          </Container>
        </Section>
        
        <Footer />
      </Page>
    </>
  );
}

export default ArchivePage;
