import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideLeft  = keyframes`from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}`;
const slideRight = keyframes`from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}`;
const fadeIn     = keyframes`from{opacity:0}to{opacity:1}`;

const DEMO1 = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85';
const DEMO2 = 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80';

const Wrap = styled.section`
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--c-text);
  padding: clamp(6rem,10vh,8rem) clamp(1.5rem,5vw,4rem);
  @media(max-width:768px){min-height:100svh;padding-top:5rem;padding-bottom:3rem;align-items:flex-end;}
`;

const BgBlur = styled.div`
  position:absolute;inset:0;z-index:0;
  img{width:100%;height:100%;object-fit:cover;filter:blur(3px) brightness(0.2) saturate(0.6);transform:scale(1.06);}
`;
const Overlay = styled.div`
  position:absolute;inset:0;z-index:1;
  background:linear-gradient(135deg,rgba(44,36,22,.55) 0%,rgba(193,57,43,.07) 50%,rgba(44,36,22,.72) 100%);
`;

const Inner = styled.div`
  position:relative;z-index:2;width:100%;max-width:var(--content-w);
  display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,4vw,5rem);align-items:center;
  @media(max-width:768px){grid-template-columns:1fr;gap:1.5rem;}
`;

/* ── LEFT: two overlapping images ── */
const ImgSide = styled.div`
  position:relative;
  height:clamp(400px,52vw,600px);
  animation:${slideLeft} 1.1s var(--ease) .3s both;
  @media(max-width:768px){height:260px;order:2;}
`;

/* diagonal border-radius from Briefing: 0px 32px 0px 32px */
const Img1 = styled.div`
  position:absolute;top:0;left:0;
  width:65%;height:80%;
  border-radius:0 32px 0 32px;
  overflow:hidden;
  border:5px solid rgba(255,255,255,.14);
  box-shadow:0 24px 60px rgba(0,0,0,.45);
  img{width:100%;height:100%;object-fit:cover;}
  @media(max-width:768px){border-radius:0 20px 0 20px;border-width:3px;}
`;
const Img2 = styled.div`
  position:absolute;bottom:0;right:0;
  width:57%;height:68%;
  border-radius:0 32px 0 32px;
  overflow:hidden;
  border:5px solid rgba(255,255,255,.14);
  box-shadow:0 24px 60px rgba(0,0,0,.45);
  z-index:2;
  img{width:100%;height:100%;object-fit:cover;}
  @media(max-width:768px){border-radius:0 20px 0 20px;border-width:3px;}
`;
const HeartDot = styled.div`
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);z-index:3;
  width:44px;height:44px;border-radius:50%;
  background:var(--c-gold);
  border:3px solid rgba(255,255,255,.25);
  box-shadow:0 8px 24px rgba(193,127,36,.45);
  display:flex;align-items:center;justify-content:center;
  font-size:1.1rem;
  animation:${fadeIn} .8s ease 1.4s both;
  @media(max-width:768px){width:32px;height:32px;font-size:.85rem;}
`;

/* ── RIGHT: text + countdown ── */
const TextSide = styled.div`
  animation:${slideRight} 1.1s var(--ease) .5s both;
  @media(max-width:768px){order:1;text-align:center;}
`;

const LocPill = styled.p`
  display:inline-block;
  font-family:var(--font-b);font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;
  color:rgba(255,255,255,.45);
  border:1px solid rgba(255,255,255,.15);border-radius:100px;
  padding:.35rem .9rem;margin-bottom:1.25rem;
`;
const Names = styled.h1`
  font-family:var(--font-s);
  font-size:clamp(2.8rem,7vw,5.5rem);
  color:white;line-height:1;margin-bottom:.6rem;
  text-shadow:0 2px 30px rgba(0,0,0,.3);
  @media(max-width:480px){font-size:clamp(2.4rem,11vw,3.8rem);}
`;
const WDate = styled.p`
  font-family:var(--font-b);font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;
  color:rgba(255,255,255,.4);margin-bottom:.5rem;
`;
const Tagline = styled.p`
  font-family:var(--font-d);font-style:italic;
  font-size:clamp(.9rem,1.8vw,1.1rem);color:rgba(255,255,255,.5);margin-bottom:2rem;
`;
const CDivider = styled.div`
  width:40px;height:1px;background:rgba(193,57,43,.55);
  margin-bottom:2rem;
  @media(max-width:768px){margin:0 auto 2rem;}
`;

