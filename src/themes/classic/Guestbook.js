import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGuestbook } from '../../components/shared/GuestbookCore';
import FeedbackModal from '../../components/shared/FeedbackModal';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-cream);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:900px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,6vw,5rem);`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const Layout = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:3rem;@media(max-width:768px){grid-template-columns:1fr;}`;
const FormBox = styled.div`background:var(--c-white);padding:2.5rem;box-shadow:0 15px 40px rgba(0,0,0,0.04);`;
const Inp = styled.input`width:100%;padding:1rem 0;border:none;border-bottom:1px solid var(--c-border);background:transparent;font-size:0.85rem;font-weight:300;margin-bottom:1rem;&:focus{outline:none;border-color:var(--c-text-muted);}`;
const Txt = styled.textarea`width:100%;padding:1rem 0;border:none;border-bottom:1px solid var(--c-border);background:transparent;font-size:0.85rem;font-weight:300;min-height:100px;resize:vertical;margin-bottom:1.5rem;&:focus{outline:none;border-color:var(--c-text-muted);}`;
const Btn = styled.button`padding:1rem 2.5rem;background:var(--c-dark);border:none;color:white;font-size:0.55rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;&:hover{opacity:0.8;}&:disabled{opacity:0.3;}`;
const Entry = styled.div`padding:1.5rem 0;border-bottom:1px solid var(--c-border);`;
const EName = styled.p`font-family:var(--font-d);font-size:1.1rem;font-weight:500;margin-bottom:0.2rem;`;
const EDate = styled.p`font-size:0.6rem;color:var(--c-text-muted);margin-bottom:0.75rem;`;
const EMsg = styled.p`font-family:var(--font-d);font-size:0.95rem;font-style:italic;color:var(--c-text-sec);line-height:1.8;`;
function Guestbook(){const{content}=useWedding();const g=content?.guestbook||{};const{entries,newEntry,updateNewEntry,submitEntry,submitting,feedback,closeFeedback}=useGuestbook();const[ref,v]=useInView();
return(<S id="guestbook" ref={ref}><Wrap><Hdr><Eye $v={v}>Eure Worte</Eye><Title $v={v}>{g.title||'G\u00E4stebuch'}</Title></Hdr><Layout><FormBox><form onSubmit={async e=>{e.preventDefault();await submitEntry();}}><Inp placeholder="Euer Name" value={newEntry.name||''} onChange={e=>updateNewEntry('name',e.target.value)} required/><Txt placeholder="Eure Nachricht..." value={newEntry.message||''} onChange={e=>updateNewEntry('message',e.target.value)} required/><Btn type="submit" disabled={submitting}>{submitting?'Wird gesendet...':'Eintragen'}</Btn></form></FormBox><div>{entries?.map((en,i)=><Entry key={en.id||i}><EName>{en.name}</EName><EDate>{new Date(en.created_at).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'})}</EDate><EMsg>\u201E{en.message}\u201C</EMsg></Entry>)}</div></Layout></Wrap><FeedbackModal {...feedback} onClose={closeFeedback}/></S>);}
export default Guestbook;
