import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: var(--classic-cream);`;
const Container = styled.div`max-width: 800px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}`;
const Desc = styled.p`font-size: 0.9rem; font-weight: 300; color: var(--classic-text-light); margin-top: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.25s;`}`;

const DropZone = styled.div`
  border: 2px dashed var(--classic-beige); padding: 3rem 2rem; text-align: center;
  background: ${p => p.$active ? 'rgba(196,168,124,0.05)' : 'var(--classic-white)'};
  transition: all 0.3s; cursor: pointer; margin-bottom: 2rem;
  &:hover { border-color: var(--classic-gold); }
`;
const DropIcon = styled.div`font-size: 2rem; margin-bottom: 1rem; color: var(--classic-gold);`;
const DropText = styled.p`font-size: 0.85rem; font-weight: 300; color: var(--classic-text-light);`;
const DropHint = styled.p`font-size: 0.7rem; color: var(--classic-text-muted); margin-top: 0.5rem;`;

const ProgressBar = styled.div`height: 3px; background: var(--classic-beige); margin-bottom: 2rem; overflow: hidden; border-radius: 2px;
  &::after { content: ''; display: block; height: 100%; width: ${p => p.$pct}%; background: var(--classic-gold); transition: width 0.3s; }`;

const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem;`;
const PhotoThumb = styled.div`aspect-ratio: 1; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; }`;

function PhotoUpload() {
  const { content } = useWedding();
  const pu = content?.photoupload || {};
  const { photos, uploading, progress, fileInputRef, handleFiles, handleDrop, handleDragOver, feedback, closeFeedback } = usePhotoUpload();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const title = pu.title || 'Eure Fotos';
  const desc = pu.description || 'Teilt eure schönsten Momente mit uns!';
  return (
    <Section id="photoupload" ref={ref}>
      <Container>
        <Header><Eyebrow $v={visible}>Bilder hochladen</Eyebrow><Title $v={visible}>{title}</Title><Desc $v={visible}>{desc}</Desc></Header>
        <DropZone $active={dragActive}
          onDragOver={e => { e.preventDefault(); setDragActive(true); handleDragOver?.(e); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={e => { e.preventDefault(); setDragActive(false); handleDrop?.(e); }}
          onClick={() => fileInputRef?.current?.click()}>
          <DropIcon>📷</DropIcon>
          <DropText>Fotos hierher ziehen oder klicken</DropText>
          <DropHint>JPG, PNG bis 20 MB</DropHint>
        </DropZone>
        <HiddenFileInput ref={fileInputRef} onChange={e => handleFiles?.(e.target.files)} />
        {uploading && <ProgressBar $pct={progress} />}
        {photos?.length > 0 && (
          <PhotoGrid>
            {photos.map((p, i) => <PhotoThumb key={p.id || i}><img src={p.url || p.thumbnail_url} alt="" loading="lazy" /></PhotoThumb>)}
          </PhotoGrid>
        )}
      </Container>
      <FeedbackModal {...feedback} onClose={closeFeedback} />
    </Section>
  );
}
export default PhotoUpload;
