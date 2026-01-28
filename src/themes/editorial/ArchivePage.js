import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import EditorialGlobalStyles from './GlobalStyles';

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
  0% { 
    opacity: 0; 
    transform: translateY(100%);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const imageReveal = keyframes`
  from { 
    opacity: 0;
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  }
  to { 
    opacity: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Page = styled.div`
  min-height: 100vh;
  background: var(--editorial-white);
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: var(--editorial-black);
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
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  padding: 4rem clamp(1.5rem, 5vw, 4rem);
  max-width: 1400px;
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

const HeroSubtitle = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  max-width: 500px;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.5s;
`;

// Content Sections
const Section = styled.section`
  padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem);
  background: ${p => p.$dark ? 'var(--editorial-black)' : 'var(--editorial-white)'};
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  margin-bottom: clamp(3rem, 6vw, 5rem);
  ${p => p.$centered && 'text-align: center;'}
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
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const SectionTitle = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 700;
  color: ${p => p.$light ? 'var(--editorial-white)' : 'var(--editorial-black)'};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

// Photo Gallery
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
  
  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
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

// Thank You Message
const ThankYouSection = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const ThankYouText = styled.p`
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
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 0.3s;
  `}
`;

// Footer
const FooterSection = styled.footer`
  padding: 3rem clamp(1.5rem, 5vw, 4rem);
  background: var(--editorial-black);
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterText = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
`;

// ============================================
// COMPONENT
// ============================================

function ArchivePage() {
  const { content, coupleNames, weddingDate } = useWedding();
  const archiveData = content?.archive || {};
  const galleryData = content?.gallery || {};
  
  const heroImage = archiveData.hero_image || 
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600';
  const thankYouMessage = archiveData.thank_you_message || 
    'Danke, dass ihr diesen besonderen Tag mit uns gefeiert habt. Die Erinnerungen an diesen Tag werden uns für immer begleiten.';
  const photos = galleryData.images || [];
  
  // Parse couple names
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Braut', 'Bräutigam'];
  const name1 = names[0] || 'Braut';
  const name2 = names[1] || 'Bräutigam';
  
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
  
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const galleryRef = useRef(null);
  const thankYouRef = useRef(null);

  useEffect(() => {
    const observers = [];
    
    if (galleryRef.current) {
      const galleryObserver = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setGalleryVisible(true); },
        { threshold: 0.1 }
      );
      galleryObserver.observe(galleryRef.current);
      observers.push(galleryObserver);
    }
    
    if (thankYouRef.current) {
      const thankYouObserver = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setThankYouVisible(true); },
        { threshold: 0.2 }
      );
      thankYouObserver.observe(thankYouRef.current);
      observers.push(thankYouObserver);
    }
    
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  // Animate title letters
  const renderAnimatedTitle = (text) => {
    let delay = 0.8;
    return text.split('').map((letter, i) => {
      const style = { animationDelay: `${delay + i * 0.04}s` };
      return (
        <span key={i} className="letter" style={style}>
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      );
    });
  };

  return (
    <>
      <EditorialGlobalStyles />
      <Page>
        {/* Hero */}
        <HeroSection>
          <HeroBackground $image={heroImage} />
          <HeroContent>
            <Eyebrow>Rückblick</Eyebrow>
            <HeroTitle>
              {renderAnimatedTitle(`${name1} & ${name2}`)}
            </HeroTitle>
            <HeroSubtitle>
              {formatDate(weddingDate)} — Der schönste Tag unseres Lebens
            </HeroSubtitle>
          </HeroContent>
        </HeroSection>
        
        {/* Gallery */}
        {photos.length > 0 && (
          <Section ref={galleryRef}>
            <Container>
              <SectionHeader $centered>
                <SectionEyebrow $visible={galleryVisible}>Erinnerungen</SectionEyebrow>
                <SectionTitle $visible={galleryVisible}>Galerie</SectionTitle>
              </SectionHeader>
              
              <GalleryGrid $visible={galleryVisible}>
                {photos.slice(0, 12).map((photo, i) => (
                  <GalleryItem key={i}>
                    <img 
                      src={photo.url || photo} 
                      alt={`Hochzeitsfoto ${i + 1}`} 
                      loading="lazy"
                    />
                  </GalleryItem>
                ))}
              </GalleryGrid>
            </Container>
          </Section>
        )}
        
        {/* Thank You */}
        <Section $dark ref={thankYouRef}>
          <Container>
            <ThankYouSection $visible={thankYouVisible}>
              <SectionEyebrow $visible={thankYouVisible}>Von Herzen</SectionEyebrow>
              <SectionTitle $visible={thankYouVisible} $light>Danke</SectionTitle>
              <Divider $visible={thankYouVisible} />
              <ThankYouText>{thankYouMessage}</ThankYouText>
              <Signature>{name1} & {name2}</Signature>
            </ThankYouSection>
          </Container>
        </Section>
        
        {/* Footer */}
        <FooterSection>
          <FooterText>
            © {new Date().getFullYear()} {name1} & {name2} — Powered by IverLasting
          </FooterText>
        </FooterSection>
      </Page>
    </>
  );
}

export default ArchivePage;
