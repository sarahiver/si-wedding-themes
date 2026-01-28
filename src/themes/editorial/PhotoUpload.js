import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const letterReveal = keyframes`
  0% { opacity: 0; transform: translateY(100%) rotateX(-80deg); }
  100% { opacity: 1; transform: translateY(0) rotateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 30, 58, 0.4); }
  50% { transform: scale(1.02); box-shadow: 0 0 0 20px rgba(196, 30, 58, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  25% { transform: translateY(-10px) rotate(2deg); }
  75% { transform: translateY(-5px) rotate(-2deg); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const photoReveal = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.8) rotate(-5deg);
    filter: grayscale(100%) blur(10px);
  }
  to { 
    opacity: 1; 
    transform: scale(1) rotate(0);
    filter: grayscale(30%) blur(0);
  }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-black);
  overflow: hidden;
  position: relative;
`;

const BackgroundIcon = styled.div`
  position: absolute;
  top: 10%;
  right: -5%;
  font-size: clamp(20rem, 50vw, 45rem);
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.3em;
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
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.85;
  overflow: hidden;
  
  .letter {
    display: inline-block;
    opacity: 0;
    
    ${p => p.$visible && css`
      animation: ${letterReveal} 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
    `}
  }
`;

const Subtitle = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.5s;
  `}
`;

const UploadArea = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed ${p => p.$dragging ? 'var(--editorial-red)' : 'rgba(255, 255, 255, 0.2)'};
  padding: clamp(4rem, 10vw, 7rem) 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s ease;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.6s;
  `}
  
  ${p => p.$dragging && css`
    background: rgba(196, 30, 58, 0.1);
    transform: scale(1.02);
  `}
  
  ${p => p.$uploading && css`
    animation: ${pulse} 2s ease infinite;
    pointer-events: none;
  `}
  
  &:hover {
    border-color: var(--editorial-red);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  
  ${p => !p.$uploading && css`
    animation: ${float} 4s ease-in-out infinite;
  `}
`;

const UploadTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-white);
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0;
`;

const UploadHint = styled.span`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin: 2rem auto 0;
  overflow: hidden;
  border-radius: 2px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, var(--editorial-red), #ff6b6b, var(--editorial-red));
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-family: var(--font-headline);
  font-size: 1rem;
  color: var(--editorial-red);
  margin-top: 1rem;
`;

const PhotosSection = styled.div`
  margin-top: 4rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.8s;
  `}
`;

const PhotosHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PhotosTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-white);
`;

const PhotosCount = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.05);
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: var(--editorial-red);
  margin-bottom: 2rem;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 1s;
  `}
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 2rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const PhotoCard = styled.div`
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${photoReveal} 0.8s ease forwards;
    animation-delay: ${0.1 + p.$index * 0.1}s;
  `}
  
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
    transition: all 0.5s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    flex-shrink: 0;
    width: 70vw;
    max-width: 250px;
    scroll-snap-align: start;
  }
`;

const PhotoBadge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: ${p => p.$approved ? 'rgba(76, 175, 80, 0.9)' : 'rgba(196, 30, 58, 0.9)'};
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.6rem;
  font-weight: 700;
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
  
  const title = photouploadData.title || 'Eure Fotos';
  const subtitle = photouploadData.subtitle || 'Teilt eure schönsten Momente mit uns';
  
  const [visible, setVisible] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);
  const photoRefs = useRef([]);

  const {
    uploading, progress, uploadedPhotos, error, success,
    fileInputRef, handleFileSelect, openFilePicker, handleDrop, handleDragOver, loadPhotos,
  } = usePhotoUpload({ maxFiles: 10, maxSizeMB: 10 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  useEffect(() => {
    const observers = photoRefs.current.map((ref, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisiblePhotos(prev => [...new Set([...prev, i])]);
          }
        },
        { threshold: 0.2 }
      );
      if (ref) observer.observe(ref);
      return observer;
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, [uploadedPhotos.length]);

  useEffect(() => {
    if (success) {
      setModalState({ isOpen: true, type: 'success', message: 'Fotos hochgeladen!' });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setModalState({ isOpen: true, type: 'error', message: error });
    }
  }, [error]);

  const onDrop = (e) => { setDragging(false); handleDrop(e); };
  const onDragOver = (e) => { handleDragOver(e); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const renderTitle = () => {
    return title.split('').map((letter, i) => (
      <span key={i} className="letter" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
        {letter === ' ' ? '\u00A0' : letter}
      </span>
    ));
  };

  return (
    <Section id="photoupload" ref={sectionRef}>
      <BackgroundIcon>📸</BackgroundIcon>
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Schnappschüsse</Eyebrow>
          <Title $visible={visible}>{renderTitle()}</Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
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
          <UploadIcon $uploading={uploading}>
            {uploading ? '⏳' : '📷'}
          </UploadIcon>
          <UploadTitle>
            {uploading ? 'Wird hochgeladen...' : 'Fotos hochladen'}
          </UploadTitle>
          <UploadText>
            {dragging ? 'Jetzt loslassen!' : 'Klicken oder Dateien hierher ziehen'}
          </UploadText>
          <UploadHint>Max. 10 Bilder · Je max. 10MB</UploadHint>
          
          {uploading && (
            <>
              <ProgressBar>
                <ProgressFill $progress={progress} />
              </ProgressBar>
              <ProgressText>{progress}%</ProgressText>
            </>
          )}
        </UploadArea>
        
        <HiddenFileInput 
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          multiple={true}
          accept="image/*"
        />
        
        {uploadedPhotos.length > 0 && (
          <PhotosSection $visible={visible}>
            <PhotosHeader>
              <PhotosTitle>Hochgeladen</PhotosTitle>
              <PhotosCount>{uploadedPhotos.length} Fotos</PhotosCount>
            </PhotosHeader>
            <Divider $visible={visible} />
            
            <PhotoGrid>
              {uploadedPhotos.map((photo, i) => (
                <PhotoCard 
                  key={photo.id}
                  ref={el => photoRefs.current[i] = el}
                  $visible={visiblePhotos.includes(i)}
                  $index={i}
                >
                  <img src={photo.cloudinary_url} alt="Hochzeitsfoto" loading="lazy" />
                  <PhotoBadge $approved={photo.approved}>
                    {photo.approved ? '✓ Freigegeben' : 'Wartet auf Freigabe'}
                  </PhotoBadge>
                </PhotoCard>
              ))}
            </PhotoGrid>
          </PhotosSection>
        )}
      </Container>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={3000}
      />
    </Section>
  );
}

export default PhotoUpload;
