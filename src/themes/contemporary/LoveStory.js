// Contemporary LoveStory - Colorful Cards, Horizontal Scroll Mobile
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 0;
  background: var(--white);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 900px) {
    padding: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  padding: 0 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  
  @media (max-width: 900px) {
    padding: 0 1.5rem;
  }
`;

const TitleGroup = styled.div``;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '-20px'});
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease 0.1s;
`;

const ScrollHint = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  @media (max-width: 900px) {
    display: flex;
    padding-right: 1.5rem;
  }
  
  span {
    animation: ${float} 1.5s ease-in-out infinite;
  }
`;

// Desktop Grid
const DesktopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 900px) {
    display: none;
  }
`;

// Mobile Horizontal Scroll
const MobileScroller = styled.div`
  display: none;
  
  @media (max-width: 900px) {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 1rem 1.5rem 2rem;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--gray-200);
      margin: 0 1.5rem;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--coral);
      border: 2px solid var(--black);
    }
  }
`;

const cardColors = [
  { bg: 'var(--coral)', text: 'var(--white)', textDark: 'rgba(255,255,255,0.9)' },
  { bg: 'var(--electric)', text: 'var(--black)', textDark: 'rgba(0,0,0,0.8)' },
  { bg: 'var(--yellow)', text: 'var(--black)', textDark: 'rgba(0,0,0,0.8)' },
  { bg: 'var(--purple)', text: 'var(--white)', textDark: 'rgba(255,255,255,0.9)' },
  { bg: 'var(--pink)', text: 'var(--white)', textDark: 'rgba(255,255,255,0.9)' },
];

const Card = styled.div`
  background: ${p => cardColors[p.$index % cardColors.length].bg};
  padding: 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'}) rotate(${p => p.$visible ? 0 : (p.$index % 2 === 0 ? -3 : 3)}deg);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${p => 0.1 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateY(-8px) rotate(0deg);
    box-shadow: var(--shadow-xl);
  }
  
  @media (max-width: 900px) {
    flex: 0 0 280px;
    scroll-snap-align: start;
    min-height: 300px;
    opacity: 1;
    transform: none;
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 120px;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--gray-300)'};
  border: 3px solid var(--black);
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '${p => p.$emoji || '📸'}';
    position: absolute;
    bottom: -12px;
    right: 10px;
    font-size: 1.5rem;
    background: var(--white);
    border: 2px solid var(--black);
    padding: 0.25rem 0.5rem;
  }
`;

const Year = styled.div`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: rgba(0,0,0,0.15);
  line-height: 1;
  margin-bottom: auto;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const CardContent = styled.div`
  margin-top: auto;
  position: relative;
  z-index: 1;
`;

const CardTitle = styled.h3`
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  font-weight: 700;
  color: ${p => cardColors[p.$index % cardColors.length].text};
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const CardText = styled.p`
  font-size: 0.9rem;
  color: ${p => cardColors[p.$index % cardColors.length].textDark};
  line-height: 1.5;
  margin: 0;
`;

const CardDate = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => cardColors[p.$index % cardColors.length].text};
  opacity: 0.7;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid currentColor;
`;

function LoveStory() {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  
  const title = lovestoryData.title || 'Our Story';
  const events = lovestoryData.events || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultEvents = [
    { date: '2020', title: 'First Match', description: 'Ein Swipe nach rechts und alles begann. Wer hätte gedacht, dass eine App unser Leben so verändern würde?', image: '', emoji: '📱' },
    { date: '2021', title: 'First Date', description: 'Aus einem Kaffee wurde Abendessen, aus Abendessen wurde ein Spaziergang bis Mitternacht.', image: '', emoji: '☕' },
    { date: '2022', title: 'Adventures', description: 'Bali, Paris, Tokyo – die Welt gemeinsam zu erkunden wurde unser liebstes Hobby.', image: '', emoji: '✈️' },
    { date: '2024', title: 'The Question', description: 'Unter dem Sternenhimmel, mit zitternden Händen und dem wichtigsten "Ja" unseres Lebens.', image: '', emoji: '💍' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const renderCard = (item, index) => (
    <Card key={index} $index={index} $visible={visible}>
      {item.image && (
        <CardImage $image={item.image} $emoji={item.emoji || '📸'} />
      )}
      <Year>{item.date}</Year>
      <CardContent>
        <CardTitle $index={index}>{item.title}</CardTitle>
        <CardText $index={index}>{item.description}</CardText>
        <CardDate $index={index}>{item.date}</CardDate>
      </CardContent>
    </Card>
  );

  return (
    <Section ref={sectionRef} id="story">
      <Container>
        <Header>
          <TitleGroup>
            <Eyebrow $visible={visible}>💕 Unsere Geschichte</Eyebrow>
            <Title $visible={visible}>{title}</Title>
          </TitleGroup>
          <ScrollHint>
            <span>→</span> Swipe
          </ScrollHint>
        </Header>
        
        {/* Desktop Grid */}
        <DesktopGrid>
          {items.map((item, i) => renderCard(item, i))}
        </DesktopGrid>
        
        {/* Mobile Horizontal Scroll */}
        <MobileScroller>
          {items.map((item, i) => renderCard(item, i))}
        </MobileScroller>
      </Container>
    </Section>
  );
}

export default LoveStory;
