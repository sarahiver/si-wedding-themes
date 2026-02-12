import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
const bgImg1='https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg';
const bgImg2='https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg';

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Grid = styled.div`max-width:var(--content-w,1200px);margin:0 auto;
  display:grid;grid-template-columns:0.8fr 1fr;gap:clamp(3rem,5vw,5rem);align-items:center;
  @media(max-width:768px){grid-template-columns:1fr;gap:2.5rem;}`;

/* 2 verschachtelte Bilder, kleiner */
const ImgStack = styled.div`position:relative;height:420px;
  @media(max-width:768px){height:320px;}`;
const Img1 = styled.div`position:absolute;top:0;left:0;width:60%;overflow:hidden;
  border:6px solid white;box-shadow:0 15px 40px rgba(0,0,0,0.08);z-index:1;
  img{width:100%;aspect-ratio:3/4;object-fit:cover;filter:grayscale(30%) brightness(0.6);}`;
const Img2 = styled.div`position:absolute;bottom:0;right:0;width:55%;overflow:hidden;z-index:2;
  border:6px solid white;box-shadow:0 18px 45px rgba(0,0,0,0.1);
  img{width:100%;aspect-ratio:4/5;object-fit:cover;filter:grayscale(20%) brightness(0.65);}`;
const ScriptOv = styled.p`position:absolute;bottom:1.5rem;left:1.5rem;z-index:3;
  font-family:var(--font-s);font-size:clamp(1.8rem,3vw,2.5rem);color:rgba(255,255,255,0.7);`;

const FormSide = styled.div``;
const Eye = styled.p`font-family:var(--font-s);font-size:1.5rem;color:var(--c-accent);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(1.8rem,3vw,2.5rem);font-weight:300;margin-bottom:2rem;`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.06));
  background:transparent;font-size:0.85rem;font-weight:300;margin-bottom:1rem;font-family:var(--font-b);
  &:focus{outline:none;border-color:var(--c-text-muted);}`;
const Btn = styled.button`padding:1rem 3rem;background:var(--c-dark,#1A1A1A);border:none;
  color:white;font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;
  margin-top:1.5rem;cursor:pointer;transition:opacity 0.3s;&:hover{opacity:0.8;}&:disabled{opacity:0.3;}`;
const Msg = styled.p`font-size:0.75rem;margin-top:0.75rem;`;
const WishList = styled.div`margin-top:2rem;max-height:220px;overflow-y:auto;scrollbar-width:thin;`;
const WI = styled.div`padding:0.8rem 0;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.06));`;
const WS = styled.p`font-family:var(--font-d);font-size:1rem;`;
const WA = styled.p`font-size:0.7rem;color:var(--c-text-muted);`;

function MusicWishes(){
  const{content}=useWedding();const m=content?.musicwishes||{};
  const{wishes,formData,updateField,submitWish,submitting,error,success}=useMusicWishes();
  return(
    <S id="musicwishes" data-theme-light>
      <Grid>
        <ImgStack>
          <Img1><img src={m.image||bgImg1} alt="" loading="lazy"/></Img1>
          <Img2><img src={m.image2||bgImg2} alt="" loading="lazy"/><ScriptOv>Your Song</ScriptOv></Img2>
        </ImgStack>
        <FormSide>
          <Eye>Playlist</Eye>
          <Title>{m.title||'Musikwünsche'}</Title>
          <form onSubmit={async e=>{e.preventDefault();await submitWish();}}>
            <Inp placeholder="Song-Titel" value={formData.songTitle||''} onChange={e=>updateField('songTitle',e.target.value)} required/>
            <Inp placeholder="Interpret" value={formData.artist||''} onChange={e=>updateField('artist',e.target.value)}/>
            <Inp placeholder="Euer Name" value={formData.name||''} onChange={e=>updateField('name',e.target.value)}/>
            <Btn type="submit" disabled={submitting}>{submitting?'...':'Wünschen'}</Btn>
          </form>
          {error&&<Msg style={{color:'#c44'}}>{error}</Msg>}
          {success&&<Msg style={{color:'var(--c-accent)'}}>Gespeichert!</Msg>}
          {wishes?.length>0&&<WishList>{wishes.map((w,i)=>(<WI key={w.id||i}><WS>{w.song_title||w.song||''}</WS>
            {w.artist&&<WA>{w.artist}{w.name?` · ${w.name}`:''}</WA>}</WI>))}</WishList>}
        </FormSide>
      </Grid>
    </S>);
}
export default MusicWishes;
