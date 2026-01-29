// Botanical Gallery - Images in holes
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.4rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.6rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.3rem;
  width: 100%;
  max-height: 70%;
  overflow: hidden;
`;

const ImageItem = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--off-white)'};
  cursor: ${p => p.$image ? 'pointer' : 'default'};
  filter: grayscale(100%);
  transition: filter 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: var(--pale);
  
  &:hover {
    filter: grayscale(50%);
  }
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease;
  padding: 2rem;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  filter: grayscale(50%);
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: white;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$dir === 'prev' ? 'left: 1rem;' : 'right: 1rem;'}
  color: white;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

function Gallery() {
  const { content } = useWedding();
  const { mainHole, secondaryHoles } = useKnotholes();
  const galleryData = content?.gallery || {};
  
  const title = galleryData.title || 'Galerie';
  const images = galleryData.images || [];
  
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const allImages = images.length > 0 ? images : [];
  
  // Main hole gets first 4 images
  const mainImages = allImages.slice(0, 4);
  // Secondary holes get remaining
  const secondaryImages = secondaryHoles.map((_, i) => 
    allImages.slice(4 + i * 2, 4 + (i + 1) * 2)
  );

  const openLightbox = (idx) => {
    if (allImages.length > 0) setLightbox({ open: true, index: idx });
  };

  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const nextImage = () => setLightbox(l => ({ ...l, index: (l.index + 1) % allImages.length }));
  const prevImage = () => setLightbox(l => ({ ...l, index: (l.index - 1 + allImages.length) % allImages.length }));

  return (
    <Section data-section="gallery">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Erinnerungen</Eyebrow>
        <Title>{title}</Title>
        <ImageGrid>
          {(mainImages.length > 0 ? mainImages : Array(4).fill(null)).map((img, i) => (
            <ImageItem 
              key={i} 
              $image={img?.url || img}
              onClick={() => img && openLightbox(i)}
            >
              {!img && 'Foto'}
            </ImageItem>
          ))}
        </ImageGrid>
      </HoleContent>
      
      {/* Secondary holes */}
      {secondaryHoles.map((hole, holeIdx) => (
        <HoleContent key={holeIdx} $hole={hole}>
          <ImageGrid style={{ gridTemplateColumns: '1fr 1fr', maxHeight: '90%' }}>
            {(secondaryImages[holeIdx]?.length > 0 ? secondaryImages[holeIdx] : [null, null]).map((img, i) => (
              <ImageItem 
                key={i} 
                $image={img?.url || img}
                onClick={() => img && openLightbox(4 + holeIdx * 2 + i)}
              >
                {!img && ''}
              </ImageItem>
            ))}
          </ImageGrid>
        </HoleContent>
      ))}
      
      {/* Lightbox */}
      {lightbox.open && allImages.length > 0 && (
        <Lightbox onClick={closeLightbox}>
          <LightboxClose onClick={closeLightbox}>×</LightboxClose>
          {allImages.length > 1 && (
            <>
              <LightboxNav $dir="prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</LightboxNav>
              <LightboxNav $dir="next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</LightboxNav>
            </>
          )}
          <LightboxImage 
            src={allImages[lightbox.index]?.url || allImages[lightbox.index]} 
            alt=""
            onClick={e => e.stopPropagation()}
          />
        </Lightbox>
      )}
    </Section>
  );
}

export default Gallery;
