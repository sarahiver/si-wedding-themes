import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import Gallery from './Gallery';
import Guestbook from './Guestbook';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: var(--cream);
`;

const Hero = styled.section`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, var(--cream) 0%, var(--cream-dark) 100%);
  position: relative;
  overflow: hidden;
  padding: 4rem 2rem;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  opacity: 0.15;
  animation: ${float} ${p => p.$duration}s ease-in-out infinite;
  pointer-events: none;
  
  svg { width: 100%; height: 100%; fill: var(--sage); }
`;

const Content = styled.div`
  text-align: center;
  max-width: 700px;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 1s ease forwards;
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.8;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
`;

const VideoSection = styled.section`
  padding: 4rem 2rem;
  background: var(--cream-dark);
`;

const VideoContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  
  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: var(--forest);
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .video-wrapper {
    aspect-ratio: 16/9;
    background: var(--cream);
    border-radius: 16px;
    overflow: hidden;
    
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
`;

const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

function ArchivePage() {
  const { coupleNames, getContent } = useWedding();
  const content = getContent('archive');
  
  const title = content.thank_you_title || 'Danke!';
  const text = content.thank_you_text || 'Es war ein unvergesslicher Tag mit euch.';
  const videoUrl = content.video_url || '';
  const galleryActive = content.gallery_active !== false;
  const guestbookActive = content.guestbook_active !== false;

  return (
    <Page>
      <Hero>
        <FloatingLeaf $size={90} $duration={8} style={{ top: '15%', left: '8%' }}><LeafSVG /></FloatingLeaf>
        <FloatingLeaf $size={70} $duration={10} style={{ top: '25%', right: '10%' }}><LeafSVG /></FloatingLeaf>
        <FloatingLeaf $size={60} $duration={7} style={{ bottom: '20%', left: '15%' }}><LeafSVG /></FloatingLeaf>
        
        <Content>
          <Title>{title}</Title>
          <Subtitle>{text}</Subtitle>
        </Content>
      </Hero>
      
      {videoUrl && (
        <VideoSection>
          <VideoContainer>
            <h2>Unser Hochzeitsvideo</h2>
            <div className="video-wrapper">
              <iframe 
                src={videoUrl} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
              />
            </div>
          </VideoContainer>
        </VideoSection>
      )}
      
      {galleryActive && <Gallery content={{ title: 'Erinnerungen', images: content.gallery_images || [] }} />}
      {guestbookActive && <Guestbook content={{ title: 'Gästebuch' }} />}
    </Page>
  );
}

export default ArchivePage;
