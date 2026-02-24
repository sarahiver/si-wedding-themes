import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`
  padding:clamp(6rem,10vh,10rem) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;
`;
const Hdr = styled.div`max-width:var(--content-w);margin:0 auto 3rem;`;
const Eye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:var(--c-accent);margin-bottom:0.5rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;

/* Fixe Breite Container, Karten passen sich an */
const TrackWrap = styled.div`
  max-width:var(--content-w);margin:0 auto;position:relative;
  display:flex;align-items:stretch;justify-content:center;gap:${p=>p.$gap||'1rem'};
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.25s;`}
  @media(max-width:768px){flex-wrap:wrap;}
`;

const Card = styled.div`
  position:relative;overflow:hidden;cursor:pointer;
  flex:${p=>p.$active?'2.5':'1'};min-width:0;
  height:clamp(380px,50vh,550px);
  border:${p=>p.$active?'6px solid white':'2px solid rgba(255,255,255,0.1)'};
  box-shadow:${p=>p.$active?'0 25px 60px rgba(0,0,0,0.2)':'0 8px 25px rgba(0,0,0,0.1)'};
  transition:all 0.6s var(--ease);
  img{width:100%;height:100%;object-fit:cover;
    filter:${p=>p.$active?'brightness(0.55) grayscale(20%)':'brightness(0.3) grayscale(60%)'};
    transition:all 0.6s var(--ease);}
  &:hover img{filter:${p=>p.$active?'brightness(0.55) grayscale(15%)':'brightness(0.4) grayscale(40%)'};}
  @media(max-width:768px){flex:none;width:100%;height:280px;}
`;
const CardOv = styled.div`
  position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;
  padding:${p=>p.$active?'clamp(1.5rem,3vw,2.5rem)':'1.2rem'};
  background:linear-gradient(transparent 30%,rgba(0,0,0,${p=>p.$active?'0.55':'0.4'}) 100%);
  transition:padding 0.4s;
`;
const CTime = styled.p`font-family:var(--font-d);font-size:${p=>p.$active?'clamp(2.5rem,5vw,3.5rem)':'clamp(1rem,1.8vw,1.4rem)'};
  font-weight:300;color:white;line-height:1;margin-bottom:0.3rem;transition:font-size 0.4s;`;
const CTitle = styled.p`font-family:var(--font-d);font-size:${p=>p.$active?'clamp(1rem,1.8vw,1.3rem)':'clamp(0.7rem,1vw,0.85rem)'};
  font-weight:400;color:rgba(255,255,255,0.9);margin-bottom:${p=>p.$active?'0.3rem':'0'};transition:all 0.4s;`;
const CDesc = styled.p`font-size:0.7rem;color:rgba(255,255,255,0.5);max-width:300px;
  opacity:${p=>p.$active?1:0};max-height:${p=>p.$active?'50px':'0'};overflow:hidden;transition:all 0.4s;`;

const IMGS = [
  'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg',
];
const DEFS=[{time:'14:00',title:'Empfang',description:'Sektempfang im Garten'},{time:'15:00',title:'Trauung',description:'Freie Trauung im Schlosspark'},{time:'16:30',title:'Kaffee & Kuchen',description:'Hochzeitstorte & Patisserie'},{time:'18:30',title:'Dinner',description:'4-Gänge-Menü'},{time:'21:00',title:'Party',description:'Eröffnungstanz & DJ'}];

function Timeline() {
  const { content } = useWedding();
  const tl = content?.timeline || {};
  const [ref, v] = useInView();
  const [active, setActive] = useState(0);
  const items = tl.events?.length ? tl.events : tl.items?.length ? tl.items : DEFS;

  return (
    <S id="timeline" data-theme-light ref={ref}>
      <Hdr>
        <Eye $v={v}>Der große Tag</Eye>
        <Title $v={v}>{tl.title || 'Tagesablauf'}</Title>
      </Hdr>
      <TrackWrap $v={v} $gap={items.length > 5 ? '0.5rem' : '1rem'}>
        {items.map((it, i) => (
          <Card key={i} $active={i===active} onClick={() => setActive(i)}>
            <img src={optimizedUrl.card(it.image || IMGS[i % IMGS.length])} alt={it.title||it.titel} loading="lazy" />
            <CardOv $active={i===active}>
              <CTime $active={i===active}>{it.time || it.zeit}</CTime>
              <CTitle $active={i===active}>{it.title || it.titel}</CTitle>
              <CDesc $active={i===active}>{it.description || it.beschreibung || ''}</CDesc>
            </CardOv>
          </Card>
        ))}
      </TrackWrap>
    </S>
  );
}
export default Timeline;
