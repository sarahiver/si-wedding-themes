// Luxe PhotoUpload
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { submitPhotoUpload } from '../../lib/supabase';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-sand);`;
const Container = styled.div`max-width: 500px; margin: 0 auto; text-align: center;`;

const Header = styled.div`margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const DropZone = styled.div`
  padding: 4rem 2rem; background: ${p => p.$dragging ? 'var(--luxe-olive)' : 'var(--luxe-white)'}; border: 1px dashed var(--luxe-taupe); cursor: pointer; transition: all 0.3s ease;
  opacity: 0; animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.2s;
  &:hover { border-color: var(--luxe-olive); }
`;
const DropText = styled.p`font-family: var(--font-sans); font-size: 0.9rem; color: ${p => p.$dragging ? 'var(--luxe-white)' : 'var(--luxe-charcoal)'};`;
const HiddenInput = styled.input`display: none;`;

const Progress = styled.div`margin-top: 2rem;`;
const ProgressBar = styled.div`height: 4px; background: var(--luxe-sand); margin-top: 1rem;`;
const ProgressFill = styled.div`height: 100%; background: var(--luxe-olive); width: ${p => p.$progress}%; transition: width 0.3s;`;

const Success = styled.div`padding: 2rem;`;
const SuccessText = styled.p`font-family: var(--font-serif); font-size: 1.5rem; font-style: italic; color: var(--luxe-black);`;
const ResetBtn = styled.button`margin-top: 1rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--luxe-taupe); text-decoration: underline; &:hover { color: var(--luxe-black); }`;

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
        <Header $visible={visible}><Eyebrow>Momente</Eyebrow><Title>{title}</Title></Header>
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
