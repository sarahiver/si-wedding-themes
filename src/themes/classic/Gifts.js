import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`
  display:grid;grid-template-columns:0.45fr 1fr;min-height:75vh;position:relative;z-index:2;
  @media(max-width:768px){grid-template-columns:1fr;}
`;
const ImgSide = styled.div`
  position:relative;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(30%) brightness(0.5);}
  @media(max-width:768px){height:35vh;}
`;
const ImgOv = styled.div`
  position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;
  padding:clamp(2rem,4vw,3rem);background:linear-gradient(transparent 40%,rgba(0,0,0,0.5));
`;
const ImgTitle = styled.p`font-family:var(--font-s);font-size:clamp(2rem,4vw,3rem);color:rgba(255,255,255,0.6);`;
const ContentSide = styled.div`
  background:var(--c-white,#fff);padding:clamp(3rem,5vw,5rem);display:flex;flex-direction:column;justify-content:center;
`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted,#999);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(1.8rem,3vw,2.5rem);font-weight:300;margin-bottom:0.75rem;`;
const Desc = styled.p`font-size:0.85rem;line-height:1.9;color:var(--c-text-sec,#555);margin-bottom:2.5rem;max-width:500px;`;
const Card = styled.div`padding:1.5rem 0;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.06));
  display:flex;justify-content:space-between;align-items:center;gap:1.5rem;
  @media(max-width:500px){flex-direction:column;align-items:flex-start;}`;
const GInfo = styled.div`flex:1;`;
const GN = styled.h3`font-family:var(--font-d);font-size:1.2rem;font-weight:400;margin-bottom:0.25rem;`;
const GT = styled.p`font-size:0.78rem;color:var(--c-text-sec,#555);line-height:1.6;`;
const GA = styled.p`font-family:var(--font-d);font-size:1.1rem;color:var(--c-text-muted,#999);margin-top:0.4rem;`;
const PBar = styled.div`width:120px;height:2px;background:var(--c-border,rgba(0,0,0,0.06));overflow:hidden;margin-top:0.4rem;
  &::after{content:'';display:block;height:100%;width:${p=>p.$p||0}%;background:var(--c-text-muted,#999);transition:width 1s;}`;
const RB = styled.button`padding:0.65rem 1.8rem;background:transparent;border:1px solid var(--c-border,rgba(0,0,0,0.12));
  font-size:0.5rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;flex-shrink:0;
  &:hover{background:var(--c-dark,#111);color:white;border-color:var(--c-dark,#111);}&:disabled{opacity:0.3;}`;

const giftImg = 'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg';

function Gifts() {
  const { content } = useWedding();
  const g = content?.gifts || {};
  const { items, isItemReserved, reserveGiftItem } = useGifts();
  const giftItems = items?.length ? items : g.items || [];

  return (
    <S id="gifts">
      <ImgSide>
        <img src={giftImg} alt="" loading="lazy" />
        <ImgOv><ImgTitle>Wünsche</ImgTitle></ImgOv>
      </ImgSide>
      <ContentSide>
        <Eye>Geschenke</Eye>
        <Title>{g.title || 'Geschenkideen'}</Title>
        <Desc>{g.description || 'Das größte Geschenk ist eure Anwesenheit. Wer uns dennoch etwas schenken möchte, findet hier einige Ideen.'}</Desc>
        {giftItems.map((gift, i) => {
          const reserved = isItemReserved ? isItemReserved(gift.id) : false;
          const pct = gift.target_amount ? Math.min(100, ((gift.reserved_amount||0)/gift.target_amount)*100) : 0;
          return (
            <Card key={gift.id||i}>
              <GInfo>
                <GN>{gift.title||gift.name||'Geschenk'}</GN>
                {gift.description && <GT>{gift.description}</GT>}
                {gift.target_amount && <><GA>{gift.target_amount} €</GA><PBar $p={pct}/></>}
              </GInfo>
              <RB onClick={()=>reserveGiftItem&&reserveGiftItem(gift.id)} disabled={reserved||pct>=100}>
                {reserved||pct>=100?'Reserviert':'Reservieren'}
              </RB>
            </Card>
          );
        })}
      </ContentSide>
    </S>
  );
}
export default Gifts;
