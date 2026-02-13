import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const heroImg='https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg';

/* Hero Bild am Anfang der Section */
const HeroImg = styled.div`position:relative;width:100vw;margin-left:50%;transform:translateX(-50%);
  height:45vh;min-height:300px;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(20%) brightness(0.45);}`;
const HeroOv = styled.div`position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2rem;`;
const HEye = styled.p`font-family:var(--font-s);font-size:clamp(1.6rem,3vw,2.2rem);color:rgba(255,255,255,0.5);margin-bottom:0.5rem;`;
const HTitle = styled.h2`font-family:var(--font-d);font-size:clamp(2.5rem,5vw,4rem);font-weight:300;color:white;`;

const S = styled.section`position:relative;z-index:2;background:var(--c-white);`;
const Content = styled.div`max-width:750px;margin:0 auto;padding:clamp(4rem,6vh,6rem) clamp(2rem,5vw,5rem);`;

/* Buchstaben als klickbare Reihe */
const LetterRow = styled.div`display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;margin-bottom:2.5rem;`;
const LetterBtn = styled.button`
  width:42px;height:42px;display:flex;align-items:center;justify-content:center;
  font-family:var(--font-d);font-size:1.3rem;font-weight:300;
  background:${p=>p.$active?'var(--c-dark)':'transparent'};
  color:${p=>p.$active?'white':'var(--c-text-muted)'};
  border:1px solid ${p=>p.$active?'var(--c-dark)':'var(--c-border)'};
  cursor:pointer;transition:all 0.3s;
  &:hover{border-color:var(--c-text-muted);color:var(--c-text);}
`;

/* Geöffnete Karte */
const CardWrap = styled.div`
  overflow:hidden;max-height:${p=>p.$open?'300px':'0'};opacity:${p=>p.$open?1:0};
  transition:max-height 0.5s var(--ease), opacity 0.4s;
  padding:${p=>p.$open?'2rem 0':'0'};
`;
const CardTitle = styled.h3`font-family:var(--font-d);font-size:1.5rem;font-weight:400;margin-bottom:0.5rem;`;
const CardLetter = styled.span`font-family:var(--font-d);font-size:3rem;font-weight:300;color:var(--c-border);
  float:left;margin-right:1rem;line-height:1;`;
const CardText = styled.p`font-size:0.85rem;line-height:1.9;color:var(--c-text-sec);`;

const DEFS=[{letter:'A',title:'Ankunft',text:'Bitte seid spätestens 13:45 Uhr da.'},
{letter:'D',title:'Dresscode',text:'Elegante Abendgarderobe in gedeckten Farben.'},
{letter:'F',title:'Fotos',text:'Bitte lasst Kameras während der Zeremonie in der Tasche.'},
{letter:'K',title:'Kinder',text:'Wir feiern nur mit Erwachsenen.'},
{letter:'P',title:'Parken',text:'Kostenlose Parkplätze vor dem Schloss.'},
{letter:'T',title:'Taxi',text:'Wir organisieren einen Shuttle-Service.'}];

function WeddingABC(){
  const{content}=useWedding();const abc=content?.weddingabc||{};
  const items=abc.entries?.length?abc.entries:abc.items?.length?abc.items:DEFS;
  const[active,setActive]=useState(null);
  return(
    <S id="weddingabc" data-theme-light>
      <HeroImg><img src={abc.hero_image||heroImg} alt="" loading="lazy"/>
        <HeroOv><HEye>Von A bis Z</HEye><HTitle>{abc.title||'Hochzeits-ABC'}</HTitle></HeroOv>
      </HeroImg>
      <Content>
        <LetterRow>
          {items.map((it,i)=>(
            <LetterBtn key={i} $active={active===i} onClick={()=>setActive(active===i?null:i)}>
              {it.letter||it.buchstabe||String.fromCharCode(65+i)}
            </LetterBtn>
          ))}
        </LetterRow>
        {items.map((it,i)=>(
          <CardWrap key={i} $open={active===i}>
            <CardLetter>{it.letter||it.buchstabe||String.fromCharCode(65+i)}</CardLetter>
            <CardTitle>{it.title||it.titel||it.word||it.wort}</CardTitle>
            <CardText>{it.text||it.description||it.beschreibung}</CardText>
          </CardWrap>
        ))}
      </Content>
    </S>);
}
export default WeddingABC;
