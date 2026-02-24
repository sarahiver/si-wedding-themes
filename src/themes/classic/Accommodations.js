import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const aImg='https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg';
const HIMGS=['https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg','https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg','https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg'];

/* Full-width hero image */
const HeroImg = styled.div`position:relative;width:100vw;margin-left:50%;transform:translateX(-50%);
  height:55vh;min-height:380px;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(15%) brightness(0.5);}`;
const HeroOv = styled.div`position:absolute;bottom:0;left:0;right:0;padding:clamp(2rem,5vw,4rem);
  background:linear-gradient(transparent,rgba(0,0,0,0.45));`;
const HEye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:rgba(255,255,255,0.5);margin-bottom:0.3rem;`;
const HTitle = styled.h2`font-family:var(--font-d);font-size:clamp(2.5rem,5vw,3.5rem);font-weight:300;color:white;`;

/* Overlapping hotel images + info */
const Content = styled.div`max-width:var(--content-w);margin:-5rem auto 0;position:relative;z-index:2;
  padding:0 clamp(2rem,5vw,5rem) clamp(4rem,6vh,6rem);
  display:flex;gap:2rem;flex-wrap:wrap;justify-content:center;`;
const HotelCard = styled.div`
  flex:0 0 clamp(260px,30%,340px);background:var(--c-white);
  box-shadow:0 20px 50px rgba(0,0,0,0.08);overflow:hidden;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:${p.$d||0}s;`}
`;
const HImg = styled.div`overflow:hidden;border:6px solid white;
  img{width:100%;aspect-ratio:4/3;object-fit:cover;transition:transform 0.5s;filter:grayscale(10%);}
  &:hover img{transform:scale(1.03);}`;
const HInfo = styled.div`padding:1.5rem;`;
const HName = styled.h3`font-family:var(--font-d);font-size:1.2rem;font-weight:400;margin-bottom:0.3rem;`;
const HMeta = styled.p`font-size:0.75rem;color:var(--c-text-muted);`;
const HP = styled.p`font-size:0.8rem;color:var(--c-text-sec);line-height:1.7;margin-top:0.5rem;`;
const HAddr = styled.p`font-size:0.78rem;color:var(--c-text-sec);line-height:1.5;margin-top:0.4rem;`;
const HCode = styled.div`margin-top:0.6rem;padding:0.5rem 0.75rem;background:var(--c-bg,#faf9f7);
  border:1px dashed rgba(0,0,0,0.12);border-radius:4px;font-size:0.75rem;
  span{font-weight:600;font-family:monospace;letter-spacing:0.05em;}`;
const HLinks = styled.div`display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap;`;
const HLink = styled.a`display:inline-flex;align-items:center;gap:0.3rem;font-size:0.75rem;
  padding:0.4rem 0.8rem;border:1px solid rgba(0,0,0,0.12);border-radius:3px;
  color:var(--c-text);text-decoration:none;transition:all 0.3s;
  &:hover{background:var(--c-text);color:var(--c-white);border-color:var(--c-text);}`;


const DEFS=[{name:'Hotel am Schlosspark',distance:'5 Min. entfernt',price:'ab 120 € / Nacht',description:'Komfortable Zimmer mit Blick auf den Park.'},
{name:'Boutique Hotel Gartenblick',distance:'10 Min. entfernt',price:'ab 95 € / Nacht',description:'Charmantes Boutique-Hotel in ruhiger Lage.'}];

function Accommodations() {
  const { content } = useWedding();
  const a = content?.accommodations || {};
  const [ref, v] = useInView();
  const hotels = a.hotels?.length ? a.hotels : DEFS;

  return (
    <section id="accommodations" data-theme-light style={{position:'relative',zIndex:2,background:'var(--c-white)'}}>
      <HeroImg>
        <img src={optimizedUrl.hero(a.hero_image||aImg)} alt="" loading="lazy" />
        <HeroOv>
          <HEye>Übernachten</HEye>
          <HTitle>{a.title||'Hotels'}</HTitle>
        </HeroOv>
      </HeroImg>
      <Content ref={ref}>
        {hotels.map((h,i)=>(
          <HotelCard key={i} $v={v} $d={i*0.15}>
            <HImg><img src={optimizedUrl.card(h.image||HIMGS[i%HIMGS.length])} alt={h.name||''} loading="lazy"/></HImg>
            <HInfo>
              <HName>{h.name||h.titel}</HName>
              <HMeta>{h.distance||h.entfernung}{(h.price_range||h.price)?` · ${h.price_range||h.price}`:''}</HMeta>
              {h.address&&<HAddr>📍 {h.address}</HAddr>}
              {h.description&&<HP>{h.description}</HP>}
              {h.booking_code&&<HCode>Buchungscode: <span>{h.booking_code}</span></HCode>}
              <HLinks>
                {(h.maps_url||h.maps_link)&&<HLink href={h.maps_url||h.maps_link} target="_blank" rel="noopener noreferrer">📍 Anfahrt</HLink>}
                {(h.booking_url||h.url)&&<HLink href={h.booking_url||h.url} target="_blank" rel="noopener noreferrer">🔗 Buchen</HLink>}
              </HLinks>
            </HInfo>
          </HotelCard>
        ))}
      </Content>
    </section>
  );
}
export default Accommodations;
