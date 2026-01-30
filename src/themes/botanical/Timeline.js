import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg-alt);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Events = styled.div`
  display: flex;
  flex-direction: column;
`;

const Event = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--zen-line);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay}s;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Time = styled.div`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: var(--zen-text);
  min-width: 60px;
`;

const EventContent = styled.div`
  flex: 1;
`;

const EventTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--zen-text);
  margin-bottom: 0.2rem;
`;

const EventLocation = styled.p`
  font-size: 0.8rem;
  color: var(--zen-text-light);
  margin: 0;
`;

function Timeline() {
  const { content } = useWedding();
  const data = content?.timeline || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Der Ablauf';
  const events = data.events?.length > 0 ? data.events : [
    { time: '14:00', title: 'Trauung', location: 'Standesamt' },
    { time: '15:30', title: 'Sektempfang', location: 'Terrasse' },
    { time: '18:00', title: 'Dinner', location: 'Festsaal' },
    { time: '21:00', title: 'Party', location: 'Tanzfläche' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="timeline" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        
        <Events>
          {events.map((event, i) => (
            <Event 
              key={i} 
              className={visible ? 'visible' : ''} 
              $delay={0.1 + i * 0.1}
            >
              <Time>{event.time}</Time>
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                {event.location && <EventLocation>{event.location}</EventLocation>}
              </EventContent>
            </Event>
          ))}
        </Events>
      </Content>
    </Section>
  );
}

export default Timeline;