/* Countdown */
const CountRow = styled.div`
  display:flex;gap:clamp(1.2rem,3vw,2.2rem);align-items:flex-start;
  @media(max-width:768px){justify-content:center;}
`;
const CUnit = styled.div`display:flex;flex-direction:column;align-items:center;gap:.25rem;`;
const CNum = styled.span`
  font-family:var(--font-d);font-size:clamp(1.8rem,4vw,3rem);
  color:white;line-height:1;font-weight:400;
  @media(max-width:480px){font-size:clamp(1.5rem,7vw,2rem);}
`;
const CLbl = styled.span`
  font-family:var(--font-b);font-size:.5rem;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(255,255,255,.32);
`;
const CSep = styled.span`
  font-family:var(--font-d);font-size:1.4rem;color:rgba(193,57,43,.45);
  margin-top:.25rem;
`;
const Married = styled.p`
  font-family:var(--font-d);font-style:italic;
  font-size:clamp(1rem,2vw,1.2rem);color:rgba(255,255,255,.55);
`;

function useCountdown(weddingDate) {
  const [t, setT] = useState(null);
  useEffect(() => {
    if (!weddingDate) return;
    const target = new window.Date(weddingDate);
    const calc = () => {
      const diff = target - new window.Date();
      if (diff <= 0) { setT(null); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [weddingDate]);
  return t;
}
const p2 = n => String(n).padStart(2, '0');

function Hero() {
  const { project, content } = useWedding();
  const h = content?.hero || {};
  const bgRef = useRef(null);
  const wrapRef = useRef(null);

  const cn = project?.couple_names || 'Lena & Jonas';
  const wDate = project?.wedding_date;
  const img1 = h.background_image || DEMO1;
  /* image2: admins set via hero editor (we add field) — fallback to lovestory image_front */
  const img2 = h.image2 || content?.lovestory?.image_front || DEMO2;
  const loc = h.location_short || project?.location || '';
  const tagline = h.tagline || '';
  const formatted = wDate
    ? new window.Date(wDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  const countdown = useCountdown(wDate);

  useEffect(() => {
    const fn = () => {
      if (!bgRef.current || !wrapRef.current) return;
      const sy = window.scrollY;
      if (sy < wrapRef.current.offsetHeight)
        bgRef.current.style.transform = `scale(1.06) translateY(${sy * 0.12}px)`;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <Wrap ref={wrapRef} id="top">
      <BgBlur><img ref={bgRef} src={img1} alt="" /></BgBlur>
      <Overlay />
      <Inner>
        {/* Images */}
        <ImgSide>
          <Img1><img src={img1} alt={cn} loading="eager" /></Img1>
          <Img2><img src={img2} alt={cn} loading="eager" /></Img2>
          <HeartDot>♡</HeartDot>
        </ImgSide>

        {/* Text + Countdown */}
        <TextSide>
          {loc && <LocPill>{loc}</LocPill>}
          <Names>{cn}</Names>
          {formatted && <WDate>{formatted}</WDate>}
          {tagline && <Tagline>{tagline}</Tagline>}
          <CDivider />
          {countdown ? (
            <CountRow>
              <CUnit><CNum>{p2(countdown.d)}</CNum><CLbl>Tage</CLbl></CUnit>
              <CSep>·</CSep>
              <CUnit><CNum>{p2(countdown.h)}</CNum><CLbl>Std</CLbl></CUnit>
              <CSep>·</CSep>
              <CUnit><CNum>{p2(countdown.m)}</CNum><CLbl>Min</CLbl></CUnit>
              <CSep>·</CSep>
              <CUnit><CNum>{p2(countdown.s)}</CNum><CLbl>Sek</CLbl></CUnit>
            </CountRow>
          ) : (
            <Married>Wir haben geheiratet ♡</Married>
          )}
        </TextSide>
      </Inner>
    </Wrap>
  );
}
export default Hero;
