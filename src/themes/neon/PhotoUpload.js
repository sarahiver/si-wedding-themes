import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const glowPulse = keyframes`
  0%, 100% { 
    border-color: var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
  50% { 
    border-color: var(--neon-pink);
    box-shadow: 0 0 40px rgba(255, 0, 255, 0.3);
  }
`;

const uploadProgress = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const Section = styled.section`
  min-height: 100vh;
  background: var(--neon-bg);
  padding: 120px 5vw;
  position: relative;
  overflow: hidden;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const CommandLine = styled.div`
  font-family: 'Space Grotesk', monospace;
  color: var(--neon-green);
  font-size: 0.9rem;
  margin-bottom: 15px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.5s ease;
  
  &::before {
    content: '$ ';
    color: var(--neon-cyan);
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 15px;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 30px rgba(0, 255, 255, 0.4);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  font-family: 'Space Grotesk', sans-serif;
  max-width: 600px;
  margin: 0 auto;
`;

const DropZone = styled.div`
  border: 2px dashed ${props => props.isDragging ? 'var(--neon-pink)' : 'var(--neon-cyan)'};
  border-radius: 8px;
  padding: 60px 40px;
  text-align: center;
  background: ${props => props.isDragging ? 'rgba(255, 0, 255, 0.05)' : 'rgba(0, 255, 255, 0.02)'};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${props => props.isDragging ? glowPulse : 'none'} 1s infinite;
  
  &:hover {
    border-color: var(--neon-pink);
    background: rgba(255, 0, 255, 0.05);
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(0, 255, 255, 0.2),
      transparent
    );
    animation: ${scanline} 4s linear infinite;
    opacity: ${props => props.isDragging ? 1 : 0.3};
  }
`;

const UploadIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 25px;
  border: 2px solid var(--neon-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--neon-cyan);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 15px;
    height: 15px;
    border-top: 2px solid var(--neon-pink);
    border-left: 2px solid var(--neon-pink);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 15px;
    height: 15px;
    border-bottom: 2px solid var(--neon-pink);
    border-right: 2px solid var(--neon-pink);
  }
`;

const DropText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  color: white;
  margin-bottom: 10px;
`;

const DropSubtext = styled.p`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
`;

const HiddenInput = styled.input`
  display: none;
`;

const BrowseButton = styled.span`
  color: var(--neon-cyan);
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--neon-pink);
    text-shadow: 0 0 10px var(--neon-pink);
  }
`;

const FileFormats = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const Format = styled.span`
  padding: 5px 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const UploadedFiles = styled.div`
  margin-top: 40px;
`;

const FilesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
`;

const FilesTitle = styled.h3`
  font-family: 'Space Grotesk', monospace;
  font-size: 1rem;
  color: var(--neon-cyan);
  
  &::before {
    content: '> ';
    color: var(--neon-pink);
  }
`;

const FileCount = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  
  span {
    color: var(--neon-green);
  }
`;

const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
`;

const FileCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid ${props => props.uploading ? 'var(--neon-pink)' : 'rgba(255, 255, 255, 0.1)'};
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  }
`;

const FilePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.uploading ? 0.5 : 1};
  transition: opacity 0.3s ease;
`;

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 15, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProgressBar = styled.div`
  width: 80%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink));
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: var(--neon-cyan);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(10, 10, 15, 0.8);
  border: 1px solid rgba(255, 95, 86, 0.5);
  color: #ff5f56;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  
  ${FileCard}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: #ff5f56;
    color: white;
    box-shadow: 0 0 10px rgba(255, 95, 86, 0.5);
  }
`;

const FileName = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(transparent, rgba(10, 10, 15, 0.9));
  font-family: 'Space Grotesk', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UploadComplete = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid var(--neon-green);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.65rem;
  color: var(--neon-green);
`;

const StatusBar = styled.div`
  margin-top: 30px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
`;

const StatusText = styled.span`
  color: ${props => props.color || 'rgba(255, 255, 255, 0.6)'};
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: var(--neon-cyan);
  margin-left: 5px;
  animation: ${blink} 1s infinite;
`;

