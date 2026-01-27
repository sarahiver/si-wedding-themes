import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LUXE GALLERY - Modern Bento Grid with Creative Hover Effects
// Asymmetric layout with reveal animations
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--luxe-white);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 1rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 180px);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 250px);
  }
`;

const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const GridItem = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.6s ease-out forwards;
    animation-delay: ${p.$delay}s;
  `}
  
  /* Bento grid positioning */
  ${p => p.$span === 'large' && css`
    grid-column: span 2;
    grid-row: span 2;
  `}
  
  ${p => p.$span === 'wide' && css`
    grid-column: span 2;
  `}
  
  ${p => p.$span === 'tall' && css`
    grid-row: span 2;
  `}
  
  @media (max-width: 900px) {
    ${p => p.$span === 'large' && css`
      grid-column: span 2;
      grid-row: span 1;
    `}
  }
  
  @media (max-width: 500px) {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
`;

const Image = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), filter 0.4s ease;
  
  ${GridItem}:hover & {
    transform: scale(1.08);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.5) 0%,
    rgba(0,0,0,0) 50%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  
  ${GridItem}:hover & {
    opacity: 1;
  }
`;

const ItemContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s ease 0.1s;
  
  ${GridItem}:hover & {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ItemTitle = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-style: italic;
  color: white;
`;

const ItemIndex = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-family: var(--font-serif);
  font-size: 0.8rem;
  font-style: italic;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${GridItem}:hover & {
    opacity: 0.7;
  }
`;

const ZoomIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  
  ${GridItem}:hover & {
    transform: translate(-50%, -50%) scale(1);
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--luxe-text-heading);
  }
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.98);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.$isOpen ? 1 : 0};
  visibility: ${p => p.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 2rem;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 85vh;
  object-fit: contain;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border: 1px solid var(--luxe-border);
  background: var(--luxe-white);
  font-size: 1.5rem;
  color: var(--luxe-text);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  width: 50px;
  height: 50px;
  border: 1px solid var(--luxe-border);
  background: var(--luxe-white);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

function Gallery({ images }) {
  const [visible, setVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const sectionRef = useRef(null);
  
  const defaultImages = [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', title: 'Der Moment', span: 'large' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', title: 'Die Feier' },
    { src: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600', title: 'Details', span: 'tall' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600', title: 'Blumen' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', title: 'Zusammen', span: 'wide' },
    { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600', title: 'Freude' },
    { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600', title: 'Ring' },
    { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600', title: 'Tanz' },
  ];
  
  const imageData = images || defaultImages;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((lightboxIndex + 1) % imageData.length);
  const prevImage = () => setLightboxIndex((lightboxIndex - 1 + imageData.length) % imageData.length);
  
  return (
    <Section id="gallery" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow>Galerie</Eyebrow>
          <Title>Momente</Title>
        </Header>
        
        <BentoGrid>
          {imageData.map((img, index) => (
            <GridItem 
              key={index}
              $span={img.span}
              $visible={visible}
              $delay={index * 0.1}
              onClick={() => openLightbox(index)}
            >
              <Image $src={img.src} />
              <Overlay />
              <ItemIndex>0{index + 1}</ItemIndex>
              <ZoomIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
                </svg>
              </ZoomIcon>
              <ItemContent>
                <ItemTitle>{img.title}</ItemTitle>
              </ItemContent>
            </GridItem>
          ))}
        </BentoGrid>
      </Container>
      
      <Lightbox $isOpen={lightboxIndex !== null} onClick={closeLightbox}>
        <LightboxClose onClick={closeLightbox}>×</LightboxClose>
        
        {lightboxIndex !== null && (
          <>
            <LightboxImage 
              src={imageData[lightboxIndex].src} 
              alt={imageData[lightboxIndex].title}
              onClick={e => e.stopPropagation()}
            />
            <LightboxNav $direction="prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </LightboxNav>
            <LightboxNav $direction="next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </LightboxNav>
          </>
        )}
      </Lightbox>
    </Section>
  );
}

export default Gallery;
