import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const vid = 'https://res.cloudinary.com/si-weddings/video/upload/v1770139115/siwedding/lola-fredi/hero/xqejg9c6h9wnye8zw99d.mp4';

const S = styled.section`
  position:relative;overflow:hidden;min-height:100vh;
  display:flex;align-items:center;justify-content:center;
  padding:clamp(6rem,12vh,10rem) clamp(2rem,5vw,5rem);
`;
const BgV = styled.div`position:absolute;inset:0;z-index:0;
  video{width:100%;height:100%;object-fit:cover;filter:grayscale(60%) brightness(0.18);}`;
const Card = styled.div`
  position:relative;z-index:2;
  background:rgba(255,255,255,0.04);backdrop-filter:blur(30px);
  border:1px solid rgba(255,255,255,0.07);
  padding:clamp(2.5rem,5vw,4.5rem);max-width:520px;width:100%;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;`}
`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.35);text-align:center;margin-bottom:0.75rem;`;
const H2 = styled.h2`font-family:var(--font-d);font-size:clamp(2.2rem,5vw,3.2rem);font-weight:300;color:white;text-align:center;margin-bottom:0.3rem;`;
const Script = styled.p`font-family:var(--font-s);font-size:1.5rem;color:rgba(255,255,255,0.3);text-align:center;margin-bottom:2.5rem;`;
const Lbl = styled.p`font-size:0.5rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin:1.5rem 0 0.3rem;`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid rgba(255,255,255,0.1);
  background:transparent;color:white;font-family:var(--font-b);font-size:0.85rem;font-weight:300;
  &::placeholder{color:rgba(255,255,255,0.15);}&:focus{outline:none;border-color:rgba(255,255,255,0.3);}`;
const Sel = styled.select`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid rgba(255,255,255,0.1);
  background:transparent;color:white;font-family:var(--font-b);font-size:0.85rem;font-weight:300;
  &:focus{outline:none;border-color:rgba(255,255,255,0.3);}
  option{background:var(--c-dark,#111);color:white;}`;
const Txt = styled.textarea`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid rgba(255,255,255,0.1);
  background:transparent;color:white;font-family:var(--font-b);font-size:0.85rem;font-weight:300;
  min-height:70px;resize:vertical;
  &::placeholder{color:rgba(255,255,255,0.15);}&:focus{outline:none;border-color:rgba(255,255,255,0.3);}`;
const ToggleRow = styled.div`display:flex;gap:1rem;margin-top:1rem;`;
const TogBtn = styled.button`flex:1;padding:0.85rem;border:1px solid ${p=>p.$a?'rgba(255,255,255,0.4)':'rgba(255,255,255,0.08)'};
  background:${p=>p.$a?'rgba(255,255,255,0.08)':'transparent'};color:${p=>p.$a?'white':'rgba(255,255,255,0.3)'};
  font-family:var(--font-b);font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;
  cursor:pointer;transition:all 0.3s;`;
const Btn = styled.button`width:100%;padding:1.1rem;background:transparent;
  border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);
  font-family:var(--font-b);font-size:0.6rem;font-weight:300;letter-spacing:0.25em;text-transform:uppercase;
  margin-top:2.5rem;cursor:pointer;transition:all 0.4s;
  &:hover{border-color:rgba(255,255,255,0.5);color:white;}&:disabled{opacity:0.3;}`;
const Err = styled.p`font-size:0.75rem;color:#e88;text-align:center;margin-top:1rem;`;
const SuccWrap = styled.div`text-align:center;padding:2rem 0;`;
const SuccT = styled.h3`font-family:var(--font-d);font-size:2.5rem;font-weight:300;color:white;margin-bottom:1rem;`;
const SuccP = styled.p`font-size:0.85rem;color:rgba(255,255,255,0.5);`;

function RSVP() {
  const { content } = useWedding();
  const r = content?.rsvp || {};
  const { formData, submitting, submitted, error, updateField, submit } = useRSVP();
  const [ref, v] = useInView();

  if (submitted) return (
    <S id="rsvp">
      <BgV><video autoPlay muted loop playsInline><source src={vid} type="video/mp4"/></video></BgV>
      <Card $v={true} ref={ref}>
        <SuccWrap>
          <SuccT>Vielen Dank!</SuccT>
          <SuccP>{formData.attending==='yes'?'Wir freuen uns sehr auf euch!':'Schade – wir werden euch vermissen.'}</SuccP>
        </SuccWrap>
      </Card>
    </S>
  );

  return (
    <S id="rsvp">
      <BgV><video autoPlay muted loop playsInline><source src={vid} type="video/mp4"/></video></BgV>
      <Card $v={v} ref={ref}>
        <Eye>Zusage</Eye>
        <H2>{r.title || 'RSVP'}</H2>
        <Script>wir freuen uns auf euch</Script>
        <form onSubmit={e=>{e.preventDefault();submit();}}>
          <Lbl>Teilnahme</Lbl>
          <ToggleRow>
            <TogBtn type="button" $a={formData.attending==='yes'} onClick={()=>updateField('attending','yes')}>Wir kommen gerne</TogBtn>
            <TogBtn type="button" $a={formData.attending==='no'} onClick={()=>updateField('attending','no')}>Leider nicht</TogBtn>
          </ToggleRow>
          <Lbl>Name</Lbl>
          <Inp placeholder="Euer Name" value={formData.name||''} onChange={e=>updateField('name',e.target.value)} required />
          <Lbl>E-Mail</Lbl>
          <Inp type="email" placeholder="email@beispiel.de" value={formData.email||''} onChange={e=>updateField('email',e.target.value)} required />
          {formData.attending!=='no'&&<>
            <Lbl>Personen</Lbl>
            <Sel value={formData.guests||'1'} onChange={e=>updateField('guests',e.target.value)}>
              {[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
            </Sel>
          </>}
          <Lbl>Nachricht</Lbl>
          <Txt placeholder="Allergien, Sonderwünsche..." value={formData.message||''} onChange={e=>updateField('message',e.target.value)} />
          <Btn type="submit" disabled={submitting}>{submitting?'Wird gesendet...':'Absenden'}</Btn>
          {error && <Err>{error}</Err>}
        </form>
      </Card>
    </S>
  );
}
export default RSVP;
