import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const Sec = styled.section`display:grid;grid-template-columns:1fr 1fr;min-height:80vh;${p=>p.$rev?'direction:rtl;':''}@media(max-width:900px){grid-template-columns:1fr;direction:ltr;}& > *{direction:ltr;}`;
const ImgSide = styled.div`position:relative;overflow:hidden;@media(max-width:900px){height:50vh;} img{width:100%;height:100%;object-fit:cover;filter:grayscale(15%);}`;
const AccentImg = styled.div`position:absolute;bottom:-2rem;${p=>p.$rev?'left:-1.5rem':'right:-1.5rem'};width:40%;border:6px solid white;box-shadow:0 15px 40px rgba(0,0,0,0.12);z-index:3;overflow:hidden;@media(max-width:900px){bottom:-1rem;${p=>p.$rev?'left:1rem':'right:1rem'};width:35%;} img{width:100%;aspect-ratio:1;object-fit:cover;filter:none;}`;
const TxtSide = styled.div`display:flex;flex-direction:column;justify-content:center;padding:clamp(3rem,6vw,6rem);`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;line-height:1.2;margin-bottom:1.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const P = styled.p`font-size:0.82rem;line-height:2;color:var(--c-text-sec);max-width:440px;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.24s;`}`;
const Addr = styled.p`font-size:0.75rem;font-style:italic;color:var(--c-text-muted);margin-top:0.5rem;opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.36s;`}`;

const DEF_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg';
const DEF_ACC = 'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg';

function LocationItem({ loc, index }) {
  const [ref, v] = useInView(0.08);
  const rev = index % 2 === 1;
  return (
    <Sec ref={ref} $rev={rev} id={index === 0 ? 'locations' : undefined}>
      <ImgSide>
        <img src={loc.image || DEF_IMG} alt={loc.name} loading="lazy"/>
        {loc.accent_image && <AccentImg $rev={rev}><img src={loc.accent_image} alt="" loading="lazy"/></AccentImg>}
      </ImgSide>
      <TxtSide>
        {loc.label && <Eye $v={v}>{loc.label}</Eye>}
        <Title $v={v}>{loc.name || loc.titel}</Title>
        <P $v={v}>{loc.description || loc.beschreibung}</P>
        {(loc.address || loc.adresse) && <Addr $v={v}>{loc.address || loc.adresse}</Addr>}
      </TxtSide>
    </Sec>
  );
}

function Locations() {
  const { content } = useWedding();
  const ld = content?.locations || {};
  const locs = ld.locations?.length ? ld.locations : [{
    label: 'Trauung & Feier',
    name: 'Schloss Charlottenburg',
    description: 'Die Zeremonie und Feier finden im prachtvollen Ambiente des Schlosses statt.',
    address: 'Spandauer Damm 20, 14059 Berlin',
    image: DEF_IMG,
    accent_image: DEF_ACC
  }];
  return (<>{locs.map((loc, i) => <LocationItem key={i} loc={loc} index={i} />)}</>);
}
export default Locations;
