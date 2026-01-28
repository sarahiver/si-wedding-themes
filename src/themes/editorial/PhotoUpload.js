import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const progressAnimation = keyframes`
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-light-gray);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 4rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(2.5rem, 10vw, 5rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 1.5rem;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const UploadArea = styled.div`
  background: var(--editorial-white);
  padding: clamp(3rem, 8vw, 5rem) 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px dashed ${p => p.$dragging ? 'var(--editorial-red)' : 'var(--editorial-light-gray)'};
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
  
  ${p => p.$dragging && css`
    border-color: var(--editorial-red);
    background: rgba(196, 30, 58, 0.05);
  `}
  
  ${p => p.$uploading && css`
    animation: ${pulse} 1.5s ease infinite;
    pointer-events: none;
  `}
  
  &:hover {
    border-color: var(--editorial-black);
  }
`;

const UploadIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const UploadTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 0.75rem;
`;

const UploadText = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--editorial-gray);
  margin-bottom: 0;
`;

const UploadHint = styled.span`
  display: block;
  font-size: 0.75rem;
  color: var(--editorial-gray);
  margin-top: 1rem;
  opacity: 0.7;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--editorial-light-gray);
  margin-top: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, var(--editorial-red), #ff6b6b, var(--editorial-red));
  background-size: 200% 100%;
  animation: ${progressAnimation} 1s linear infinite;
  transition: width 0.3s ease;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 3rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.5s;
  `}
`;

const PhotoCard = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--editorial-white);
  
  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
    transition: filter 0.3s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
  }
`;

const PhotoBadge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: ${p => p.$approved ? '#4CAF50' : 'var(--editorial-red)'};
  color: var(--editorial-white);
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
`;

// ============================================
// COMPONENT
// ============================================

function PhotoUpload() {
  const { content } = useWedding();
  const photouploadData = content?.photoupload || {};
  
  const title = photouploadData.title || 'Teilt eure Fotos';
  const description = photouploadData.description || 'Ladet hier eure Schnappschüsse hoch – die schönsten Momente, festgehalten von euch.';
  
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  const {
    uploading,
    progress,
    uploadedPhotos,
    error,
    success,
    fileInputRef,
    handleFileSelect,
    openFilePicker,
    handleDrop,
    handleDragOver,
    loadPhotos,
  } = usePhotoUpload({ maxFiles: 10, maxSizeMB: 10 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  useEffect(() => {
    if (success) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: 'Fotos wurden hochgeladen! Sie werden nach Freigabe sichtbar.',
      });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setModalState({
        isOpen: true,
        type: 'error',
        message: error,
      });
    }
  }, [error]);

  const onDrop = (e) => {
    setDragging(false);
    handleDrop(e);
  };

  const onDragOver = (e) => {
    handleDragOver(e);
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  return (
    <Section id="photoupload" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Eure Schnappschüsse</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        <UploadArea
          $visible={visible}
          $dragging={dragging}
          $uploading={uploading}
          onClick={openFilePicker}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <UploadIcon>{uploading ? '⏳' : '📸'}</UploadIcon>
          <UploadTitle>
            {uploading ? `Wird hochgeladen... ${progress}%` : 'Fotos hochladen'}
          </UploadTitle>
          <UploadText>
            {dragging ? 'Jetzt loslassen!' : 'Klicken oder Dateien hierher ziehen'}
          </UploadText>
          <UploadHint>Max. 10 Bilder, je max. 10MB</UploadHint>
          
          {uploading && (
            <ProgressBar>
              <ProgressFill $progress={progress} />
            </ProgressBar>
          )}
        </UploadArea>
        
        <HiddenFileInput 
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          multiple={true}
          accept="image/*"
        />
        
        {uploadedPhotos.length > 0 && (
          <PhotoGrid $visible={visible}>
            {uploadedPhotos.map(photo => (
              <PhotoCard key={photo.id}>
                <img src={photo.cloudinary_url} alt="Hochzeitsfoto" loading="lazy" />
                <PhotoBadge $approved={photo.approved}>
                  {photo.approved ? 'Freigegeben' : 'Wartet auf Freigabe'}
                </PhotoBadge>
              </PhotoCard>
            ))}
          </PhotoGrid>
        )}
      </Container>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={modalState.type === 'success' ? 3000 : 0}
      />
    </Section>
  );
}

export default PhotoUpload;
