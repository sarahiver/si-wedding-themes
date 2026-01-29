// Botanical PhotoUpload - Upload area in hole
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';
import { usePhotoUpload } from '../../components/shared/PhotoUploadCore';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--medium);
  margin-bottom: 1rem;
  text-align: center;
`;

const DropZone = styled.div`
  width: 100%;
  max-width: 240px;
  padding: 2rem 1rem;
  border: 2px dashed ${p => p.$drag ? 'var(--dark)' : 'var(--pale)'};
  background: ${p => p.$drag ? 'var(--off-white)' : 'var(--white)'};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--light);
  }
`;

const DropIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
`;

const DropText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--dark);
`;

const DropHint = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: var(--light);
  margin-top: 0.3rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 240px;
  height: 4px;
  background: var(--off-white);
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: var(--black);
  transition: width 0.3s;
`;

const ProgressText = styled.p`
  font-size: 0.75rem;
  color: var(--medium);
  margin-top: 0.5rem;
`;

const SuccessMsg = styled.div`
  text-align: center;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  color: var(--black);
  margin-bottom: 0.3rem;
`;

const SuccessText = styled.p`
  font-size: 0.85rem;
  color: var(--medium);
  margin-bottom: 1rem;
`;

const ResetBtn = styled.button`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--medium);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
`;

const ErrorMsg = styled.p`
  font-size: 0.75rem;
  color: #c00;
  margin-top: 0.5rem;
`;

function PhotoUpload() {
  const { content } = useWedding();
  const { mainHole } = useKnotholes();
  const uploadData = content?.photoupload || {};
  
  const title = uploadData.title || 'Eure Fotos';
  const description = uploadData.description || 'Teilt eure schönsten Momente';
  
  const [drag, setDrag] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    uploading, progress, error,
    fileInputRef, handleFileSelect, openFilePicker, handleDrop, handleDragOver,
  } = usePhotoUpload({
    maxFiles: 10,
    onSuccess: () => setSuccess(true),
  });

  const reset = () => setSuccess(false);

  return (
    <Section data-section="photos">
      <HoleContent $hole={mainHole}>
        {success ? (
          <SuccessMsg>
            <SuccessTitle>Danke!</SuccessTitle>
            <SuccessText>Eure Fotos wurden hochgeladen.</SuccessText>
            <ResetBtn onClick={reset}>Weitere hochladen</ResetBtn>
          </SuccessMsg>
        ) : (
          <>
            <Eyebrow>Teilen</Eyebrow>
            <Title>{title}</Title>
            <Subtitle>{description}</Subtitle>
            
            <DropZone
              $drag={drag}
              onClick={openFilePicker}
              onDrop={e => { handleDrop(e); setDrag(false); }}
              onDragOver={e => { handleDragOver(e); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
            >
              <DropIcon>📷</DropIcon>
              <DropText>{drag ? 'Ablegen' : 'Fotos auswählen'}</DropText>
              <DropHint>oder hierher ziehen</DropHint>
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
                  <ProgressFill $pct={progress} />
                </ProgressBar>
                <ProgressText>{Math.round(progress)}%</ProgressText>
              </>
            )}
            
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </>
        )}
      </HoleContent>
    </Section>
  );
}

export default PhotoUpload;
