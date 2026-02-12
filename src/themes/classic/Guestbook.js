import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGuestbook } from '../../components/shared/GuestbookCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-cream);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:1000px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,6vw,5rem);`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s forwards;animation-delay:0.12s;`}`;
const Layout = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:3rem;@media(max-width:768px){grid-template-columns:1fr;}`;
const FormBox = styled.div`background:var(--c-white);padding:2.5rem;`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border);background:transparent;font-size:0.85rem;font-weight:300;margin-bottom:1rem;&:focus{outline:none;border-color:var(--c-text-muted);}`;
const Txt = styled.textarea`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border);background:transparent;font-size:0.85rem;font-weight:300;min-height:100px;resize:vertical;margin-bottom:1.5rem;&:focus{outline:none;border-color:var(--c-text-muted);}`;
const Btn = styled.button`width:100%;padding:1rem;background:var(--c-dark);border:none;color:white;font-size:0.55rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;&:hover{opacity:0.8;}&:disabled{opacity:0.3;}`;
const Entry = styled.div`padding:1.5rem 0;border-bottom:1px solid var(--c-border);`;
const EName = styled.p`font-family:var(--font-d);font-size:1.1rem;font-weight:500;`;
const EDate = styled.p`font-size:0.6rem;color:var(--c-text-muted);letter-spacing:0.1em;margin-bottom:0.5rem;`;
const EMsg = styled.p`font-size:0.85rem;font-weight:300;line-height:1.8;color:var(--c-text-sec);font-style:italic;`;
const Msg = styled.p`font-size:0.8rem;margin-top:0.5rem;text-align:center;`;

function Guestbook() {
  const { content } = useWedding();
  const g = content?.guestbook || {};
  const { entries, formData, updateField, submitEntry, submitting, error, success } = useGuestbook();
  const [ref, v] = useInView();

  return (
    <S id="guestbook" ref={ref}>
      <Wrap>
        <Hdr>
          <Eye $v={v}>Eure Worte</Eye>
          <Title $v={v}>{g.title || 'Gästebuch'}</Title>
        </Hdr>
        <Layout>
          <FormBox>
            <form onSubmit={async e => { e.preventDefault(); await submitEntry(); }}>
              <Inp placeholder="Euer Name" value={formData.name || ''} onChange={e => updateField('name', e.target.value)} required />
              <Txt placeholder="Eure Nachricht..." value={formData.message || ''} onChange={e => updateField('message', e.target.value)} required />
              <Btn type="submit" disabled={submitting}>{submitting ? 'Wird gesendet...' : 'Eintragen'}</Btn>
            </form>
            {error && <Msg style={{color:'#c44'}}>{error}</Msg>}
            {success && <Msg style={{color:'var(--c-accent)'}}>Eintrag gespeichert!</Msg>}
          </FormBox>
          <div>
            {entries?.map((en, i) => (
              <Entry key={en.id || i}>
                <EName>{en.name || 'Anonym'}</EName>
                <EDate>{en.created_at ? new Date(en.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</EDate>
                <EMsg>„{en.message || ''}"</EMsg>
              </Entry>
            ))}
          </div>
        </Layout>
      </Wrap>
    </S>
  );
}
export default Guestbook;
