import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ImageCard = styled.div`
  aspect-ratio: 4/5;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$index * 0.08}s;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  &:hover img { transform: scale(1.08); }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--cream), var(--sage-muted));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  opacity: 0.5;
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(45, 59, 45, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  
  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
`;

function Gallery({ content = {} }) {
  const [visible, setVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const sectionRef = useRef(null);

  const title = content.title || 'Galerie';
  const images = content.images || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (img) => {
    setActiveImage(img);
    setLightboxOpen(true);
  };

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Impressionen</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {images.length > 0 ? images.map((img, i) => (
            <ImageCard key={i} $visible={visible} $index={i} onClick={() => openLightbox(img.url || img)}>
              <img src={img.url || img} alt={img.alt || `Bild ${i + 1}`} />
            </ImageCard>
          )) : (
            Array.from({ length: 6 }).map((_, i) => (
              <ImageCard key={i} $visible={visible} $index={i}>
                <Placeholder>🌸</Placeholder>
              </ImageCard>
            ))
          )}
        </Grid>
      </Container>
      
      <Lightbox $open={lightboxOpen} onClick={() => setLightboxOpen(false)}>
        <CloseButton onClick={() => setLightboxOpen(false)}>×</CloseButton>
        {activeImage && <img src={activeImage} alt="" />}
      </Lightbox>
    </Section>
  );
}

export default Gallery;
