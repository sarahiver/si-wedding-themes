import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0%, 100% { 
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }
  50% { 
    text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
  }
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

const Page = styled.div`
  min-height: 100vh;
  background: var(--neon-bg);
  position: relative;
  overflow: hidden;
`;

const GridOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 255, 255, 0.1),
    transparent
  );
  animation: ${scanline} 8s linear infinite;
  pointer-events: none;
  z-index: 1;
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
  
  &::before {
    content: '✓ ';
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 30px rgba(0, 255, 255, 0.4);
  animation: ${flicker} 4s infinite;
  
  span {
    color: var(--neon-pink);
    text-shadow: 
      0 0 10px rgba(255, 0, 255, 0.8),
      0 0 30px rgba(255, 0, 255, 0.4);
  }
`;

const HeroSubtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
`;

const WeddingDate = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 1.1rem;
  color: var(--neon-cyan);
  padding: 15px 30px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  display: inline-block;
  
  &::before {
    content: '// ';
    opacity: 0.5;
  }
`;

const FloatingHeart = styled.div`
  position: absolute;
  font-size: 2rem;
  color: var(--neon-pink);
  animation: ${float} ${props => props.duration || '3s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.3;
  text-shadow: 0 0 20px var(--neon-pink);
`;

// Thank You Section
const ThankYouSection = styled.section`
  padding: 100px 5vw;
  position: relative;
  z-index: 2;
`;

const SectionContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const ThankYouCard = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 255, 0.2);
  padding: 60px;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 30%;
    right: 30%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
  }
`;

const ThankYouTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: white;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const ThankYouText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.9;
  max-width: 700px;
  margin: 0 auto 30px;
`;

const Signature = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  color: var(--neon-pink);
  margin-top: 40px;
  text-shadow: 0 0 10px var(--neon-pink);
`;

// Stats Section
const StatsSection = styled.section`
  padding: 80px 5vw;
  position: relative;
  z-index: 2;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  padding: 40px 30px;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.color};
    box-shadow: 0 0 10px ${props => props.color};
  }
`;

const StatNumber = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 10px;
  text-shadow: 0 0 20px ${props => props.color};
`;

const StatLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Gallery Section
const GallerySection = styled.section`
  padding: 100px 5vw;
  position: relative;
  z-index: 2;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const GalleryTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: white;
  margin-bottom: 15px;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 30px rgba(0, 255, 255, 0.4);
`;

const GallerySubtitle = styled.p`
  font-family: 'Space Grotesk', monospace;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const GalleryItem = styled.div`
  aspect-ratio: ${props => props.tall ? '3/4' : props.wide ? '4/3' : '1'};
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--neon-cyan);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
    transform: scale(1.02);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 70%,
      rgba(10, 10, 15, 0.8)
    );
    z-index: 1;
  }
`;

const GalleryImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.gradient || 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2))'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
`;

const GalleryCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  z-index: 2;
  font-family: 'Space Grotesk', sans-serif;
  color: white;
  font-size: 0.9rem;
`;

// Call to Action
const CTASection = styled.section`
  padding: 100px 5vw;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const CTATitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: white;
  margin-bottom: 20px;
`;

const CTAText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled.a`
  display: inline-block;
  padding: 18px 50px;
  background: transparent;
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--neon-cyan);
    color: var(--neon-bg);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  }
`;

