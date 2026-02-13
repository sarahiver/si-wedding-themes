import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const scaleIn = keyframes`from{opacity:0;transform:scale(1.06)}to{opacity:1;transform:scale(1)}`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const float = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}`;

const S = styled.section`position:relative;height:100vh;min-height:650px;overflow:hidden;background:#111;`;
const BgW = styled.div`position:absolute;inset:0;animation:${scaleIn} 2.5s var(--ease) forwards;`;
const BgV = styled.video`width:100%;height:100%;object-fit:cover;filter:grayscale(40%) brightness(0.42);`;
const BgI = styled.img`width:100%;height:100%;object-fit:cover;filter:grayscale(40%) brightness(0.42);`;
const Ov = styled.div`position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.15) 0%,transparent 40%,rgba(0,0,0,0.35) 100%);`;
const Ct = styled.div`position:absolute;bottom:clamp(3rem,8vh,6rem);left:clamp(2rem,5vw,5rem);z-index:10;max-width:600px;`;
const Eye = styled.p`font-family:var(--font-b);font-size:0.5rem;font-weight:300;letter-spacing:0.4em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:1.2rem;opacity:0;animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.8s;`;
const Names = styled.h1`font-family:var(--font-d);font-size:clamp(3rem,8vw,5.5rem);font-weight:300;color:white;line-height:1;opacity:0;animation:${fadeUp} 1s var(--ease) forwards;animation-delay:1s;`;
const Script = styled.span`display:block;font-family:var(--font-s);font-size:clamp(1.8rem,4vw,3rem);color:rgba(255,255,255,0.6);margin-top:0.5rem;opacity:0;animation:${fadeIn} 1s ease forwards;animation-delay:1.5s;`;
const Dt = styled.p`font-family:var(--font-b);font-size:0.5rem;font-weight:300;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-top:1.5rem;opacity:0;animation:${fadeUp} 0.8s ease forwards;animation-delay:1.8s;`;
const Scroll = styled.div`position:absolute;bottom:2.5rem;right:clamp(2rem,5vw,5rem);display:flex;flex-direction:column;align-items:center;gap:0.5rem;opacity:0;animation:${fadeIn} 1s ease forwards;animation-delay:2.5s;`;
const SLine = styled.div`width:1px;height:35px;background:linear-gradient(to bottom,rgba(255,255,255,0.4),transparent);animation:${float} 2.5s ease-in-out infinite;`;
const SLbl = styled.span`font-size:0.4rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);`;

function Hero() {
  const { content, project, weddingDate } = useWedding();
  const h = content?.hero || {};
  const n1 = project?.partner1_name || 'Anna';
  const n2 = project?.partner2_name || 'Max';
  const tagline = h.tagline || 'Wir heiraten';
  const scriptLine = h.script_line || 'füreinander bestimmt';
  const bgImg = h.background_image || 'https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg';
  const bgVid = h.background_media?.url || h.background_video || 'https://res.cloudinary.com/si-weddings/video/upload/v1770287435/212698_small_cibloj.mp4';
  const bgMobile = h.background_image_mobile || h.background_media_mobile?.url || bgImg;
  const useVideo = h.background_media?.url ? true : h.use_video !== false;
  const [mob, setMob] = useState(false);
  useEffect(() => { const c = () => setMob(window.innerWidth <= 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);
  const loc = project?.location || '';
  const fmtDate = d => d ? new Date(d).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}) : '';
  const dateLoc = [fmtDate(weddingDate), loc].filter(Boolean).join(' \u00B7 ');

  return (
    <S id="top">
      <BgW>{useVideo && !mob ? <BgV autoPlay muted loop playsInline poster={bgImg}><source src={bgVid} type="video/mp4"/></BgV> : <BgI src={mob ? bgMobile : bgImg} alt="" loading="eager"/>}</BgW>
      <Ov/>
      <Ct>
        <Eye>{tagline}</Eye>
        <Names>{n1} &<br/>{n2}</Names>
        <Script>{scriptLine}</Script>
        {dateLoc && <Dt>{dateLoc}</Dt>}
      </Ct>
      <Scroll><SLine/><SLbl>Scroll</SLbl></Scroll>
    </S>
  );
}
export default Hero;
