import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
import FeedbackModal from '../../components/shared/FeedbackModal';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:800px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:3rem;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;
const Drop = styled.div`border:2px dashed rgba(0,0,0,0.1);padding:3.5rem 2rem;text-align:center;background:${p=>p.$a?'rgba(0,0,0,0.02)':'var(--c-cream)'};cursor:pointer;&:hover{border-color:rgba(0,0,0,0.2);}`;
const DI = styled.div`font-size:1.8rem;margin-bottom:1rem;`;
const DT = styled.p`font-size:0.8rem;color:var(--c-text-sec);`;
const PBar = styled.div`height:2px;background:var(--c-cream-dark);margin:1.5rem 0;&::after{content:'';display:block;height:100%;width:${p=>p.$p}%;background:var(--c-text-muted);}`;
const PG = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:0.5rem;margin-top:1.5rem;`;
const PT = styled.div`aspect-ratio:1;overflow:hidden; img{width:100%;height:100%;object-fit:cover;filter:grayscale(20%);} &:hover img{filter:grayscale(0%);}`;
function PhotoUpload(){const{content}=useWedding();const pu=content?.photoupload||{};const{photos,uploading,progress,fileInputRef,handleFiles,handleDrop,handleDragOver,feedback,closeFeedback}=usePhotoUpload();const[drag,setDrag]=useState(false);
return(<S id="photoupload"><Wrap><Hdr><Eye>Bilder</Eye><Title>{pu.title||'Eure Fotos'}</Title></Hdr><Drop $a={drag} onDragOver={e=>{e.preventDefault();setDrag(true);handleDragOver?.(e);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleDrop?.(e);}} onClick={()=>fileInputRef?.current?.click()}><DI>\ud83d\udcf7</DI><DT>Fotos hierher ziehen oder klicken</DT></Drop><HiddenFileInput ref={fileInputRef} onChange={e=>handleFiles?.(e.target.files)}/>{uploading&&<PBar $p={progress}/>}{photos?.length>0&&<PG>{photos.map((p,i)=><PT key={p.id||i}><img src={p.url||p.thumbnail_url} alt="" loading="lazy"/></PT>)}</PG>}</Wrap><FeedbackModal {...feedback} onClose={closeFeedback}/></S>);}
export default PhotoUpload;
