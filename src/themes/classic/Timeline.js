import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`
  padding:clamp(6rem,10vh,10rem) 0;background:var(--c-dark,#111);position:relative;z-index:2;overflow:hidden;
`;
const Hdr = styled.div`
  max-width:var(--content-w,1200px);margin:0 auto 4rem;padding:0 clamp(2rem,5vw,5rem);
`;
const Eye = styled.p`font-size:0.55rem;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:1rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;color:white;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;

const Track = styled.div`
  display:flex;align-items:center;gap:1.5rem;padding:0 clamp(2rem,5vw,5rem);
  overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;
  scrollbar-width:none;&::-webkit-scrollbar{display:none;}
  @media(max-width:768px){gap:1rem;padding:0 1.5rem;}
`;

const Card = styled.div`
  position:relative;overflow:hidden;cursor:pointer;
  flex:0 0 ${p=>p.$active?'clamp(320px,40vw,520px)':'clamp(160px,18vw,220px)'};
  height:${p=>p.$active?'clamp(420px,55vh,600px)':'clamp(280px,35vh,380px)'};
  border:${p=>p.$active?'6px solid white':'none'};
  box-shadow:${p=>p.$active?'0 25px 60px rgba(0,0,0,0.4)':'0 10px 30px rgba(0,0,0,0.2)'};
  scroll-snap-align:center;transition:all 0.6s var(--ease);z-index:${p=>p.$active?5:1};
  filter:${p=>p.$active?'none':'brightness(0.4) grayscale(50%)'};
  &:hover{filter:${p=>p.$active?'none':'brightness(0.55) grayscale(30%)'};}
  img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s var(--ease);}
  &:hover img{transform:scale(1.03);}
  @media(max-width:768px){
    flex:0 0 ${p=>p.$active?'85vw':'35vw'};
    height:${p=>p.$active?'55vh':'35vh'};
  }
`;

const CardOverlay = styled.div`
  position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;
  padding:${p=>p.$active?'2.5rem':'1.2rem'};
  background:${p=>p.$active?'linear-gradient(transparent 30%,rgba(0,0,0,0.65) 100%)':'linear-gradient(transparent 50%,rgba(0,0,0,0.5) 100%)'};
`;
const CTime = styled.p`font-family:var(--font-d);font-size:${p=>p.$active?'clamp(2.5rem,5vw,4rem)':'clamp(1.2rem,2vw,1.6rem)'};font-weight:300;color:white;line-height:1;margin-bottom:0.3rem;transition:font-size 0.4s;`;
const CTitle = styled.p`font-family:var(--font-d);font-size:${p=>p.$active?'clamp(1.1rem,2vw,1.4rem)':'clamp(0.7rem,1vw,0.85rem)'};font-weight:400;color:rgba(255,255,255,0.9);margin-bottom:0.15rem;transition:font-size 0.4s;`;
const CDesc = styled.p`font-size:${p=>p.$active?'0.75rem':'0.55rem'};color:rgba(255,255,255,${p=>p.$active?'0.55':'0.35'});max-width:${p=>p.$active?'300px':'150px'};transition:all 0.4s;`;

const Dots = styled.div`display:flex;justify-content:center;gap:0.75rem;margin-top:2.5rem;`;
const Dot = styled.button`width:${p=>p.$a?'24px':'6px'};height:6px;border-radius:3px;border:none;
  background:${p=>p.$a?'white':'rgba(255,255,255,0.2)'};transition:all 0.3s;cursor:pointer;`;

const DEF_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg';
const IMGS = [
  DEF_IMG,
  'https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg',
  'https://res.cloudinary.com/si-weddings/image/upload/v1770716441/siwedding/demo-botanical/lovestory/uj61pv6uqigwyh5pidvi.jpg',
];
const DEFS = [
  {time:'14:00',title:'Empfang',description:'Sektempfang im Garten'},
  {time:'15:00',title:'Trauung',description:'Freie Trauung im Schlosspark'},
  {time:'16:30',title:'Kaffee & Kuchen',description:'Hochzeitstorte & Patisserie'},
  {time:'18:30',title:'Dinner',description:'4-Gänge-Menü'},
  {time:'21:00',title:'Party',description:'Eröffnungstanz & DJ'},
];

function Timeline() {
  const { content } = useWedding();
  const tl = content?.timeline || {};
  const [ref, v] = useInView();
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const items = tl.events?.length ? tl.events : tl.items?.length ? tl.items : DEFS;

  const scrollToCard = (idx) => {
    setActive(idx);
    const track = trackRef.current;
    if (track) {
      const cards = track.children;
      if (cards[idx]) {
        const card = cards[idx];
        const offset = card.offsetLeft - track.offsetWidth / 2 + card.offsetWidth / 2;
        track.scrollTo({ left: offset, behavior: 'smooth' });
      }
    }
  };

  return (
    <S id="timeline" ref={ref}>
      <Hdr>
        <Eye $v={v}>Der große Tag</Eye>
        <Title $v={v}>{tl.title || 'Tagesablauf'}</Title>
      </Hdr>
      <Track ref={trackRef}>
        {items.map((it, i) => (
          <Card key={i} $active={i === active} onClick={() => scrollToCard(i)}>
            <img src={it.image || IMGS[i % IMGS.length]} alt={it.title || it.titel} loading="lazy" />
            <CardOverlay $active={i === active}>
              <CTime $active={i === active}>{it.time || it.zeit}</CTime>
              <CTitle $active={i === active}>{it.title || it.titel}</CTitle>
              {(it.description || it.beschreibung) && <CDesc $active={i === active}>{it.description || it.beschreibung}</CDesc>}
            </CardOverlay>
          </Card>
        ))}
      </Track>
      <Dots>
        {items.map((_, i) => <Dot key={i} $a={i === active} onClick={() => scrollToCard(i)} />)}
      </Dots>
    </S>
  );
}
export default Timeline;
