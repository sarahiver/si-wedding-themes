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

const checkmark = keyframes`
  0% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 0; }
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
  max-width: 800px;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.15em;
  
  .word {
    display: inline-flex;
    white-space: nowrap;
  }
  
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
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  margin: 2rem auto 0;
  overflow: hidden;
  border-radius: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, var(--editorial-red), #ff6b6b, var(--editorial-red));
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;
  transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(196, 30, 58, 0.6), 0 0 2px rgba(196, 30, 58, 0.8);
`;

const ProgressText = styled.p`
  font-family: var(--font-headline);
  font-size: 1rem;
  color: var(--editorial-red);
  margin-top: 1rem;
`;

// Success State
const SuccessState = styled.div`
  text-align: center;
  padding: clamp(4rem, 10vw, 6rem) 2rem;
  background: rgba(76, 175, 80, 0.1);
  border: 2px solid rgba(76, 175, 80, 0.3);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  border: 3px solid #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 40px;
    height: 40px;
    stroke: #4CAF50;
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 50;
    animation: ${checkmark} 0.5s ease forwards;
    animation-delay: 0.3s;
  }
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-white);
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
`;

const UploadMoreButton = styled.button`
  padding: 1rem 2.5rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--editorial-red);
    border-color: var(--editorial-red);
  }
`;

// ============================================
// COMPONENT
// ============================================

function PhotoUpload() {
  const { content } = useWedding();
  const photouploadData = content?.photoupload || {};
  
  const title = photouploadData.title || 'Eure Fotos';
  const description = photouploadData.description || 'Teilt eure schönsten Momente mit uns';
  
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  const {
    uploading, progress, error, success,
    fileInputRef, handleFileSelect, openFilePicker, handleDrop, handleDragOver,
  } = usePhotoUpload({ maxFiles: 10, maxSizeMB: 10 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
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

  const handleUploadMore = () => {
    setShowSuccess(false);
    openFilePicker();
  };

  const renderTitle = () => {
    const words = title.split(' ');
    let letterIndex = 0;
    
    return words.map((word, wi) => (
      <span key={wi} className="word">
        {word.split('').map((letter, li) => {
          const delay = 0.1 + letterIndex * 0.05;
          letterIndex++;
          return (
            <span key={li} className="letter" style={{ animationDelay: `${delay}s` }}>
              {letter}
            </span>
          );
        })}
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
          <Subtitle $visible={visible}>{description}</Subtitle>
        </Header>
        
        {showSuccess ? (
          <SuccessState $visible={visible}>
            <SuccessIcon>
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </SuccessIcon>
            <SuccessTitle>Danke!</SuccessTitle>
            <SuccessText>
              Eure Fotos wurden erfolgreich hochgeladen und werden vom Brautpaar gesichtet.
            </SuccessText>
            <UploadMoreButton onClick={handleUploadMore}>
              Weitere Fotos hochladen
            </UploadMoreButton>
          </SuccessState>
        ) : (
          <UploadArea
            $visible={visible}
            $dragging={dragging}
            $uploading={uploading}
            onClick={!uploading ? openFilePicker : undefined}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            style={{ cursor: uploading ? 'wait' : 'pointer' }}
          >
            {uploading ? (
              // Upload Status - deutlich sichtbar
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 2rem',
                  border: '4px solid rgba(196, 30, 58, 0.2)',
                  borderTopColor: '#C41E3A',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <UploadTitle>Fotos werden hochgeladen</UploadTitle>
                <UploadText style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                  Bitte warten, das Fenster nicht schließen...
                </UploadText>
                <ProgressBar>
                  <ProgressFill $progress={progress} />
                </ProgressBar>
                <ProgressText>{progress}% abgeschlossen</ProgressText>
                <style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </>
            ) : (
              // Normal State
              <>
                <UploadIcon $uploading={false}>📷</UploadIcon>
                <UploadTitle>Fotos hochladen</UploadTitle>
                <UploadText>
                  {dragging ? 'Jetzt loslassen!' : 'Klicken oder Dateien hierher ziehen'}
                </UploadText>
                <UploadHint>Max. 10 Bilder · Je max. 10MB</UploadHint>
              </>
            )}
          </UploadArea>
        )}
        
        <HiddenFileInput 
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          multiple={true}
          accept="image/*"
        />
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
