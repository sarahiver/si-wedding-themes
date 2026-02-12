import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { usePhotoUpload, HiddenFileInput } from '../../components/shared/PhotoUploadCore';
const bgImg='https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg';
const S = styled.section`position:relative;overflow:hidden;z-index:2;
  padding:clamp(8rem,14vh,12rem) clamp(2rem,5vw,5rem);text-align:center;`;
const Bg = styled.div`position:absolute;inset:0;z-index:0;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(40%) brightness(0.4);}`;
const Inner = styled.div`position:relative;z-index:2;max-width:550px;margin:0 auto;`;
const Eye = styled.p`font-family:var(--font-s);font-size:1.6rem;color:rgba(255,255,255,0.5);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;color:white;margin-bottom:1rem;`;
const Sub = styled.p`font-size:0.85rem;color:rgba(255,255,255,0.45);margin-bottom:3rem;line-height:1.8;`;
const Drop = styled.div`border:1px dashed ${p=>p.$a?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.15)'};
  padding:clamp(3rem,5vw,5rem) 2rem;cursor:pointer;transition:all 0.3s;
  &:hover{border-color:rgba(255,255,255,0.4);}`;
const DI = styled.div`font-size:2rem;margin-bottom:1rem;opacity:0.4;`;
const DT = styled.p`font-size:0.8rem;color:rgba(255,255,255,0.4);`;
const PBar = styled.div`height:2px;background:rgba(255,255,255,0.08);margin-top:2rem;overflow:hidden;
  &::after{content:'';display:block;height:100%;width:${p=>p.$p||0}%;background:rgba(255,255,255,0.4);transition:width 0.5s;}`;
const Msg = styled.p`font-size:0.75rem;margin-top:1rem;`;

function PhotoUpload(){
  const{content}=useWedding();const pu=content?.photoupload||{};
  const{uploading,progress,error,success,fileInputRef,handleFileSelect,openFilePicker,handleDrop,handleDragOver}=usePhotoUpload({maxFiles:10,maxSizeMB:10});
  const[drag,setDrag]=useState(false);
  return(
    <S id="photoupload">
      <Bg><img src={pu.background_image||bgImg} alt="" loading="lazy"/></Bg>
      <Inner>
        <Eye>Teilt eure Momente</Eye>
        <Title>{pu.title||'Eure Fotos'}</Title>
        <Sub>{pu.description||'Ladet eure schönsten Bilder hoch und teilt sie mit allen Gästen.'}</Sub>
        <Drop $a={drag}
          onDragOver={e=>{e.preventDefault();setDrag(true);handleDragOver?.(e);}}
          onDragLeave={()=>setDrag(false)}
          onDrop={e=>{e.preventDefault();setDrag(false);handleDrop?.(e);}}
          onClick={()=>openFilePicker?.() || fileInputRef?.current?.click()}>
          <DI>📷</DI><DT>Fotos hierher ziehen oder klicken</DT>
        </Drop>
        <HiddenFileInput ref={fileInputRef} onChange={handleFileSelect}/>
        {uploading&&<PBar $p={progress}/>}
        {error&&<Msg style={{color:'#e88'}}>{error}</Msg>}
        {success&&<Msg style={{color:'rgba(255,255,255,0.5)'}}>Fotos hochgeladen!</Msg>}
      </Inner>
    </S>);
}
export default PhotoUpload;
