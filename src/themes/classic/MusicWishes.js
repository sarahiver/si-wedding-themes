import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
import FeedbackModal from '../../components/shared/FeedbackModal';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:650px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:3rem;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;
const FormBox = styled.div`background:var(--c-cream);padding:2.5rem;margin-bottom:2.5rem;`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border);background:transparent;font-size:0.85rem;font-weight:300;margin-bottom:1rem;&:focus{outline:none;border-color:var(--c-text-muted);}`;
const Btn = styled.button`width:100%;padding:1rem;background:var(--c-dark);border:none;color:white;font-size:0.55rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;&:hover{opacity:0.8;}&:disabled{opacity:0.3;}`;
const WI = styled.div`padding:1.2rem 0;border-bottom:1px solid var(--c-border);`;
const WS = styled.p`font-family:var(--font-d);font-size:1.1rem;font-weight:400;`;
const WA = styled.p`font-size:0.72rem;color:var(--c-text-muted);`;
function MusicWishes(){const{content}=useWedding();const m=content?.musicwishes||{};const{wishes,newWish,updateNewWish,submitWish,submitting,feedback,closeFeedback}=useMusicWishes();
return(<S id="musicwishes"><Wrap><Hdr><Eye>Playlist</Eye><Title>{m.title||'Musikw\u00FCnsche'}</Title></Hdr><FormBox><form onSubmit={async e=>{e.preventDefault();await submitWish();}}><Inp placeholder="Song-Titel" value={newWish.song||''} onChange={e=>updateNewWish('song',e.target.value)} required/><Inp placeholder="Interpret" value={newWish.artist||''} onChange={e=>updateNewWish('artist',e.target.value)}/><Inp placeholder="Euer Name" value={newWish.name||''} onChange={e=>updateNewWish('name',e.target.value)}/><Btn type="submit" disabled={submitting}>{submitting?'...':'W\u00FCnschen'}</Btn></form></FormBox>{wishes?.map((w,i)=><WI key={w.id||i}><WS>{w.song}</WS>{w.artist&&<WA>{w.artist}</WA>}</WI>)}</Wrap><FeedbackModal {...feedback} onClose={closeFeedback}/></S>);}
export default MusicWishes;
