import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { submitPhotoUpload } from '../../lib/supabase';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-paper);`;
const Container = styled.div`max-width: 500px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const DropZone = styled.div`
  padding: 4rem 2rem;
  background: ${p => p.$dragging ? 'var(--botanical-sage)' : 'white'};
  border: 3px dashed ${p => p.$dragging ? 'white' : 'var(--botanical-sage)'};
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 0.2s;
  &:hover { border-color: var(--botanical-olive); background: var(--botanical-mint); }
`;
const DropIcon = styled.div`font-size: 3rem; margin-bottom: 1rem;`;
const DropText = styled.p`font-family: var(--font-body); font-size: 1rem; color: ${p => p.$dragging ? 'white' : 'var(--botanical-brown)'};`;
const HiddenInput = styled.input`display: none;`;

const Progress = styled.div`margin-top: 1.5rem;`;
const ProgressBar = styled.div`height: 8px; background: var(--botanical-mint); border-radius: 4px; overflow: hidden;`;
const ProgressFill = styled.div`height: 100%; background: linear-gradient(90deg, var(--botanical-sage), var(--botanical-olive)); width: ${p => p.$progress}%; transition: width 0.3s;`;
const ProgressText = styled.p`font-family: var(--font-body); font-size: 0.85rem; color: var(--botanical-olive); margin-top: 0.5rem;`;

const Success = styled.div`padding: 2rem; background: white; border-radius: 24px;`;
const SuccessIcon = styled.div`font-size: 3rem; margin-bottom: 1rem;`;
const SuccessText = styled.p`font-family: var(--font-handwritten); font-size: 1.5rem; color: var(--botanical-forest); margin-bottom: 1rem;`;
const ResetBtn = styled.button`font-family: var(--font-body); font-size: 0.85rem; color: var(--botanical-olive); text-decoration: underline; &:hover { color: var(--botanical-forest); }`;

function PhotoUpload() {
  const { project, content } = useWedding();
  const title = content?.photoupload?.title || 'Fotos teilen';
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFiles = async (files) => {
    if (!project?.id || files.length === 0) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadToCloudinary(files[i]);
        if (result.url) await submitPhotoUpload(project.id, { url: result.url, public_id: result.public_id });
        setProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) { console.error(err); }
    }
    setUploading(false);
    setSuccess(true);
  };

  const handleDrop = useCallback((e) => { e.preventDefault(); setDragging(false); handleFiles([...e.dataTransfer.files].filter(f => f.type.startsWith('image/'))); }, [project?.id]);
  const handleChange = (e) => handleFiles([...e.target.files].filter(f => f.type.startsWith('image/')));

  return (
    <Section ref={sectionRef} id="photos">
      <Container>
        <Eyebrow $visible={visible}>📸 Momente festhalten</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        {success ? (
          <Success><SuccessIcon>🌻</SuccessIcon><SuccessText>Danke fuer eure Fotos!</SuccessText><ResetBtn onClick={() => { setSuccess(false); setProgress(0); }}>Weitere hochladen</ResetBtn></Success>
        ) : (
          <DropZone $visible={visible} $dragging={dragging} onClick={() => fileInputRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
            <DropIcon>{dragging ? '🌿' : '📷'}</DropIcon>
            <DropText $dragging={dragging}>{dragging ? 'Loslassen!' : 'Fotos hier ablegen oder klicken'}</DropText>
            <HiddenInput ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleChange} />
          </DropZone>
        )}
        {uploading && <Progress><ProgressBar><ProgressFill $progress={progress} /></ProgressBar><ProgressText>{progress}% hochgeladen</ProgressText></Progress>}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
