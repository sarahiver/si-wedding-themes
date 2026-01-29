// GalleryContent
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../../context/WeddingContext';

const Wrapper = styled.div``;

const Eyebrow = styled.p`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--black);
  margin-bottom: 1rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const Item = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$img ? `url(${p.$img}) center/cover` : 'var(--off-white)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: var(--light);
  cursor: ${p => p.$img ? 'pointer' : 'default'};
  filter: grayscale(100%);
  transition: filter 0.3s;
  
  &:hover {
    filter: grayscale(50%);
  }
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LightboxImg = styled.img`
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: white;
  font-size: 2rem;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

function GalleryContent() {
  const { content } = useWedding();
  const data = content?.gallery || {};
  const [lightbox, setLightbox] = useState(null);
  
  const title = data.title || 'Galerie';
  const images = data.images || [];

  return (
    <Wrapper>
      <Eyebrow>Erinnerungen</Eyebrow>
      <Title>{title}</Title>
      <Grid>
        {(images.length > 0 ? images : Array(4).fill(null)).slice(0, 4).map((img, i) => (
          <Item 
            key={i} 
            $img={img?.url || img}
            onClick={() => img && setLightbox(img?.url || img)}
          >
            {!img && `Foto ${i + 1}`}
          </Item>
        ))}
      </Grid>
      
      {lightbox && (
        <Lightbox onClick={() => setLightbox(null)}>
          <LightboxClose>×</LightboxClose>
          <LightboxImg src={lightbox} alt="" onClick={e => e.stopPropagation()} />
        </Lightbox>
      )}
    </Wrapper>
  );
}

export default GalleryContent;
