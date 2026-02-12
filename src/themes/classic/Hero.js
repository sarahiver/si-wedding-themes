import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const scaleRev = keyframes`from { opacity: 0; transform: scale(1.15); } to { opacity: 1; transform: scale(1); }`;
const lineExp = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const floatSoft = keyframes`0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); }`;

const S = styled.section`position: relative; height: 100vh; min-height: 600px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--c-dark);`;

const BgWrap = styled.div`
  position: absolute; inset: 0; opacity: 0;
  animation: ${scaleRev} 2s var(--ease) forwards; animation-delay: 0.2s;
  &::after { content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.5) 100%); }
`;
const BgImg = styled.img`width: 100%; height: 100%; object-fit: cover; object-position: ${p => p.$pos || 'center'}; filter: grayscale(60%) brightness(0.45);`;
const BgVid = styled.video`width: 100%; height: 100%; object-fit: cover; filter: grayscale(60%) brightness(0.45);`;

const Content = styled.div`position: relative; z-index: 10; text-align: center; padding: 2rem; max-width: 800px;`;

const Eye = styled.p`
  font-family: var(--font-body); font-size: 0.6rem; font-weight: 400;
  letter-spacing: 0.35em; text-transform: uppercase; color: rgba(255,255,255,0.7);
  margin-bottom: 2rem; opacity: 0;
  animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.8s;
`;
const Name = styled.div`
  font-family: var(--font-display); font-size: clamp(3.5rem, 12vw, 8rem); font-weight: 300;
  color: #FFFFFF; line-height: 0.95; letter-spacing: 0.01em;
  text-shadow: 0 2px 30px rgba(0,0,0,0.15);
  opacity: 0; animation: ${fadeUp} 1s var(--ease) forwards; animation-delay: ${p => p.$d};
`;
const ScriptAnd = styled.span`
  display: block; font-family: var(--font-script); font-size: clamp(2rem, 6vw, 4rem);
  color: var(--c-gold); margin: 0.15em 0;
  opacity: 0; animation: ${fadeIn} 0.8s ease forwards; animation-delay: 1.3s;
`;
const GoldLine = styled.div`
  width: 80px; height: 1px; background: var(--c-gold); margin: 2.5rem auto;
  transform-origin: center; transform: scaleX(0);
  animation: ${lineExp} 0.8s var(--ease) forwards; animation-delay: 1.8s;
`;
const DateTxt = styled.p`
  font-family: var(--font-display); font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 300; font-style: italic; color: rgba(255,255,255,0.9);
  opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 2s;
`;
const LocTxt = styled.p`
  font-family: var(--font-body); font-size: 0.6rem; font-weight: 400;
  letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.45);
  margin-top: 0.5rem; opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 2.2s;
`;
const ScrollHint = styled.div`
  position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  opacity: 0; animation: ${fadeIn} 1s ease forwards; animation-delay: 3s;
`;
const ScrollLine = styled.div`width: 1px; height: 40px; background: linear-gradient(to bottom, var(--c-gold), transparent); animation: ${floatSoft} 2.5s ease-in-out infinite;`;
const ScrollLbl = styled.span`font-family: var(--font-body); font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.3);`;

function Hero() {
  const { content, project, weddingDate } = useWedding();
  const h = content?.hero || {};
  const name1 = project?.partner1_name || h.name1 || 'Anna';
  const name2 = project?.partner2_name || h.name2 || 'Max';
  const loc = h.location_short || project?.location || null;
  const tagline = h.tagline || 'Wir heiraten';
  const bgImg = h.background_image || 'https://res.cloudinary.com/si-weddings/image/upload/v1770826558/siwedding/demo-neon/hero/hauxediplqad4yx26v6b.jpg';
  const bgVid = h.background_video || 'https://res.cloudinary.com/si-weddings/video/upload/v1770287435/212698_small_cibloj.mp4';
  const imgPos = h.image_position || 'center';
  const useVideo = h.use_video !== false;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { const c = () => setIsMobile(window.innerWidth <= 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);

  const fmtDate = d => d ? new Date(d).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Datum folgt';

  return (
    <S id="top">
      <BgWrap>
        {useVideo && !isMobile ? (
          <BgVid autoPlay muted loop playsInline poster={bgImg}><source src={bgVid} type="video/mp4" /></BgVid>
        ) : (
          <BgImg src={bgImg} alt="" $pos={imgPos} loading="eager" />
        )}
      </BgWrap>
      <Content>
        <Eye>{tagline}</Eye>
        <Name $d="1s">{name1}</Name>
        <ScriptAnd>&amp;</ScriptAnd>
        <Name $d="1.4s">{name2}</Name>
        <GoldLine />
        <DateTxt>{fmtDate(weddingDate)}</DateTxt>
        {loc && <LocTxt>{loc}</LocTxt>}
      </Content>
      <ScrollHint><ScrollLine /><ScrollLbl>Scroll</ScrollLbl></ScrollHint>
    </S>
  );
}
export default Hero;
