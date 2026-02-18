import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideLeft  = keyframes`from{opacity:0;transform:translateX(-48px)}to{opacity:1;transform:translateX(0)}`;
const slideRight = keyframes`from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:translateX(0)}`;
const fadeUp     = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}`;

function useInView(th=0.1){
  const r=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});
  if(r.current)o.observe(r.current);return()=>o.disconnect();},[th]);
  return[r,v];
}

const DEMO1='https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80';
const DEMO2='https://images.unsplash.com/photo-1591604329141-c2b78069a79c?w=800&q=80';

const S = styled.section`
  padding:var(--section-pad) clamp(1.5rem,5vw,5rem);
  background:var(--c-bg);position:relative;overflow:hidden;z-index:2;
  &::before{content:'';position:absolute;top:-60px;right:-60px;width:260px;height:260px;
    background:radial-gradient(circle,rgba(193,127,36,.06) 0%,transparent 70%);border-radius:50%;pointer-events:none;}
`;

const Inner = styled.div`
  max-width:var(--content-w);margin:0 auto;
  display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(3rem,6vw,7rem);align-items:center;
  @media(max-width:860px){grid-template-columns:1fr;gap:2.5rem;}
`;

/* two overlapping images — same diagonal radius as Hero */
const ImgStack = styled.div`
  position:relative;height:clamp(460px,58vw,620px);
  opacity:0;${p=>p.$v&&css`animation:${slideLeft} .9s var(--ease) forwards;`}
  @media(max-width:860px){height:380px;} @media(max-width:480px){height:300px;}
`;
const Img1 = styled.div`
  position:absolute;top:0;left:0;width:63%;height:80%;
  border-radius:0 32px 0 32px;overflow:hidden;
  border:6px solid var(--c-cream);box-shadow:0 16px 48px rgba(44,36,22,.12);
  img{width:100%;height:100%;object-fit:cover;}
  @media(max-width:480px){border-radius:0 20px 0 20px;border-width:4px;}
`;
const Img2 = styled.div`
  position:absolute;bottom:0;right:0;width:56%;height:68%;
  border-radius:0 32px 0 32px;overflow:hidden;z-index:2;
  border:6px solid var(--c-cream);box-shadow:0 20px 56px rgba(44,36,22,.15);
  img{width:100%;height:100%;object-fit:cover;}
  @media(max-width:480px){border-radius:0 20px 0 20px;border-width:4px;}
`;
const DateTag = styled.div`
  position:absolute;top:50%;left:54%;transform:translate(-50%,-50%);z-index:3;
  background:var(--c-gold);color:white;
  font-family:var(--font-s);font-size:clamp(.9rem,1.8vw,1.2rem);
  padding:.5rem 1rem;border-radius:var(--radius-sm);
  box-shadow:0 8px 24px rgba(193,127,36,.3);white-space:nowrap;
  @media(max-width:480px){font-size:.8rem;padding:.4rem .8rem;}
`;

const TextSide = styled.div`
  opacity:0;${p=>p.$v&&css`animation:${slideRight} .9s var(--ease) .15s forwards;`}
`;
const Eyebrow = styled.p`
  font-family:var(--font-s);font-size:clamp(1.3rem,2.5vw,1.7rem);color:var(--c-accent);margin-bottom:.6rem;
`;
const H2 = styled.h2`
  font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:400;
  color:var(--c-text);margin-bottom:1.5rem;line-height:1.15;
`;
const Body = styled.p`
  font-family:var(--font-b);font-size:clamp(.88rem,1.4vw,.98rem);
  line-height:1.9;color:var(--c-text-sec);margin-bottom:1.1rem;max-width:460px;
`;
const HLine = styled.div`width:48px;height:2px;background:var(--c-accent);margin:1.75rem 0;border-radius:2px;`;
const Sig = styled.p`
  font-family:var(--font-s);font-size:clamp(1.2rem,2vw,1.5rem);color:var(--c-text-muted);
`;

/* Milestone list for standard (non-classic) mode */
const MilestoneList = styled.div`display:flex;flex-direction:column;gap:1.5rem;`;
const Milestone = styled.div`
  display:grid;grid-template-columns:auto 1fr;gap:1rem;align-items:start;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} .7s var(--ease) ${p.$i*.1}s forwards;`}
`;
const MDate = styled.div`
  font-family:var(--font-b);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--c-accent);min-width:80px;padding-top:.15rem;font-weight:500;
`;
const MBody = styled.div``;
const MTitle = styled.p`font-family:var(--font-d);font-size:1rem;font-weight:500;color:var(--c-text);margin-bottom:.2rem;`;
const MDesc = styled.p`font-family:var(--font-b);font-size:.82rem;color:var(--c-text-muted);line-height:1.7;`;

function LoveStory(){
  const{content,project}=useWedding();
  const ls=content?.lovestory||{};
  const cn=project?.couple_names||'Lena & Jonas';
  const wDate=project?.wedding_date;
  const[ref,v]=useInView();

  /* Admin fields: image_back (large), image_front (medium) */
  const img1=ls.image_back||DEMO1;
  const img2=ls.image_front||DEMO2;

  const dateTag=wDate
    ?new window.Date(wDate).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'})
    :'';

  /* Classic mode: subtitle, title, text, signature + 2 images */
  /* Standard mode: title + events[] */
  const hasEvents=ls.events?.length>0;

  if(hasEvents){
    return(
      <S id="lovestory" data-theme-light ref={ref}>
        <Inner>
          <ImgStack $v={v}>
            <Img1><img src={img1} alt={cn} loading="lazy"/></Img1>
            <Img2><img src={img2} alt={cn} loading="lazy"/></Img2>
            {dateTag&&<DateTag>{dateTag}</DateTag>}
          </ImgStack>
          <TextSide $v={v}>
            <Eyebrow>wie alles begann</Eyebrow>
            <H2>{ls.title||'Unsere Geschichte'}</H2>
            <MilestoneList>
              {ls.events.map((ev,i)=>(
                <Milestone key={i} $v={v} $i={i}>
                  <MDate>{ev.date}</MDate>
                  <MBody>
                    <MTitle>{ev.title}</MTitle>
                    {ev.description&&<MDesc>{ev.description}</MDesc>}
                  </MBody>
                </Milestone>
              ))}
            </MilestoneList>
            <HLine/>
            <Sig>{cn}</Sig>
          </TextSide>
        </Inner>
      </S>
    );
  }

  return(
    <S id="lovestory" data-theme-light ref={ref}>
      <Inner>
        <ImgStack $v={v}>
          <Img1><img src={img1} alt={cn} loading="lazy"/></Img1>
          <Img2><img src={img2} alt={cn} loading="lazy"/></Img2>
          {dateTag&&<DateTag>{dateTag}</DateTag>}
        </ImgStack>
        <TextSide $v={v}>
          <Eyebrow>{ls.subtitle||'wie alles begann'}</Eyebrow>
          <H2>{ls.title||'Unsere Geschichte'}</H2>
          {ls.text&&<Body>{ls.text}</Body>}
          <HLine/>
          <Sig>{ls.signature||cn}</Sig>
        </TextSide>
      </Inner>
    </S>
  );
}
export default LoveStory;
