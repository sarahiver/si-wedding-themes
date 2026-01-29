// Botanical PhotoUpload - Nature-Inspired Photo Sharing
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload } from '../../components/shared/PhotoUploadCore';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-moss);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.08};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-tight);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  color: var(--green-forest);
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--text-light);
  margin-top: 0.5rem;
`;

const UploadCard = styled.div`
  background: var(--bg-cream);
  padding: clamp(2rem, 6vw, 3rem);
  border-radius: 40px;
  box-shadow: var(--shadow-medium);
`;

const DropZone = styled.div`
  border: 3px dashed ${p => p.$dragging ? 'var(--green-fern)' : 'var(--bg-moss)'};
  border-radius: 30px;
  padding: 3rem 2rem;
  text-align: center;
  background: ${p => p.$dragging ? 'rgba(92, 138, 77, 0.05)' : 'var(--bg-fog)'};
  transition: all 0.3s var(--ease-nature);
  cursor: pointer;
  
  &:hover {
    border-color: var(--green-sage);
    background: rgba(92, 138, 77, 0.03);
  }
`;

const UploadIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${sway} 4s ease-in-out infinite;
`;

const UploadText = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const HiddenInput = styled.input`
  display: none;
`;

// Progress state
const ProgressContainer = styled.div`
  margin-top: 1.5rem;
`;

const ProgressBar = styled.div`
  height: 12px;
  background: var(--bg-moss);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 0.75rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, var(--green-sage) 0%, var(--green-fern) 100%);
  border-radius: 20px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-medium);
  text-align: center;
`;

// Success state
const SuccessCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessEmoji = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: ${sway} 3s ease-in-out infinite;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 2.5rem;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: var(--text-medium);
  margin-bottom: 1.5rem;
`;

const ResetButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--bg-fog);
  border: 2px solid var(--bg-moss);
  border-radius: 25px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--green-forest);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--green-mint);
  }
`;

const ErrorMessage = styled.div`
  background: rgba(193, 127, 89, 0.15);
  border: 2px solid var(--earth-clay);
  color: var(--earth-bark);
  padding: 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
`;

function PhotoUpload() {
  const { content } = useWedding();
  const photouploadData = content?.photoupload || {};
  
  const title = photouploadData.title || 'Eure Fotos';
  const description = photouploadData.description || 'Teilt eure schönsten Momente mit uns!';
  
  const [dragging, setDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    uploading, progress, error, success,
    fileInputRef, handleFileSelect, openFilePicker, handleDrop, handleDragOver,
  } = usePhotoUpload({
    maxFiles: 10,
    onSuccess: () => setShowSuccess(true),
  });

  const handleReset = () => {
    setShowSuccess(false);
  };

  return (
    <Section id="photos">
      <DecoLeaf $size="150px" $color="var(--green-mint)" $opacity={0.06} style={{ top: '10%', left: '-5%' }} />
      <DecoLeaf $size="100px" $color="var(--green-sage)" $opacity={0.05} style={{ bottom: '15%', right: '-3%' }} $duration="12s" />
      
      <Container>
        <Header>
          <Eyebrow>📸 Teilen</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        <UploadCard>
          {showSuccess ? (
            <SuccessCard>
              <SuccessEmoji>🌸</SuccessEmoji>
              <SuccessTitle>Danke!</SuccessTitle>
              <SuccessText>Eure Fotos wurden hochgeladen. Wir freuen uns darauf, die Erinnerungen zu sehen!</SuccessText>
              <ResetButton onClick={handleReset}>Weitere Fotos hochladen</ResetButton>
            </SuccessCard>
          ) : (
            <>
              <DropZone
                $dragging={dragging}
                onClick={openFilePicker}
                onDrop={(e) => {
                  handleDrop(e);
                  setDragging(false);
                }}
                onDragOver={(e) => {
                  handleDragOver(e);
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
              >
                <UploadIcon>🌿</UploadIcon>
                <UploadText>
                  {dragging ? 'Fotos hier ablegen!' : 'Fotos auswählen oder hierher ziehen'}
                </UploadText>
                <UploadHint>Max. 10 Bilder, je max. 10 MB</UploadHint>
              </DropZone>
              
              <HiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
              
              {uploading && (
                <ProgressContainer>
                  <ProgressBar>
                    <ProgressFill $progress={progress} />
                  </ProgressBar>
                  <ProgressText>Hochladen... {Math.round(progress)}%</ProgressText>
                </ProgressContainer>
              )}
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </>
          )}
        </UploadCard>
      </Container>
    </Section>
  );
}

export default PhotoUpload;
