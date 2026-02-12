import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const bgImg = 'https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg';

const S = styled.section`
  position:relative;overflow:hidden;z-index:2;
  display:grid;grid-template-columns:1fr 1fr;min-height:80vh;
  @media(max-width:768px){grid-template-columns:1fr;}
`;
const ImgSide = styled.div`
  position:relative;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) brightness(0.35);}
  @media(max-width:768px){height:35vh;}
`;
const ImgOverlay = styled.div`
  position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;
  padding:3rem;text-align:center;
`;
const ImgScript = styled.p`font-family:var(--font-s);font-size:clamp(2.5rem,5vw,4rem);color:rgba(255,255,255,0.5);`;
const FormSide = styled.div`
  background:var(--c-dark,#111);display:flex;flex-direction:column;justify-content:center;
  padding:clamp(3rem,6vw,5rem);
`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(1.8rem,3vw,2.5rem);font-weight:300;color:white;margin-bottom:2rem;`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid rgba(255,255,255,0.08);
  background:transparent;color:white;font-family:var(--font-b);font-size:0.85rem;font-weight:300;margin-bottom:1rem;
  &::placeholder{color:rgba(255,255,255,0.15);}&:focus{outline:none;border-color:rgba(255,255,255,0.25);}`;
const Btn = styled.button`width:100%;padding:1rem;background:transparent;border:1px solid rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.5);font-family:var(--font-b);font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;
  margin-top:1.5rem;cursor:pointer;transition:all 0.3s;
  &:hover{border-color:rgba(255,255,255,0.4);color:white;}&:disabled{opacity:0.3;}`;
const Msg = styled.p`font-size:0.75rem;margin-top:0.75rem;text-align:center;`;
const WishList = styled.div`margin-top:2rem;max-height:250px;overflow-y:auto;
  scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.1) transparent;`;
const WI = styled.div`padding:0.8rem 0;border-bottom:1px solid rgba(255,255,255,0.05);`;
const WS = styled.p`font-family:var(--font-d);font-size:1rem;color:rgba(255,255,255,0.8);`;
const WA = styled.p`font-size:0.7rem;color:rgba(255,255,255,0.3);`;

function MusicWishes() {
  const { content } = useWedding();
  const m = content?.musicwishes || {};
  const { wishes, formData, updateField, submitWish, submitting, error, success } = useMusicWishes();

  return (
    <S id="musicwishes">
      <ImgSide>
        <img src={bgImg} alt="" loading="lazy" />
        <ImgOverlay>
          <ImgScript>Your Song</ImgScript>
        </ImgOverlay>
      </ImgSide>
      <FormSide>
        <Eye>Playlist</Eye>
        <Title>{m.title || 'Musikwünsche'}</Title>
        <form onSubmit={async e=>{e.preventDefault();await submitWish();}}>
          <Inp placeholder="Song-Titel" value={formData.songTitle||''} onChange={e=>updateField('songTitle',e.target.value)} required />
          <Inp placeholder="Interpret" value={formData.artist||''} onChange={e=>updateField('artist',e.target.value)} />
          <Inp placeholder="Euer Name" value={formData.name||''} onChange={e=>updateField('name',e.target.value)} />
          <Btn type="submit" disabled={submitting}>{submitting?'...':'Wünschen'}</Btn>
        </form>
        {error && <Msg style={{color:'#e88'}}>{error}</Msg>}
        {success && <Msg style={{color:'rgba(255,255,255,0.4)'}}>Gespeichert!</Msg>}
        {wishes?.length > 0 && (
          <WishList>
            {wishes.map((w,i)=>(
              <WI key={w.id||i}>
                <WS>{w.song_title||w.song||''}</WS>
                {w.artist&&<WA>{w.artist}{w.name?` · ${w.name}`:''}</WA>}
              </WI>
            ))}
          </WishList>
        )}
      </FormSide>
    </S>
  );
}
export default MusicWishes;
