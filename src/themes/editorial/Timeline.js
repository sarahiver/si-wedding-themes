import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-80px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(80px); }
  to { opacity: 1; transform: translateX(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`;

const numberReveal = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(30px) scale(0.8);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
`;

const iconPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-black);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(4rem, 10vw, 8rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.2s;
  `}
`;

const Subtitle = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const EventsWrapper = styled.div`
  position: relative;
  
  /* Central vertical line */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-50%);
    
    @media (max-width: 900px) {
      left: 2rem;
    }
  }
`;

const CenterLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  background: var(--editorial-red);
  transform: translateX(-50%);
  transform-origin: top;
  height: ${p => p.$progress}%;
  transition: height 0.3s ease;
  z-index: 1;
  
  @media (max-width: 900px) {
    left: 2rem;
  }
`;

const Event = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 3rem;
  padding: 3rem 0;
  position: relative;
  
  &:first-child { padding-top: 0; }
  &:last-child { padding-bottom: 0; }
  
  @media (max-width: 900px) {
    grid-template-columns: auto 1fr;
    gap: 2rem;
    padding: 2rem 0;
  }
`;

const TimeBlock = styled.div`
  text-align: right;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${slideInLeft} 0.8s ease forwards;
    animation-delay: ${p.$delay}s;
  `}
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const Time = styled.div`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--editorial-white);
  line-height: 0.9;
  letter-spacing: -0.02em;
`;

const TimeSuffix = styled.span`
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 0.5rem;
`;

const Marker = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  
  @media (max-width: 900px) {
    align-items: flex-start;
    padding-top: 0.5rem;
  }
`;

const MarkerDot = styled.div`
  width: ${p => p.$highlight ? '60px' : '44px'};
  height: ${p => p.$highlight ? '60px' : '44px'};
  background: ${p => p.$highlight ? 'var(--editorial-red)' : 'var(--editorial-black)'};
  border: 3px solid ${p => p.$highlight ? 'var(--editorial-red)' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${p => p.$highlight ? '1.8rem' : '1.4rem'};
  transition: all 0.3s ease;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${numberReveal} 0.6s ease forwards;
    animation-delay: ${p.$delay}s;
  `}
  
  ${p => p.$highlight && css`
    animation: ${numberReveal} 0.6s ease forwards, ${iconPulse} 2s ease-in-out infinite;
    animation-delay: ${p.$delay}s, ${p.$delay + 0.6}s;
  `}
  
  @media (max-width: 900px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ContentBlock = styled.div`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${slideInRight} 0.8s ease forwards;
    animation-delay: ${p.$delay + 0.1}s;
  `}
  
  @media (max-width: 900px) {
    padding-right: 1rem;
  }
`;

const MobileTime = styled.div`
  display: none;
  font-family: var(--font-headline);
  font-size: 2rem;
  font-weight: 700;
  color: var(--editorial-white);
  margin-bottom: 0.5rem;
  
  @media (max-width: 900px) {
    display: block;
  }
`;

const EventTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin-bottom: 0.75rem;
`;

const EventDescription = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  max-width: 400px;
`;

const EventLocation = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
`;

const FooterNote = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.8s;
  `}
`;

const FooterText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.4);
`;

// ============================================
// COMPONENT
// ============================================

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Tagesablauf';
  const events = timelineData.events || [];
  
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const eventRefs = useRef([]);

  const defaultEvents = [
    { time: '14:00', icon: '💒', title: 'Trauung', description: 'Der Moment, auf den wir so lange gewartet haben. Wir geben uns das Ja-Wort.', location: 'Schlosskapelle', highlight: true },
    { time: '15:30', icon: '🥂', title: 'Sektempfang', description: 'Anstoßen, Gratulieren, die ersten Freudentränen trocknen.', location: 'Schlossterrasse' },
    { time: '18:00', icon: '🍽️', title: 'Dinner', description: 'Ein festliches Menü erwartet euch. Genießt, lacht, feiert mit uns.', location: 'Großer Festsaal' },
    { time: '20:30', icon: '💃', title: 'Eröffnungstanz', description: 'Wir eröffnen das Tanzparkett – und hoffen, dass niemand filmt.', location: 'Großer Festsaal', highlight: true },
    { time: '21:00', icon: '🎉', title: 'Party', description: 'Die Nacht gehört uns. Tanzt, feiert, macht Erinnerungen.', location: 'Großer Festsaal' },
    { time: '00:00', icon: '🌙', title: 'Mitternachtssnack', description: 'Für alle, die durchhalten – Stärkung um Mitternacht.', location: 'Buffet' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  // Header observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Events observer
  useEffect(() => {
    const observers = eventRefs.current.map((ref, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleEvents(prev => [...new Set([...prev, i])]);
            setProgress(((i + 1) / items.length) * 100);
          }
        },
        { threshold: 0.3 }
      );
      if (ref) observer.observe(ref);
      return observer;
    });
    
    return () => observers.forEach(obs => obs.disconnect());
  }, [items.length]);

  return (
    <Section id="timeline" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={headerVisible}>So läuft der Tag</Eyebrow>
          <Title $visible={headerVisible}>{title}</Title>
          <Subtitle $visible={headerVisible}>Von der Trauung bis zum letzten Tanz</Subtitle>
        </Header>
        
        <EventsWrapper>
          <CenterLine $progress={progress} />
          
          {items.map((event, i) => {
            const isVisible = visibleEvents.includes(i);
            const delay = 0;
            
            return (
              <Event key={i} ref={el => eventRefs.current[i] = el}>
                <TimeBlock $visible={isVisible} $delay={delay}>
                  <Time>
                    {event.time}
                    <TimeSuffix>Uhr</TimeSuffix>
                  </Time>
                </TimeBlock>
                
                <Marker>
                  <MarkerDot 
                    $highlight={event.highlight} 
                    $visible={isVisible}
                    $delay={delay}
                  >
                    {event.icon}
                  </MarkerDot>
                </Marker>
                
                <ContentBlock $visible={isVisible} $delay={delay}>
                  <MobileTime>{event.time} Uhr</MobileTime>
                  <EventTitle>{event.title}</EventTitle>
                  {event.description && (
                    <EventDescription>{event.description}</EventDescription>
                  )}
                  {event.location && (
                    <EventLocation>
                      📍 {event.location}
                    </EventLocation>
                  )}
                </ContentBlock>
              </Event>
            );
          })}
        </EventsWrapper>
        
        <FooterNote $visible={headerVisible}>
          <FooterText>Änderungen vorbehalten – aber das Feiern steht fest.</FooterText>
        </FooterNote>
      </Container>
    </Section>
  );
}

export default Timeline;
