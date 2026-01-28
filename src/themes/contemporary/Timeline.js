import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const pop = keyframes`
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const Section = styled.section`
  padding: 100px 5%;
  background: #FAFAFA;
  position: relative;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Eyebrow = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FF6B6B;
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: #0D0D0D;
  line-height: 1.1;
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #FFFFFF;
  border: 3px solid #0D0D0D;
  padding: 25px;
  position: relative;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: ${p => p.$visible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-10deg)'};
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: ${p => p.$index * 0.1}s;
  
  ${p => p.$highlighted && css`
    background: #FFE66D;
    box-shadow: 8px 8px 0 #0D0D0D;
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 8px 8px 0 ${p => p.$highlighted ? '#FF6B6B' : '#0D0D0D'};
  }
`;

const TimeLabel = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${p => p.$highlighted ? '#0D0D0D' : '#FF6B6B'};
  margin-bottom: 10px;
`;

const EventTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0D0D0D;
  margin-bottom: 8px;
`;

const EventDesc = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  color: rgba(13, 13, 13, 0.7);
  line-height: 1.5;
`;

const EventIcon = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.5rem;
`;

function Timeline({ content = {}, events: eventsProp }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // Get events from content or direct prop
  const eventsFromContent = content.events || [];
  const events = eventsProp?.length > 0 ? eventsProp : eventsFromContent;

  const defaultEvents = [
    { time: '14:00', title: 'Zeremonie', description: 'Die Trauung beginnt', icon: '💒', highlighted: true },
    { time: '15:30', title: 'Empfang', description: 'Sektempfang auf der Terrasse', icon: '🥂' },
    { time: '17:00', title: 'Dinner', description: '3-Gänge-Menü im Festsaal', icon: '🍽️' },
    { time: '20:00', title: 'First Dance', description: 'Unser erster Tanz', icon: '💃', highlighted: true },
    { time: '21:00', title: 'Party', description: 'DJ & Tanzfläche', icon: '🎉' },
    { time: '00:00', title: 'Mitternachtssnack', description: 'Burger & Pommes', icon: '🍔' },
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
          <Title>{content.title || 'Tagesablauf'}</Title>
        </Header>
        
        <TimelineGrid>
          {items.map((event, i) => (
            <Card 
              key={i} 
              $index={i} 
              $visible={visible}
              $highlighted={event.highlighted || event.highlight}
            >
              {event.icon && <EventIcon>{event.icon}</EventIcon>}
              <TimeLabel $highlighted={event.highlighted || event.highlight}>{event.time}</TimeLabel>
              <EventTitle>{event.title}</EventTitle>
              <EventDesc>{event.description || event.desc}</EventDesc>
            </Card>
          ))}
        </TimelineGrid>
      </Container>
    </Section>
  );
}

export default Timeline;
