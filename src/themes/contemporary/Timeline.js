// Contemporary Timeline - Horizontal Stacked Cards
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 0;
  background: var(--gray-100);
  overflow: hidden;
  width: 100vw;
  max-width: 100vw;
  position: relative;
`;

const Container = styled.div`
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const TimelineTrack = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem 0 4rem;
`;

const TimelineLine = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 2rem;
  right: 2rem;
  height: 6px;
  background: var(--black);
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: var(--coral);
    border: 3px solid var(--black);
  }
  
  &::before { left: -8px; }
  &::after { right: -8px; }
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 380px;
  position: relative;
  padding: 0 2rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    min-height: auto;
    gap: 1rem;
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)', 'var(--pink)'];

const Card = styled.div`
  position: absolute;
  width: clamp(180px, 22vw, 260px);
  background: var(--white);
  border: 4px solid var(--black);
  box-shadow: ${p => p.$active ? '12px 12px 0 var(--black)' : '6px 6px 0 var(--black)'};
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: ${p => p.$active ? 100 : p.$zIndex};
  transform: ${p => {
    const centerOffset = (p.$total - 1) / 2;
    const baseX = (p.$position - centerOffset) * 200;
    const rotate = p.$active ? 0 : (p.$position - centerOffset) * 4;
    const scale = p.$active ? 1.08 : 1;
    const y = p.$active ? -25 : 0;
    return `translateX(${baseX}px) translateY(${y}px) rotate(${rotate}deg) scale(${scale})`;
  }};
  
  &:hover {
    z-index: 99;
    box-shadow: 10px 10px 0 var(--black);
  }
  
  @media (max-width: 1024px) {
    position: relative;
    width: 100%;
    max-width: 320px;
    transform: none !important;
    box-shadow: 6px 6px 0 var(--black);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const TimeBox = styled.div`
  background: ${p => colors[p.$index % colors.length]};
  border: 3px solid var(--black);
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--black);
`;

const IconBox = styled.div`
  width: 36px;
  height: 36px;
  background: var(--gray-100);
  border: 3px solid var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.2}s;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.4rem;
`;

const CardLocation = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-500);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &::before {
    content: '📍';
    font-size: 0.7rem;
  }
`;

const CardDescription = styled.p`
  font-size: 0.8rem;
  color: var(--gray-600);
  line-height: 1.5;
  max-height: ${p => p.$visible ? '100px' : '0'};
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.3s ease;
  
  @media (max-width: 1024px) {
    max-height: none;
    opacity: 1;
  }
`;

const Connector = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  width: 4px;
  height: 30px;
  background: var(--black);
  transform: translateX(-50%);
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Dot = styled.div`
  position: absolute;
  bottom: -42px;
  left: 50%;
  width: 20px;
  height: 20px;
  background: ${p => colors[p.$index % colors.length]};
  border: 4px solid var(--black);
  transform: translateX(-50%);
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Hint = styled.p`
  text-align: center;
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 3rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Tagesablauf';
  const events = timelineData.events || [];
  
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  const defaultEvents = [
    { time: '14:00', title: 'Trauung', location: 'Kirche St. Marien', description: 'Die kirchliche Trauung mit anschließendem Sektempfang.', icon: '💒' },
    { time: '16:00', title: 'Empfang', location: 'Schloss Garten', description: 'Begrüßung aller Gäste mit Häppchen und Drinks.', icon: '🥂' },
    { time: '18:00', title: 'Dinner', location: 'Großer Saal', description: 'Festliches 4-Gänge-Menü mit vegetarischen Optionen.', icon: '🍽️' },
    { time: '21:00', title: 'Party', location: 'Ballsaal', description: 'Eröffnungstanz und dann ab auf die Tanzfläche!', icon: '🎉' },
    { time: '00:00', title: 'Snack', location: 'Terrasse', description: 'Burger und Pommes für die Durchhalter.', icon: '🍔' },
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

  return (
    <Section ref={sectionRef} id="timeline">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>📋 Der Tag</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
      </Container>
      
      <TimelineTrack>
        <CardsContainer>
          {items.map((item, index) => (
            <Card 
              key={index}
              $position={index}
              $total={items.length}
              $zIndex={items.length - Math.abs(index - activeIndex)}
              $active={index === activeIndex}
              $visible={visible}
              onClick={() => setActiveIndex(index)}
            >
              <CardHeader>
                <TimeBox $index={index}>{item.time}</TimeBox>
                <IconBox $index={index}>{item.icon || '📍'}</IconBox>
              </CardHeader>
              <CardTitle>{item.title}</CardTitle>
              {item.location && <CardLocation>{item.location}</CardLocation>}
              <CardDescription $visible={index === activeIndex}>
                {item.description}
              </CardDescription>
              <Connector />
              <Dot $index={index} />
            </Card>
          ))}
        </CardsContainer>
        
        <TimelineLine />
      </TimelineTrack>
      
      <Hint>Klicke auf eine Karte für Details</Hint>
    </Section>
  );
}

export default Timeline;
