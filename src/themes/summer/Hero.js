import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(1.06)}to{opacity:1;transform:scale(1)}`;

const Wrap = styled.section`
  position: relative;
  height: 100dvh;
  min-height: 600px;
  overflow: hidden;
  background: #2C2416;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 600px) {
    min-height: 100svh;
  }
`;

const BgWrap = styled.div`
  position: absolute;
  inset: 0;
  will-change: transform;
  animation: ${scaleIn} 2.2s var(--ease) forwards;
`;

const BgImg = styled.img`
  width: 100%;
  height: 110%; /* extra height for parallax */
  object-fit: cover;
  object-position: center top;
`;

/* Warm terracotta/amber gradient overlay — leicht (0.35) */
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      160deg,
      rgba(193, 57, 43, 0.12) 0%,
      rgba(193, 127, 36, 0.08) 40%,
      rgba(44, 36, 22, 0.55) 100%
    );
`;

/* Subtiles Körner-Textur-Overlay für Boho-Feeling */
const GrainOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 100px 100px;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 4rem);
  padding-bottom: clamp(4rem, 10vh, 7rem);
  max-width: 800px;
  width: 100%;
`;

const Eyebrow = styled.p`
  font-family: var(--font-b);
  font-size: clamp(0.6rem, 1.2vw, 0.7rem);
  font-weight: 400;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.25rem;
  opacity: 0;
  animation: ${fadeUp} 0.8s var(--ease) 0.6s forwards;
`;

const Names = styled.h1`
  font-family: var(--font-s);
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 500;
  color: white;
  line-height: 1;
  letter-spacing: 0.01em;
  opacity: 0;
  animation: ${fadeUp} 1s var(--ease) 0.9s forwards;
  text-shadow: 0 2px 40px rgba(0,0,0,0.2);

  @media (max-width: 480px) {
    font-size: clamp(2.8rem, 14vw, 4.5rem);
  }
`;

const DateLine = styled.p`
  font-family: var(--font-b);
  font-size: clamp(0.65rem, 1.3vw, 0.75rem);
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1.25rem;
  opacity: 0;
  animation: ${fadeUp} 0.8s var(--ease) 1.4s forwards;
`;

const Divider = styled.div`
  width: 40px;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 1.75rem auto;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease 1.7s forwards;
`;

/* Countdown direkt im Hero */
const CountdownRow = styled.div`
  display: flex;
  gap: clamp(1.5rem, 4vw, 3rem);
  justify-content: center;
  opacity: 0;
  animation: ${fadeUp} 0.8s var(--ease) 1.9s forwards;

  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

const CountUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
`;

const CountNum = styled.span`
  font-family: var(--font-d);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: white;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: clamp(1.6rem, 8vw, 2.2rem);
  }
`;

const CountLabel = styled.span`
  font-family: var(--font-b);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

const CountSep = styled.span`
  font-family: var(--font-d);
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.2);
  align-self: flex-start;
  margin-top: 0.4rem;
`;

const AlreadyMarried = styled.p`
  font-family: var(--font-d);
  font-style: italic;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  opacity: 0;
  animation: ${fadeIn} 1s ease 1.9s forwards;
`;

function useCountdown(weddingDate) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (!weddingDate) return;
    const target = new Date(weddingDate);

    const calc = () => {
      const diff = target - new Date();
      if (diff <= 0) {
        setTime(null);
        return;
      }
      setTime({
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

  return time;
}

function Hero() {
  const { project } = useWedding();
  const wrapRef = useRef(null);
  const bgRef = useRef(null);

  const cn = project?.couple_names || 'Lena & Jonas';
  const weddingDate = project?.wedding_date;
  const location = project?.location_name;
  const heroImg = project?.hero_image_url;

  const countdown = useCountdown(weddingDate);

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!bgRef.current || !wrapRef.current) return;
      const scrollY = window.scrollY;
      const heroH = wrapRef.current.offsetHeight;
      if (scrollY < heroH) {
        bgRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Wrap ref={wrapRef} id="top">
      <BgWrap ref={bgRef}>
        {heroImg ? (
          <BgImg src={heroImg} alt={cn} />
        ) : (
          <BgImg
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
            alt="Sommerhochzeit"
          />
        )}
      </BgWrap>
      <Overlay />
      <GrainOverlay />

      <Content>
        {location && (
          <Eyebrow>{location}</Eyebrow>
        )}

        <Names>{cn}</Names>

        {formattedDate && (
          <DateLine>{formattedDate}</DateLine>
        )}

        {countdown && (
          <>
            <Divider />
            <CountdownRow>
              <CountUnit>
                <CountNum>{String(countdown.d).padStart(2, '0')}</CountNum>
                <CountLabel>Tage</CountLabel>
              </CountUnit>
              <CountSep>·</CountSep>
              <CountUnit>
                <CountNum>{String(countdown.h).padStart(2, '0')}</CountNum>
                <CountLabel>Stunden</CountLabel>
              </CountUnit>
              <CountSep>·</CountSep>
              <CountUnit>
                <CountNum>{String(countdown.m).padStart(2, '0')}</CountNum>
                <CountLabel>Minuten</CountLabel>
              </CountUnit>
              <CountSep>·</CountSep>
              <CountUnit>
                <CountNum>{String(countdown.s).padStart(2, '0')}</CountNum>
                <CountLabel>Sekunden</CountLabel>
              </CountUnit>
            </CountdownRow>
          </>
        )}

        {!countdown && formattedDate && (
          <AlreadyMarried>Wir haben geheiratet ♡</AlreadyMarried>
        )}
      </Content>
    </Wrap>
  );
}

export default Hero;
