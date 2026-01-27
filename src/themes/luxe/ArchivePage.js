import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: var(--luxe-white, #FFFFFF);
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--luxe-cream, #FDFCFA);
  padding: 4rem 2rem;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 700px;
  animation: ${fadeIn} 1s ease;
`;

const GoldLine = styled.div`
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, var(--luxe-gold, #C8B88A), transparent);
  margin: 0 auto 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--luxe-text-muted, #9A9A9A);
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-family: var(--font-serif, 'Cormorant Garamond', serif);
  font-size: clamp(2.5rem, 7vw, 4rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-text-heading, #4A4A4A);
  margin-bottom: 1.5rem;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.9rem;
  line-height: 1.9;
  color: var(--luxe-text-light, #7A7A7A);
  max-width: 500px;
  margin: 0 auto 2rem;
`;

const DateLocation = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-text-muted, #9A9A9A);
`;

// Gallery Section
const Section = styled.section`
  padding: var(--section-padding, 6rem) 2rem;
  background: ${p => p.$alt ? 'var(--luxe-cream, #FDFCFA)' : 'var(--luxe-white, #FFFFFF)'};
`;

const Container = styled.div`
  max-width: var(--container-max, 1100px);
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-serif, 'Cormorant Garamond', serif);
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-text-heading, #4A4A4A);
  margin-bottom: 0.75rem;
`;

const SectionSubtitle = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.8rem;
  color: var(--luxe-text-muted, #9A9A9A);
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const GalleryItem = styled.div`
  aspect-ratio: 4/5;
  background: var(--luxe-cream, #FDFCFA);
  border: 1px solid var(--luxe-border, #ECEAE6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: 'Photo';
    font-family: var(--font-sans, 'Montserrat', sans-serif);
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--luxe-text-muted, #9A9A9A);
  }
  
  &:hover {
    border-color: var(--luxe-gold, #C8B88A);
    transform: translateY(-4px);
  }
`;

// Upload Section
const UploadArea = styled.div`
  max-width: 550px;
  margin: 0 auto;
  padding: 3.5rem 2rem;
  border: 2px dashed var(--luxe-border, #ECEAE6);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--luxe-white, #FFFFFF);
  
  &:hover {
    border-color: var(--luxe-gold, #C8B88A);
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.4;
`;

const UploadText = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.85rem;
  color: var(--luxe-text-light, #7A7A7A);
  margin-bottom: 1rem;
`;

const UploadButton = styled.span`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-gold, #C8B88A);
  border-bottom: 1px solid var(--luxe-gold, #C8B88A);
  padding-bottom: 0.2rem;
`;

// Guestbook Section
const GuestbookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
`;

const GuestbookCard = styled.div`
  padding: 2rem;
  background: var(--luxe-white, #FFFFFF);
`;

const GuestbookMessage = styled.p`
  font-family: var(--font-serif, 'Cormorant Garamond', serif);
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.8;
  color: var(--luxe-text, #5A5A5A);
  margin-bottom: 1.5rem;
`;

const GuestbookAuthor = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-text-muted, #9A9A9A);
`;

// Footer
const ArchiveFooter = styled.footer`
  padding: 4rem 2rem;
  background: var(--luxe-text-heading, #4A4A4A);
  text-align: center;
`;

const FooterLogo = styled.div`
  font-family: var(--font-serif, 'Cormorant Garamond', serif);
  font-size: 1.8rem;
  font-style: italic;
  color: var(--luxe-white, #FFFFFF);
  margin-bottom: 1rem;
`;

const FooterText = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 1.5rem;
`;

const FooterHashtag = styled.p`
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-gold, #C8B88A);
`;

function ArchivePage({ config = {} }) {
  const {
    coupleName = "Dave & Kalle",
    name1 = "Dave",
    name2 = "Kalle",
    weddingDateDisplay = "October 20, 2026",
    location = "Château de Lumière",
    hashtag = "#DaveAndKalle2026",
  } = config;

  const [guestMessages] = useState([
    { id: 1, message: "What an incredible celebration of love! We are so honored to have been part of your special day.", author: "Emma & James" },
    { id: 2, message: "The most beautiful wedding we have ever attended. Wishing you a lifetime of happiness together!", author: "The Laurent Family" },
    { id: 3, message: "Thank you for letting us share in your joy. Here is to forever!", author: "Sophie Martin" },
  ]);

  return (
    <Page>
      {/* Hero */}
      <HeroSection>
        <HeroContent>
          <GoldLine />
          <Eyebrow>Our Wedding Day</Eyebrow>
          <Title>{name1} & {name2}</Title>
          <Subtitle>
            Thank you for being part of the most magical day of our lives. 
            Relive the memories and share your favorite moments with us.
          </Subtitle>
          <DateLocation>{weddingDateDisplay} · {location}</DateLocation>
        </HeroContent>
      </HeroSection>

      {/* Photo Gallery */}
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>Our Memories</SectionTitle>
            <SectionSubtitle>A collection of moments from our celebration</SectionSubtitle>
          </SectionHeader>
          
          <GalleryGrid>
            {[...Array(8)].map((_, i) => (
              <GalleryItem key={i} />
            ))}
          </GalleryGrid>
        </Container>
      </Section>

      {/* Upload Photos */}
      <Section $alt>
        <Container>
          <SectionHeader>
            <SectionTitle>Share Your Photos</SectionTitle>
            <SectionSubtitle>Add your favorite moments to our collection</SectionSubtitle>
          </SectionHeader>
          
          <UploadArea>
            <UploadIcon>📷</UploadIcon>
            <UploadText>Drag photos here or click to browse</UploadText>
            <UploadButton>Select Files</UploadButton>
          </UploadArea>
        </Container>
      </Section>

      {/* Guestbook */}
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>Kind Words</SectionTitle>
            <SectionSubtitle>Messages from our loved ones</SectionSubtitle>
          </SectionHeader>
          
          <GuestbookGrid>
            {guestMessages.map((entry) => (
              <GuestbookCard key={entry.id}>
                <GuestbookMessage>"{entry.message}"</GuestbookMessage>
                <GuestbookAuthor>— {entry.author}</GuestbookAuthor>
              </GuestbookCard>
            ))}
          </GuestbookGrid>
        </Container>
      </Section>

      {/* Footer */}
      <ArchiveFooter>
        <FooterLogo>{name1} & {name2}</FooterLogo>
        <FooterText>Forever grateful for your love and support.</FooterText>
        <FooterHashtag>{hashtag}</FooterHashtag>
      </ArchiveFooter>
    </Page>
  );
}

export default ArchivePage;
