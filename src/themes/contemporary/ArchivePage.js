import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import Gallery from './Gallery';
import Guestbook from './Guestbook';
import PhotoUpload from './PhotoUpload';

const pop = keyframes`
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: var(--white, #FFFFFF);
`;

const HeroSection = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 4rem 2rem;
  background: var(--gray-100, #F5F5F5);
  overflow: hidden;
`;

const FloatingEmoji = styled.div`
  position: absolute;
  font-size: ${p => p.$size}rem;
  animation: ${float} ${p => p.$duration}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
  opacity: 0.5;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 700px;
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

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--black, #0D0D0D);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  animation: ${pop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.1s;
  opacity: 0;
`;

const Subtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  line-height: 1.7;
  color: var(--gray-700, #444);
  max-width: 550px;
  margin: 0 auto;
  animation: ${pop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const VideoSection = styled.section`
  padding: 4rem 2rem;
  background: var(--black, #0D0D0D);
`;

const VideoContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const VideoWrapper = styled.div`
  aspect-ratio: 16/9;
  background: var(--gray-900, #1a1a1a);
  border: 3px solid var(--coral, #FF6B6B);
  box-shadow: 8px 8px 0 var(--coral, #FF6B6B);
  display: flex;
  align-items: center;
  justify-content: center;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const VideoPlaceholder = styled.div`
  text-align: center;
  color: var(--white, #FFFFFF);
  font-family: 'Space Grotesk', sans-serif;
  
  .emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .text {
    font-size: 1rem;
    opacity: 0.6;
  }
`;

const SectionDivider = styled.div`
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    var(--coral, #FF6B6B) 0px,
    var(--coral, #FF6B6B) 20px,
    var(--yellow, #FFE66D) 20px,
    var(--yellow, #FFE66D) 40px,
    var(--electric, #4ECDC4) 40px,
    var(--electric, #4ECDC4) 60px,
    var(--purple, #A855F7) 60px,
    var(--purple, #A855F7) 80px
  );
`;

function ArchivePage() {
  const { coupleNames, content } = useWedding();
  const archiveContent = content?.archive || {};
  
  const thankYouTitle = archiveContent.thank_you_title || 'Danke!';
  const thankYouText = archiveContent.thank_you_text || 'Was für ein unvergesslicher Tag! Danke, dass ihr dabei wart und ihn mit uns gefeiert habt.';
  const showGallery = archiveContent.gallery_active !== false;
  const showGuestbook = archiveContent.guestbook_active !== false;
  const showPhotoUpload = archiveContent.photoupload_active !== false;
  const videoUrl = archiveContent.video_url || '';

  const renderVideo = () => {
    if (!videoUrl) {
      return (
        <VideoPlaceholder>
          <div className="emoji">🎬</div>
          <div className="text">Hochzeitsvideo coming soon</div>
        </VideoPlaceholder>
      );
    }
    
    // Support YouTube and Vimeo
    if (videoUrl.includes('youtube') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('youtu.be') 
        ? videoUrl.split('/').pop() 
        : new URLSearchParams(new URL(videoUrl).search).get('v');
      return (
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    
    if (videoUrl.includes('vimeo')) {
      const videoId = videoUrl.split('/').pop();
      return (
        <iframe 
          src={`https://player.vimeo.com/video/${videoId}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }
    
    return (
      <video src={videoUrl} controls style={{ width: '100%', height: '100%' }} />
    );
  };

  return (
    <Page>
      <HeroSection>
        <FloatingEmoji $size={3} $duration={6} $delay={0} style={{ top: '15%', left: '10%' }}>💕</FloatingEmoji>
        <FloatingEmoji $size={2.5} $duration={8} $delay={1} style={{ top: '25%', right: '15%' }}>✨</FloatingEmoji>
        <FloatingEmoji $size={2} $duration={7} $delay={0.5} style={{ bottom: '20%', left: '15%' }}>🎉</FloatingEmoji>
        <FloatingEmoji $size={3} $duration={9} $delay={2} style={{ bottom: '25%', right: '10%' }}>💍</FloatingEmoji>
        
        <Content>
          <Badge>Archiv</Badge>
          <Title>{thankYouTitle}</Title>
          <Subtitle>{thankYouText}</Subtitle>
        </Content>
      </HeroSection>
      
      <SectionDivider />
      
      {(videoUrl || true) && (
        <VideoSection>
          <VideoContainer>
            <VideoWrapper>
              {renderVideo()}
            </VideoWrapper>
          </VideoContainer>
        </VideoSection>
      )}
      
      <SectionDivider />
      
      {showGallery && <Gallery content={content?.gallery} />}
      
      {showPhotoUpload && <PhotoUpload content={content?.photoupload} />}
      
      {showGuestbook && <Guestbook content={content?.guestbook} />}
    </Page>
  );
}

export default ArchivePage;
