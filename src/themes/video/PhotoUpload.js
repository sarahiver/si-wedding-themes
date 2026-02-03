import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { submitPhotoUpload } from '../../lib/supabase';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Content = styled.div`text-align: center; max-width: 450px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Subtitle = styled.p`font-family: var(--font-primary); font-size: 1rem; color: var(--video-silver); max-width: 450px; margin: 0 auto 2rem; line-height: 1.6; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.15s;`;
const DropZone = styled.div`padding: 4rem 2rem; border: 2px dashed ${p => p.$dragging ? 'var(--video-accent)' : 'rgba(255,255,255,0.2)'}; background: ${p => p.$dragging ? 'rgba(107, 140, 174, 0.1)' : 'rgba(255,255,255,0.02)'}; cursor: pointer; transition: all 0.3s ease; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s; &:hover { border-color: var(--video-accent); }`;
const DropText = styled.p`font-family: var(--font-primary); font-size: 0.85rem; color: ${p => p.$dragging ? 'var(--video-accent)' : 'var(--video-silver)'};`;
const HiddenInput = styled.input`display: none;`;
const Progress = styled.div`margin-top: 1.5rem;`;
const ProgressBar = styled.div`height: 2px; background: rgba(255,255,255,0.1);`;
const ProgressFill = styled.div`height: 100%; background: var(--video-accent); width: ${p => p.$progress}%; transition: width 0.3s;`;
const ProgressText = styled.p`font-family: var(--font-primary); font-size: 0.75rem; color: var(--video-gray); margin-top: 0.5rem;`;
const Success = styled.div`text-align: center; opacity: 0; animation: ${fadeIn} 0.8s ease forwards;`;
const SuccessTitle = styled.h3`font-family: var(--font-accent); font-size: 2rem; font-style: italic; color: var(--video-white); margin-bottom: 0.5rem;`;
const SuccessText = styled.p`font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-silver); margin-bottom: 1rem;`;
const ResetBtn = styled.button`font-family: var(--font-primary); font-size: 0.75rem; color: var(--video-accent); text-decoration: underline;`;

function PhotoUpload() {
  const { project, content } = useWedding();
  const title = content?.photoupload?.title || 'Fotos teilen';
  const description = content?.photoupload?.description || 'Teilt eure schönsten Momente mit uns';
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFiles = useCallback(async (files) => {
    if (!project?.id || files.length === 0) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadToCloudinary(files[i]);
        if (result.url && project?.id) await submitPhotoUpload(project.id, { cloudinaryUrl: result.url, cloudinaryPublicId: result.public_id, uploadedBy: 'Guest' });
        setProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) { console.error(err); }
    }
    setUploading(false);
    setSuccess(true);
  }, [project?.id]);

  const handleDrop = useCallback((e) => { e.preventDefault(); setDragging(false); handleFiles([...e.dataTransfer.files].filter(f => f.type.startsWith('image/'))); }, [handleFiles]);
  const handleChange = (e) => handleFiles([...e.target.files].filter(f => f.type.startsWith('image/')));

  return (
    <SectionWrapper id="photos">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Momente festhalten</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Subtitle $visible={visible}>{description}</Subtitle>
        {success ? (
          <Success>
            <SuccessTitle>Danke!</SuccessTitle>
            <SuccessText>Eure Fotos wurden hochgeladen.</SuccessText>
            <ResetBtn onClick={() => { setSuccess(false); setProgress(0); }}>Weitere hochladen</ResetBtn>
          </Success>
        ) : (
          <DropZone 
            $visible={visible} 
            $dragging={dragging} 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <DropText $dragging={dragging}>{dragging ? 'Loslassen zum Hochladen' : 'Fotos hier ablegen oder klicken'}</DropText>
            <HiddenInput ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleChange} />
          </DropZone>
        )}
        {uploading && <Progress><ProgressBar><ProgressFill $progress={progress} /></ProgressBar><ProgressText>{progress}%</ProgressText></Progress>}
      </Content>
    </SectionWrapper>
  );
}

export default PhotoUpload;
