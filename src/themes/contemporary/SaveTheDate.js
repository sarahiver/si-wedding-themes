import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import Countdown from './Countdown';

const pop = keyframes`
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: var(--white, #FFFFFF);
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
`;

const FloatingShape = styled.div`
  position: fixed;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: ${p => p.$color};
  border: 3px solid var(--black, #0D0D0D);
  border-radius: ${p => p.$round ? '50%' : '0'};
  animation: ${float} ${p => p.$duration}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
  opacity: 0.6;
  z-index: 1;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
`;

const Badge = styled.div`
  display: inline-block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--white, #FFFFFF);
  background: var(--coral, #FF6B6B);
  padding: 0.6rem 1.5rem;
  border: 3px solid var(--black, #0D0D0D);
  box-shadow: 4px 4px 0 var(--black, #0D0D0D);
  margin-bottom: 2rem;
  animation: ${pop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;

const Names = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 700;
  color: var(--black, #0D0D0D);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.95;
  margin-bottom: 2rem;
  animation: ${pop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.1s;
  opacity: 0;
  
  .ampersand {
    display: block;
    font-size: 0.4em;
    color: var(--coral, #FF6B6B);
    margin: 0.5rem 0;
  }
`;

const DateBox = styled.div`
  display: inline-block;
  background: var(--yellow, #FFE66D);
  padding: 1.5rem 3rem;
  border: 3px solid var(--black, #0D0D0D);
  box-shadow: 8px 8px 0 var(--black, #0D0D0D);
  margin-bottom: 2rem;
  animation: ${pop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const DateText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--black, #0D0D0D);
  margin: 0;
`;

const Location = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-600, #666);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 0.5rem;
`;

const Message = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--gray-700, #444);
  max-width: 500px;
  margin: 0 auto 2rem;
  animation: ${pop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.3s;
  opacity: 0;
`;

const CountdownWrapper = styled.div`
  animation: ${pop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.4s;
  opacity: 0;
`;

const GallerySection = styled.section`
  padding: 6rem 2rem;
  background: var(--gray-100, #F5F5F5);
  position: relative;
  z-index: 10;
`;

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const GalleryTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--black, #0D0D0D);
  text-transform: uppercase;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const GalleryImage = styled.div`
  aspect-ratio: 4/5;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--coral, #FF6B6B)'};
  border: 3px solid var(--black, #0D0D0D);
  box-shadow: 6px 6px 0 var(--black, #0D0D0D);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--black, #0D0D0D);
  }
`;

const colors = ['var(--coral, #FF6B6B)', 'var(--electric, #4ECDC4)', 'var(--yellow, #FFE66D)', 'var(--purple, #A855F7)'];

function SaveTheDate() {
  const { coupleNames, weddingDate, content } = useWedding();
  const stdContent = content?.savethedate || {};
  const countdownContent = content?.countdown || {};
  const galleryContent = content?.gallery || {};
  
  const names = coupleNames?.split('&') || ['Name', 'Name'];
  const name1 = names[0]?.trim() || 'Name';
  const name2 = names[1]?.trim() || 'Name';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const displayDate = formatDate(weddingDate);
  const location = stdContent.location_teaser || '';
  const message = stdContent.message || 'Merkt euch den Termin vor! Die offizielle Einladung folgt bald.';
  const showCountdown = stdContent.countdown_active !== false;
  const showGallery = stdContent.gallery_active !== false;
  const galleryImages = galleryContent.images || [];

  return (
    <Page>
      <FloatingShape $size={80} $color={colors[0]} $round $duration={6} $delay={0} style={{ top: '10%', left: '5%' }} />
      <FloatingShape $size={60} $color={colors[1]} $duration={8} $delay={1} style={{ top: '20%', right: '10%' }} />
      <FloatingShape $size={100} $color={colors[2]} $round $duration={7} $delay={0.5} style={{ bottom: '15%', left: '8%' }} />
      <FloatingShape $size={50} $color={colors[3]} $duration={9} $delay={2} style={{ bottom: '25%', right: '5%' }} />
      
      <HeroSection>
        <Content>
          <Badge>Save the Date</Badge>
          
          <Names>
            {name1}
            <span className="ampersand">&</span>
            {name2}
          </Names>
          
          <DateBox>
            <DateText>{displayDate}</DateText>
            {location && <Location>{location}</Location>}
          </DateBox>
          
          <Message>{message}</Message>
          
          {showCountdown && (
            <CountdownWrapper>
              <Countdown 
                targetDate={countdownContent.target_date || weddingDate}
                title=""
                showSeconds={false}
              />
            </CountdownWrapper>
          )}
        </Content>
      </HeroSection>
      
      {showGallery && galleryImages.length > 0 && (
        <GallerySection>
          <GalleryContainer>
            <GalleryHeader>
              <GalleryTitle>Sneak Peek</GalleryTitle>
            </GalleryHeader>
            
            <GalleryGrid>
              {galleryImages.slice(0, 6).map((img, i) => (
                <GalleryImage key={i} $image={img.url} />
              ))}
            </GalleryGrid>
          </GalleryContainer>
        </GallerySection>
      )}
    </Page>
  );
}

export default SaveTheDate;
