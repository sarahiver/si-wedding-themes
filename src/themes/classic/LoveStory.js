import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Grid = styled.div`max-width:var(--content-w);margin:0 auto;display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(3rem,5vw,6rem);align-items:center;
  @media(max-width:900px){grid-template-columns:1fr;gap:3rem;}`;

/* Links: 2-3 überlappende Bilder die das Paar hochladen kann */
const ImgStack = styled.div`position:relative;height:620px;
  @media(max-width:900px){height:450px;}@media(max-width:600px){height:380px;}`;
const Img1 = styled.div`position:absolute;top:0;left:0;width:58%;overflow:hidden;
  border:8px solid white;box-shadow:0 20px 50px rgba(0,0,0,0.1);z-index:1;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;`}
  img{width:100%;aspect-ratio:3/4;object-fit:cover;filter:grayscale(100%);}
  @media(max-width:600px){width:65%;}`;
const Img2 = styled.div`position:absolute;bottom:0;right:0;width:50%;overflow:hidden;z-index:2;
  border:8px solid white;box-shadow:0 25px 60px rgba(0,0,0,0.12);
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;animation-delay:0.2s;`}
  img{width:100%;aspect-ratio:4/5;object-fit:cover;}
  @media(max-width:600px){width:55%;}`;
const Img3 = styled.div`position:absolute;top:35%;right:5%;width:30%;overflow:hidden;z-index:3;
  border:6px solid white;box-shadow:0 15px 40px rgba(0,0,0,0.1);
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;animation-delay:0.4s;`}
  img{width:100%;aspect-ratio:1;object-fit:cover;}
  @media(max-width:600px){display:none;}`;

/* Rechts: Subhead darüber, Header, Text, Paar-Namen */
const Txt = styled.div`@media(max-width:900px){order:-1;}`;
const Sub = styled.p`font-family:var(--font-s);font-size:clamp(1.6rem,3vw,2.2rem);color:var(--c-accent);margin-bottom:0.5rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;line-height:1.2;margin-bottom:1.5rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const P = styled.p`font-size:0.85rem;line-height:2;color:var(--c-text-sec);max-width:420px;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.24s;`}`;
const Names = styled.div`font-family:var(--font-s);font-size:clamp(2rem,4vw,3rem);color:var(--c-accent);margin-top:2rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.36s;`}`;

const D1='https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg';
const D2='https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg';
const D3='https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg';

function LoveStory() {
  const { content, project } = useWedding();
  const ls = content?.lovestory || {};
  const [ref, v] = useInView(0.1);
  const cn = project?.couple_names || 'Anna & Max';
  // Classic fields first, then fallback to milestone events for backward compat
  const events = ls.events || ls.stories || [];
  const img1 = ls.image_back || events[0]?.image || D1;
  const img2 = ls.image_front || events[1]?.image || D2;
  const img3 = ls.image_accent || events[2]?.image || D3;
  const sub = ls.subtitle || 'Unsere Geschichte';
  const title = ls.title || 'Wie alles begann';
  const text = ls.text || events[0]?.text || 'Was als zufällige Begegnung begann, entwickelte sich schnell zu einer tiefen Verbindung – und der Gewissheit, dass wir füreinander bestimmt sind.';
  const signature = ls.signature || cn;

  return (
    <S id="lovestory" data-theme-light ref={ref}>
      <Grid>
        <ImgStack>
          <Img1 $v={v}><img src={optimizedUrl.card(img1)} alt="" loading="lazy" /></Img1>
          <Img2 $v={v}><img src={optimizedUrl.card(img2)} alt="" loading="lazy" /></Img2>
          {img3 && <Img3 $v={v}><img src={optimizedUrl.card(img3)} alt="" loading="lazy" /></Img3>}
        </ImgStack>
        <Txt>
          <Sub $v={v}>{sub}</Sub>
          <Title $v={v}>{title}</Title>
          <P $v={v}>{text}</P>
          <Names $v={v}>{signature}</Names>
        </Txt>
      </Grid>
    </S>
  );
}
export default LoveStory;
