import { useWedding } from '../../context/WeddingContext';
// src/components/LoveStory.js - Neon Theme
import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(0,255,255,0.5); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const Section = styled.section`
  position: relative;
  height: ${p => p.$totalCards * 100}vh;
  background: #0a0a0f;
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 30px 30px;
`;

const Header = styled.div`
  position: absolute;
  top: 40px;
  left: 5%;
  z-index: 10;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #fff;
  
  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const HorizontalTrack = styled.div`
  display: flex;
  gap: 40px;
  padding: 0 5%;
  transform: translateX(${p => p.$offset}px);
  transition: transform 0.1s linear;
`;

const Card = styled.div`
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
  
  /* Scanline */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.3;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: 80vh;
  }
`;

const CardImage = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%) contrast(1.1);
  }
  
  /* Neon Overlay */
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

const CardContent = styled.div`
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const YearBadge = styled.div`
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

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.2;
`;

const CardText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.6);
  max-width: 400px;
`;

const CardIndex = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 4rem;
  font-weight: 700;
  color: ${p => p.$color}15;
  line-height: 1;
`;

const ProgressDots = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 10;
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
`;

function LoveStory() {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  const title = lovestoryData.title || 'Love Story';

  const defaultChapters = [
    {
      date: '2018',
      title: 'First Connection',
      description: 'Two strangers in a crowded room. A glance across the dance floor. The music faded, and only they remained.',
      image: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800',
      color: '#00ffff'
    },
    {
      date: '2019',
      title: 'The First Date',
      description: 'Coffee turned into dinner. Dinner turned into a walk through the city lights. Neither wanted the night to end.',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
      color: '#ff00ff'
    },
    {
      date: '2021',
      title: 'Moving In',
      description: 'Two apartments became one home. Boxes everywhere, but together, it felt like they had already found home.',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      color: '#b347ff'
    },
    {
      date: '2024',
      title: 'The Question',
      description: 'Under a sky full of stars, one knee touched the ground. A ring emerged. A tear fell. "Yes" echoed into forever.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
      color: '#00ff88'
    },
    {
      date: '2025',
      title: 'Forever Begins',
      description: 'This is just the beginning. A lifetime of adventures, laughter, and love awaits. Will you join us?',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      color: '#00ffff'
    }
  ];

  // Map events from editor format to chapter format
  const colors = ['#00ffff', '#ff00ff', '#b347ff', '#00ff88', '#00ffff'];
  const chapters = lovestoryData.events?.length > 0
    ? lovestoryData.events.map((e, i) => ({
        year: e.date,
        title: e.title,
        text: e.description,
        image: e.image || defaultChapters[i % defaultChapters.length]?.image,
        color: colors[i % colors.length]
      }))
    : defaultChapters.map(c => ({ year: c.date, title: c.title, text: c.description, image: c.image, color: c.color }));
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const rafRef = useRef(null);

  // Handle viewport resize
  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel previous animation frame to prevent buildup
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const vh = window.innerHeight;
        
        // Calculate how far we've scrolled through the section
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
  }, [chapters.length]);

  // Calculate horizontal offset based on scroll progress
  const cardWidth = 900 + 40; // card width + gap
  const totalWidth = cardWidth * chapters.length;
  const maxOffset = totalWidth - viewportWidth + 100;
  const offset = -scrollProgress * maxOffset;

  return (
    <Section ref={sectionRef} id="story" $totalCards={chapters.length}>
      <StickyContainer>
        <GridBG />
        
        <Header>
          <Eyebrow>// Our Journey</Eyebrow>
          <Title><span>{title}</span></Title>
        </Header>
        
        <HorizontalTrack $offset={offset}>
          {chapters.map((chapter, i) => (
            <Card key={i} $color={chapter.color}>
              <CardImage $color={chapter.color}>
                <img src={chapter.image} alt={chapter.title} />
              </CardImage>
              <CardContent>
                <YearBadge $color={chapter.color}>{chapter.year}</YearBadge>
                <CardTitle>{chapter.title}</CardTitle>
                <CardText>{chapter.text}</CardText>
                <CardIndex $color={chapter.color}>0{i + 1}</CardIndex>
              </CardContent>
            </Card>
          ))}
        </HorizontalTrack>
        
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
