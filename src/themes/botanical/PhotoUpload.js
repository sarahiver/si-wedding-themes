import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 800px;
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
  line-height: 1.7;
`;

const UploadArea = styled.div`
  background: ${p => p.$isDragging ? 'var(--sage-muted)' : 'var(--cream-light)'};
  border: 2px dashed ${p => p.$isDragging ? 'var(--sage)' : 'var(--sage-light)'};
  border-radius: 16px;
  padding: 4rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  
  &:hover {
    border-color: var(--sage);
    background: var(--sage-muted);
  }
  
  .icon { 
    font-size: 4rem; 
    margin-bottom: 1rem; 
    opacity: 0.5;
    ${p => p.$uploading && `animation: ${pulse} 1s ease infinite;`}
  }
  
  p { 
    font-family: 'Lato', sans-serif; 
    color: var(--text-light);
    margin-bottom: 0.5rem;
  }
  
  .hint {
    font-size: 0.85rem;
    opacity: 0.7;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--cream-dark);
  border-radius: 3px;
  margin-top: 1.5rem;
  overflow: hidden;
  
  .fill {
    height: 100%;
    background: var(--sage);
    border-radius: 3px;
    transition: width 0.3s ease;
    width: ${p => p.$progress}%;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 3rem;
`;

const PhotoCard = styled.div`
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: var(--cream-dark);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(192, 57, 43, 0.1);
  border-radius: 8px;
`;

function PhotoUpload({ content = {} }) {
  const [isDragging, setIsDragging] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  
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

  const title = content.title || 'Teilt eure Fotos';
  const description = content.description || 'Ladet hier eure Schnappschüsse vom Tag hoch! Die schönsten Momente, festgehalten von euch.';

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Show modal on success/error
  useEffect(() => {
    if (success) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: 'Eure Fotos wurden hochgeladen! Sie werden nach Freigabe sichtbar.',
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
    setIsDragging(false);
    handleDrop(e);
  };

  const onDragOver = (e) => {
    handleDragOver(e);
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Section id="photos">
      <Container>
        <Title>{title}</Title>
        <Description>{description}</Description>
        
        <UploadArea 
          onClick={openFilePicker}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          $isDragging={isDragging}
          $uploading={uploading}
        >
          <div className="icon">{uploading ? '⏳' : '📸'}</div>
          <p>{uploading ? `Wird hochgeladen... ${progress}%` : 'Klicken oder Dateien hierher ziehen'}</p>
          <p className="hint">Max. 10 Bilder, je max. 10MB</p>
          
          {uploading && (
            <ProgressBar $progress={progress}>
              <div className="fill" />
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
          <PhotoGrid>
            {uploadedPhotos.map(photo => (
              <PhotoCard key={photo.id}>
                <img src={photo.cloudinary_url} alt="Hochzeitsfoto" />
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
