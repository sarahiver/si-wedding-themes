// Luxe ArchivePage - Elegant Archive mit Supabase-Daten
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import LuxeGlobalStyles from './GlobalStyles';
import Gallery from './Gallery';
import PhotoUpload from './PhotoUpload';
import Guestbook from './Guestbook';
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
`;

const SectionSubtitle = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-gold);
`;

// Component
function ArchivePage() {
  const { content, project, weddingDate } = useWedding();
  const heroData = content?.hero || {};
  const archiveData = content?.archive || {};
  
  // Namen aus project
  const name1 = project?.partner1_name || 'Alexandra';
  const name2 = project?.partner2_name || 'Benjamin';
  const location = project?.location || heroData.location || '';
  
  // Archive-spezifische Daten
  const thankYouTitle = archiveData.thank_you_title || 'Danke!';
  const thankYouText = archiveData.thank_you_text || 'Danke, dass ihr diesen besonderen Tag mit uns gefeiert habt. Die Erinnerungen werden uns für immer begleiten.';
  const backgroundImage = archiveData.hero_image || heroData.background_image;
  
  // Was wird angezeigt?
  const showGallery = archiveData.gallery_active !== false;
  const showGuestbook = archiveData.guestbook_active !== false;
  const showPhotoUpload = archiveData.photoupload_active !== false;
  
  // Format date
  const formattedDate = weddingDate 
    ? new Date(weddingDate).toLocaleDateString('de-DE', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : '';

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

        {/* Gallery */}
        {showGallery && (
          <Section>
            <SectionHeader>
              <SectionTitle>Unsere Erinnerungen</SectionTitle>
              <SectionSubtitle>Momente unserer Feier</SectionSubtitle>
            </SectionHeader>
            <Gallery />
          </Section>
        )}

        {/* Photo Upload */}
        {showPhotoUpload && (
          <Section $alt>
            <SectionHeader>
              <SectionTitle>Eure Fotos</SectionTitle>
              <SectionSubtitle>Teilt eure Erinnerungen mit uns</SectionSubtitle>
            </SectionHeader>
            <PhotoUpload />
          </Section>
        )}

        {/* Guestbook */}
        {showGuestbook && (
          <Section>
            <SectionHeader>
              <SectionTitle>Gästebuch</SectionTitle>
              <SectionSubtitle>Eure Wünsche und Grüße</SectionSubtitle>
            </SectionHeader>
            <Guestbook />
          </Section>
        )}

        <Footer />
      </Page>
    </>
  );
}

export default ArchivePage;
