import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LUXE TIMELINE - Horizontal Scrollable Timeline
// Modern horizontal layout with scroll snap
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 0;
  background: var(--luxe-white);
  overflow: hidden;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 0 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const TimelineContainer = styled.div`
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const TimelineTrack = styled.div`
  display: flex;
  gap: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 2rem;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimelineItem = styled.div`
  flex: 0 0 280px;
  scroll-snap-align: center;
  position: relative;
  padding: 0 1.5rem;
  
  @media (max-width: 768px) {
    flex: 0 0 250px;
  }
  
  &:first-child {
    margin-left: calc(50vw - 140px);
  }
  
  &:last-child {
    margin-right: calc(50vw - 140px);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TimelineCard = styled.div`
  background: var(--luxe-cream);
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: all 0.4s ease;
  
  ${p => p.$active && css`
    background: var(--luxe-white);
    box-shadow: 0 15px 40px rgba(0,0,0,0.06);
    transform: translateY(-10px);
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${p => p.$active ? 'var(--luxe-gold)' : 'var(--luxe-border)'};
    transition: all 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -24px;
    left: calc(50% + 6px);
    width: calc(100% + 3rem - 6px);
    height: 1px;
    background: var(--luxe-border);
  }
  
  ${TimelineItem}:last-child &::after {
    display: none;
  }
`;

const TimelineTime = styled.p`
  font-family: var(--font-serif);
  font-size: 2rem;
  font-style: italic;
  color: ${p => p.$active ? 'var(--luxe-gold)' : 'var(--luxe-text-heading)'};
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
`;

const TimelineTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 0.75rem;
`;

const TimelineText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--luxe-text-light);
  line-height: 1.7;
`;

const TimelineIcon = styled.div`
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--luxe-border);
  border-radius: 50%;
  font-size: 1.2rem;
  color: var(--luxe-text-light);
  transition: all 0.3s ease;
  
  ${TimelineCard}:hover & {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const NavDot = styled.button`
  width: 30px;
  height: 3px;
  background: ${p => p.$active ? 'var(--luxe-gold)' : 'var(--luxe-border)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--luxe-gold);
  }
`;

const ScrollHint = styled.p`
  text-align: center;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-top: 1rem;
  
  span {
    display: inline-block;
    animation: bounce 1.5s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
  }
`;

function Timeline({ events }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  
  const defaultEvents = [
    { time: '14:00', title: 'Empfang', text: 'Sektempfang im Schlossgarten', icon: '🥂' },
    { time: '15:00', title: 'Trauung', text: 'Zeremonie in der Orangerie', icon: '💒' },
    { time: '16:00', title: 'Gratulation', text: 'Empfang der Glückwünsche', icon: '💐' },
    { time: '17:00', title: 'Kaffee', text: 'Kaffee & Kuchen auf der Terrasse', icon: '☕' },
    { time: '18:30', title: 'Dinner', text: 'Festliches Menü im Spiegelsaal', icon: '🍽️' },
    { time: '21:00', title: 'Party', text: 'Tanz und Feiern bis in die Nacht', icon: '💃' },
  ];
  
  const eventData = events || defaultEvents;
  
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    
    const handleScroll = () => {
      const scrollPosition = track.scrollLeft;
      const itemWidth = 280;
      const newIndex = Math.round(scrollPosition / itemWidth);
      setActiveIndex(Math.min(newIndex, eventData.length - 1));
    };
    
    track.addEventListener('scroll', handleScroll);
    return () => track.removeEventListener('scroll', handleScroll);
  }, [eventData.length]);
  
  const scrollToIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;
    
    const itemWidth = 280;
    track.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
  };
  
  return (
    <Section id="timeline">
      <Header>
        <Eyebrow>Der Tag</Eyebrow>
        <Title>Ablauf</Title>
      </Header>
      
      <TimelineContainer>
        <TimelineTrack ref={trackRef}>
          {eventData.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineCard $active={index === activeIndex}>
                <TimelineIcon>{event.icon}</TimelineIcon>
                <TimelineTime $active={index === activeIndex}>{event.time}</TimelineTime>
                <TimelineTitle>{event.title}</TimelineTitle>
                <TimelineText>{event.text}</TimelineText>
              </TimelineCard>
            </TimelineItem>
          ))}
        </TimelineTrack>
        
        <Navigation>
          {eventData.map((_, index) => (
            <NavDot 
              key={index} 
              $active={index === activeIndex}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </Navigation>
        
        <ScrollHint>
          Horizontal scrollen <span>→</span>
        </ScrollHint>
      </TimelineContainer>
    </Section>
  );
}

export default Timeline;
