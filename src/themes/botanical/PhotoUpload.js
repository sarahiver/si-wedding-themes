import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
`;

const UploadArea = styled.div`
  background: var(--cream-light);
  border: 2px dashed var(--sage-light);
  border-radius: 16px;
  padding: 4rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--sage);
    background: var(--sage-muted);
  }
  
  .icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
  p { font-family: 'Lato', sans-serif; color: var(--text-light); }
`;

const HiddenInput = styled.input`
  display: none;
`;

function PhotoUpload({ content = {} }) {
  const { projectId } = useWedding();
  const [uploading, setUploading] = useState(false);

  const title = content.title || 'Teilt eure Fotos';
  const description = content.description || 'Ladet hier eure Schnappschüsse hoch!';

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setUploading(true);
    // Cloudinary upload logic would go here
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <Section id="photos">
      <Container>
        <Title>{title}</Title>
        <Description>{description}</Description>
        
        <label>
          <UploadArea>
            <div className="icon">📸</div>
            <p>{uploading ? 'Wird hochgeladen...' : 'Klicken oder Dateien hierher ziehen'}</p>
          </UploadArea>
          <HiddenInput type="file" multiple accept="image/*" onChange={handleUpload} />
        </label>
      </Container>
    </Section>
  );
}

export default PhotoUpload;
