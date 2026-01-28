// Contemporary PhotoUpload
import React, { useState, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';
import { uploadPhoto } from '../../lib/cloudinary';
import { savePhotoEntry } from '../../lib/supabase';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
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

const DropZone = styled.div`
  background: ${p => p.$dragging ? 'var(--coral)' : 'var(--gray-800)'};
  border: 4px dashed ${p => p.$dragging ? 'var(--white)' : 'var(--gray-600)'};
  padding: 4rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${p => p.$dragging ? pulse : 'none'} 0.5s ease-in-out infinite;
  
  &:hover {
    border-color: var(--coral);
    background: var(--gray-700);
  }
`;

const DropIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const DropText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 0.5rem;
`;

const DropSubtext = styled.p`
  font-size: 0.85rem;
  color: var(--gray-400);
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--coral);
  color: var(--white);
  border: 3px solid var(--white);
  box-shadow: 6px 6px 0 var(--white);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--white);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--gray-700);
  border: 2px solid var(--white);
  margin-top: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--coral);
  width: ${p => p.$progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-size: 0.85rem;
  color: var(--white);
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  padding: 3rem 2rem;
  text-align: center;
`;

const SuccessEmoji = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const SuccessText = styled.p`
  color: var(--gray-400);
  margin-top: 0.5rem;
`;

const ResetButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  background: var(--gray-800);
  color: var(--white);
  border: 2px solid var(--white);
  cursor: pointer;
  
  &:hover {
    background: var(--gray-700);
  }
`;

const NameInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 1rem;
  font-size: 1rem;
  background: var(--gray-800);
  color: var(--white);
  border: 3px solid var(--gray-600);
  text-align: center;
  margin-top: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: var(--coral);
  }
  
  &::placeholder {
    color: var(--gray-500);
  }
`;

function PhotoUpload() {
  const { project, content } = useWedding();
  const photouploadData = content?.photoupload || {};
  
  const title = photouploadData.title || 'Fotos teilen';
  const description = photouploadData.description || 'Teile deine schönsten Momente mit uns!';
  
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = [...e.target.files].filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !project?.id) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const result = await uploadPhoto(file);
        
        if (result.url) {
          await savePhotoEntry(project.id, {
            url: result.url,
            public_id: result.public_id,
            uploader_name: uploaderName || 'Anonym'
          });
        }
        
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setSelectedFiles([]);
    setProgress(0);
    setUploaderName('');
  };

  return (
    <Section id="photos">
      <Container>
        <Header>
          <Eyebrow>📸 Share your shots</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        {success ? (
          <SuccessMessage>
            <SuccessEmoji>🎉</SuccessEmoji>
            <SuccessTitle>Upload complete!</SuccessTitle>
            <SuccessText>Danke fürs Teilen! Die Fotos erscheinen nach Freigabe.</SuccessText>
            <ResetButton onClick={handleReset}>Mehr Fotos hochladen</ResetButton>
          </SuccessMessage>
        ) : (
          <>
            <DropZone
              $dragging={dragging}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <DropIcon>{selectedFiles.length > 0 ? '✅' : '📷'}</DropIcon>
              <DropText>
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} Foto${selectedFiles.length > 1 ? 's' : ''} ausgewählt`
                  : 'Fotos hier ablegen'}
              </DropText>
              <DropSubtext>
                {selectedFiles.length > 0 
                  ? 'Klicken um andere zu wählen'
                  : 'oder klicken zum Auswählen'}
              </DropSubtext>
              <HiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
            </DropZone>
            
            {selectedFiles.length > 0 && (
              <>
                <NameInput
                  type="text"
                  placeholder="Dein Name (optional)"
                  value={uploaderName}
                  onChange={e => setUploaderName(e.target.value)}
                />
                
                <UploadButton onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading...' : `${selectedFiles.length} Foto${selectedFiles.length > 1 ? 's' : ''} hochladen →`}
                </UploadButton>
              </>
            )}
            
            {uploading && (
              <>
                <ProgressBar>
                  <ProgressFill $progress={progress} />
                </ProgressBar>
                <ProgressText>{progress}% hochgeladen</ProgressText>
              </>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
