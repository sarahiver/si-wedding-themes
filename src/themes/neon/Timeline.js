import { useWedding } from '../../context/WeddingContext';
// src/components/Timeline.js - Neon Theme
import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }
  50% { 
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: clamp(4rem, 10vw, 9rem) 5%;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 100px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 20px;
  
  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(255,255,255,0.2);
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  
  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const TimelineWrapper = styled.div`
  position: relative;
  padding-left: 100px;
  
  @media (max-width: 768px) {
    padding-left: 60px;
  }
`;

const ProgressLine = styled.div`
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255,255,255,0.1);
  
  @media (max-width: 768px) {
    left: 20px;
  }
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${p => p.$progress}%;
  background: linear-gradient(180deg, #00ffff, #ff00ff);
  box-shadow: 0 0 20px rgba(0,255,255,0.5);
  transition: height 0.1s linear;
`;

const ProgressDot = styled.div`
  position: absolute;
  left: -7px;
  top: ${p => p.$progress}%;
  width: 16px;
  height: 16px;
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 20px #00ffff;
  transition: top 0.1s linear;
  z-index: 2;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '50px'});
  transition: all 0.6s ease ${p => p.$delay}s;
  
  &:last-child {
    padding-bottom: 0;
  }
`;

const TimeDot = styled.div`
  position: absolute;
  left: -77px;
  top: 5px;
  width: 14px;
  height: 14px;
  background: ${p => p.$active ? p.$color : 'transparent'};
  border: 2px solid ${p => p.$color};
  border-radius: 50%;
  transition: all 0.3s ease;
  
  ${p => p.$active && css`
    animation: ${glowPulse} 2s ease-in-out infinite;
    color: ${p.$color};
  `}
  
  @media (max-width: 768px) {
    left: -47px;
  }
`;

const TimeCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.15);
  padding: 35px;
  position: relative;
  
  /* Corner Accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-top: 2px solid ${p => p.$color};
    border-left: 2px solid ${p => p.$color};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-bottom: 2px solid ${p => p.$color};
    border-right: 2px solid ${p => p.$color};
  }
  
  &:hover {
    border-color: ${p => p.$color}50;
    box-shadow: 0 0 30px ${p => p.$color}20;
  }
`;

const TimeDisplay = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${p => p.$color};
  text-shadow: 0 0 15px ${p => p.$color}50;
  margin-bottom: 15px;
`;

const EventTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
`;

const EventDescription = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.5);
`;

const EventMeta = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.05);
`;

const MetaItem = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 14px;
    height: 14px;
    color: ${p => p.$color};
  }
`;

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  const title = timelineData.title || 'Timeline';

  const defaultEvents = [
    {
      time: '14:00',
      title: 'Ceremony Begins',
      description: 'Join us as we exchange our vows in front of friends and family.',
      location: 'St. Patrick Church',
      duration: '45 min',
      color: '#00ffff'
    },
    {
      time: '15:00',
      title: 'Cocktail Hour',
      description: 'Enjoy drinks and appetizers while we take photos. Live music and mingling.',
      location: 'Garden Terrace',
      duration: '1.5 hours',
      color: '#ff00ff'
    },
    {
      time: '17:00',
      title: 'Reception & Dinner',
      description: 'A four-course dinner followed by speeches and tears of joy.',
      location: 'The Glass Factory',
      duration: '3 hours',
      color: '#b347ff'
    },
    {
      time: '20:00',
      title: 'First Dance',
      description: 'Watch us embarrass ourselves on the dance floor. Then join us!',
      location: 'Main Hall',
      duration: '30 min',
      color: '#00ff88'
    },
    {
      time: '21:00',
      title: 'Party Time!',
      description: 'DJ takes over. Dance floor opens. Let\'s celebrate until the lights come on!',
      location: 'Main Hall',
      duration: 'Until late',
      color: '#00ffff'
    }
  ];

  const neonColors = ['#00ffff', '#ff00ff', '#b347ff', '#00ff88', '#00ffff'];
  const events = timelineData.events?.length > 0
    ? timelineData.events.map((e, i) => ({ ...e, color: e.color || neonColors[i % neonColors.length] }))
    : defaultEvents;
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rafRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel previous animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        const scrolled = -rect.top + viewportHeight * 0.5;
        const maxScroll = sectionHeight;
        const progress = Math.max(0, Math.min(100, (scrolled / maxScroll) * 100));
        
        setScrollProgress(progress);
        setActiveIndex(Math.floor((progress / 100) * events.length) - 1);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [events.length]);

  return (
    <Section ref={sectionRef} id="timeline">
      <GridBG />
      
      <Container>
        <Header $visible={visible}>
          <Eyebrow>The Schedule</Eyebrow>
          <Title><span>{title}</span></Title>
        </Header>
        
        <TimelineWrapper>
          <ProgressLine>
            <ProgressFill $progress={scrollProgress} />
            <ProgressDot $progress={scrollProgress} />
          </ProgressLine>
          
          {events.map((event, i) => (
            <TimelineItem 
              key={i} 
              $visible={visible}
              $delay={i * 0.15}
            >
              <TimeDot $active={i <= activeIndex} $color={event.color} />
              
              <TimeCard $color={event.color}>
                <TimeDisplay $color={event.color}>{event.time}</TimeDisplay>
                <EventTitle>{event.title}</EventTitle>
                <EventDescription>{event.description}</EventDescription>
                
                <EventMeta>
                  <MetaItem $color={event.color}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {event.location}
                  </MetaItem>
                  <MetaItem $color={event.color}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    {event.duration}
                  </MetaItem>
                </EventMeta>
              </TimeCard>
            </TimelineItem>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default Timeline;
