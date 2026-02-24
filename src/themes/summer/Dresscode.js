import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

const slideLeft  = keyframes`from{opacity:0;transform:translateX(-36px)}to{opacity:1;transform:translateX(0)}`;
const slideRight = keyframes`from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}`;
const fadeUp     = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}`;

function useInView(th=0.08){
  const r=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});
  if(r.current)o.observe(r.current);return()=>o.disconnect();},[th]);
  return[r,v];
}

const DEMO_COLORS=[{hex:'#F5DEB3'},{hex:'#C17F24'},{hex:'#8B6914'},{hex:'#C1392B'},{hex:'#DDA0DD'},{hex:'#98D08E'}];
const DEMO_DOS=['Leichte Sommerkleider','Erdtöne & Naturfarben','Boho-Prints','Sandalen & Flats'];
const DEMO_DONTS=['Weiß oder Cremeweiß','Formelle Abendgarderobe'];
const DEMO_IMG='https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80';

const S = styled.section`
  padding:var(--section-pad) clamp(1.5rem,5vw,4rem);
  background:var(--c-bg-warm);position:relative;z-index:2;overflow:hidden;
`;
const Inner = styled.div`
  max-width:var(--content-w);margin:0 auto;
  display:grid;grid-template-columns:1fr 1fr;gap:clamp(3rem,6vw,6rem);align-items:center;
  @media(max-width:768px){grid-template-columns:1fr;gap:2.5rem;}
`;
const TextSide = styled.div`opacity:0;${p=>p.$v&&css`animation:${slideLeft} .9s var(--ease) forwards;`}`;
const Eyebrow  = styled.p`font-family:var(--font-b);font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--c-accent);margin-bottom:.6rem;font-weight:500;`;
const H2       = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:400;color:var(--c-text);margin-bottom:.6rem;`;
const StyleLbl = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.8vw,1.9rem);color:var(--c-accent);margin-bottom:1.25rem;`;
const Desc     = styled.p`font-family:var(--font-b);font-size:.88rem;color:var(--c-text-sec);line-height:1.85;max-width:420px;margin-bottom:1.75rem;`;

const SwatchRow   = styled.div`display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:.5rem;`;
const SwatchLabel = styled.p`font-family:var(--font-b);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:.4rem;`;
const Swatch = styled.div`
  width:34px;height:34px;border-radius:50%;background:${p=>p.$c};
  box-shadow:0 3px 10px rgba(0,0,0,.12);cursor:default;
  position:relative;
  &:hover::after{content:attr(title);position:absolute;bottom:calc(100% + 5px);left:50%;transform:translateX(-50%);
    background:var(--c-text);color:white;font-size:.6rem;padding:2px 6px;border-radius:4px;white-space:nowrap;pointer-events:none;}
`;

const DoDont  = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-top:1.75rem;`;
const DDCol   = styled.div``;
const DDLabel = styled.p`font-family:var(--font-d);font-size:1rem;font-weight:500;color:var(--c-text);margin-bottom:.6rem;`;
const DDItem  = styled.p`font-family:var(--font-b);font-size:.8rem;color:var(--c-text-muted);line-height:1.8;
  padding-left:1rem;position:relative;
  &::before{content:'${p=>p.$do?'✓':'✗'}';position:absolute;left:0;color:${p=>p.$do?'#7CB87C':'var(--c-accent)'};font-size:.72rem;}`;

/* Right: stacked images */
const ImgSide = styled.div`
  position:relative;height:clamp(420px,52vw,580px);
  opacity:0;${p=>p.$v&&css`animation:${slideRight} .9s var(--ease) .2s forwards;`}
  @media(max-width:768px){display:none;}
`;
const DImg1 = styled.div`
  position:absolute;top:0;right:0;width:72%;height:75%;
  border-radius:0 32px 0 32px;overflow:hidden;
  border:6px solid var(--c-cream);box-shadow:0 16px 48px rgba(44,36,22,.12);
  img{width:100%;height:100%;object-fit:cover;}
`;
const DImg2 = styled.div`
  position:absolute;bottom:0;left:0;width:55%;height:58%;
  border-radius:0 32px 0 32px;overflow:hidden;z-index:2;
  border:6px solid var(--c-cream);box-shadow:0 20px 56px rgba(44,36,22,.15);
  img{width:100%;height:100%;object-fit:cover;}
`;

function Dresscode(){
  const{content}=useWedding();
  /* Admin fields: title, code, description, colors[]{hex,name}, dos[], donts[], image, accent_image */
  const d=content?.dresscode||{};
  const[ref,v]=useInView();

  const colors   = d.colors?.length   ? d.colors   : DEMO_COLORS;
  const dos      = d.dos?.length      ? d.dos      : DEMO_DOS;
  const donts    = d.donts?.length    ? d.donts    : DEMO_DONTS;
  const mainImg  = d.image            || DEMO_IMG;
  const accentImg= d.accent_image     || null;

  return(
    <S id="dresscode" data-theme-light ref={ref}>
      <Inner>
        <TextSide $v={v}>
          <Eyebrow>was ihr tragen dürft</Eyebrow>
          <H2>{d.title||'Dresscode'}</H2>
          {d.code&&<StyleLbl>{d.code}</StyleLbl>}
          {d.description&&<Desc>{d.description}</Desc>}

          {colors.length>0&&<>
            <SwatchLabel>Farbpalette</SwatchLabel>
            <SwatchRow>
              {colors.map((c,i)=>{
                const hex=typeof c==='string'?c:c.hex;
                const name=typeof c==='object'?c.name:'';
                return<Swatch key={i} $c={hex} title={name||hex}/>;
              })}
            </SwatchRow>
          </>}

          <DoDont>
            <DDCol>
              <DDLabel>✓ Passt super</DDLabel>
              {dos.map((item,i)=><DDItem key={i} $do>{typeof item==='string'?item:item.text||item}</DDItem>)}
            </DDCol>
            <DDCol>
              <DDLabel>✗ Lieber nicht</DDLabel>
              {donts.map((item,i)=><DDItem key={i}>{typeof item==='string'?item:item.text||item}</DDItem>)}
            </DDCol>
          </DoDont>
        </TextSide>

        <ImgSide $v={v}>
          <DImg1><img src={optimizedUrl.card(mainImg)} alt="Dresscode" loading="lazy"/></DImg1>
          {accentImg&&<DImg2><img src={optimizedUrl.card(accentImg)} alt="" loading="lazy"/></DImg2>}
        </ImgSide>
      </Inner>
    </S>
  );
}
export default Dresscode;
