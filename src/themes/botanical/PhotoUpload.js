// Botanical PhotoUpload - Clean upload interface
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload } from '../../components/shared/PhotoUploadCore';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--forest-main);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-mist);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--cream);
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--forest-mist);
  margin-top: 0.5rem;
`;

const UploadCard = styled.div`
  background: var(--cream);
  padding: 2rem;
`;

const DropZone = styled.div`
  border: 2px dashed ${p => p.$dragging ? 'var(--forest-deep)' : 'var(--cream-dark)'};
  background: ${p => p.$dragging ? 'var(--cream-dark)' : 'var(--warm-white)'};
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--forest-light);
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const UploadText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--forest-deep);
  margin-bottom: 0.25rem;
`;

const UploadHint = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--bark-light);
`;

const HiddenInput = styled.input`
  display: none;
`;

const ProgressBar = styled.div`
  margin-top: 1.5rem;
  height: 4px;
  background: var(--cream-dark);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: var(--forest-deep);
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--bark-medium);
  text-align: center;
  margin-top: 0.75rem;
`;

const SuccessCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: var(--forest-deep);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--bark-medium);
`;

const ResetButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  background: transparent;
  border: 1px solid var(--bark-light);
  color: var(--bark-medium);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--forest-light);
    color: var(--forest-deep);
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
`;

function PhotoUpload() {
  const { content } = useWedding();
  const photouploadData = content?.photoupload || {};
  
  const title = photouploadData.title || 'Eure Fotos';
  const description = photouploadData.description || 'Teilt eure schönsten Momente mit uns';
  
  const [dragging, setDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    uploading, progress, error,
    fileInputRef, handleFileSelect, openFilePicker, handleDrop, handleDragOver,
  } = usePhotoUpload({
    maxFiles: 10,
    onSuccess: () => setShowSuccess(true),
  });

  const handleReset = () => setShowSuccess(false);

  return (
    <Section id="photos" data-section="photos">
      <Content>
        <Header>
          <Eyebrow>Teilen</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        <UploadCard>
          {showSuccess ? (
            <SuccessCard>
              <SuccessTitle>Danke!</SuccessTitle>
              <SuccessText>Eure Fotos wurden hochgeladen.</SuccessText>
              <ResetButton onClick={handleReset}>Weitere hochladen</ResetButton>
            </SuccessCard>
          ) : (
            <>
              <DropZone
                $dragging={dragging}
                onClick={openFilePicker}
                onDrop={(e) => { handleDrop(e); setDragging(false); }}
                onDragOver={(e) => { handleDragOver(e); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
              >
                <UploadIcon>📷</UploadIcon>
                <UploadText>
                  {dragging ? 'Hier ablegen' : 'Fotos auswählen'}
                </UploadText>
                <UploadHint>oder hierher ziehen • max. 10 Bilder</UploadHint>
              </DropZone>
              
              <HiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
              
              {uploading && (
                <>
                  <ProgressBar>
                    <ProgressFill $progress={progress} />
                  </ProgressBar>
                  <ProgressText>{Math.round(progress)}%</ProgressText>
                </>
              )}
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </>
          )}
        </UploadCard>
      </Content>
    </Section>
  );
}

export default PhotoUpload;
