import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGuestbook } from '../../components/shared/GuestbookCore';
import { optimizedUrl } from '../../lib/cloudinary';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const bgImg='https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg';

const S = styled.section`position:relative;z-index:2;background:var(--c-white);`;
const Top = styled.div`padding:var(--section-pad) clamp(2rem,5vw,5rem);`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,6vw,4rem);`;
const Eye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:var(--c-accent);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;
const Desc = styled.p`font-family:var(--font-b);font-size:0.85rem;font-weight:300;color:var(--c-text-sec);max-width:500px;margin:0.8rem auto 0;line-height:1.8;`;
const Content = styled.div`max-width:var(--content-w);margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:3rem;
  @media(max-width:768px){grid-template-columns:1fr;}`;
const FormBox = styled.div``;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border);
  background:transparent;font-size:0.85rem;font-weight:300;margin-bottom:1rem;font-family:var(--font-b);
  &:focus{outline:none;border-color:var(--c-text-muted);}`;
const Txt = styled.textarea`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border);
  background:transparent;font-size:0.85rem;font-weight:300;min-height:120px;resize:vertical;font-family:var(--font-b);
  &:focus{outline:none;border-color:var(--c-text-muted);}`;
const Btn = styled.button`padding:1rem 3rem;background:var(--c-dark);border:none;
  color:white;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;
  margin-top:1.5rem;cursor:pointer;transition:opacity 0.3s;&:hover{opacity:0.8;}&:disabled{opacity:0.3;}`;
const Msg = styled.p`font-size:0.75rem;margin-top:0.75rem;`;
const Entries = styled.div`max-height:450px;overflow-y:auto;scrollbar-width:thin;`;
const Entry = styled.div`padding:1.5rem 0;border-bottom:1px solid var(--c-border);`;
const EName = styled.p`font-family:var(--font-d);font-size:1.15rem;font-weight:500;`;
const EDate = styled.p`font-size:0.6rem;color:var(--c-text-muted);letter-spacing:0.1em;margin-bottom:0.5rem;`;
const EMsg = styled.p`font-size:0.85rem;font-weight:300;line-height:1.8;color:var(--c-text-sec);font-style:italic;`;

/* Bild UNTEN - farbig, nicht s/w */
const BottomImg = styled.div`width:100vw;margin-left:50%;transform:translateX(-50%);
  height:45vh;min-height:300px;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(10%) brightness(0.7);}`;

function Guestbook(){
  const{content}=useWedding();const g=content?.guestbook||{};
  const{entries,formData,updateField,submitEntry,submitting,error,success}=useGuestbook();
  return(
    <S id="guestbook" data-theme-light>
      <Top>
        <Hdr><Eye>Eure Worte</Eye><Title>{g.title||'Gästebuch'}</Title>{g.description&&<Desc>{g.description}</Desc>}</Hdr>
        <Content>
          <FormBox>
            <form onSubmit={async e=>{e.preventDefault();await submitEntry();}}>
              <Inp placeholder="Euer Name" value={formData.name||''} onChange={e=>updateField('name',e.target.value)} required/>
              <Txt placeholder="Eure Nachricht..." value={formData.message||''} onChange={e=>updateField('message',e.target.value)} required/>
              <Btn type="submit" disabled={submitting}>{submitting?'Wird gesendet...':'Eintragen'}</Btn>
            </form>
            {error&&<Msg style={{color:'#c44'}}>{error}</Msg>}
            {success&&<Msg style={{color:'var(--c-accent)'}}>Eintrag gespeichert!</Msg>}
          </FormBox>
          <Entries>
            {entries?.map((en,i)=>(<Entry key={en.id||i}><EName>{en.name||'Anonym'}</EName>
              <EDate>{en.created_at?new Date(en.created_at).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}):''}</EDate>
              <EMsg>„{en.message||''}"</EMsg></Entry>))}
          </Entries>
        </Content>
      </Top>
      <BottomImg><img src={optimizedUrl.hero(g.image||bgImg)} alt="" loading="lazy"/></BottomImg>
    </S>);
}
export default Guestbook;
