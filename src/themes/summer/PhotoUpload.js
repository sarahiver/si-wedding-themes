import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

const fadeUp = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}`;
const progressAnim = keyframes`from{width:0}to{width:100%}`;

function useInView(th = 0.08) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [th]);
  return [r, v];
}

const MAX_FILES = 10;
const MAX_MB = 10;

const S = styled.section`
  padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem);
  background: var(--c-bg);
  position: relative;
  z-index: 2;
`;

const Inner = styled.div`
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
  opacity: 0;
  ${p => p.$v && css`animation: ${fadeUp} 0.9s var(--ease) forwards;`}
`;

const Eyebrow = styled.p`
  font-family: var(--font-s);
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  color: var(--c-accent);
  margin-bottom: 0.4rem;
`;

const H2 = styled.h2`
  font-family: var(--font-d);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  color: var(--c-text);
  margin-bottom: 0.75rem;
`;

const Sub = styled.p`
  font-family: var(--font-b);
  font-size: 0.88rem;
  color: var(--c-text-muted);
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

/* Drop zone */
const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  border: 2px dashed ${p => p.$drag ? 'var(--c-accent)' : 'var(--c-border-warm)'};
  border-radius: var(--radius-md);
  background: ${p => p.$drag ? 'rgba(193,57,43,0.04)' : 'var(--c-bg-warm)'};
  cursor: pointer;
  transition: all 0.25s var(--ease);
  margin-bottom: 1.5rem;

  &:hover {
    border-color: var(--c-accent);
    background: rgba(193,57,43,0.04);
  }
`;

const DropIcon = styled.div`
  font-size: 2.5rem;
  line-height: 1;
`;

const DropText = styled.p`
  font-family: var(--font-b);
  font-size: 0.9rem;
  color: var(--c-text-sec);

  span {
    color: var(--c-accent);
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const DropHint = styled.p`
  font-family: var(--font-b);
  font-size: 0.72rem;
  color: var(--c-text-muted);
  letter-spacing: 0.05em;
`;

const HiddenInput = styled.input`
  display: none;
`;

/* Preview thumbnails */
const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) { grid-template-columns: repeat(4, 1fr); }
`;

const Preview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid var(--c-border-warm);

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 3px; right: 3px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(193,57,43,0.85);
  border: none;
  color: white;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
  transition: background 0.2s;

  &:hover { background: var(--c-accent); }
`;

/* Progress bar */
const ProgressWrap = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressTrack = styled.div`
  height: 4px;
  background: var(--c-border);
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: linear-gradient(90deg, var(--c-accent), var(--c-gold));
  border-radius: 100px;
  transition: width 0.3s var(--ease);
`;

const ProgressLabel = styled.p`
  font-family: var(--font-b);
  font-size: 0.72rem;
  color: var(--c-text-muted);
  text-align: center;
`;

const Counter = styled.p`
  font-family: var(--font-b);
  font-size: 0.75rem;
  color: var(--c-text-muted);
  margin-bottom: 1rem;

  span { color: var(--c-accent); font-weight: 500; }
`;

const Btn = styled.button`
  padding: 1rem 2.5rem;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--c-accent);
  color: white;
  font-family: var(--font-b);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s, transform 0.2s;

  &:hover:not(:disabled) { background: var(--c-accent-hover); transform: translateY(-1px); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

const Msg = styled.p`
  margin-top: 1rem;
  font-family: var(--font-b);
  font-size: 0.85rem;
  color: ${p => p.$err ? 'var(--c-accent)' : '#7CB87C'};
`;

function PhotoUpload() {
  const { content, project } = useWedding();
  const pu = content?.photoupload || {};
  const [ref, v] = useInView();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [msg, setMsg] = useState('');
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter(f => {
      if (!f.type.startsWith('image/')) return false;
      if (f.size > MAX_MB * 1024 * 1024) { setMsg(`Datei zu groß: ${f.name} (max. ${MAX_MB}MB)`); return false; }
      return true;
    });
    const combined = [...files, ...valid].slice(0, MAX_FILES);
    setFiles(combined);
    setPreviews(combined.map(f => URL.createObjectURL(f)));
    setMsg('');
  };

  const remove = (i) => {
    const f = [...files]; f.splice(i, 1);
    const p = [...previews]; p.splice(i, 1);
    setFiles(f); setPreviews(p);
  };

  const upload = async () => {
    if (!files.length) return;
    setUploading(true);
    setMsg('');
    let done = 0;

    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', 'si_weddings_upload');
        fd.append('folder', `siwedding/${project?.slug || 'demo'}/guestphotos`);
        const res = await fetch('https://api.cloudinary.com/v1_1/si-weddings/image/upload', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Upload failed');
        done++;
        setUploadedCount(done);
      } catch {
        setMsg(`Fehler beim Hochladen von ${file.name}`);
      }
    }

    setUploading(false);
    if (done === files.length) {
      setMsg(`✓ ${done} Foto${done !== 1 ? 's' : ''} erfolgreich hochgeladen!`);
      setFiles([]); setPreviews([]); setUploadedCount(0);
    }
  };

  const pct = uploading && files.length ? Math.round((uploadedCount / files.length) * 100) : 0;

  return (
    <S id="photoupload" data-theme-light ref={ref}>
      <Inner $v={v}>
        <Eyebrow>erinnerungen teilen</Eyebrow>
        <H2>{pu.title || 'Fotos hochladen'}</H2>
        <Sub>
          {pu.description || `Macht ihr auch Fotos? Ladet sie hier hoch — wir freuen uns über jeden Schnappschuss! (max. ${MAX_FILES} Bilder, je max. ${MAX_MB}MB)`}
        </Sub>

        <DropZone
          $drag={drag}
          onDragEnter={() => setDrag(true)}
          onDragLeave={() => setDrag(false)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        >
          <HiddenInput
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={e => addFiles(e.target.files)}
          />
          <DropIcon>📷</DropIcon>
          <DropText>
            Bilder hier ablegen oder <span>auswählen</span>
          </DropText>
          <DropHint>JPG, PNG, HEIC — max. {MAX_FILES} Bilder, je {MAX_MB}MB</DropHint>
        </DropZone>

        {previews.length > 0 && (
          <>
            <Counter>
              <span>{previews.length}</span> / {MAX_FILES} Fotos ausgewählt
            </Counter>
            <PreviewGrid>
              {previews.map((src, i) => (
                <Preview key={i}>
                  <img src={optimizedUrl.thumb(src)} alt="" />
                  <RemoveBtn onClick={() => remove(i)}>×</RemoveBtn>
                </Preview>
              ))}
            </PreviewGrid>
          </>
        )}

        {uploading && (
          <ProgressWrap>
            <ProgressTrack><ProgressBar $pct={pct} /></ProgressTrack>
            <ProgressLabel>{uploadedCount} von {files.length} hochgeladen…</ProgressLabel>
          </ProgressWrap>
        )}

        <Btn onClick={upload} disabled={!files.length || uploading}>
          {uploading ? 'Wird hochgeladen…' : `${files.length ? files.length + ' ' : ''}Foto${files.length !== 1 ? 's' : ''} hochladen`}
        </Btn>

        {msg && <Msg $err={msg.startsWith('Fehler') || msg.startsWith('Datei')}>{msg}</Msg>}
      </Inner>
    </S>
  );
}

export default PhotoUpload;
