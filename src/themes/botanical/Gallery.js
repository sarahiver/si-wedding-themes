import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const GalleryItem = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: ${p => {
    const shapes = ['50% 50% 20px 20px', '20px', '20px 20px 50% 50%', '30px'];
    return shapes[p.index % shapes.length];
  }};
  overflow: hidden;
  aspect-ratio: ${p => p.index % 4 === 0 ? '1/1.2' : '1/1'};
  background: var(--cream-dark);
  opacity: ${p => p.visible ? 1 : 0};
  transform: scale(${p => p.visible ? 1 : 0.9});
  transition: all 0.6s ease;
  transition-delay: ${p => p.index * 0.08}s;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: var(--shadow-lg);
    
    img { transform: scale(1.1); }
    .overlay { opacity: 1; }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--cream-dark), var(--cream));
  gap: 0.5rem;
  
  .number {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-style: italic;
    color: var(--sage-light);
  }
  
  .icon {
    font-size: 1.5rem;
    opacity: 0.5;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(45,59,45,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  span {
    width: 50px;
    height: 50px;
    background: var(--cream);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--forest);
    transform: scale(0.8);
    transition: transform 0.3s ease;
  }
  
  ${GalleryItem}:hover & span {
    transform: scale(1);
  }
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(45,59,45,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.isOpen ? 1 : 0};
  visibility: ${p => p.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 2rem;
`;

const LightboxImage = styled.div`
  max-width: 90vw;
  max-height: 85vh;
  border-radius: var(--radius-lg);
  overflow: hidden;
  animation: ${p => p.isOpen ? scaleIn : 'none'} 0.3s ease;
  
  img { 
    max-width: 100%; 
    max-height: 85vh; 
    object-fit: contain;
    display: block;
  }
`;

const LightboxPlaceholder = styled.div`
  width: 70vw;
  height: 60vh;
  max-width: 800px;
  background: var(--cream-dark);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  .number {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    font-style: italic;
    color: var(--sage-light);
  }
  
  .text {
    font-family: 'Lato', sans-serif;
    font-size: 1rem;
    color: var(--text-light);
  }
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--cream);
  border: none;
  border-radius: 50%;
  color: var(--forest);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover { 
    background: var(--sage); 
    color: var(--cream);
    transform: rotate(90deg);
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: var(--cream);
  border: none;
  border-radius: 50%;
  color: var(--forest);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  ${p => p.direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  
  &:hover { 
    background: var(--sage); 
    color: var(--cream);
  }
  
  @media (max-width: 768px) {
    ${p => p.direction === 'prev' ? 'left: 1rem;' : 'right: 1rem;'}
    width: 40px;
    height: 40px;
  }
`;

const LightboxCounter = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--cream);
  background: rgba(0,0,0,0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Gallery({
  images = [
    { src: null, alt: 'Foto 1' },
    { src: null, alt: 'Foto 2' },
    { src: null, alt: 'Foto 3' },
    { src: null, alt: 'Foto 4' },
    { src: null, alt: 'Foto 5' },
    { src: null, alt: 'Foto 6' },
  ],
}) {
  const [visible, setVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : 'unset';
    
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
    };
    
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen, currentIndex, images.length]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Erinnerungen</Eyebrow>
          <Title>Unsere Momente</Title>
        </Header>
        
        <GalleryGrid>
          {images.map((img, i) => (
            <GalleryItem 
              key={i} 
              index={i} 
              visible={visible} 
              onClick={() => openLightbox(i)}
            >
              {img.src ? (
                <img src={img.src} alt={img.alt} />
              ) : (
                <Placeholder>
                  <span className="icon">🌸</span>
                  <span className="number">{i + 1}</span>
                </Placeholder>
              )}
              <Overlay className="overlay">
                <span>+</span>
              </Overlay>
            </GalleryItem>
          ))}
        </GalleryGrid>
      </Container>
      
      <Lightbox isOpen={lightboxOpen} onClick={() => setLightboxOpen(false)}>
        <LightboxClose onClick={() => setLightboxOpen(false)}>✕</LightboxClose>
        
        {currentIndex > 0 && (
          <LightboxNav 
            direction="prev" 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(currentIndex - 1); }}
          >
            ←
          </LightboxNav>
        )}
        
        <LightboxImage isOpen={lightboxOpen} onClick={(e) => e.stopPropagation()}>
          {images[currentIndex]?.src ? (
            <img src={images[currentIndex].src} alt="" />
          ) : (
            <LightboxPlaceholder>
              <span className="number">{currentIndex + 1}</span>
              <span className="text">Foto Platzhalter</span>
            </LightboxPlaceholder>
          )}
        </LightboxImage>
        
        {currentIndex < images.length - 1 && (
          <LightboxNav 
            direction="next" 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(currentIndex + 1); }}
          >
            →
          </LightboxNav>
        )}
        
        <LightboxCounter>{currentIndex + 1} / {images.length}</LightboxCounter>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
