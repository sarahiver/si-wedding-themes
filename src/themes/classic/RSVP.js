import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const lineExp = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;
const checkIn = keyframes`from { transform: scale(0); } to { transform: scale(1); }`;

const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-dark); color: #fff;`;
const Wrap = styled.div`max-width: 600px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3.5rem;`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; color: #fff; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const Desc = styled.p`font-size: 0.85rem; font-weight: 300; color: rgba(255,255,255,0.5); margin-top: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.25s;`}`;
const Line = styled.div`width: 60px; height: 1px; background: var(--c-gold); margin: 1.5rem auto 0; transform: scaleX(0); ${p => p.$v && css`animation: ${lineExp} 0.6s var(--ease) forwards; animation-delay: 0.3s;`}`;

const Form = styled.form`opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.4s;`}`;
const FG = styled.div`margin-bottom: 1.5rem;`;
const Lbl = styled.label`display: block; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 0.5rem;`;
const Inp = styled.input`width: 100%; padding: 1rem 0; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 0.9rem; font-weight: 300; transition: border 0.3s; &:focus { outline: none; border-color: var(--c-gold); } &::placeholder { color: rgba(255,255,255,0.25); }`;
const Txtarea = styled.textarea`width: 100%; padding: 1rem 0; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 0.9rem; font-weight: 300; min-height: 80px; resize: vertical; &:focus { outline: none; border-color: var(--c-gold); } &::placeholder { color: rgba(255,255,255,0.25); }`;
const Sel = styled.select`width: 100%; padding: 1rem 0; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 0.9rem; option { background: var(--c-dark); }`;
const RadioGrp = styled.div`display: flex; gap: 1rem; flex-wrap: wrap;`;
const RadioLbl = styled.label`display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem 1.5rem; border: 1px solid ${p => p.$a ? 'var(--c-gold)' : 'rgba(255,255,255,0.15)'}; background: ${p => p.$a ? 'rgba(196,168,124,0.08)' : 'transparent'}; font-size: 0.8rem; font-weight: 300; transition: all 0.3s; input { display: none; } &:hover { border-color: var(--c-gold); }`;
const Btn = styled.button`width: 100%; padding: 1.25rem; background: var(--c-gold); border: none; color: #fff; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; transition: background 0.3s; margin-top: 0.5rem; &:hover { background: var(--c-gold-dark); } &:disabled { opacity: 0.4; }`;
const Err = styled.p`color: #E57373; font-size: 0.8rem; margin-top: 0.5rem;`;

const SuccessBox = styled.div`text-align: center; padding: 3rem 0; animation: ${fadeUp} 0.8s var(--ease);`;
const SuccessIcon = styled.div`width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--c-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; animation: ${checkIn} 0.5s ease; font-size: 1.5rem; color: var(--c-gold);`;

function RSVP() {
  const { content } = useWedding();
  const rd = content?.rsvp || {};
  const { formData, submitting, submitted, error, updateField, submit } = useRSVP();
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);
  if (submitted) return (<S id="rsvp"><Wrap><SuccessBox><SuccessIcon>✓</SuccessIcon><Title $v={true} style={{opacity:1}}>Vielen Dank!</Title><Desc $v={true} style={{opacity:1}}>{formData.attending === 'yes' ? 'Wir freuen uns auf euch!' : 'Schade! Wir werden euch vermissen.'}</Desc></SuccessBox></Wrap></S>);
  return (
    <S id="rsvp" ref={ref}><Wrap>
      <Header><Eye $v={v}>Zusage</Eye><Title $v={v}>{rd.title || 'RSVP'}</Title><Desc $v={v}>{rd.description || 'Bitte gebt uns Bescheid, ob ihr dabei seid.'}</Desc><Line $v={v} /></Header>
      <Form $v={v} onSubmit={e => { e.preventDefault(); submit(); }}>
        <FG><Lbl>Kommt ihr?</Lbl><RadioGrp>
          <RadioLbl $a={formData.attending === 'yes'}><input type="radio" checked={formData.attending === 'yes'} onChange={() => updateField('attending', 'yes')} />Ja, wir sind dabei!</RadioLbl>
          <RadioLbl $a={formData.attending === 'no'}><input type="radio" checked={formData.attending === 'no'} onChange={() => updateField('attending', 'no')} />Leider nicht</RadioLbl>
        </RadioGrp></FG>
        <FG><Lbl>Name</Lbl><Inp placeholder="Euer Name" value={formData.name||''} onChange={e => updateField('name', e.target.value)} required /></FG>
        <FG><Lbl>E-Mail</Lbl><Inp type="email" placeholder="email@beispiel.de" value={formData.email||''} onChange={e => updateField('email', e.target.value)} required /></FG>
        {formData.attending === 'yes' && <FG><Lbl>Anzahl Personen</Lbl><Sel value={formData.guests||'1'} onChange={e => updateField('guests', e.target.value)}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?'Person':'Personen'}</option>)}</Sel></FG>}
        <FG><Lbl>Nachricht (optional)</Lbl><Txtarea placeholder="Allergien, Sonderwünsche..." value={formData.message||''} onChange={e => updateField('message', e.target.value)} /></FG>
        {error && <Err>{error}</Err>}
        <Btn type="submit" disabled={submitting}>{submitting ? 'Wird gesendet...' : 'Absenden'}</Btn>
      </Form>
    </Wrap></S>
  );
}
export default RSVP;
