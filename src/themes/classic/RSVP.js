import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`position:relative;overflow:hidden;padding:clamp(6rem,12vh,10rem) clamp(2rem,5vw,5rem);min-height:100vh;display:flex;align-items:center;justify-content:center;`;
const BgV = styled.div`position:absolute;inset:0; video{width:100%;height:100%;object-fit:cover;filter:grayscale(60%) brightness(0.18);}`;
const Ov = styled.div`position:absolute;inset:0;background:rgba(0,0,0,0.4);`;
const Card = styled.div`position:relative;z-index:2;background:rgba(255,255,255,0.03);backdrop-filter:blur(25px);border:1px solid rgba(255,255,255,0.06);padding:clamp(3rem,6vw,5rem);max-width:520px;width:100%;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:1rem;text-align:center;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2.2rem,5vw,3.2rem);font-weight:300;color:white;text-align:center;margin-bottom:0.3rem;`;
const ScriptLn = styled.p`font-family:var(--font-s);font-size:1.6rem;color:rgba(255,255,255,0.35);text-align:center;margin-bottom:2.5rem;`;
const Lbl = styled.p`font-size:0.45rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin:1.5rem 0 0.3rem;`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid rgba(255,255,255,0.08);background:transparent;color:white;font-size:0.82rem;font-weight:300;&:focus{outline:none;border-color:rgba(255,255,255,0.3);}&::placeholder{color:rgba(255,255,255,0.12);}`;
const Txt = styled.textarea`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid rgba(255,255,255,0.08);background:transparent;color:white;font-size:0.82rem;font-weight:300;min-height:70px;resize:vertical;&:focus{outline:none;border-color:rgba(255,255,255,0.3);}&::placeholder{color:rgba(255,255,255,0.12);}`;
const Sel = styled.select`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid rgba(255,255,255,0.08);background:transparent;color:white;font-size:0.82rem;option{background:#222;}`;
const Btn = styled.button`width:100%;padding:1.1rem;background:transparent;border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);font-size:0.55rem;font-weight:300;letter-spacing:0.3em;text-transform:uppercase;margin-top:2.5rem;transition:all 0.4s;&:hover{border-color:rgba(255,255,255,0.4);color:white;}&:disabled{opacity:0.3;}`;
const Err = styled.p`color:#E57373;font-size:0.75rem;margin-top:0.5rem;`;
const Succ = styled.div`text-align:center;padding:3rem 0;`;
const SuccT = styled.h2`font-family:var(--font-d);font-size:2.5rem;font-weight:300;color:white;margin-bottom:1rem;`;
const SuccP = styled.p`font-size:0.85rem;color:rgba(255,255,255,0.4);`;
const DEF_VID = 'https://res.cloudinary.com/si-weddings/video/upload/v1770139115/siwedding/lola-fredi/hero/xqejg9c6h9wnye8zw99d.mp4';

function RSVP() {
  const { content } = useWedding();
  const rd = content?.rsvp || {};
  const { formData, submitting, submitted, error, updateField, submit } = useRSVP();
  const vid = rd.background_video || DEF_VID;
  if (submitted) return (<S id="rsvp"><BgV><video autoPlay muted loop playsInline><source src={vid} type="video/mp4"/></video></BgV><Ov/><Card><Succ><SuccT>Vielen Dank!</SuccT><SuccP>{formData.attending==='yes'?'Wir freuen uns auf euch!':'Schade! Wir werden euch vermissen.'}</SuccP></Succ></Card></S>);
  return (
    <S id="rsvp"><BgV><video autoPlay muted loop playsInline><source src={vid} type="video/mp4"/></video></BgV><Ov/>
    <Card><Eye>Zusage</Eye><Title>{rd.title||'RSVP'}</Title><ScriptLn>{rd.script_line||'wir freuen uns auf euch'}</ScriptLn>
    <form onSubmit={e=>{e.preventDefault();submit();}}>
      <Lbl>Name</Lbl><Inp placeholder="Euer Name" value={formData.name||''} onChange={e=>updateField('name',e.target.value)} required/>
      <Lbl>E-Mail</Lbl><Inp type="email" placeholder="email@beispiel.de" value={formData.email||''} onChange={e=>updateField('email',e.target.value)} required/>
      {formData.attending!=='no'&&<><Lbl>Personen</Lbl><Sel value={formData.guests||'1'} onChange={e=>updateField('guests',e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</Sel></>}
      <Lbl>Nachricht</Lbl><Txt placeholder="Allergien, Sonderwünsche..." value={formData.message||''} onChange={e=>updateField('message',e.target.value)}/>
      {error&&<Err>{error}</Err>}
      <Btn type="submit" disabled={submitting}>{submitting?'Wird gesendet...':'Absenden'}</Btn>
    </form></Card></S>
  );
}
export default RSVP;
