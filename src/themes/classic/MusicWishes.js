import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-white);`;
const Wrap = styled.div`max-width: 650px; margin: 0 auto;`;
const Hdr = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Ttl = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const Desc = styled.p`font-size: 0.85rem; font-weight: 300; color: var(--c-text-sec); margin-top: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.25s;`}`;
const FormBox = styled.div`background: var(--c-cream); padding: 2.5rem; margin-bottom: 2.5rem;`;
const Inp = styled.input`width: 100%; padding: 1rem 0; border: none; border-bottom: 1px solid var(--c-border); background: transparent; font-size: 0.9rem; font-weight: 300; margin-bottom: 1rem; &:focus { outline: none; border-color: var(--c-gold); }`;
const Btn = styled.button`width: 100%; padding: 1rem; background: var(--c-gold); border: none; color: #fff; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; &:hover { background: var(--c-gold-dark); } &:disabled { opacity: 0.4; }`;
const WItem = styled.div`padding: 1.25rem 0; border-bottom: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: center;`;
const WSong = styled.p`font-family: var(--font-display); font-size: 1.1rem; font-weight: 400;`;
const WArt = styled.p`font-size: 0.75rem; color: var(--c-text-muted);`;
const WName = styled.p`font-size: 0.7rem; color: var(--c-text-muted); font-style: italic;`;

function MusicWishes(){const{content}=useWedding();const m=content?.musicwishes||{};const{wishes,newWish,updateNewWish,submitWish,submitting,feedback,closeFeedback}=useMusicWishes();const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:0.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);
return(<S id="musicwishes" ref={ref}><Wrap><Hdr><Eye $v={v}>Playlist</Eye><Ttl $v={v}>{m.title||'Musikwünsche'}</Ttl><Desc $v={v}>{m.description||'Welche Songs dürfen nicht fehlen?'}</Desc></Hdr><FormBox><form onSubmit={async e=>{e.preventDefault();await submitWish();}}><Inp placeholder="Song-Titel" value={newWish.song||''} onChange={e=>updateNewWish('song',e.target.value)} required /><Inp placeholder="Interpret" value={newWish.artist||''} onChange={e=>updateNewWish('artist',e.target.value)} /><Inp placeholder="Euer Name" value={newWish.name||''} onChange={e=>updateNewWish('name',e.target.value)} /><Btn type="submit" disabled={submitting}>{submitting?'Wird gesendet...':'Wünschen'}</Btn></form></FormBox>{wishes?.map((w,i)=>(<WItem key={w.id||i}><div><WSong>{w.song}</WSong>{w.artist&&<WArt>{w.artist}</WArt>}</div>{w.name&&<WName>— {w.name}</WName>}</WItem>))}</Wrap><FeedbackModal {...feedback} onClose={closeFeedback}/></S>);}
export default MusicWishes;
