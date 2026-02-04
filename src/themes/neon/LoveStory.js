// src/themes/neon/LoveStory.js - Neon Theme
// Mobile: Vertical timeline cards
// Desktop: Horizontal scroll animation
import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: 80px 0;
  overflow: hidden;

  @media (min-width: 769px) {
    height: ${p => p.$totalCards * 100}vh;
    padding: 0;
  }
`;

const StickyContainer = styled.div`
  @media (min-width: 769px) {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;

  @media (min-width: 769px) {
    position: absolute;
    top: 40px;
    left: 5%;
    text-align: left;
    margin-bottom: 0;
    z-index: 10;
  }
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 10px;

  &::before {
    content: '// ';
    color: rgba(255,255,255,0.3);
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
  color: #fff;

  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

/* ============================================
   MOBILE: Vertical Timeline
   ============================================ */

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 0 20px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid ${p => p.$color}40;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${p => p.$color};
    box-shadow: 0 0 15px ${p => p.$color};
  }
`;

const MobileCardImage = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(20%) contrast(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 60%,
      rgba(10, 10, 15, 0.9) 100%
    );
  }
`;

const MobileCardContent = styled.div`
  padding: 25px;
  position: relative;
`;

const MobileIndex = styled.div`
  position: absolute;
  top: -50px;
  right: 20px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 4rem;
  font-weight: 700;
  color: ${p => p.$color};
  opacity: 0.15;
  line-height: 1;
`;

const MobileYear = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${p => p.$color};
  letter-spacing: 0.15em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 20px;
    height: 2px;
    background: ${p => p.$color};
    box-shadow: 0 0 8px ${p => p.$color};
  }
`;

const MobileTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  line-height: 1.3;
`;

const MobileText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.6);
`;

/* ============================================
   DESKTOP: Horizontal Scroll
   ============================================ */

const DesktopTrack = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    gap: 40px;
    padding: 0 5%;
    transform: translateX(${p => p.$offset}px);
    transition: transform 0.1s linear;
    will-change: transform;
  }
`;

const DesktopCard = styled.div`
  flex-shrink: 0;
  width: 80vw;
  max-width: 900px;
  height: 70vh;
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$color}40;
  position: relative;
  display: flex;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${p => p.$color}, transparent);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 50%, rgba(0,0,0,0.05) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.3;
  }
`;

const DesktopCardImage = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%) contrast(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      ${p => p.$color}20 0%,
      transparent 50%,
      ${p => p.$color}10 100%
    );
    mix-blend-mode: overlay;
  }
`;

const DesktopCardContent = styled.div`
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const DesktopYear = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${p => p.$color};
  letter-spacing: 0.2em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 30px;
    height: 2px;
    background: ${p => p.$color};
    box-shadow: 0 0 10px ${p => p.$color};
  }
`;

const DesktopTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.2;
`;

const DesktopText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.6);
  max-width: 400px;
`;

const DesktopIndex = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 4rem;
  font-weight: 700;
  color: ${p => p.$color};
  opacity: 0.15;
  line-height: 1;
`;

const ProgressDots = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    gap: 15px;
    z-index: 10;
  }
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid ${p => p.$active ? p.$color : 'rgba(255,255,255,0.2)'};
  background: ${p => p.$active ? p.$color : 'transparent'};
  transition: all 0.3s ease;

  ${p => p.$active && css`
    box-shadow: 0 0 15px ${p.$color};
  `}
`;

const TerminalHint = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: block;
    position: absolute;
    bottom: 40px;
    right: 5%;
    font-family: 'Space Grotesk', monospace;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.3);
    z-index: 10;

    span {
      color: #00ff88;
    }
  }
`;

/* ============================================
   COMPONENT
   ============================================ */

