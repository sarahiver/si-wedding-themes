import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const checkmark = keyframes`
  0% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.1s;`}
`;

const Subtitle = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1rem;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.2s;`}
`;

const UploadArea = styled.div`
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 2px dashed ${p => p.$dragging ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'};
  border-radius: 28px;
  padding: clamp(4rem, 10vw, 6rem) 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s ease;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.3s;`}
  ${p => p.$dragging && css`background: rgba(255,255,255,0.08); transform: scale(1.02);`}
  ${p => p.$uploading && css`animation: ${pulse} 2s ease infinite; pointer-events: none;`}
  &:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); }
`;

const UploadIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  ${p => !p.$uploading && css`animation: ${float} 4s ease-in-out infinite;`}
`;

const UploadTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.75rem;
`;

const UploadText = styled.p`
  font-family: var(--font-display);
  font-size: 1rem;
  font-style: italic;
  color: var(--text-muted);
  margin-bottom: 0;
`;

const UploadHint = styled.span`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(255,255,255,0.05);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 350px;
  height: 4px;
  background: rgba(255,255,255,0.1);
  margin: 2rem auto 0;
  overflow: hidden;
  border-radius: 2px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.9), rgba(255,255,255,0.6));
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-light);
  margin-top: 1rem;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: rgba(255,255,255,0.8);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SuccessState = styled.div`
  text-align: center;
  padding: clamp(4rem, 10vw, 6rem) 2rem;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.25);
  border-radius: 28px;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const SuccessIcon = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  border: 2px solid #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 35px;
    height: 35px;
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
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.75rem;
`;

const SuccessText = styled.p`
  font-family: var(--font-display);
  font-size: 1rem;
  font-style: italic;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
`;

const UploadMoreButton = styled.button`
  padding: 0.9rem 2rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }
`;

const StatusMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: ${p => p.$type === 'error'
    ? 'rgba(239, 83, 80, 0.15)'
    : p.$type === 'success'
      ? 'rgba(76, 175, 80, 0.15)'
      : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${p => p.$type === 'error'
    ? 'rgba(239, 83, 80, 0.3)'
    : p.$type === 'success'
      ? 'rgba(76, 175, 80, 0.3)'
      : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  text-align: center;
  animation: ${fadeInUp} 0.4s ease;
`;

const StatusText = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: ${p => p.$type === 'error'
    ? 'rgba(239, 83, 80, 0.9)'
    : p.$type === 'success'
      ? 'rgba(76, 175, 80, 0.9)'
      : 'var(--text-light)'};
  margin: 0;
`;

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
    uploading, progress, error, success, fileCount,
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

  useEffect(() => { if (success) setShowSuccess(true); }, [success]);
  useEffect(() => { if (error) setModalState({ isOpen: true, type: 'error', message: error }); }, [error]);

  const onDrop = (e) => { setDragging(false); handleDrop(e); };
  const onDragOver = (e) => { handleDragOver(e); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const handleUploadMore = () => { setShowSuccess(false); openFilePicker(); };

  return (
    <Section id="photoupload" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Schnappschüsse</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Subtitle $visible={visible}>{description}</Subtitle>
        </Header>

        {showSuccess ? (
          <SuccessState $visible={visible}>
            <SuccessIcon>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
            </SuccessIcon>
            <SuccessTitle>Danke!</SuccessTitle>
            <SuccessText>Eure Fotos wurden erfolgreich hochgeladen.</SuccessText>
            <UploadMoreButton onClick={handleUploadMore}>Weitere Fotos hochladen</UploadMoreButton>
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
              <>
                <Spinner />
                <UploadTitle>Fotos werden hochgeladen</UploadTitle>
                <UploadText>Bitte warten...</UploadText>
                <ProgressBar><ProgressFill $progress={progress} /></ProgressBar>
                <ProgressText>{progress}% abgeschlossen</ProgressText>
              </>
            ) : (
              <>
                <UploadIcon $uploading={false}>📷</UploadIcon>
                <UploadTitle>Fotos hochladen</UploadTitle>
                <UploadText>{dragging ? 'Jetzt loslassen!' : 'Klicken oder Dateien hierher ziehen'}</UploadText>
                <UploadHint>Max. 10 Bilder · Je max. 10MB</UploadHint>
              </>
            )}
          </UploadArea>
        )}

        {/* Status-Anzeige */}
        {uploading && fileCount > 0 && (
          <StatusMessage $type="info">
            <StatusText>{fileCount} {fileCount === 1 ? 'Foto wird' : 'Fotos werden'} hochgeladen... ({progress}%)</StatusText>
          </StatusMessage>
        )}

        {error && !uploading && (
          <StatusMessage $type="error">
            <StatusText $type="error">{error}</StatusText>
          </StatusMessage>
        )}

        <HiddenFileInput fileInputRef={fileInputRef} handleFileSelect={handleFileSelect} multiple={true} accept="image/*" />
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
