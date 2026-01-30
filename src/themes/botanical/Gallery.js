import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg-alt);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 1000px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const ImageWrapper = styled.div`
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--zen-line-light);
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay}s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(30%);
  transition: all 0.5s ease;
  ${ImageWrapper}:hover & {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zen-text-muted);
  font-size: 0.8rem;
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

const LightboxImg = styled.img`
  max-width: 90%;
  max-height: 85vh;
  object-fit: contain;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: white;
  font-size: 2rem;
  opacity: 0.6;
  &:hover { opacity: 1; }
`;

function Gallery() {
  const { content } = useWedding();
  const data = content?.gallery || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  
  const title = data.title || 'Galerie';
  const images = data.images || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Placeholder if no images
  const displayImages = images.length > 0 ? images : Array(6).fill(null);

  return (
    <Section id="gallery" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Grid>
          {displayImages.map((img, i) => (
            <ImageWrapper 
              key={i} 
              className={visible ? 'visible' : ''} 
              $delay={0.05 * i}
              onClick={() => img && setLightbox(img.url || img)}
            >
              {img ? (
                <Image src={img.url || img} alt="" />
              ) : (
                <Placeholder>Foto {i + 1}</Placeholder>
              )}
            </ImageWrapper>
          ))}
        </Grid>
      </Content>
      
      <Lightbox $open={!!lightbox} onClick={() => setLightbox(null)}>
        <LightboxClose onClick={() => setLightbox(null)}>×</LightboxClose>
        {lightbox && <LightboxImg src={lightbox} alt="" onClick={e => e.stopPropagation()} />}
      </Lightbox>
    </Section>
  );
}

export default Gallery;