const PhotoUpload = () => {
  const { content, project } = useWedding();
  const photoData = content?.photoupload || {};
  
  const projectId = project?.id;
  const slug = project?.slug;
  const title = photoData.title || 'Fotos hochladen';
  
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  const sectionRef = useRef(null);
  
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 50;
  const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
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
  
  const uploadFile = async (fileObj) => {
    try {
      // Dynamic import to avoid issues if cloudinary/supabase not configured
      const { uploadToCloudinary } = await import('../../lib/cloudinary');
      const { submitPhotoUpload } = await import('../../lib/supabase');
      
      // Upload to Cloudinary
      const result = await uploadToCloudinary(fileObj.file, {
        folder: slug ? `weddings/${slug}/photos` : 'weddings/photos',
        onProgress: (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, progress } : f
          ));
        }
      });
      
      // Save to Supabase
      if (result.url && projectId) {
        await submitPhotoUpload(projectId, {
          cloudinaryUrl: result.url,
          cloudinaryPublicId: result.public_id,
          uploadedBy: 'Guest'
        });
      }
      
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, uploading: false, uploaded: true, progress: 100 } : f
      ));
    } catch (err) {
      console.error('Upload failed:', err);
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, uploading: false, error: true } : f
      ));
    }
  };
  
  const handleFiles = useCallback((newFiles) => {
    const validFiles = Array.from(newFiles)
      .filter(file => {
        if (!acceptedFormats.includes(file.type)) return false;
        if (file.size > maxFileSize) return false;
        return true;
      })
      .slice(0, maxFiles - files.length)
      .map(file => ({
        id: Date.now() + Math.random(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        uploading: true,
        uploaded: false,
        progress: 0
      }));
    
    setFiles(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      uploadFile(file);
    });
  }, [files.length, maxFiles, maxFileSize, projectId, slug]);
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);
  
  const handleInputChange = useCallback((e) => {
    handleFiles(e.target.files);
  }, [handleFiles]);
  
  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };
  
  const uploadedCount = files.filter(f => f.uploaded).length;
  const uploadingCount = files.filter(f => f.uploading).length;
  
  return (
    <Section ref={sectionRef} id="photo-upload">
      <GridOverlay />
      
      <Container>
        <Header>
          <CommandLine visible={visible}>
            ./photo_upload.sh --init --max-size=10MB
          </CommandLine>
          <Title>Fotos Hochladen</Title>
          <Subtitle>
            Teilt eure schönsten Momente mit uns! 
            Ladet eure Fotos hier hoch und helft uns, Erinnerungen zu sammeln.
          </Subtitle>
        </Header>
        
        <DropZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <HiddenInput
            ref={inputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(',')}
            onChange={handleInputChange}
          />
          
          <UploadIcon>↑</UploadIcon>
          <DropText>
            {isDragging ? 'Dateien hier ablegen!' : 'Fotos hierher ziehen'}
          </DropText>
          <DropSubtext>
            oder <BrowseButton>Dateien durchsuchen</BrowseButton>
          </DropSubtext>
          
          <FileFormats>
            <Format>.jpg</Format>
            <Format>.png</Format>
            <Format>.gif</Format>
            <Format>.webp</Format>
            <Format>max 10MB</Format>
          </FileFormats>
        </DropZone>
        
        {files.length > 0 && (
          <UploadedFiles>
            <FilesHeader>
              <FilesTitle>Hochgeladene Dateien</FilesTitle>
              <FileCount>
                <span>{uploadedCount}</span> / {files.length} abgeschlossen
              </FileCount>
            </FilesHeader>
            
            <FilesGrid>
              {files.map(file => (
                <FileCard key={file.id} uploading={file.uploading}>
                  <FilePreview 
                    src={file.preview} 
                    alt={file.name}
                    uploading={file.uploading}
                  />
                  
                  {file.uploading && (
                    <UploadOverlay>
                      <ProgressBar>
                        <ProgressFill progress={file.progress} />
                      </ProgressBar>
                      <ProgressText>{Math.round(file.progress)}%</ProgressText>
                    </UploadOverlay>
                  )}
                  
                  {file.uploaded && <UploadComplete>✓</UploadComplete>}
                  
                  <RemoveButton onClick={() => removeFile(file.id)}>
                    ×
                  </RemoveButton>
                  
                  <FileName>{file.name}</FileName>
                </FileCard>
              ))}
            </FilesGrid>
          </UploadedFiles>
        )}
        
        <StatusBar>
          <StatusText>
            {uploadingCount > 0 ? (
              <>Uploading {uploadingCount} file(s)...<Cursor /></>
            ) : files.length > 0 ? (
              <StatusText color="var(--neon-green)">
                ✓ {uploadedCount} file(s) ready
              </StatusText>
            ) : (
              'Waiting for files...'
            )}
          </StatusText>
          <StatusText>
            {files.length} / {maxFiles} max
          </StatusText>
        </StatusBar>
      </Container>
    </Section>
  );
};

export default PhotoUpload;
