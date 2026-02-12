import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const aImg = 'https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg';
const aAcc = 'https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg';

const S = styled.section`
  display:grid;grid-template-columns:0.55fr 1fr;min-height:65vh;position:relative;z-index:2;
  @media(max-width:768px){grid-template-columns:1fr;}
`;
const ImgSide = styled.div`position:relative;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(15%);}
  @media(max-width:768px){height:40vh;}`;
const AccImgW = styled.div`position:absolute;bottom:-1.5rem;right:-1.5rem;width:40%;border:6px solid white;
  box-shadow:0 15px 40px rgba(0,0,0,0.12);z-index:3;overflow:hidden;
  img{width:100%;aspect-ratio:1;object-fit:cover;filter:none;}
  @media(max-width:768px){width:30%;bottom:-1rem;right:1rem;}`;
const TxtSide = styled.div`background:var(--c-white,#fff);padding:clamp(3rem,6vw,5rem);display:flex;flex-direction:column;justify-content:center;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted,#999);margin-bottom:1.5rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;margin-bottom:1.5rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const P = styled.p`font-size:0.85rem;line-height:2;color:var(--c-text-sec,#555);max-width:440px;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.24s;`}`;
const Hotel = styled.div`margin-top:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:${p.$d||0.36}s;`}`;
const HName = styled.p`font-family:var(--font-d);font-size:1.1rem;font-weight:400;color:var(--c-text,#111);`;
const HMeta = styled.p`font-size:0.75rem;color:var(--c-text-muted,#999);`;

const DEFS = [{name:'Hotel am Schlosspark',distance:'5 Min. entfernt',price:'ab 120 € / Nacht'},
{name:'Boutique Hotel Gartenblick',distance:'10 Min. entfernt',price:'ab 95 € / Nacht'}];

function Accommodations() {
  const { content } = useWedding();
  const a = content?.accommodations || {};
  const [ref, v] = useInView();
  const hotels = a.hotels?.length ? a.hotels : DEFS;
  return (
    <S id="accommodations">
      <ImgSide>
        <img src={a.image||aImg} alt="" loading="lazy" />
        <AccImgW><img src={a.accent_image||aAcc} alt="" loading="lazy" /></AccImgW>
      </ImgSide>
      <TxtSide ref={ref}>
        <Eye $v={v}>Übernachten</Eye>
        <Title $v={v}>{a.title || 'Hotels'}</Title>
        <P $v={v}>{a.description || 'Wir haben Zimmerkontingente in Hotels in der Nähe reserviert.'}</P>
        {hotels.map((h, i) => (
          <Hotel key={i} $v={v} $d={0.36 + i * 0.12}>
            <HName>{h.name || h.titel}</HName>
            <HMeta>{h.distance || h.entfernung}{h.price ? ` · ${h.price}` : ''}</HMeta>
          </Hotel>
        ))}
      </TxtSide>
    </S>
  );
}
export default Accommodations;
