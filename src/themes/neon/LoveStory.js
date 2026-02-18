import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

/* ── Animations ── */
const flicker = keyframes`
  0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
  20%,24%,55% { opacity: 0.6; }
`;
const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;
const fadeSlide = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

/* ── Defaults ── */
const COLORS = ['#00ffff', '#ff00ff', '#b347ff', '#00ff88', '#00ffff'];
const DEFAULTS = [
  { date: '2018', title: 'First Connection', description: 'Two strangers in a crowded room. A glance across the dance floor. The music faded, and only they remained.', image: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=900', color: '#00ffff' },
  { date: '2019', title: 'The First Date',   description: 'Coffee turned into dinner. Dinner turned into a walk through city lights. Neither wanted the night to end.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900', color: '#ff00ff' },
  { date: '2021', title: 'Moving In',        description: 'Two apartments became one home. Boxes everywhere, but together it already felt like home.', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900', color: '#b347ff' },
  { date: '2024', title: 'The Question',     description: 'Under a sky full of stars, one knee touched the ground. A ring emerged. A tear fell. "Yes" echoed into forever.', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900', color: '#00ff88' },
  { date: '2025', title: 'Forever Begins',   description: 'This is just the beginning. A lifetime of adventures, laughter, and love awaits. Will you join us?', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900', color: '#00ffff' },
];

/* ────────────────────────────────────────
   STYLED COMPONENTS
──────────────────────────────────────── */

/* Outer wrapper — sets total scroll height */
const Outer = styled.section`
  position: relative;
  background: #0a0a0f;
  /* height = sticky viewport + (n-1) × step per chapter */
  /* We control this via JS, but set a safe default */
`;

/* Scanline overlay */
const Scanline = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(transparent, rgba(0,255,255,0.06), transparent);
  z-index: 1;
  pointer-events: none;
  animation: ${scanline} 6s linear infinite;
  opacity: 0;
  .is-in-story & { opacity: 1; }
`;

/* Grid background */
const GridBG = styled.div`
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(0,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.025) 1px, transparent 1px);
  background-size: 40px 40px;
`;

/* ── Sticky container — stays fixed while outer scrolls ── */
const StickyWrap = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 2;

  /* DESKTOP: split left image / right text */
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 45vh 1fr;
  }
`;

/* ── LEFT / TOP: Image panel ── */
const ImgPanel = styled.div`
  position: relative;
  overflow: hidden;
  background: #050508;
`;

/* Each image absolutely positioned, crossfades */
const PanelImg = styled.div`
  position: absolute; inset: 0;
  opacity: ${p => p.$active ? 1 : 0};
  transition: opacity 0.7s cubic-bezier(.4,0,.2,1);

  img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: grayscale(20%) contrast(1.05) brightness(0.8);
    transform: scale(${p => p.$active ? 1 : 1.04});
    transition: transform 0.9s cubic-bezier(.4,0,.2,1), opacity 0.7s;
  }

  /* Neon color overlay per chapter */
  &::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, ${p => p.$color}18 0%, transparent 60%);
    mix-blend-mode: screen;
  }
`;

/* Right-edge gradient to blend into text panel on desktop */
const ImgEdge = styled.div`
  position: absolute; top: 0; right: 0; bottom: 0; width: 120px;
  background: linear-gradient(to right, transparent, #0a0a0f);
  z-index: 2;
  @media (max-width: 768px) { display: none; }
`;

/* Bottom edge on mobile */
const ImgEdgeMobile = styled.div`
  display: none;
  position: absolute; left: 0; right: 0; bottom: 0; height: 80px;
  background: linear-gradient(to bottom, transparent, #0a0a0f);
  z-index: 2;
  @media (max-width: 768px) { display: block; }
`;

/* Progress bar — left edge of image panel */
const ProgressBar = styled.div`
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: rgba(255,255,255,0.06); z-index: 3;
`;
const ProgressFill = styled.div`
  width: 100%;
  background: linear-gradient(to bottom, ${p => p.$color}, ${p => p.$colorNext});
  height: ${p => p.$pct}%;
  transition: height 0.15s linear, background 0.6s;
  box-shadow: 0 0 8px ${p => p.$color}80;
`;

/* Chapter index display on image */
const ChapterNum = styled.div`
  position: absolute; bottom: 2rem; left: 2rem; z-index: 3;
  font-family: 'Space Grotesk', monospace;
  font-size: 5rem; font-weight: 700; line-height: 1;
  color: ${p => p.$color}12;
  transition: color 0.6s;
  user-select: none;
  @media (max-width: 768px) { font-size: 3.5rem; bottom: 1.5rem; left: 1.5rem; }
`;

/* ── RIGHT / BOTTOM: Text panel ── */
const TextPanel = styled.div`
  position: relative;
  display: flex; flex-direction: column; justify-content: center;
  padding: clamp(2rem, 6vw, 5rem);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    justify-content: flex-start;
    padding-top: 1.5rem;
  }
`;

/* Section header — always visible */
const SectionHeader = styled.div`
  position: absolute; top: clamp(2rem, 4vh, 3rem); left: clamp(2rem, 6vw, 5rem);
  @media (max-width: 768px) { position: relative; top: auto; left: auto; margin-bottom: 1.5rem; }
`;
const Eyebrow = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase;
  color: #ff00ff;
  &::before { content: '// '; opacity: .5; }
`;
const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.3rem, 2.5vw, 1.8rem); font-weight: 700;
  color: #fff;
  span { color: #00ffff; text-shadow: 0 0 20px rgba(0,255,255,.4); }
`;

/* Chapter text items — stack and crossfade */
const ChapterWrap = styled.div`
  position: relative;
  /* enough height so all items can stack */
  min-height: 300px;
  @media (max-width: 768px) { min-height: 220px; }
`;
const ChapterItem = styled.div`
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: center;
  opacity: ${p => p.$active ? 1 : 0};
  transform: ${p => p.$active ? 'translateX(0)' : p.$past ? 'translateX(-30px)' : 'translateX(30px)'};
  transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
  pointer-events: ${p => p.$active ? 'auto' : 'none'};
`;

const YearTag = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem; letter-spacing: 0.3em; font-weight: 600;
  color: ${p => p.$color};
  text-shadow: 0 0 12px ${p => p.$color}80;
  margin-bottom: 1rem;
  display: flex; align-items: center; gap: .75rem;

  &::before {
    content: '';
    width: 28px; height: 2px;
    background: ${p => p.$color};
    box-shadow: 0 0 8px ${p => p.$color};
    flex-shrink: 0;
  }
`;
const ChapterTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 700;
  color: #fff; line-height: 1.1; margin-bottom: 1.25rem;
  animation: ${p => p.$active ? css`${fadeSlide} .5s ease forwards` : 'none'};
`;
const ChapterText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(.85rem, 1.4vw, 1rem); line-height: 1.85;
  color: rgba(255,255,255,.5); max-width: 420px;
`;

/* Dot navigation */
const Dots = styled.div`
  position: absolute; bottom: clamp(1.5rem, 3vh, 2.5rem); left: clamp(2rem, 6vw, 5rem);
  display: flex; gap: .75rem; align-items: center;
  @media (max-width: 768px) { position: relative; bottom: auto; left: auto; margin-top: 2rem; }
`;
const DotBtn = styled.button`
  width: ${p => p.$active ? '24px' : '8px'};
  height: 8px; border-radius: 100px; border: none; padding: 0;
  background: ${p => p.$active ? p.$color : 'rgba(255,255,255,0.2)'};
  box-shadow: ${p => p.$active ? `0 0 12px ${p.$color}` : 'none'};
  cursor: pointer;
  transition: all .3s cubic-bezier(.4,0,.2,1);
`;

/* Mobile: tap to advance hint */
const TapHint = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex; align-items: center; gap: .5rem;
    position: absolute; bottom: 1rem; right: 1.5rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: .55rem; letter-spacing: .2em; text-transform: uppercase;
    color: rgba(255,255,255,.2);
    animation: ${flicker} 3s ease-in-out infinite;
  }
`;

/* ────────────────────────────────────────
   COMPONENT
──────────────────────────────────────── */
function LoveStory() {
  const { content } = useWedding();
  const ls = content?.lovestory || {};

  const chapters = ls.events?.length > 0
    ? ls.events.map((e, i) => ({
        date: e.date,
        title: e.title,
        description: e.description,
        image: e.image || DEFAULTS[i % DEFAULTS.length].image,
        color: COLORS[i % COLORS.length],
      }))
    : DEFAULTS;

  const outerRef = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  /* ── Scroll handler: map outer scroll progress → chapter index ── */
  useEffect(() => {
    const STEP_VH = 80; // vh per chapter transition
    const totalExtra = (chapters.length - 1) * STEP_VH;

    /* Set outer height */
    if (outerRef.current) {
      outerRef.current.style.height = `calc(100vh + ${totalExtra}vh)`;
    }

    const onScroll = () => {
      if (!outerRef.current) return;
      const rect = outerRef.current.getBoundingClientRect();
      const scrolled = -rect.top; // px scrolled past section top
      if (scrolled < 0) { setActive(0); setProgress(0); return; }

      const stepPx = (STEP_VH / 100) * window.innerHeight;
      const maxScroll = stepPx * (chapters.length - 1);

      const rawIdx = scrolled / stepPx;
      const idx    = Math.min(Math.floor(rawIdx), chapters.length - 1);
      const frac   = rawIdx - Math.floor(rawIdx); // 0-1 within current step

      setActive(idx);
      /* Overall progress for progress bar */
      setProgress(Math.min((scrolled / maxScroll) * 100, 100));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial
    return () => window.removeEventListener('scroll', onScroll);
  }, [chapters.length]);

  /* Mobile: tap image panel to advance */
  const advance = () => {
    if (!outerRef.current) return;
    const STEP_VH = 80;
    const next = Math.min(active + 1, chapters.length - 1);
    const stepPx = (STEP_VH / 100) * window.innerHeight;
    const target = outerRef.current.offsetTop + next * stepPx;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const goTo = (idx) => {
    if (!outerRef.current) return;
    const STEP_VH = 80;
    const stepPx = (STEP_VH / 100) * window.innerHeight;
    const target = outerRef.current.offsetTop + idx * stepPx;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const cur  = chapters[active];
  const next = chapters[Math.min(active + 1, chapters.length - 1)];

  return (
    <Outer ref={outerRef} id="lovestory">
      <GridBG />
      <StickyWrap>

        {/* ── IMAGE PANEL ── */}
        <ImgPanel onClick={advance}>
          {chapters.map((ch, i) => (
            <PanelImg key={i} $active={i === active} $color={ch.color}>
              <img src={ch.image} alt={ch.title} loading={i === 0 ? 'eager' : 'lazy'} />
            </PanelImg>
          ))}
          <ImgEdge />
          <ImgEdgeMobile />
          <ProgressBar>
            <ProgressFill $pct={progress} $color={cur.color} $colorNext={next.color} />
          </ProgressBar>
          <ChapterNum $color={cur.color}>
            {String(active + 1).padStart(2, '0')}
          </ChapterNum>
        </ImgPanel>

        {/* ── TEXT PANEL ── */}
        <TextPanel>
          <SectionHeader>
            <Eyebrow>Our Journey</Eyebrow>
            <SectionTitle>
              <span>{ls.title || 'Love Story'}</span>
            </SectionTitle>
          </SectionHeader>

          <ChapterWrap>
            {chapters.map((ch, i) => (
              <ChapterItem key={i} $active={i === active} $past={i < active}>
                <YearTag $color={ch.color}>{ch.date}</YearTag>
                <ChapterTitle $active={i === active}>{ch.title}</ChapterTitle>
                <ChapterText>{ch.description}</ChapterText>
              </ChapterItem>
            ))}
          </ChapterWrap>

          <Dots>
            {chapters.map((ch, i) => (
              <DotBtn
                key={i}
                $active={i === active}
                $color={ch.color}
                onClick={() => goTo(i)}
                aria-label={`Kapitel ${i + 1}`}
              />
            ))}
          </Dots>

          <TapHint>tap to continue →</TapHint>
        </TextPanel>

      </StickyWrap>
    </Outer>
  );
}

export default LoveStory;
