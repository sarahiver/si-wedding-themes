import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, #FAF9F6 0%, #F5F1EB 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #8B9D83;
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #2C3E2D;
  font-style: italic;
`;

const TimelineWrapper = styled.div`
  position: relative;
  padding-left: 80px;
  
  &::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #8B9D83 0%, rgba(139, 157, 131, 0.3) 100%);
  }
  
  @media (max-width: 600px) {
    padding-left: 60px;
    &::before { left: 20px; }
  }
`;

const Event = styled.div`
  position: relative;
  padding-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$index * 0.1}s;
  
  &:last-child { padding-bottom: 0; }
`;

const EventTime = styled.div`
  position: absolute;
  left: -80px;
  width: 50px;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #8B9D83;
  text-align: right;
  
  @media (max-width: 600px) {
    left: -60px;
    width: 40px;
    font-size: 0.75rem;
  }
`;

const EventDot = styled.div`
  position: absolute;
  left: -58px;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${p => p.$highlight ? '#8B9D83' : '#F5F1EB'};
  border: 2px solid #8B9D83;
  
  @media (max-width: 600px) {
    left: -48px;
  }
`;

const EventContent = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 157, 131, 0.2);
`;

const EventIcon = styled.span`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  display: block;
`;

const EventTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 500;
  color: #2C3E2D;
  margin-bottom: 0.5rem;
`;

const EventDescription = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: #5A6B5A;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

const EventLocation = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  color: #8B9D83;
`;

function Timeline({ content = {} }) {
  const title = content.title || 'Tagesablauf';
  const events = content.events || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultEvents = [
    { time: '15:00', icon: '💒', title: 'Freie Trauung', description: 'Unter der alten Linde im Rosengarten', location: 'Botanischer Garten', highlight: true },
    { time: '16:00', icon: '🥂', title: 'Sektempfang', description: 'Stoßt mit uns an zwischen blühenden Rosen', location: 'Rosengarten' },
    { time: '17:00', icon: '📸', title: 'Paarfotos', description: 'Ein Spaziergang durch den Garten', location: 'Botanischer Garten' },
    { time: '18:30', icon: '🍽️', title: 'Festliches Dinner', description: 'Nachhaltiges 4-Gänge-Menü aus regionalen Zutaten', location: 'Orangerie', highlight: true },
    { time: '21:00', icon: '🎉', title: 'Party', description: 'Tanzen unter Lichterketten bis in die Nacht', location: 'Pavillon' },
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
          <Eyebrow>So läuft der Tag</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <TimelineWrapper>
          {items.map((event, i) => (
            <Event key={i} $index={i} $visible={visible}>
              <EventTime>{event.time}</EventTime>
              <EventDot $highlight={event.highlight} />
              <EventContent>
                {event.icon && <EventIcon>{event.icon}</EventIcon>}
                <EventTitle>{event.title}</EventTitle>
                {event.description && <EventDescription>{event.description}</EventDescription>}
                {event.location && <EventLocation>📍 {event.location}</EventLocation>}
              </EventContent>
            </Event>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default Timeline;
