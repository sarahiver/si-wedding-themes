import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`
  padding:clamp(6rem,10vh,10rem) clamp(2rem,5vw,5rem);background:var(--c-dark,#111);position:relative;z-index:2;
`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,6vw,5rem);`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;color:white;`;
const Grid = styled.div`
  max-width:var(--content-w,1200px);margin:0 auto;
  display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1px;
`;
const Item = styled.div`
  background:rgba(255,255,255,0.02);padding:2rem;border:1px solid rgba(255,255,255,0.04);
  transition:background 0.3s;&:hover{background:rgba(255,255,255,0.05);}
`;
const Letter = styled.span`font-family:var(--font-d);font-size:2.5rem;font-weight:300;color:rgba(255,255,255,0.15);
  display:block;margin-bottom:0.5rem;line-height:1;`;
const ITitle = styled.h3`font-family:var(--font-d);font-size:1.1rem;font-weight:400;color:rgba(255,255,255,0.85);margin-bottom:0.5rem;`;
const IText = styled.p`font-size:0.8rem;line-height:1.8;color:rgba(255,255,255,0.35);`;

const DEFS=[{letter:'A',title:'Ankunft',text:'Bitte seid spätestens 13:45 Uhr da.'},
{letter:'D',title:'Dresscode',text:'Elegante Abendgarderobe in gedeckten Farben.'},
{letter:'F',title:'Fotos',text:'Bitte lasst Kameras während der Zeremonie in der Tasche.'},
{letter:'K',title:'Kinder',text:'Wir feiern nur mit Erwachsenen.'},
{letter:'P',title:'Parken',text:'Kostenlose Parkplätze vor dem Schloss.'},
{letter:'T',title:'Taxi',text:'Wir organisieren einen Shuttle-Service.'}];

function WeddingABC() {
  const { content } = useWedding();
  const abc = content?.weddingabc || {};
  const [ref, v] = useInView();
  const items = abc.entries?.length ? abc.entries : abc.items?.length ? abc.items : DEFS;
  return (
    <S id="weddingabc" ref={ref}>
      <Hdr>
        <Eye>Von A bis Z</Eye>
        <Title>{abc.title || 'Hochzeits-ABC'}</Title>
      </Hdr>
      <Grid>
        {items.map((it,i) => (
          <Item key={i}>
            <Letter>{it.letter || it.buchstabe || String.fromCharCode(65+i)}</Letter>
            <ITitle>{it.title || it.titel || it.word || it.wort}</ITitle>
            <IText>{it.text || it.description || it.beschreibung}</IText>
          </Item>
        ))}
      </Grid>
    </S>
  );
}
export default WeddingABC;
