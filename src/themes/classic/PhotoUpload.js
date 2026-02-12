import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-white);`;
const Wrap = styled.div`max-width: 800px; margin: 0 auto;`;
const Hdr = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Ttl = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const Desc = styled.p`font-size: 0.85rem; font-weight: 300; color: var(--c-text-sec); margin-top: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.25s;`}`;
const Drop = styled.div`border: 2px dashed var(--c-sand); padding: 3.5rem 2rem; text-align: center; background: ${p => p.$a ? 'rgba(196,168,124,0.04)' : 'var(--c-cream)'}; transition: all 0.3s; cursor: pointer; margin-bottom: 2rem; &:hover { border-color: var(--c-gold); }`;
const DropIcon = styled.div`font-size: 2rem; margin-bottom: 1rem; color: var(--c-gold);`;
const DropText = styled.p`font-size: 0.8rem; font-weight: 300; color: var(--c-text-sec);`;
const DropHint = styled.p`font-size: 0.65rem; color: var(--c-text-muted); margin-top: 0.5rem;`;
const PBar = styled.div`height: 2px; background: var(--c-sand); margin-bottom: 2rem; overflow: hidden; &::after { content: ''; display: block; height: 100%; width: ${p => p.$p}%; background: var(--c-gold); transition: width 0.3s; }`;
const PGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.5rem;`;
const PThumb = styled.div`aspect-ratio: 1; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(20%); transition: filter 0.3s; } &:hover img { filter: grayscale(0%); }`;

function PhotoUpload(){const{content}=useWedding();const pu=content?.photoupload||{};const{photos,uploading,progress,fileInputRef,handleFiles,handleDrop,handleDragOver,feedback,closeFeedback}=usePhotoUpload();const ref=useRef(null);const[v,setV]=useState(false);const[drag,setDrag]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:0.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);
return(<S id="photoupload" ref={ref}><Wrap><Hdr><Eye $v={v}>Bilder hochladen</Eye><Ttl $v={v}>{pu.title||'Eure Fotos'}</Ttl><Desc $v={v}>{pu.description||'Teilt eure schönsten Momente mit uns!'}</Desc></Hdr><Drop $a={drag} onDragOver={e=>{e.preventDefault();setDrag(true);handleDragOver?.(e);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleDrop?.(e);}} onClick={()=>fileInputRef?.current?.click()}><DropIcon>📷</DropIcon><DropText>Fotos hierher ziehen oder klicken</DropText><DropHint>JPG, PNG bis 20 MB</DropHint></Drop><HiddenFileInput ref={fileInputRef} onChange={e=>handleFiles?.(e.target.files)}/>{uploading&&<PBar $p={progress}/>}{photos?.length>0&&<PGrid>{photos.map((p,i)=><PThumb key={p.id||i}><img src={p.url||p.thumbnail_url} alt="" loading="lazy"/></PThumb>)}</PGrid>}</Wrap><FeedbackModal {...feedback} onClose={closeFeedback}/></S>);}
export default PhotoUpload;
