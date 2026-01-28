// Luxe Timeline - Elegant Vertical
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const lineGrow = keyframes`
  from { height: 0; }
  to { height: 100%; }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-sand);
`;

const Container = styled.div`
  max-width: var(--container-narrow);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: 0;
  animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-black);
`;

const TimelineWrapper = styled.div`
  position: relative;
  padding-left: 3rem;
  
  @media (max-width: 600px) {
    padding-left: 2rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: ${p => p.$visible ? '100%' : '0'};
    background: var(--luxe-taupe);
    transition: height 1.5s ease;
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 3rem;
  opacity: 0;
  animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards;
  animation-delay: ${p => 0.2 + p.$index * 0.15}s;
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -3rem;
    top: 0.5rem;
    width: 9px;
    height: 9px;
    background: var(--luxe-cream);
    border: 1px solid var(--luxe-taupe);
    border-radius: 50%;
    
    @media (max-width: 600px) {
      left: -2rem;
    }
  }
`;

const Time = styled.span`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  display: block;
  margin-bottom: 0.5rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--luxe-black);
  margin-bottom: 0.75rem;
`;

const ItemDescription = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.8;
  color: var(--luxe-charcoal);
`;

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Tagesablauf';
  const items = timelineData.items || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultItems = [
    { time: '14:00', title: 'Empfang', description: 'Willkommensgetraenke im Garten' },
    { time: '15:00', title: 'Zeremonie', description: 'Die Trauung in der Kapelle' },
    { time: '16:30', title: 'Aperitif', description: 'Haeppchen und Champagner auf der Terrasse' },
    { time: '18:00', title: 'Dinner', description: 'Festliches Abendessen im Saal' },
    { time: '21:00', title: 'Party', description: 'Musik und Tanz bis in die Nacht' }
  ];

  const timelineItems = items.length > 0 ? items : defaultItems;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="timeline">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Der Tag</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <TimelineWrapper $visible={visible}>
          {timelineItems.map((item, i) => (
            <TimelineItem key={i} $visible={visible} $index={i}>
              <Time>{item.time} Uhr</Time>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
            </TimelineItem>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default Timeline;
