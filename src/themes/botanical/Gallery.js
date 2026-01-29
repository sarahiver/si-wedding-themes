// Botanical Tree Gallery
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  @media (max-width: 500px) { grid-template-columns: repeat(2, 1fr); }
`;

const ImageItem = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--off-white)'};
  cursor: ${p => p.$image ? 'pointer' : 'default'};
  filter: grayscale(100%);
  transition: all 0.3s;
  &:hover { filter: grayscale(50%); transform: scale(1.02); }
`;

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
  top: 2rem;
  right: 2rem;
  color: white;
  font-size: 2rem;
  background: none;
  cursor: pointer;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

function Gallery({ side = 'center' }) {
  const { content } = useWedding();
  const galleryData = content?.gallery || {};
  const title = galleryData.title || 'Galerie';
  const images = galleryData.images || [];
  
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  return (
    <ContentBranch side={side} wide eyebrow="Erinnerungen" title={title} align="center">
      <Grid>
        {(images.length > 0 ? images : Array(6).fill(null)).slice(0, 6).map((img, i) => (
          <ImageItem 
            key={i} 
            $image={img?.url || img}
            onClick={() => img && setLightbox({ open: true, index: i })}
          />
        ))}
      </Grid>
      
      {lightbox.open && images.length > 0 && (
        <Lightbox onClick={() => setLightbox({ open: false, index: 0 })}>
          <LightboxClose>×</LightboxClose>
          <LightboxImage src={images[lightbox.index]?.url || images[lightbox.index]} alt="" />
        </Lightbox>
      )}
    </ContentBranch>
  );
}

export default Gallery;
