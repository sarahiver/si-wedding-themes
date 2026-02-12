import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const lineExp = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-white); text-align: center;`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; font-weight: 400; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1.5rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Sub = styled.span`font-family: var(--font-script); font-size: clamp(1.5rem, 3vw, 2.5rem); color: var(--c-gold); display: block; margin-bottom: 2rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const Line = styled.div`width: 60px; height: 1px; background: var(--c-gold); margin: 0 auto 3.5rem; transform: scaleX(0); ${p => p.$v && css`animation: ${lineExp} 0.6s var(--ease) forwards; animation-delay: 0.3s;`}`;
const Grid = styled.div`display: flex; justify-content: center; gap: clamp(2.5rem, 6vw, 5rem); flex-wrap: wrap; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.4s;`}`;
const Unit = styled.div`text-align: center;`;
const Num = styled.div`font-family: var(--font-display); font-size: clamp(3.5rem, 9vw, 6rem); font-weight: 300; color: var(--c-text); line-height: 1;`;
const Lbl = styled.div`font-family: var(--font-body); font-size: 0.55rem; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase; color: var(--c-text-muted); margin-top: 0.5rem;`;

function Countdown() {
  const { content, weddingDate } = useWedding();
  const cd = content?.countdown || {};
  const ref = useRef(null);
  const [v, setV] = useState(false);
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const target = cd.target_date || weddingDate || '2026-08-15T14:00:00';

  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.2 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);
  useEffect(() => { const calc = () => { const diff = Math.max(0, new Date(target) - new Date()); setT({ d: Math.floor(diff/864e5), h: Math.floor((diff%864e5)/36e5), m: Math.floor((diff%36e5)/6e4), s: Math.floor((diff%6e4)/1e3) }); }; calc(); const id = setInterval(calc, 1000); return () => clearInterval(id); }, [target]);

  return (
    <S id="countdown" ref={ref}>
      <Eye $v={v}>{cd.title || 'Bald ist es soweit'}</Eye>
      <Sub $v={v}>{cd.subtitle || 'bis zum großen Tag'}</Sub>
      <Line $v={v} />
      <Grid $v={v}>
        <Unit><Num>{t.d}</Num><Lbl>Tage</Lbl></Unit>
        <Unit><Num>{t.h}</Num><Lbl>Stunden</Lbl></Unit>
        <Unit><Num>{t.m}</Num><Lbl>Minuten</Lbl></Unit>
        <Unit><Num>{t.s}</Num><Lbl>Sekunden</Lbl></Unit>
      </Grid>
    </S>
  );
}
export default Countdown;
