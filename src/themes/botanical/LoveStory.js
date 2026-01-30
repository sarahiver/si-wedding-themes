import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
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

const Timeline = styled.div`
  position: relative;
  padding-left: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    background: var(--zen-line);
  }
`;

const Item = styled.div`
  position: relative;
  padding: 1.5rem 0 1.5rem 2rem;
  border-bottom: 1px solid var(--zen-line-light);
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

const Dot = styled.div`
  position: absolute;
  left: -2rem;
  top: 2rem;
  width: 7px;
  height: 7px;
  background: var(--zen-bg);
  border: 1px solid var(--zen-text-light);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: all 0.3s ease;
  
  ${Item}:hover & {
    background: var(--zen-text);
    border-color: var(--zen-text);
    transform: translateX(-50%) scale(1.3);
  }
`;

const Year = styled.p`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--zen-text-muted);
  margin-bottom: 0.3rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--zen-text);
  margin-bottom: 0.3rem;
`;

const Description = styled.p`
  font-size: 0.85rem;
  color: var(--zen-text-light);
  margin: 0;
`;

function LoveStory() {
  const { content } = useWedding();
  const data = content?.lovestory || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Unsere Geschichte';
  const events = data.events?.length > 0 ? data.events : [
    { date: '2019', title: 'Das erste Treffen', description: 'Bei gemeinsamen Freunden' },
    { date: '2021', title: 'Zusammengezogen', description: 'Unsere erste Wohnung' },
    { date: '2024', title: 'Der Antrag', description: 'Sie hat Ja gesagt' },
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
    <Section id="lovestory" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        
        <Timeline>
          {events.map((event, i) => (
            <Item 
              key={i} 
              className={visible ? 'visible' : ''} 
              $delay={0.1 + i * 0.1}
            >
              <Dot />
              <Year>{event.date}</Year>
              <ItemTitle>{event.title}</ItemTitle>
              {event.description && <Description>{event.description}</Description>}
            </Item>
          ))}
        </Timeline>
      </Content>
    </Section>
  );
}

export default LoveStory;
