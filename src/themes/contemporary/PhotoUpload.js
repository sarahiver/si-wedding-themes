import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(135deg, var(--yellow), var(--coral));
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(0,0,0,0.7);
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.1s;
`;

const DropZone = styled.div`
  background: var(--white);
  padding: 4rem 2rem;
  border: 4px dashed var(--black);
  text-align: center;
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.2s;
  
  &:hover {
    background: var(--gray-100);
  }
`;

const DropZoneDragging = styled(DropZone)`
  background: var(--gray-100);
  border-style: solid;
  animation: ${pulse} 0.5s ease infinite;
`;

const DropIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const DropTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const DropText = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 1.5rem;
`;

const BrowseButton = styled.span`
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 var(--black);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)', 'var(--pink)'];

const PreviewItem = styled.div`
  aspect-ratio: 1;
  background: ${p => colors[p.$index % colors.length]};
  border: 3px solid var(--black);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 28px;
  height: 28px;
  background: var(--coral);
  color: var(--white);
  border: 2px solid var(--black);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--black);
  }
`;

const UploadButton = styled.button`
  width: 100%;
  margin-top: 2rem;
  padding: 1.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--white);
  background: var(--black);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--purple);
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--black);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: var(--shadow-md);
  }
`;

function PhotoUpload() {
  const { content, projectId } = useWedding();
  const photouploadData = content?.photoupload || {};
  const onUpload = (files) => console.log("Upload", files);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const sectionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);
    if (onUpload) await onUpload(files);
    setTimeout(() => {
      setUploading(false);
      setFiles([]);
    }, 2000);
  };

  const DropZoneComponent = dragging ? DropZoneDragging : DropZone;

  return (
    <Section ref={sectionRef} id="photos">
      <Container>
        <Header>
          <Title $visible={visible}>📸 Foto Upload</Title>
          <Subtitle $visible={visible}>Teile deine schönsten Momente mit uns</Subtitle>
        </Header>
        
        <DropZoneComponent 
          $visible={visible}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <DropIcon>📷</DropIcon>
          <DropTitle>Fotos hochladen</DropTitle>
          <DropText>Drag & Drop oder klicken zum Auswählen</DropText>
          <BrowseButton>Dateien auswählen</BrowseButton>
          <HiddenInput 
            ref={inputRef}
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileSelect}
          />
        </DropZoneComponent>
        
        {files.length > 0 && (
          <>
            <PreviewGrid>
              {files.map((file, i) => (
                <PreviewItem key={i} $index={i}>
                  📷
                  <RemoveButton onClick={() => removeFile(i)}>×</RemoveButton>
                </PreviewItem>
              ))}
            </PreviewGrid>
            
            <UploadButton onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : `${files.length} Fotos hochladen →`}
            </UploadButton>
          </>
        )}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
