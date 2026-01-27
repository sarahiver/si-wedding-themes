import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 157, 131, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(139, 157, 131, 0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
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
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
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

const TimelineWrapper = styled.div`
  position: relative;
`;

const TimelineEvent = styled.div`
  display: grid;
  grid-template-columns: 100px 60px 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: flex-start;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateX(${p => p.visible ? 0 : '-30px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.index * 0.1}s;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 70px 40px 1fr;
    gap: 1rem;
  }
`;

const TimeBlock = styled.div`
  text-align: right;
  padding-top: 0.5rem;
`;

const Time = styled.span`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-style: italic;
  color: var(--forest);
  
  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const MarkerColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Marker = styled.div`
  width: 50px;
  height: 50px;
  background: ${p => p.highlight ? 'var(--sage)' : 'var(--cream)'};
  border: 2px solid var(--sage);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  position: relative;
  z-index: 2;
  transition: all var(--transition-normal);
  
  ${p => p.highlight && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
  
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const Line = styled.div`
  width: 2px;
  flex: 1;
  min-height: 60px;
  background: linear-gradient(180deg, var(--sage) 0%, var(--sage-light) 100%);
  margin: 0.5rem 0;
`;

const EventContent = styled.div`
  background: ${p => p.highlight ? 'var(--sage-muted)' : 'var(--cream-dark)'};
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid ${p => p.highlight ? 'var(--sage)' : 'transparent'};
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateX(8px);
    box-shadow: var(--shadow-md);
    border-color: var(--sage-light);
  }
`;

const EventTitle = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HighlightBadge = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cream);
  background: var(--sage);
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
`;

const EventDescription = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.7;
  margin-bottom: 0.75rem;
`;

const EventLocation = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  color: var(--sage-dark);
  
  .icon { opacity: 0.7; }
`;

// Note at bottom
const Note = styled.div`
  margin-top: 3rem;
  padding: 1.5rem 2rem;
  background: var(--sage-muted);
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px dashed var(--sage-light);
  opacity: ${p => p.visible ? 1 : 0};
  transition: opacity 0.8s ease;
  transition-delay: 0.5s;
  
  p {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-style: italic;
    color: var(--text-light);
    
    .emoji { margin: 0 0.3rem; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Timeline({
  events = [
    { time: '15:00', icon: '💒', title: 'Freie Trauung', description: 'Unter der alten Linde im Rosengarten', location: 'Botanischer Garten', highlight: true },
    { time: '16:00', icon: '🥂', title: 'Sektempfang', description: 'Stoßt mit uns an zwischen blühenden Rosen', location: 'Rosengarten', highlight: false },
    { time: '17:00', icon: '📸', title: 'Paarfotos', description: 'Ein Spaziergang durch den Garten', location: 'Botanischer Garten', highlight: false },
    { time: '18:30', icon: '🍽️', title: 'Festliches Dinner', description: 'Nachhaltiges 4-Gänge-Menü aus regionalen Zutaten', location: 'Orangerie', highlight: true },
    { time: '21:00', icon: '💃', title: 'Tanz & Feier', description: 'Lasst uns gemeinsam in die Nacht tanzen', location: 'Orangerie', highlight: false },
    { time: '00:00', icon: '🌙', title: 'Mitternachtssnack', description: 'Kleine Stärkung für die Nacht', location: 'Orangerie', highlight: false },
  ],
  note = 'Zeiten sind flexibel – wir lassen uns vom Tag tragen.',
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

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
        <Header visible={visible}>
          <Eyebrow>Tagesablauf</Eyebrow>
          <Title>Unser Tag</Title>
        </Header>

        <TimelineWrapper>
          {events.map((event, i) => (
            <TimelineEvent key={i} index={i} visible={visible}>
              <TimeBlock>
                <Time>{event.time}</Time>
              </TimeBlock>
              
              <MarkerColumn>
                <Marker highlight={event.highlight}>
                  {event.icon}
                </Marker>
                {i < events.length - 1 && <Line />}
              </MarkerColumn>
              
              <EventContent highlight={event.highlight}>
                <EventTitle>
                  {event.title}
                  {event.highlight && <HighlightBadge>Highlight</HighlightBadge>}
                </EventTitle>
                <EventDescription>{event.description}</EventDescription>
                <EventLocation>
                  <span className="icon">📍</span>
                  {event.location}
                </EventLocation>
              </EventContent>
            </TimelineEvent>
          ))}
        </TimelineWrapper>

        {note && (
          <Note visible={visible}>
            <p><span className="emoji">🌿</span>{note}<span className="emoji">🌿</span></p>
          </Note>
        )}
      </Container>
    </Section>
  );
}

export default Timeline;
