import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGuestbook } from '../../components/shared/GuestbookCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const bgImg = 'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg';

/* Full-bleed image divider at top */
const HeroImg = styled.div`
  position:relative;width:100vw;margin-left:50%;transform:translateX(-50%);
  height:45vh;min-height:300px;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) brightness(0.25);}
`;
const HeroInner = styled.div`
  position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;
  text-align:center;padding:2rem;
`;
const HEye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1rem;`;
const HTitle = styled.h2`font-family:var(--font-d);font-size:clamp(2.2rem,5vw,3.5rem);font-weight:300;color:white;`;

const Content = styled.div`
  max-width:var(--content-w,1200px);margin:-4rem auto 0;position:relative;z-index:2;
  padding:0 clamp(2rem,5vw,5rem) clamp(6rem,8vh,8rem);
  display:grid;grid-template-columns:1fr 1fr;gap:3rem;
  @media(max-width:768px){grid-template-columns:1fr;}
`;
const FormBox = styled.div`
  background:var(--c-white,#fff);padding:clamp(2rem,4vw,3.5rem);box-shadow:0 15px 50px rgba(0,0,0,0.06);
`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.08));
  background:transparent;font-size:0.85rem;font-weight:300;margin-bottom:1rem;font-family:var(--font-b);
  &:focus{outline:none;border-color:var(--c-text-muted,#999);}`;
const Txt = styled.textarea`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.08));
  background:transparent;font-size:0.85rem;font-weight:300;min-height:120px;resize:vertical;font-family:var(--font-b);
  &:focus{outline:none;border-color:var(--c-text-muted,#999);}`;
const Btn = styled.button`width:100%;padding:1rem;background:var(--c-dark,#111);border:none;
  color:white;font-size:0.6rem;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;
  margin-top:1.5rem;cursor:pointer;transition:opacity 0.3s;&:hover{opacity:0.8;}&:disabled{opacity:0.3;}`;
const Msg = styled.p`font-size:0.75rem;margin-top:0.75rem;text-align:center;`;

const Entries = styled.div`max-height:500px;overflow-y:auto;scrollbar-width:thin;`;
const Entry = styled.div`padding:1.5rem 0;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.06));`;
const EName = styled.p`font-family:var(--font-d);font-size:1.15rem;font-weight:500;color:var(--c-text,#111);`;
const EDate = styled.p`font-size:0.6rem;color:var(--c-text-muted,#999);letter-spacing:0.1em;margin-bottom:0.5rem;`;
const EMsg = styled.p`font-size:0.85rem;font-weight:300;line-height:1.8;color:var(--c-text-sec,#555);font-style:italic;`;

function Guestbook() {
  const { content } = useWedding();
  const g = content?.guestbook || {};
  const { entries, formData, updateField, submitEntry, submitting, error, success } = useGuestbook();

  return (
    <section id="guestbook" style={{position:'relative',zIndex:2,background:'var(--c-cream,#F5F0EB)'}}>
      <HeroImg>
        <img src={bgImg} alt="" loading="lazy" />
        <HeroInner>
          <HEye>Eure Worte</HEye>
          <HTitle>{g.title || 'Gästebuch'}</HTitle>
        </HeroInner>
      </HeroImg>
      <Content>
        <FormBox>
          <form onSubmit={async e=>{e.preventDefault();await submitEntry();}}>
            <Inp placeholder="Euer Name" value={formData.name||''} onChange={e=>updateField('name',e.target.value)} required />
            <Txt placeholder="Eure Nachricht..." value={formData.message||''} onChange={e=>updateField('message',e.target.value)} required />
            <Btn type="submit" disabled={submitting}>{submitting?'Wird gesendet...':'Eintragen'}</Btn>
          </form>
          {error && <Msg style={{color:'#c44'}}>{error}</Msg>}
          {success && <Msg style={{color:'var(--c-text-muted,#999)'}}>Eintrag gespeichert!</Msg>}
        </FormBox>
        <Entries>
          {entries?.map((en,i) => (
            <Entry key={en.id||i}>
              <EName>{en.name||'Anonym'}</EName>
              <EDate>{en.created_at?new Date(en.created_at).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}):''}</EDate>
              <EMsg>„{en.message||''}"</EMsg>
            </Entry>
          ))}
        </Entries>
      </Content>
    </section>
  );
}
export default Guestbook;
