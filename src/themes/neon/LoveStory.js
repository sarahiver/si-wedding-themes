import { useWedding } from '../../context/WeddingContext';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  padding: clamp(4rem, 8vw, 6rem) 0;
  background: #0a0a0f;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
`;

const Header = styled.div`
  padding: 0 5%;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  position: relative;
  z-index: 2;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards;
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

const Track = styled.div`
  display: flex;
  gap: 30px;
  padding: 0 5%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  position: relative;
  z-index: 2;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 768px) {
    gap: 16px;
    padding: 0 1rem;
  }
`;

const Card = styled.div`
  flex-shrink: 0;
  width: min(80vw, 900px);
  scroll-snap-align: center;
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
    z-index: 1;
  }

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
    width: 85vw;
    flex-direction: column;
  }
`;

const CardImage = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 300px;

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

  @media (max-width: 768px) {
    min-height: 200px;
    flex: none;
  }
`;

const CardContent = styled.div`
  flex: 1;
  padding: clamp(1.5rem, 4vw, 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
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
  font-size: clamp(1.5rem, 3vw, 2.5rem);
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
  bottom: 20px;
  right: 20px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: ${p => p.$color}15;
  line-height: 1;
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  position: relative;
  z-index: 2;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  padding: 0;
  border: 2px solid ${p => p.$active ? p.$color : 'rgba(255,255,255,0.2)'};
  background: ${p => p.$active ? p.$color : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;

  ${p => p.$active && css`
    box-shadow: 0 0 15px ${p.$color};
  `}
`;

function LoveStory() {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  const title = lovestoryData.title || 'Love Story';

  const defaultChapters = [
    { date: '2018', title: 'First Connection', description: 'Two strangers in a crowded room. A glance across the dance floor. The music faded, and only they remained.', image: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800', color: '#00ffff' },
    { date: '2019', title: 'The First Date', description: 'Coffee turned into dinner. Dinner turned into a walk through the city lights. Neither wanted the night to end.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', color: '#ff00ff' },
    { date: '2021', title: 'Moving In', description: 'Two apartments became one home. Boxes everywhere, but together, it felt like they had already found home.', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', color: '#b347ff' },
    { date: '2024', title: 'The Question', description: 'Under a sky full of stars, one knee touched the ground. A ring emerged. A tear fell. "Yes" echoed into forever.', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800', color: '#00ff88' },
    { date: '2025', title: 'Forever Begins', description: 'This is just the beginning. A lifetime of adventures, laughter, and love awaits. Will you join us?', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', color: '#00ffff' },
  ];

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

  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, clientWidth } = trackRef.current;
    const cardWidth = clientWidth * 0.8 + 30; // approximate card + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, chapters.length - 1));
  }, [chapters.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.addEventListener('scroll', handleScroll, { passive: true });
      return () => track.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scrollToCard = (index) => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  return (
    <Section id="story">
      <GridBG />

      <Header>
        <Eyebrow>// Our Journey</Eyebrow>
        <Title><span>{title}</span></Title>
      </Header>

      <Track ref={trackRef}>
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
      </Track>

      <ProgressDots>
        {chapters.map((chapter, i) => (
          <Dot
            key={i}
            $active={i === activeIndex}
            $color={chapter.color}
            onClick={() => scrollToCard(i)}
          />
        ))}
      </ProgressDots>
    </Section>
  );
}

export default LoveStory;
