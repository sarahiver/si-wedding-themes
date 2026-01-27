// src/components/Gallery.js - Neon Theme
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const marqueeScroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const marqueeScrollReverse = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(0,255,255,0.5); }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: 150px 0;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  padding: 0 5%;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  
  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const MarqueeContainer = styled.div`
  margin-bottom: 30px;
  overflow: hidden;
  
  &:hover .marquee-track {
    animation-play-state: paused;
  }
`;

const MarqueeTrack = styled.div`
  display: flex;
  gap: 30px;
  animation: ${p => p.$reverse ? marqueeScrollReverse : marqueeScroll} ${p => p.$duration || 30}s linear infinite;
  width: max-content;
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: ${p => p.$size || 350}px;
  height: ${p => p.$height || 250}px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(0,255,255,0.1);
  transition: all 0.4s ease;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      ${p => p.$color || '#00ffff'}30 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
  }
  
  &:hover {
    border-color: ${p => p.$color || '#00ffff'};
    box-shadow: 0 0 30px ${p => p.$color || '#00ffff'}40;
    transform: scale(1.02);
    
    &::before {
      opacity: 1;
    }
    
    img {
      filter: grayscale(0%);
    }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
    transition: filter 0.4s ease;
  }
`;

const ViewOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10,10,15,0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
  
  ${ImageWrapper}:hover & {
    opacity: 1;
  }
`;

const ViewIcon = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid #00ffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ffff;
  animation: ${glowPulse} 2s ease-in-out infinite;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10,10,15,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40px;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  border: 1px solid rgba(0,255,255,0.3);
  box-shadow: 0 0 50px rgba(0,255,255,0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: transparent;
  border: 1px solid rgba(0,255,255,0.3);
  color: #00ffff;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0,255,255,0.1);
    box-shadow: 0 0 20px rgba(0,255,255,0.3);
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$direction === 'prev' ? 'left: 20px;' : 'right: 20px;'}
  width: 60px;
  height: 60px;
  background: rgba(0,255,255,0.1);
  border: 1px solid rgba(0,255,255,0.3);
  color: #00ffff;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0,255,255,0.2);
    box-shadow: 0 0 20px rgba(0,255,255,0.3);
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  
  span {
    color: #00ffff;
  }
`;

function Gallery({
  images = [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', color: '#00ffff' },
    { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600', color: '#ff00ff' },
    { src: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=600', color: '#b347ff' },
    { src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600', color: '#00ff88' },
    { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600', color: '#00ffff' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600', color: '#ff00ff' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', color: '#b347ff' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', color: '#00ff88' },
  ]
}) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setCurrentImage(prev => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentImage(prev => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, images.length]);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  // Create duplicate arrays for seamless marquee
  const row1Images = [...images, ...images];
  const row2Images = [...images.slice(4), ...images.slice(0, 4), ...images.slice(4), ...images.slice(0, 4)];
  const row3Images = [...images.slice(2), ...images.slice(0, 2), ...images.slice(2), ...images.slice(0, 2)];

  return (
    <Section ref={sectionRef} id="gallery">
      <GridBG />
      
      <Header $visible={visible}>
        <Eyebrow>// Captured Moments</Eyebrow>
        <Title>Our <span>Gallery</span></Title>
      </Header>
      
      <MarqueeContainer>
        <MarqueeTrack className="marquee-track" $duration={40}>
          {row1Images.map((img, i) => (
            <ImageWrapper 
              key={i} 
              $color={img.color} 
              $size={350} 
              $height={250}
              onClick={() => openLightbox(i % images.length)}
            >
              <img src={img.src} alt={`Gallery ${i + 1}`} />
              <ViewOverlay>
                <ViewIcon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </ViewIcon>
              </ViewOverlay>
            </ImageWrapper>
          ))}
        </MarqueeTrack>
      </MarqueeContainer>
      
      <MarqueeContainer>
        <MarqueeTrack className="marquee-track" $duration={35} $reverse>
          {row2Images.map((img, i) => (
            <ImageWrapper 
              key={i} 
              $color={img.color} 
              $size={300} 
              $height={200}
              onClick={() => openLightbox((i + 4) % images.length)}
            >
              <img src={img.src} alt={`Gallery ${i + 1}`} />
              <ViewOverlay>
                <ViewIcon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </ViewIcon>
              </ViewOverlay>
            </ImageWrapper>
          ))}
        </MarqueeTrack>
      </MarqueeContainer>
      
      <MarqueeContainer>
        <MarqueeTrack className="marquee-track" $duration={45}>
          {row3Images.map((img, i) => (
            <ImageWrapper 
              key={i} 
              $color={img.color} 
              $size={400} 
              $height={280}
              onClick={() => openLightbox((i + 2) % images.length)}
            >
              <img src={img.src} alt={`Gallery ${i + 1}`} />
              <ViewOverlay>
                <ViewIcon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </ViewIcon>
              </ViewOverlay>
            </ImageWrapper>
          ))}
        </MarqueeTrack>
      </MarqueeContainer>
      
      <Lightbox $open={lightboxOpen} onClick={() => setLightboxOpen(false)}>
        <CloseButton onClick={() => setLightboxOpen(false)}>✕</CloseButton>
        <NavButton 
          $direction="prev" 
          onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => (prev - 1 + images.length) % images.length); }}
        >
          ←
        </NavButton>
        <LightboxImage 
          src={images[currentImage]?.src} 
          alt="Lightbox"
          onClick={e => e.stopPropagation()}
        />
        <NavButton 
          $direction="next" 
          onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => (prev + 1) % images.length); }}
        >
          →
        </NavButton>
        <ImageCounter>
          <span>{currentImage + 1}</span> / {images.length}
        </ImageCounter>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
