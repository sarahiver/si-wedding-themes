import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,5vw,4rem);`;
const Eye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:var(--c-accent);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;margin-bottom:0.75rem;`;
const Desc = styled.p`font-size:0.85rem;line-height:1.9;color:var(--c-text-sec);max-width:550px;margin:0 auto;`;

const Grid = styled.div`max-width:var(--content-w);margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:clamp(3rem,5vw,5rem);align-items:start;
  @media(max-width:768px){grid-template-columns:1fr;}`;

/* Links: 2 überlappende Bilder */
const ImgStack = styled.div`position:relative;min-height:480px;
  @media(max-width:768px){min-height:320px;}`;
const GiftImg = styled.div`
  position:absolute;overflow:hidden;
  border:5px solid white;box-shadow:0 12px 35px rgba(0,0,0,0.08);
  transition:all 0.5s var(--ease);
  img{width:100%;aspect-ratio:${p=>p.$ratio||'4/3'};object-fit:cover;
    filter:${p=>p.$reserved?'grayscale(100%) brightness(0.7)':'grayscale(100%)'};
    transition:filter 0.5s;}
  &:hover img{filter:${p=>p.$reserved?'grayscale(100%) brightness(0.7)':'grayscale(0%)'};}
  &:hover{transform:translateY(-3px);box-shadow:0 18px 45px rgba(0,0,0,0.12);}
`;

/* Rechts: Geschenke-Liste */
const GiftCard = styled.div`padding:1.5rem 0;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.06));
  display:flex;justify-content:space-between;align-items:center;gap:1.5rem;
  opacity:${p=>p.$reserved?0.5:1};transition:opacity 0.4s;
  @media(max-width:500px){flex-direction:column;align-items:flex-start;}`;
const GInfo = styled.div`flex:1;`;
const GN = styled.h3`font-family:var(--font-d);font-size:1.2rem;font-weight:400;margin-bottom:0.25rem;`;
const GT = styled.p`font-size:0.8rem;color:var(--c-text-sec);line-height:1.6;`;
const GA = styled.p`font-family:var(--font-d);font-size:1.05rem;color:var(--c-text-muted);margin-top:0.3rem;`;
const RB = styled.button`padding:0.6rem 1.8rem;background:transparent;
  border:1px solid ${p=>p.$done?'var(--c-border,rgba(0,0,0,0.06))':'var(--c-dark,#1A1A1A)'};
  color:${p=>p.$done?'var(--c-text-muted)':'var(--c-dark)'};
  font-size:0.5rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;flex-shrink:0;
  &:hover{background:${p=>p.$done?'transparent':'var(--c-dark)'};color:${p=>p.$done?'var(--c-text-muted)':'white'};}&:disabled{opacity:0.3;cursor:default;}`;

const GIMGS=['https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg',
'https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg'];

const DEF_GIFTS=[
  {id:'g1',title:'Hochzeitsreise',description:'Ein Beitrag zu unserem Flitterwochen-Abenteuer.',target_amount:500},
  {id:'g2',title:'Küchenausstattung',description:'Für unsere erste gemeinsame Küche.',target_amount:200},
  {id:'g3',title:'Gartengestaltung',description:'Pflanzen und Deko für unseren Garten.'},
];

function Gifts(){
  const{content}=useWedding();const g=content?.gifts||{};
  const{items:coreItems,isItemReserved,reserveGiftItem}=useGifts();
  const[ref,v]=useInView();
  
  // Use core items if available, then content items, then defaults
  const giftItems = (coreItems && coreItems.length > 0) ? coreItems 
    : (g.items && g.items.length > 0) ? g.items 
    : DEF_GIFTS;

  return(
    <S id="gifts" data-theme-light ref={ref}>
      <Hdr>
        <Eye>Wünsche</Eye>
        <Title>{g.title||'Geschenkideen'}</Title>
        <Desc>{g.description||'Das größte Geschenk ist eure Anwesenheit. Wer uns dennoch etwas schenken möchte, findet hier einige Ideen.'}</Desc>
      </Hdr>
      <Grid>
        <ImgStack>
          <GiftImg style={{width:'60%',top:'0',left:'0',zIndex:1}} $ratio="4/5" $reserved={false}>
            <img src={giftItems[0]?.image||GIMGS[0]} alt="" loading="lazy"/>
          </GiftImg>
          <GiftImg style={{width:'50%',top:'20%',left:'45%',zIndex:2}} $ratio="3/4" $reserved={false}>
            <img src={giftItems[1]?.image||GIMGS[1]} alt="" loading="lazy"/>
          </GiftImg>
        </ImgStack>
        <div>
          {giftItems.map((gift,i)=>{
            const reserved=isItemReserved?isItemReserved(gift.id):false;
            return(
              <GiftCard key={gift.id||i} $reserved={reserved}>
                <GInfo>
                  <GN>{gift.title||gift.name||'Geschenk'}</GN>
                  {gift.description&&<GT>{gift.description}</GT>}
                  {gift.target_amount&&<GA>{gift.target_amount} €</GA>}
                </GInfo>
                <RB $done={reserved} onClick={()=>reserveGiftItem&&reserveGiftItem(gift.id)} disabled={reserved}>
                  {reserved?'Reserviert':'Reservieren'}
                </RB>
              </GiftCard>);
          })}
        </div>
      </Grid>
    </S>);
}
export default Gifts;
