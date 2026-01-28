// src/components/PhotoUpload.js
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Section = styled.section`
  padding: 150px 5%;
  background: linear-gradient(to bottom, #FAF8F5, #F5F3EE);
  position: relative;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.5);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #1A1A1A;

  span {
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #888;
  margin-top: 15px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const UploadArea = styled.div`
  background: #FFFFFF;
  border: 2px dashed ${p => p.$dragActive ? '#B8976A' : '#E0E0E0'};
  padding: 80px 40px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease 0.2s, border-color 0.3s ease, background 0.3s ease;

  ${p => p.$dragActive && `
    background: rgba(184, 151, 106, 0.05);
    border-color: #B8976A;
  `}

  &:hover {
    border-color: #B8976A;
  }

  @media (max-width: 600px) {
    padding: 50px 20px;
  }
`;

const UploadIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 25px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const UploadTitle = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.8rem;
  color: #1A1A1A;
  margin-bottom: 15px;
`;

const UploadText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 25px;
`;

const UploadButton = styled.label`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1A1A1A;
  background: #B8976A;
  padding: 18px 40px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #D4AF37;
    transform: translateY(-2px);
  }

  input {
    display: none;
  }
`;

const FileInfo = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #AAA;
  margin-top: 20px;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 40px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #F0F0F0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  color: #FFFFFF;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${PreviewItem}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #CC0000;
  }
`;

const SubmitSection = styled.div`
  margin-top: 40px;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease 0.4s;
`;

const SubmitButton = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #FFFFFF;
  background: #1A1A1A;
  padding: 20px 60px;
  transition: all 0.4s ease;

  &:hover {
    background: #B8976A;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #CCC;
    cursor: not-allowed;
    transform: none;
  }
`;

function PhotoUpload() {
  const [isVisible, setIsVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    addFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const withPreviews = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));
    setFiles(prev => [...prev, ...withPreviews]);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const toRemove = prev.find(f => f.id === id);
      if (toRemove) URL.revokeObjectURL(toRemove.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSubmit = () => {
    console.log('Uploading files:', files);
    // Handle upload
  };

  return (
    <Section ref={sectionRef} id="upload">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Foto Upload</Eyebrow>
          <Title>Teilt eure <span>Momente</span></Title>
          <Subtitle>
            Ladet eure schönsten Fotos hoch und teilt sie mit allen Gästen
          </Subtitle>
        </Header>

        <UploadArea
          $visible={isVisible}
          $dragActive={dragActive}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadIcon>📸</UploadIcon>
          <UploadTitle>Fotos hochladen</UploadTitle>
          <UploadText>
            Zieht eure Bilder hierher oder klickt um auszuwählen
          </UploadText>
          <UploadButton>
            Dateien auswählen
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
            />
          </UploadButton>
          <FileInfo>JPG, PNG oder HEIC · Max. 20MB pro Datei</FileInfo>
        </UploadArea>

        {files.length > 0 && (
          <>
            <PreviewGrid>
              {files.map((file) => (
                <PreviewItem key={file.id}>
                  <img src={file.preview} alt="Preview" />
                  <RemoveButton onClick={() => removeFile(file.id)}>×</RemoveButton>
                </PreviewItem>
              ))}
            </PreviewGrid>

            <SubmitSection $visible={isVisible}>
              <SubmitButton onClick={handleSubmit} disabled={files.length === 0}>
                {files.length} {files.length === 1 ? 'Foto' : 'Fotos'} hochladen
              </SubmitButton>
            </SubmitSection>
          </>
        )}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
