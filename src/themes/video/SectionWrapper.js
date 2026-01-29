// Video Theme - SectionWrapper with Background Media Support
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackgroundMedia = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  
  /* S/W Filter */
  filter: grayscale(100%);
  
  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageElement = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
`;

const Fallback = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--video-charcoal) 0%, var(--video-dark) 100%);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 10, 0.4) 0%,
    rgba(10, 10, 10, 0.2) 30%,
    rgba(10, 10, 10, 0.2) 70%,
    rgba(10, 10, 10, 0.6) 100%
  );
  
  /* Additional vignette */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 0%,
      rgba(10, 10, 10, 0.3) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  padding-bottom: calc(var(--nav-height) + 2rem);
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    padding-bottom: calc(var(--nav-height) + 1.5rem);
  }
`;

/**
 * SectionWrapper - Consistent section with background media
 * 
 * @param {string} id - Section ID for navigation
 * @param {object} background - { type: 'video'|'image', url: string }
 * @param {React.ReactNode} children - Section content
 */
function SectionWrapper({ id, background, children, className }) {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for lazy loading videos
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Play/pause video based on visibility
  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  const renderBackground = () => {
    if (!background?.url) {
      return <Fallback />;
    }

    if (background.type === 'video') {
      return (
        <VideoElement
          ref={videoRef}
          src={background.url}
          muted
          loop
          playsInline
          preload="metadata"
        />
      );
    }

    return <ImageElement $src={background.url} />;
  };

  return (
    <Wrapper ref={sectionRef} id={id} className={className}>
      <BackgroundMedia>
        {renderBackground()}
      </BackgroundMedia>
      <Overlay />
      <Content>
        {children}
      </Content>
    </Wrapper>
  );
}

export default SectionWrapper;
