import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
  position: relative;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  opacity: 0.08;
  pointer-events: none;
  animation: ${float} ${p => p.duration || 8}s ease-in-out infinite;
  animation-delay: ${p => p.delay || 0}s;
  
  svg { fill: var(--sage); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  margin-top: 1rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
`;

// Stats
const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  opacity: ${p => p.visible ? 1 : 0};
  transition: opacity 0.8s ease;
  transition-delay: 0.2s;
  
  @media (max-width: 500px) {
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-style: italic;
    color: var(--sage);
  }
  
  .label {
    font-family: 'Lato', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-top: 0.25rem;
  }
`;

// Upload Zone
const UploadZone = styled.div`
  background: var(--cream);
  border: 2px dashed ${p => p.isDragging ? 'var(--sage)' : 'rgba(139, 157, 131, 0.4)'};
  border-radius: 30px;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.6s ease;
  transition-delay: 0.3s;
  position: relative;
  overflow: hidden;
  
  ${p => p.isDragging && `
    background: rgba(139, 157, 131, 0.1);
    border-color: var(--sage);
    transform: scale(1.02);
  `}
  
  &:hover {
    border-color: var(--sage);
    background: rgba(139, 157, 131, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const UploadTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--forest);
  margin-bottom: 0.75rem;
`;

const UploadText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--sage);
  color: var(--cream);
  border-radius: 30px;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--sage-dark);
    transform: translateY(-2px);
  }
  
  input {
    display: none;
  }
`;

const FileTypes = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  color: var(--sage-light);
  margin-top: 1.5rem;
`;

// Name Input
const NameInput = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--cream-dark);
  border-radius: 15px;
  
  label {
    display: block;
    font-family: 'Lato', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sage-dark);
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.8rem 1rem;
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    color: var(--forest);
    background: var(--cream);
    border: 1px solid rgba(139, 157, 131, 0.3);
    border-radius: 10px;
    
    &:focus {
      outline: none;
      border-color: var(--sage);
    }
    
    &::placeholder {
      color: var(--sage-light);
    }
  }
`;

// Preview Grid
const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  
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
  border-radius: 15px;
  overflow: hidden;
  background: var(--cream);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &.uploading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(139, 157, 131, 0.3),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  background: rgba(45, 59, 45, 0.8);
  color: var(--cream);
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  
  ${PreviewItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: var(--forest);
  }
`;

// Success Message
const SuccessMessage = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(139, 157, 131, 0.15);
  border-radius: 15px;
  text-align: center;
  border: 1px solid rgba(139, 157, 131, 0.3);
  
  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    color: var(--forest);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function PhotoUpload({
  onUpload = (files, guestName) => console.log('Upload:', files, guestName),
  totalPhotos = 0,
  totalGuests = 0,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) {
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const sectionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files) => {
    const validFiles = Array.from(files)
      .filter(file => acceptedTypes.includes(file.type))
      .slice(0, maxFiles - previews.length);

    const newPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      uploading: false,
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  }, [acceptedTypes, maxFiles, previews.length]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileChange = (e) => {
    processFiles(e.target.files);
  };

  const removePreview = (index) => {
    setPreviews(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleUpload = () => {
    if (previews.length === 0 || !guestName.trim()) return;
    
    const files = previews.map(p => p.file);
    onUpload(files, guestName.trim());
    
    // Clear previews
    previews.forEach(p => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setGuestName('');
    setUploadSuccess(true);
    
    setTimeout(() => setUploadSuccess(false), 5000);
  };

  return (
    <Section ref={sectionRef} id="photos">
      {/* Floating decorations */}
      <FloatingElement 
        style={{ top: '15%', left: '5%', width: '80px', height: '80px' }}
        duration={10}
      >
        <svg viewBox="0 0 100 100">
          <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
        </svg>
      </FloatingElement>
      <FloatingElement 
        style={{ bottom: '20%', right: '8%', width: '60px', height: '60px' }}
        duration={12}
        delay={2}
      >
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="15" />
          <ellipse cx="50" cy="20" rx="12" ry="20" />
          <ellipse cx="50" cy="80" rx="12" ry="20" />
          <ellipse cx="20" cy="50" rx="20" ry="12" />
          <ellipse cx="80" cy="50" rx="20" ry="12" />
        </svg>
      </FloatingElement>

      <Container>
        <Header visible={visible}>
          <Eyebrow>Foto-Upload</Eyebrow>
          <Title>Teilt eure Momente</Title>
          <Subtitle>
            Ladet eure Fotos von unserer Feier hoch – gemeinsam schaffen wir 
            wundervolle Erinnerungen.
          </Subtitle>
        </Header>

        <Stats visible={visible}>
          <StatItem>
            <div className="number">{totalPhotos}</div>
            <div className="label">Fotos</div>
          </StatItem>
          <StatItem>
            <div className="number">{totalGuests}</div>
            <div className="label">Gäste</div>
          </StatItem>
        </Stats>

        <UploadZone
          visible={visible}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon>📷</UploadIcon>
          <UploadTitle>Fotos hier ablegen</UploadTitle>
          <UploadText>oder klicken zum Auswählen</UploadText>
          
          <UploadButton onClick={(e) => e.stopPropagation()}>
            🌿 Dateien auswählen
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileChange}
            />
          </UploadButton>
          
          <FileTypes>JPG, PNG oder WebP · Max. {maxFiles} Dateien</FileTypes>

          {previews.length > 0 && (
            <NameInput onClick={(e) => e.stopPropagation()}>
              <label>Euer Name</label>
              <input
                type="text"
                placeholder="z.B. Lisa & Martin"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </NameInput>
          )}
        </UploadZone>

        {previews.length > 0 && (
          <>
            <PreviewGrid>
              {previews.map((preview, i) => (
                <PreviewItem key={i} className={preview.uploading ? 'uploading' : ''}>
                  <img src={preview.url} alt={`Preview ${i + 1}`} />
                  <RemoveButton onClick={() => removePreview(i)}>×</RemoveButton>
                </PreviewItem>
              ))}
            </PreviewGrid>
            
            <UploadButton
              as="button"
              style={{ 
                display: 'flex', 
                margin: '2rem auto 0',
                opacity: guestName.trim() ? 1 : 0.5,
                pointerEvents: guestName.trim() ? 'auto' : 'none'
              }}
              onClick={handleUpload}
            >
              🌸 {previews.length} {previews.length === 1 ? 'Foto' : 'Fotos'} hochladen
            </UploadButton>
          </>
        )}

        {uploadSuccess && (
          <SuccessMessage>
            <div className="icon">🌷</div>
            <p>Vielen Dank! Eure Fotos wurden erfolgreich hochgeladen.</p>
          </SuccessMessage>
        )}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
