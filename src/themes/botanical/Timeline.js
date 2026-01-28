import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
`;

const growIn = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, var(--cream) 0%, var(--cream-dark) 100%);
  position: relative;
  overflow: hidden;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  opacity: 0.12;
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  animation: ${float} ${p => p.$duration}s ease-in-out infinite;
  pointer-events: none;
  svg { width: 100%; height: 100%; fill: var(--sage); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const TimelineContainer = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--sage-light), var(--sage), var(--sage-light));
    transform: translateX(-50%);
    transform-origin: top;
    animation: ${p => p.$visible ? growIn : 'none'} 1.5s ease forwards;
    
    @media (max-width: 768px) { left: 24px; }
  }
`;

const Event = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 3rem;
  position: relative;
  
  &:nth-child(odd) {
    flex-direction: row-reverse;
    text-align: right;
    .content { padding-right: 3rem; padding-left: 0; }
  }
  
  &:nth-child(even) {
    .content { padding-left: 3rem; }
  }
  
  @media (max-width: 768px) {
    flex-direction: row !important;
    text-align: left !important;
    .content { padding-left: 3rem !important; padding-right: 0 !important; }
  }
`;

const EventMarker = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: var(--cream);
  border: 2px solid var(--sage);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
  transition-delay: ${p => p.$index * 0.15}s;
  
  span { font-size: 1.2rem; }
  
  @media (max-width: 768px) { left: 24px; }
`;

const EventContent = styled.div`
  flex: 1;
  max-width: calc(50% - 40px);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => 0.1 + p.$index * 0.15}s;
  
  @media (max-width: 768px) { max-width: calc(100% - 60px); }
`;

const EventTime = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-style: italic;
  color: var(--sage);
  margin-bottom: 0.5rem;
`;

const EventTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const EventDesc = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.7;
`;

const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const title = timelineData.title || 'Tagesablauf';
  const events = timelineData.events || [];

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
      <FloatingLeaf $size={70} $top="10%" $left="5%" $duration={8}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={50} $top="60%" $right="8%" $duration={10}><LeafSVG /></FloatingLeaf>
      
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Der große Tag</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <TimelineContainer $visible={visible}>
          {events.map((event, i) => (
            <Event key={i}>
              <EventMarker $visible={visible} $index={i}>
                <span>{event.icon || '🌿'}</span>
              </EventMarker>
              <EventContent className="content" $visible={visible} $index={i}>
                <EventTime>{event.time}</EventTime>
                <EventTitle>{event.title}</EventTitle>
                <EventDesc>{event.description || event.desc}</EventDesc>
              </EventContent>
            </Event>
          ))}
        </TimelineContainer>
      </Container>
    </Section>
  );
}

export default Timeline;