const ArchivePage = ({ config = {} }) => {
  const [visible, setVisible] = useState(false);
  const pageRef = useRef(null);
  
  const {
    coupleName = "Alex & Jordan",
    weddingDate = "15. August 2025",
    thankYouMessage = "Ein herzliches Dankeschön an alle, die diesen besonderen Tag mit uns gefeiert haben! Eure Anwesenheit, eure Wünsche und eure Freude haben diesen Tag unvergesslich gemacht. Wir sind überwältigt von so viel Liebe und Unterstützung.",
    stats = {
      guests: 120,
      photos: 2847,
      danceHours: 6,
      champagneBottles: 48
    },
    hashtag = "#AlexAndJordan2026"
  } = config;
  
  useEffect(() => {
    setVisible(true);
  }, []);
  
  const galleryItems = [
    { caption: 'Die Zeremonie', gradient: 'linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(0, 100, 150, 0.3))' },
    { caption: 'Der erste Tanz', tall: true, gradient: 'linear-gradient(135deg, rgba(255, 0, 255, 0.3), rgba(150, 0, 100, 0.3))' },
    { caption: 'Die Feier', gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.3), rgba(0, 150, 80, 0.3))' },
    { caption: 'Mit Familie', wide: true, gradient: 'linear-gradient(135deg, rgba(179, 71, 255, 0.3), rgba(100, 0, 150, 0.3))' },
    { caption: 'Der Sektempfang', gradient: 'linear-gradient(135deg, rgba(255, 200, 0, 0.3), rgba(150, 100, 0, 0.3))' },
    { caption: 'Das Brautpaar', tall: true, gradient: 'linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(150, 50, 50, 0.3))' },
    { caption: 'Die Torte', gradient: 'linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3))' },
    { caption: 'Auf der Tanzfläche', gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.3), rgba(255, 0, 255, 0.3))' },
  ];
  
  return (
    <Page ref={pageRef}>
      <GridOverlay />
      <Scanline />
      
      {/* Floating Hearts */}
      <FloatingHeart style={{ top: '20%', left: '10%' }} duration="4s" delay="0s">♥</FloatingHeart>
      <FloatingHeart style={{ top: '30%', right: '15%' }} duration="5s" delay="1s">♥</FloatingHeart>
      <FloatingHeart style={{ top: '60%', left: '5%' }} duration="3.5s" delay="0.5s">♥</FloatingHeart>
      <FloatingHeart style={{ top: '70%', right: '8%' }} duration="4.5s" delay="1.5s">♥</FloatingHeart>
      
      {/* Hero */}
      <HeroSection>
        <HeroContent>
          <Badge>Wedding Complete</Badge>
          <HeroTitle>
            {coupleName.split(' & ')[0]} <span>&</span> {coupleName.split(' & ')[1]}
          </HeroTitle>
          <HeroSubtitle>Wir haben Ja gesagt!</HeroSubtitle>
          <WeddingDate>{weddingDate}</WeddingDate>
        </HeroContent>
      </HeroSection>
      
      {/* Thank You */}
      <ThankYouSection>
        <SectionContainer>
          <ThankYouCard>
            <ThankYouTitle>Danke!</ThankYouTitle>
            <ThankYouText>{thankYouMessage}</ThankYouText>
            <Signature>In Liebe, {coupleName}</Signature>
          </ThankYouCard>
        </SectionContainer>
      </ThankYouSection>
      
      {/* Stats */}
      <StatsSection>
        <StatsGrid>
          <StatCard color="var(--neon-cyan)">
            <StatNumber color="var(--neon-cyan)">{stats.guests}</StatNumber>
            <StatLabel>Gäste</StatLabel>
          </StatCard>
          <StatCard color="var(--neon-pink)">
            <StatNumber color="var(--neon-pink)">{stats.photos.toLocaleString()}</StatNumber>
            <StatLabel>Fotos</StatLabel>
          </StatCard>
          <StatCard color="var(--neon-green)">
            <StatNumber color="var(--neon-green)">{stats.danceHours}</StatNumber>
            <StatLabel>Stunden getanzt</StatLabel>
          </StatCard>
          <StatCard color="var(--neon-purple)">
            <StatNumber color="var(--neon-purple)">{stats.champagneBottles}</StatNumber>
            <StatLabel>Flaschen Champagner</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>
      
      {/* Gallery */}
      <GallerySection>
        <GalleryHeader>
          <GalleryTitle>Unsere Highlights</GalleryTitle>
          <GallerySubtitle>{hashtag}</GallerySubtitle>
        </GalleryHeader>
        
        <GalleryGrid>
          {galleryItems.map((item, index) => (
            <GalleryItem 
              key={index}
              tall={item.tall}
              wide={item.wide}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease ${index * 0.1}s`
              }}
            >
              <GalleryImage gradient={item.gradient}>
                [Foto {index + 1}]
              </GalleryImage>
              <GalleryCaption>{item.caption}</GalleryCaption>
            </GalleryItem>
          ))}
        </GalleryGrid>
      </GallerySection>
      
      {/* CTA */}
      <CTASection>
        <CTATitle>Habt ihr auch Fotos?</CTATitle>
        <CTAText>
          Teilt eure Erinnerungen mit uns! Ladet eure Fotos hoch 
          oder nutzt unseren Hashtag {hashtag}
        </CTAText>
        <CTAButton href="#photo-upload">
          Fotos Hochladen →
        </CTAButton>
      </CTASection>
    </Page>
  );
};

export default ArchivePage;
