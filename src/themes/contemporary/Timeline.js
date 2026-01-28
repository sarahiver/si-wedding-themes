// Contemporary Timeline - Colorful Brutalist Style
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--gray-100);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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

const TimelineWrapper = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--black);
    transform: translateX(-50%);
    
    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)', 'var(--pink)'];

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease ${p => p.$index * 0.15}s;
  
  @media (max-width: 768px) {
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TimeBlock = styled.div`
  text-align: right;
  padding-top: 0.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Time = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  background: ${p => colors[p.$index % colors.length]};
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
`;

const Dot = styled.div`
  width: 50px;
  height: 50px;
  background: ${p => colors[p.$index % colors.length]};
  border: 4px solid var(--black);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  z-index: 1;
  animation: ${bounce} 2s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.3}s;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const Content = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  transition: all 0.3s ease;
`;

const MobileTime = styled.div`
  display: none;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--white);
  background: ${p => colors[p.$index % colors.length]};
  padding: 0.25rem 0.75rem;
  border: 2px solid var(--black);
  margin-bottom: 0.75rem;
  display: inline-block;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const EventTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const EventLocation = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: 0.75rem;
  
  &::before {
    content: '📍 ';
  }
`;

const EventDescription = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
`;

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Tagesablauf';
  const events = timelineData.events || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultEvents = [
    { time: '14:00', title: 'Trauung', location: 'Kirche St. Marien', description: 'Die kirchliche Trauung mit anschließendem Sektempfang.', icon: '💒' },
    { time: '16:00', title: 'Empfang', location: 'Schloss Charlottenburg', description: 'Begrüßung aller Gäste mit Häppchen und Drinks.', icon: '🥂' },
    { time: '18:00', title: 'Dinner', location: 'Großer Saal', description: 'Festliches 4-Gänge-Menü mit vegetarischen Optionen.', icon: '🍽️' },
    { time: '21:00', title: 'Party', location: 'Ballsaal', description: 'Eröffnungstanz und dann ab auf die Tanzfläche!', icon: '🎉' },
    { time: '00:00', title: 'Mitternachtssnack', location: 'Terrasse', description: 'Burger und Pommes für die Durchhalter.', icon: '🍔' },
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
        
        <TimelineWrapper>
          {items.map((item, index) => (
            <TimelineItem key={index} $index={index} $visible={visible}>
              <TimeBlock>
                <Time $index={index}>{item.time}</Time>
              </TimeBlock>
              
              <Dot $index={index}>{item.icon || '📍'}</Dot>
              
              <Content>
                <MobileTime $index={index}>{item.time}</MobileTime>
                <EventTitle>{item.title}</EventTitle>
                {item.location && <EventLocation>{item.location}</EventLocation>}
                {item.description && <EventDescription>{item.description}</EventDescription>}
              </Content>
            </TimelineItem>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default Timeline;
