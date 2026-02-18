import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideLeft = keyframes`from{opacity:0;transform:translateX(-48px)}to{opacity:1;transform:translateX(0)}`;
const slideRight = keyframes`from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:translateX(0)}`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;

function useInView(th = 0.1) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [th]);
  return [r, v];
}

const DEMO_IMGS = [
  'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80',
  'https://images.unsplash.com/photo-1591604329141-c2b78069a79c?w=800&q=80',
];

const S = styled.section`
  padding: var(--section-pad) clamp(1.5rem, 5vw, 5rem);
  background: var(--c-bg);
  position: relative;
  overflow: hidden;
  z-index: 2;

  /* Subtle botanical corner decoration */
  &::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 240px; height: 240px;
    background: radial-gradient(circle, rgba(193,127,36,0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const Inner = styled.div`
  max-width: var(--content-w);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: clamp(3rem, 6vw, 7rem);
  align-items: center;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

/* Overlapping image stack — Boho feel */
const ImgStack = styled.div`
  position: relative;
  height: clamp(480px, 60vw, 640px);

  @media (max-width: 860px) {
    height: 420px;
  }
  @media (max-width: 480px) {
    height: 320px;
  }
`;

const Img1 = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 62%;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(44,36,22,0.12);
  border: 6px solid var(--c-cream);
  opacity: 0;
  ${p => p.$v && css`animation: ${slideLeft} 0.9s var(--ease) forwards;`}

  img { width: 100%; aspect-ratio: 3/4; object-fit: cover; }

  @media (max-width: 480px) { width: 68%; border-width: 4px; }
`;

const Img2 = styled.div`
  position: absolute;
  bottom: 0; right: 0;
  width: 55%;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 20px 56px rgba(44,36,22,0.15);
  border: 6px solid var(--c-cream);
  z-index: 2;
  opacity: 0;
  ${p => p.$v && css`animation: ${slideLeft} 0.9s var(--ease) 0.2s forwards;`}

  img { width: 100%; aspect-ratio: 4/5; object-fit: cover; }

  @media (max-width: 480px) { width: 60%; border-width: 4px; }
`;

/* Gold accent tag */
const AccentTag = styled.div`
  position: absolute;
  top: 48%; left: 55%;
  transform: translate(-50%, -50%);
  z-index: 3;
  background: var(--c-gold);
  color: white;
  font-family: var(--font-s);
  font-size: clamp(1rem, 2vw, 1.3rem);
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 24px rgba(193,127,36,0.3);
  opacity: 0;
  white-space: nowrap;
  ${p => p.$v && css`animation: ${fadeUp} 0.7s var(--ease) 0.45s forwards;`}

  @media (max-width: 480px) { font-size: 0.9rem; padding: 0.5rem 0.9rem; }
`;

/* Text side */
const TextSide = styled.div`
  opacity: 0;
  ${p => p.$v && css`animation: ${slideRight} 0.9s var(--ease) 0.15s forwards;`}
`;

const Eyebrow = styled.p`
  font-family: var(--font-s);
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  color: var(--c-accent);
  margin-bottom: 0.75rem;
  line-height: 1.2;
`;

const H2 = styled.h2`
  font-family: var(--font-d);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  color: var(--c-text);
  line-height: 1.15;
  margin-bottom: 1.75rem;
`;

const Body = styled.p`
  font-family: var(--font-b);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  line-height: 1.9;
  color: var(--c-text-sec);
  margin-bottom: 1.25rem;
  max-width: 480px;
`;

const Divider = styled.div`
  width: 48px;
  height: 2px;
  background: var(--c-accent);
  margin: 2rem 0;
  border-radius: 2px;
`;

const NamesTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const NamePill = styled.span`
  font-family: var(--font-d);
  font-style: italic;
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: var(--c-text-muted);
`;

function LoveStory() {
  const { content, project } = useWedding();
  const ls = content?.lovestory || {};
  const cn = project?.couple_names || 'Lena & Jonas';
  const [ref, v] = useInView();

  const img1 = ls.image1_url || ls.images?.[0]?.url || DEMO_IMGS[0];
  const img2 = ls.image2_url || ls.images?.[1]?.url || DEMO_IMGS[1];
  const text1 = ls.text1 || ls.story || 'Unsere Geschichte begann an einem sonnigen Sommertag. Was als zufällige Begegnung begann, wurde zur schönsten Reise unseres Lebens.';
  const text2 = ls.text2 || 'Seitdem wissen wir: Zusammen ist alles leichter, bunter und voller Magie.';
  const title = ls.title || 'Unsere Geschichte';
  const eyebrow = ls.eyebrow || 'wie alles begann';

  const names = cn.split(/\s*[&+und]\s*/i);
  const date = project?.wedding_date
    ? new Date(project.wedding_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <S id="lovestory" data-theme-light ref={ref}>
      <Inner>
        <ImgStack>
          <Img1 $v={v}><img src={img1} alt="Paar" loading="lazy" /></Img1>
          <Img2 $v={v}><img src={img2} alt="Paar" loading="lazy" /></Img2>
          {date && <AccentTag $v={v}>{date}</AccentTag>}
        </ImgStack>

        <TextSide $v={v}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <H2>{title}</H2>
          <Body>{text1}</Body>
          {text2 && <Body>{text2}</Body>}
          <Divider />
          <NamesTag>
            {names[0] && <NamePill>{names[0]}</NamePill>}
            {names[1] && <>
              <span style={{ color: 'var(--c-accent)', fontFamily: 'var(--font-s)', fontSize: '1.4rem' }}>&</span>
              <NamePill>{names[1]}</NamePill>
            </>}
          </NamesTag>
        </TextSide>
      </Inner>
    </S>
  );
}

export default LoveStory;
