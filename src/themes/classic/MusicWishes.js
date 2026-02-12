import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
const bgImg='https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg';

const S = styled.section`display:grid;grid-template-columns:1fr 1fr;min-height:70vh;position:relative;z-index:2;
  @media(max-width:768px){grid-template-columns:1fr;}`;
const ImgSide = styled.div`position:relative;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(30%) brightness(0.55);}
  @media(max-width:768px){height:35vh;}`;
const ImgOv = styled.div`position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:3rem;text-align:center;`;
const ImgScript = styled.p`font-family:var(--font-s);font-size:clamp(2.5rem,5vw,4rem);color:rgba(255,255,255,0.6);`;
/* Weiß statt Schwarz */
const FormSide = styled.div`background:var(--c-white);display:flex;flex-direction:column;justify-content:center;
  padding:clamp(3rem,6vw,5rem);`;
const Eye = styled.p`font-family:var(--font-s);font-size:1.5rem;color:var(--c-accent);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(1.8rem,3vw,2.5rem);font-weight:300;margin-bottom:2rem;`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border);
  background:transparent;font-size:0.85rem;font-weight:300;margin-bottom:1rem;font-family:var(--font-b);
  &:focus{outline:none;border-color:var(--c-text-muted);}`;
const Btn = styled.button`padding:1rem 3rem;background:var(--c-dark);border:none;
  color:white;font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;
  margin-top:1.5rem;cursor:pointer;transition:opacity 0.3s;&:hover{opacity:0.8;}&:disabled{opacity:0.3;}`;
const Msg = styled.p`font-size:0.75rem;margin-top:0.75rem;text-align:center;`;
const WishList = styled.div`margin-top:2rem;max-height:220px;overflow-y:auto;scrollbar-width:thin;`;
const WI = styled.div`padding:0.8rem 0;border-bottom:1px solid var(--c-border);`;
const WS = styled.p`font-family:var(--font-d);font-size:1rem;`;
const WA = styled.p`font-size:0.7rem;color:var(--c-text-muted);`;

function MusicWishes(){
  const{content}=useWedding();const m=content?.musicwishes||{};
  const{wishes,formData,updateField,submitWish,submitting,error,success}=useMusicWishes();
  return(
    <S id="musicwishes">
      <ImgSide><img src={bgImg} alt="" loading="lazy"/><ImgOv><ImgScript>Your Song</ImgScript></ImgOv></ImgSide>
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
    </S>);
}
export default MusicWishes;