function LoveStory() {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  const title = lovestoryData.title || 'Love Story';

  const colors = ['#00ffff', '#ff00ff', '#b347ff', '#00ff88', '#00ffff', '#ff00ff'];

  const defaultChapters = [
    {
      year: '2018',
      title: 'First Connection',
      text: 'Two strangers in a crowded room. A glance across the dance floor.',
      image: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800',
      color: colors[0]
    },
    {
      year: '2019',
      title: 'The First Date',
      text: 'Coffee turned into dinner. Neither wanted the night to end.',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
      color: colors[1]
    },
    {
      year: '2024',
      title: 'The Question',
      text: 'Under a sky full of stars, one knee touched the ground. "Yes" echoed into forever.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
      color: colors[2]
    }
  ];

  const chapters = lovestoryData.events?.length > 0
    ? lovestoryData.events.map((e, i) => ({
        year: e.date?.split('-')[0] || e.date,
        title: e.title,
        text: e.description,
        image: e.image || defaultChapters[i % defaultChapters.length]?.image,
        color: colors[i % colors.length]
      }))
    : defaultChapters;

  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 769 : false);
  const rafRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 769);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    // Skip horizontal scroll logic on mobile
    if (isMobile) return;

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const vh = window.innerHeight;

        const scrolled = -rect.top;
        const maxScroll = sectionHeight - vh;
        const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

        setScrollProgress(progress);
        setActiveIndex(Math.min(chapters.length - 1, Math.floor(progress * chapters.length)));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [chapters.length, isMobile]);

  // Desktop horizontal offset calculation
  const cardWidth = Math.min(900, viewportWidth * 0.8) + 40;
  const totalWidth = cardWidth * chapters.length;
  const maxOffset = totalWidth - viewportWidth + 100;
  const offset = -scrollProgress * maxOffset;

  // Don't render if no chapters
  if (chapters.length === 0) return null;

  return (
    <Section ref={sectionRef} id="story" $totalCards={isMobile ? 1 : chapters.length}>
      <GridBG />

      <Header>
        <Eyebrow>Our Journey</Eyebrow>
        <Title><span>{title}</span></Title>
      </Header>

      {/* MOBILE: Vertical Cards */}
      <MobileContainer>
        {chapters.map((chapter, i) => (
          <MobileCard key={i} $color={chapter.color}>
            <MobileCardImage>
              <img src={chapter.image} alt={chapter.title} loading="lazy" />
            </MobileCardImage>
            <MobileCardContent>
              <MobileIndex $color={chapter.color}>0{i + 1}</MobileIndex>
              <MobileYear $color={chapter.color}>{chapter.year}</MobileYear>
              <MobileTitle>{chapter.title}</MobileTitle>
              <MobileText>{chapter.text}</MobileText>
            </MobileCardContent>
          </MobileCard>
        ))}
      </MobileContainer>

      {/* DESKTOP: Horizontal Scroll */}
      <StickyContainer>
        <DesktopTrack $offset={offset}>
          {chapters.map((chapter, i) => (
            <DesktopCard key={i} $color={chapter.color}>
              <DesktopCardImage $color={chapter.color}>
                <img src={chapter.image} alt={chapter.title} />
              </DesktopCardImage>
              <DesktopCardContent>
                <DesktopYear $color={chapter.color}>{chapter.year}</DesktopYear>
                <DesktopTitle>{chapter.title}</DesktopTitle>
                <DesktopText>{chapter.text}</DesktopText>
                <DesktopIndex $color={chapter.color}>0{i + 1}</DesktopIndex>
              </DesktopCardContent>
            </DesktopCard>
          ))}
        </DesktopTrack>

        <ProgressDots>
          {chapters.map((chapter, i) => (
            <Dot key={i} $active={i === activeIndex} $color={chapter.color} />
          ))}
        </ProgressDots>

        <TerminalHint>
          <span>$</span> scroll_to_navigate --direction=horizontal
        </TerminalHint>
      </StickyContainer>
    </Section>
  );
}

export default LoveStory;
