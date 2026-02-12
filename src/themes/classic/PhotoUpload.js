import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:800px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:3rem;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;
const Drop = styled.div`border:2px dashed ${p=>p.$a?'var(--c-text-muted)':'var(--c-border)'};padding:4rem 2rem;text-align:center;cursor:pointer;transition:all 0.3s;&:hover{border-color:var(--c-text-muted);}`;
const DI = styled.div`font-size:2.5rem;margin-bottom:1rem;opacity:0.5;`;
const DT = styled.p`font-size:0.82rem;font-weight:300;color:var(--c-text-sec);`;
const PBar = styled.div`height:3px;background:var(--c-border);margin-top:1.5rem;overflow:hidden;&::after{content:'';display:block;height:100%;width:${p=>p.$p||0}%;background:var(--c-text-muted);transition:width 0.5s;}`;
const Msg = styled.p`font-size:0.8rem;margin-top:1rem;text-align:center;`;

function PhotoUpload() {
  const { content } = useWedding();
  const pu = content?.photoupload || {};
  const { uploading, progress, error, success, fileInputRef, handleFileSelect, openFilePicker, handleDrop, handleDragOver } = usePhotoUpload({ maxFiles: 10, maxSizeMB: 10 });
  const [drag, setDrag] = useState(false);

  return (
    <S id="photoupload">
      <Wrap>
        <Hdr>
          <Eye>Bilder</Eye>
          <Title>{pu.title || 'Eure Fotos'}</Title>
        </Hdr>
        <Drop
          $a={drag}
          onDragOver={e => { e.preventDefault(); setDrag(true); handleDragOver?.(e); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleDrop?.(e); }}
          onClick={() => openFilePicker?.() || fileInputRef?.current?.click()}
        >
          <DI>📷</DI>
          <DT>Fotos hierher ziehen oder klicken</DT>
        </Drop>
        <HiddenFileInput ref={fileInputRef} onChange={handleFileSelect} />
        {uploading && <PBar $p={progress} />}
        {error && <Msg style={{color:'#c44'}}>{error}</Msg>}
        {success && <Msg style={{color:'var(--c-accent)'}}>Fotos hochgeladen!</Msg>}
      </Wrap>
    </S>
  );
}
export default PhotoUpload;
