import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const GoldLine = styled.div`
  width: 1px;
  height: 30px;
  background: var(--luxe-gold);
  margin: 0 auto 1.5rem;
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
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const DropZone = styled.div`
  padding: 3rem 2rem;
  background: var(--luxe-white);
  border: 1px dashed ${p => p.$isDragging ? 'var(--luxe-gold)' : 'var(--luxe-border)'};
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: var(--luxe-gold);
  }
`;

const DropText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--luxe-text-light);
  margin-bottom: 0.5rem;
`;

const DropSubtext = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--luxe-text-muted);
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const Preview = styled.div`
  aspect-ratio: 1;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Success = styled.p`
  text-align: center;
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--luxe-gold);
  margin-top: 1.5rem;
`;

function PhotoUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    processFiles(files);
  }, []);
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    processFiles(files);
  };
  
  const processFiles = async (files) => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    // Demo: In production, upload to storage
    for (const file of files) {
      console.log('Photo upload:', { filename: file.name, size: file.size });
    }
    
    setUploaded(true);
  };
  
  return (
    <Section id="photos">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Fotos</Eyebrow>
          <Title>Teilt eure Bilder</Title>
        </Header>
        
        <DropZone
          $isDragging={isDragging}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('photo-input').click()}
        >
          <DropText>Fotos hier ablegen</DropText>
          <DropSubtext>oder klicken zum Auswählen</DropSubtext>
          <FileInput
            id="photo-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
        </DropZone>
        
        {previews.length > 0 && (
          <PreviewGrid>
            {previews.map((src, index) => (
              <Preview key={index}>
                <img src={src} alt={`Preview ${index + 1}`} />
              </Preview>
            ))}
          </PreviewGrid>
        )}
        
        {uploaded && <Success>Danke für eure Fotos!</Success>}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
