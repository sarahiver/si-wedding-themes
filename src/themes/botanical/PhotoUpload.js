import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';
import { usePhotoUpload } from '../../components/shared/PhotoUploadCore';

const Desc = styled.p`font-size: 0.85rem; color: var(--medium); text-align: center; margin-bottom: 1rem;`;
const DropZone = styled.div`padding: 2rem; border: 2px dashed ${p => p.$drag ? 'var(--dark)' : 'var(--pale)'}; background: ${p => p.$drag ? 'var(--off-white)' : 'var(--white)'}; text-align: center; cursor: pointer;`;
const DropIcon = styled.div`font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;`;
const DropText = styled.p`font-size: 0.9rem; font-weight: 600; color: var(--dark);`;
const DropHint = styled.p`font-size: 0.75rem; color: var(--light); margin-top: 0.3rem;`;
const HiddenInput = styled.input`display: none;`;
const ProgressBar = styled.div`height: 4px; background: var(--off-white); margin-top: 1rem;`;
const ProgressFill = styled.div`height: 100%; width: ${p => p.$pct}%; background: var(--black);`;
const Success = styled.div`text-align: center; h3 { font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 0.3rem; } p { font-size: 0.85rem; color: var(--medium); }`;
const ResetBtn = styled.button`margin-top: 1rem; font-size: 0.75rem; color: var(--medium); background: none; text-decoration: underline; cursor: pointer;`;

function PhotoUpload({ side = 'left' }) {
  const { content } = useWedding();
  const d = content?.photoupload || {};
  const [drag, setDrag] = useState(false);
  const [success, setSuccess] = useState(false);
  const { uploading, progress, fileInputRef, handleFileSelect, openFilePicker, handleDrop, handleDragOver } = usePhotoUpload({ maxFiles: 10, onSuccess: () => setSuccess(true) });

  if (success) return <ContentBranch side={side} eyebrow="Teilen" title="Danke!"><Success><p>Eure Fotos wurden hochgeladen.</p><ResetBtn onClick={() => setSuccess(false)}>Weitere hochladen</ResetBtn></Success></ContentBranch>;

  return (
    <ContentBranch side={side} eyebrow="Teilen" title={d.title || 'Eure Fotos'}>
      <Desc>{d.description || 'Teilt eure schönsten Momente'}</Desc>
      <DropZone $drag={drag} onClick={openFilePicker} onDrop={e => { handleDrop(e); setDrag(false); }} onDragOver={e => { handleDragOver(e); setDrag(true); }} onDragLeave={() => setDrag(false)}>
        <DropIcon>📷</DropIcon>
        <DropText>{drag ? 'Ablegen' : 'Fotos auswählen'}</DropText>
        <DropHint>oder hierher ziehen</DropHint>
      </DropZone>
      <HiddenInput ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} />
      {uploading && <ProgressBar><ProgressFill $pct={progress} /></ProgressBar>}
    </ContentBranch>
  );
}
export default PhotoUpload;
