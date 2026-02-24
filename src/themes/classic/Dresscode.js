import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const dImg='https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg';
const dAcc='https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg';

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Grid = styled.div`max-width:var(--content-w);margin:0 auto;
  display:grid;grid-template-columns:1fr 0.8fr;gap:clamp(3rem,6vw,6rem);align-items:center;
  @media(max-width:768px){grid-template-columns:1fr;gap:2rem;}`;
const ImgWrap = styled.div`position:relative;`;
const MainImg = styled.div`overflow:hidden;border:8px solid white;box-shadow:0 20px 50px rgba(0,0,0,0.08);
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;`}
  img{width:100%;aspect-ratio:3/4;object-fit:cover;filter:grayscale(15%);}`;
const AccImg = styled.div`position:absolute;bottom:-2rem;right:-2rem;width:45%;overflow:hidden;z-index:2;
  border:6px solid white;box-shadow:0 15px 40px rgba(0,0,0,0.12);
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;animation-delay:0.2s;`}
  img{width:100%;aspect-ratio:1;object-fit:cover;}
  @media(max-width:768px){bottom:-1rem;right:-1rem;width:35%;}`;
const Txt = styled.div``;
const Eye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:var(--c-accent);margin-bottom:0.5rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;margin-bottom:1.5rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const P = styled.p`font-size:0.85rem;line-height:2;color:var(--c-text-sec);max-width:420px;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.24s;`}`;
const Swatches = styled.div`display:flex;gap:0.75rem;margin-top:2rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.36s;`}`;
const Swatch = styled.div`width:38px;height:38px;border-radius:50%;box-shadow:0 3px 10px rgba(0,0,0,0.08);`;

/* Do's and Don'ts */
const DoDont = styled.div`margin-top:2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.48s;`}
  @media(max-width:500px){grid-template-columns:1fr;}`;
const DDCol = styled.div``;
const DDLabel = styled.p`font-family:var(--font-d);font-size:1.1rem;font-weight:500;margin-bottom:0.75rem;
  color:${p=>p.$do?'var(--c-text)':'var(--c-text-muted)'};`;
const DDItem = styled.p`font-size:0.78rem;color:var(--c-text-sec);line-height:1.8;padding-left:1.2rem;position:relative;
  &::before{content:'${p=>p.$do?'✓':'✗'}';position:absolute;left:0;color:${p=>p.$do?'var(--c-text)':'var(--c-text-muted)'};}`;

const DEF_COLORS=['#2C2C2C','#999999','#8B7355','#D4C5B5','#7A8B6F'];
const DEF_DOS=['Elegante Abendgarderobe','Gedeckte, warme Farben','Cocktailkleid oder Anzug'];
const DEF_DONTS=['Bitte kein Weiß oder Creme','Keine Jeans oder Sneaker','Keine zu kurzen Kleider'];

function Dresscode() {
  const { content } = useWedding();
  const d = content?.dresscode || {};
  const [ref, v] = useInView();
  const colors = d.colors?.length ? d.colors : DEF_COLORS;
  const dos = d.dos?.length ? d.dos : DEF_DOS;
  const donts = d.donts?.length ? d.donts : DEF_DONTS;

  return (
    <S id="dresscode" data-theme-light ref={ref}>
      <Grid>
        <ImgWrap>
          <MainImg $v={v}><img src={optimizedUrl.card(d.image||dImg)} alt="" loading="lazy" /></MainImg>
          <AccImg $v={v}><img src={optimizedUrl.card(d.accent_image||dAcc)} alt="" loading="lazy" /></AccImg>
        </ImgWrap>
        <Txt>
          <Eye $v={v}>Kleiderordnung</Eye>
          <Title $v={v}>{d.title || 'Dresscode'}</Title>
          <P $v={v}>{d.description || 'Wir freuen uns über elegante Garderobe in gedeckten, warmen Farben.'}</P>
          <Swatches $v={v}>{colors.map((c,i) => <Swatch key={i} style={{background:typeof c==='string'?c:c.hex||c.color||'#ccc'}} />)}</Swatches>
          <DoDont $v={v}>
            <DDCol>
              <DDLabel $do>Do's</DDLabel>
              {dos.map((item,i)=><DDItem key={i} $do>{typeof item==='string'?item:item.text||item.titel}</DDItem>)}
            </DDCol>
            <DDCol>
              <DDLabel>Don'ts</DDLabel>
              {donts.map((item,i)=><DDItem key={i}>{typeof item==='string'?item:item.text||item.titel}</DDItem>)}
            </DDCol>
          </DoDont>
        </Txt>
      </Grid>
    </S>
  );
}
export default Dresscode;
