import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { submitPhotoUpload } from '../../lib/supabase';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-charcoal);`;
const Container = styled.div`max-width: 450px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const DropZone = styled.div`padding: 4rem 2rem; background: ${p => p.$dragging ? 'var(--luxe-gold)' : 'var(--luxe-anthracite)'}; border: 1px dashed ${p => p.$dragging ? 'var(--luxe-void)' : 'var(--luxe-graphite)'}; cursor: pointer; transition: all 0.3s ease; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s; &:hover { border-color: var(--luxe-gold); }`;
const DropText = styled.p`font-family: var(--font-body); font-size: 0.9rem; color: ${p => p.$dragging ? 'var(--luxe-void)' : 'var(--luxe-pearl)'};`;
const HiddenInput = styled.input`display: none;`;

const Progress = styled.div`margin-top: 2rem;`;
const ProgressBar = styled.div`height: 2px; background: var(--luxe-graphite); margin-top: 1rem;`;
const ProgressFill = styled.div`height: 100%; background: var(--luxe-gold); width: ${p => p.$progress}%; transition: width 0.3s;`;

const Success = styled.div`padding: 2rem;`;
const SuccessText = styled.p`font-family: var(--font-display); font-size: 1.5rem; font-style: italic; color: var(--luxe-cream);`;
const ResetBtn = styled.button`margin-top: 1rem; font-family: var(--font-body); font-size: 0.7rem; color: var(--luxe-slate); text-decoration: underline; &:hover { color: var(--luxe-gold); }`;

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
        <Eyebrow $visible={visible}>Momente</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        {success ? (
          <Success><SuccessText>Vielen Dank!</SuccessText><ResetBtn onClick={() => { setSuccess(false); setProgress(0); }}>Weitere hochladen</ResetBtn></Success>
        ) : (
          <DropZone $visible={visible} $dragging={dragging} onClick={() => fileInputRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
            <DropText $dragging={dragging}>{dragging ? 'Loslassen zum Hochladen' : 'Fotos hier ablegen oder klicken'}</DropText>
            <HiddenInput ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleChange} />
          </DropZone>
        )}
        {uploading && <Progress><DropText>{progress}%</DropText><ProgressBar><ProgressFill $progress={progress} /></ProgressBar></Progress>}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
