import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitPhotoUpload, getPhotoUploads } from '../../lib/supabase';
import { uploadToCloudinary, isCloudinaryConfigured } from '../../lib/cloudinary';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 6rem 2rem;
  background: #fff;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease;
`;

const Title = styled.h2`
  font-family: 'Instrument Serif', serif;
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const Description = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Limit = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 2rem;
`;

const DropZone = styled.div`
  border: 2px dashed ${p => p.$active ? '#000' : '#ddd'};
  border-radius: 8px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${p => p.$active ? '#f9f9f9' : '#fff'};
  
  &:hover {
    border-color: #000;
  }
`;

const DropText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.8rem 2rem;
  background: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { background: #333; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Preview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.7);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  
  &:hover { background: #000; }
`;

const Progress = styled.div`
  width: 100%;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #000;
  transition: width 0.3s ease;
  width: ${p => p.$percent}%;
`;

const Status = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: ${p => p.$error ? '#d32f2f' : '#666'};
  margin-top: 1rem;
`;

const NameInput = styled.input`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const MAX_UPLOADS = 10;

function PhotoUpload() {
  const { content, projectId, slug } = useWedding();
  const data = content?.photoupload || {};
  
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploaderName, setUploaderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploadCount, setUploadCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  const inputRef = useRef(null);

  // Load existing upload count
  useEffect(() => {
    async function loadCount() {
      if (projectId) {
        const { data } = await getPhotoUploads(projectId, false);
        setUploadCount(data?.length || 0);
      }
    }
    loadCount();
  }, [projectId]);

  const remainingUploads = MAX_UPLOADS - uploadCount;
  const canUpload = remainingUploads > 0 && isCloudinaryConfigured();

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, remainingUploads - files.length);
    
    if (validFiles.length === 0) return;
    
    setFiles(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, { file, url: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!uploaderName.trim()) {
      setError('Bitte gib deinen Namen ein');
      return;
    }
    if (files.length === 0) {
      setError('Bitte wähle mindestens ein Foto');
      return;
    }

    setUploading(true);
    setError('');
    setStatus(`Hochladen... 0/${files.length}`);
    setProgress(0);

    const folder = `iverlasting/${slug}/guest-photos`;
    
    try {
      for (let i = 0; i < files.length; i++) {
        setStatus(`Hochladen... ${i + 1}/${files.length}`);
        
        const result = await uploadToCloudinary(files[i], folder, (percent) => {
          setProgress(Math.round(((i + percent / 100) / files.length) * 100));
        });

        // Save to Supabase
        await submitPhotoUpload(projectId, {
          uploadedBy: uploaderName,
          cloudinaryUrl: result.url,
          cloudinaryPublicId: result.publicId,
        });
      }

      setStatus(`${files.length} Foto${files.length > 1 ? 's' : ''} hochgeladen!`);
      setFiles([]);
      setPreviews([]);
      setUploaderName('');
      setUploadCount(prev => prev + files.length);
      setProgress(100);
      
      setTimeout(() => {
        setStatus('');
        setProgress(0);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen');
    } finally {
      setUploading(false);
    }
  };

  if (!isCloudinaryConfigured()) {
    return (
      <Section id="photoupload">
        <Container>
          <Title>{data.title || 'Teilt eure Fotos'}</Title>
          <Status $error>Foto-Upload ist derzeit nicht verfügbar.</Status>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="photoupload">
      <Container>
        <Title>{data.title || 'Teilt eure Fotos'}</Title>
        <Description>
          {data.description || 'Ladet eure schönsten Momente hoch und teilt sie mit uns!'}
        </Description>
        
        <Limit>
          {remainingUploads > 0 
            ? `Du kannst noch ${remainingUploads} Foto${remainingUploads !== 1 ? 's' : ''} hochladen (max. ${MAX_UPLOADS} pro Gast)`
            : 'Du hast das Upload-Limit erreicht'}
        </Limit>

        {canUpload && (
          <>
            <NameInput
              type="text"
              placeholder="Dein Name"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              disabled={uploading}
            />

            <DropZone
              $active={dragActive}
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <DropText>
                Fotos hierher ziehen oder klicken zum Auswählen
              </DropText>
              <Button type="button" disabled={uploading}>
                Fotos auswählen
              </Button>
            </DropZone>

            <HiddenInput
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
            />

            {previews.length > 0 && (
              <Preview>
                {previews.map((preview, i) => (
                  <PreviewItem key={i}>
                    <img src={preview.url} alt={`Preview ${i + 1}`} />
                    {!uploading && (
                      <RemoveBtn onClick={() => removeFile(i)}>×</RemoveBtn>
                    )}
                  </PreviewItem>
                ))}
              </Preview>
            )}

            {uploading && (
              <Progress>
                <ProgressBar $percent={progress} />
              </Progress>
            )}

            {files.length > 0 && (
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Wird hochgeladen...' : `${files.length} Foto${files.length > 1 ? 's' : ''} hochladen`}
              </Button>
            )}
          </>
        )}

        {status && <Status>{status}</Status>}
        {error && <Status $error>{error}</Status>}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
