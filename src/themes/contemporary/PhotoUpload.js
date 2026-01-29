// Contemporary PhotoUpload - Bold Loading State
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const stripes = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 40px 0; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--black);
  position: relative;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--gray-400);
  margin-top: 0.5rem;
`;

// Upload Area
const UploadArea = styled.div`
  background: var(--gray-900);
  border: 4px dashed ${p => p.$dragging ? 'var(--coral)' : 'var(--gray-600)'};
  padding: 3rem 2rem;
  cursor: ${p => p.$uploading ? 'wait' : 'pointer'};
  transition: all 0.3s ease;
  
  ${p => p.$dragging && `
    background: rgba(255, 107, 107, 0.1);
    border-color: var(--coral);
  `}
  
  ${p => !p.$uploading && `
    &:hover {
      border-color: var(--coral);
      background: var(--gray-800);
    }
  `}
`;

const UploadIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const UploadText = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.p`
  font-size: 0.85rem;
  color: var(--gray-500);
`;

// Loading State - BOLD
const LoadingOverlay = styled.div`
  background: var(--gray-900);
  border: 4px solid var(--coral);
  padding: 3rem 2rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  border: 6px solid var(--gray-700);
  border-top-color: var(--coral);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const LoadingSubtitle = styled.p`
  font-size: 1rem;
  color: var(--gray-400);
  margin-bottom: 2rem;
`;

const ProgressContainer = styled.div`
  background: var(--gray-800);
  border: 4px solid var(--white);
  height: 40px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: var(--coral);
  background-image: linear-gradient(
    45deg,
    rgba(255,255,255,0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255,255,255,0.15) 50%,
    rgba(255,255,255,0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 40px 40px;
  animation: ${stripes} 1s linear infinite;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--white);
  text-shadow: 2px 2px 0 var(--black);
`;

const ProgressHint = styled.p`
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

// Success State
const SuccessBox = styled.div`
  background: var(--electric);
  border: 4px solid var(--white);
  box-shadow: 8px 8px 0 var(--white);
  padding: 3rem 2rem;
  text-align: center;
`;

const SuccessEmoji = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${p => p.$variant === 'secondary' ? 'var(--gray-800)' : 'var(--coral)'};
  color: var(--white);
  border: 4px solid var(--white);
  box-shadow: 6px 6px 0 ${p => p.$variant === 'secondary' ? 'var(--gray-600)' : 'var(--white)'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${p => p.$variant === 'secondary' ? '1.5rem' : '0'};
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 ${p => p.$variant === 'secondary' ? 'var(--gray-600)' : 'var(--white)'};
  }
  
  &:active {
    transform: translate(0, 0);
    box-shadow: 6px 6px 0 ${p => p.$variant === 'secondary' ? 'var(--gray-600)' : 'var(--white)'};
  }
`;

function PhotoUpload() {
  const { content } = useWedding();
  const photouploadData = content?.photoupload || {};
  
  const title = photouploadData.title || 'Fotos teilen';
  const description = photouploadData.description || 'Teile deine schönsten Momente mit uns!';
  
  const [dragging, setDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    uploading, progress, error, success,
    fileInputRef, handleFileSelect, openFilePicker, handleDrop, handleDragOver,
    resetState
  } = usePhotoUpload({ maxFiles: 10, maxSizeMB: 10 });

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
    }
  }, [success]);

  const onDrop = (e) => {
    setDragging(false);
    handleDrop(e);
  };

  const onDragOver = (e) => {
    handleDragOver(e);
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const handleUploadMore = () => {
    setShowSuccess(false);
    resetState();
  };

  return (
    <Section id="photos">
      <Container>
        <Header>
          <Eyebrow>📸 Share your shots</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        {showSuccess ? (
          <SuccessBox>
            <SuccessEmoji>🎉</SuccessEmoji>
            <SuccessTitle>Upload Complete!</SuccessTitle>
            <SuccessText>Danke fürs Teilen! Die Fotos erscheinen nach Freigabe in der Galerie.</SuccessText>
            <Button onClick={handleUploadMore}>Mehr Fotos hochladen</Button>
          </SuccessBox>
        ) : uploading ? (
          <LoadingOverlay>
            <LoadingIcon />
            <LoadingTitle>Uploading...</LoadingTitle>
            <LoadingSubtitle>Bitte warten, das Fenster nicht schließen</LoadingSubtitle>
            <ProgressContainer>
              <ProgressFill $progress={progress} />
              <ProgressText>{progress}%</ProgressText>
            </ProgressContainer>
            <ProgressHint>Deine Fotos werden hochgeladen</ProgressHint>
          </LoadingOverlay>
        ) : (
          <>
            <UploadArea
              $dragging={dragging}
              $uploading={uploading}
              onClick={openFilePicker}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            >
              <UploadIcon>📷</UploadIcon>
              <UploadText>
                {dragging ? 'Jetzt loslassen!' : 'Fotos hier ablegen'}
              </UploadText>
              <UploadHint>oder klicken zum Auswählen • Max. 10 Bilder</UploadHint>
            </UploadArea>
            
            {error && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: 'var(--coral)', 
                border: '3px solid var(--white)',
                color: 'var(--white)',
                fontWeight: '700'
              }}>
                {error}
              </div>
            )}
          </>
        )}
        
        <HiddenFileInput 
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          multiple={true}
          accept="image/*"
        />
      </Container>
    </Section>
  );
}

export default PhotoUpload;
