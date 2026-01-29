// Botanical Timeline - Flowing River Path
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const flow = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
`;

const ripple = keyframes`
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
`;

const fadeGrow = keyframes`
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-cream);
  position: relative;
  overflow: hidden;
`;

// Decorative background elements
const BackgroundLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '150px'};
  height: ${p => p.$size || '150px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.15};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '12s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '15px'});
  transition: all 0.6s var(--ease-nature);
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s var(--ease-nature) 0.1s;
`;

// The River Path
const RiverContainer = styled.div`
  position: relative;
  padding: 2rem 0;
`;

const River = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 8px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    var(--water-stream) 0%,
    var(--water-pond) 50%,
    var(--water-deep) 100%
  );
  border-radius: 20px;
  
  /* Flowing water effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(255,255,255,0.4) 50%,
      transparent 100%
    );
    background-size: 100% 50px;
    animation: ${flow} 3s linear infinite;
    border-radius: 20px;
  }
  
  @media (max-width: 768px) {
    left: 30px;
    transform: none;
  }
`;

// Timeline Events as Stepping Stones
const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const EventItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  padding: 2rem 0;
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? fadeGrow : 'none'} 0.8s var(--ease-nature) forwards;
  animation-delay: ${p => p.$index * 0.15}s;
  
  @media (max-width: 768px) {
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
    padding-left: 20px;
  }
  
  &:nth-child(even) {
    .content {
      grid-column: 1;
      text-align: right;
      
      @media (max-width: 768px) {
        grid-column: 2;
        text-align: left;
      }
    }
    .stone {
      grid-column: 2;
    }
    .time-side {
      grid-column: 3;
      
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
`;

// Stepping Stone (the dot/marker)
const Stone = styled.div`
  width: 70px;
  height: 70px;
  background: var(--bg-cream);
  border: 4px solid var(--green-fern);
  border-radius: 50% 50% 45% 55% / 55% 45% 55% 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  position: relative;
  z-index: 2;
  box-shadow: var(--shadow-soft);
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: scale(1.1);
    border-color: var(--green-forest);
    box-shadow: var(--shadow-medium);
  }
  
  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    border: 2px solid var(--water-stream);
    border-radius: inherit;
    opacity: 0;
    animation: ${ripple} 2s ease-out infinite;
  }
  
  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    font-size: 1.5rem;
  }
`;

const ContentCard = styled.div`
  background: var(--bg-fog);
  padding: 1.75rem;
  border-radius: 30px 30px 30px 8px;
  box-shadow: var(--shadow-soft);
  max-width: 380px;
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }
  
  ${EventItem}:nth-child(even) & {
    border-radius: 30px 30px 8px 30px;
    margin-left: auto;
    
    @media (max-width: 768px) {
      margin-left: 0;
      border-radius: 30px 30px 30px 8px;
    }
  }
`;

const TimeDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--green-mint);
  color: var(--green-forest);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const EventTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.75rem;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
`;

const EventLocation = styled.p`
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${EventItem}:nth-child(even) & {
    justify-content: flex-end;
    
    @media (max-width: 768px) {
      justify-content: flex-start;
    }
  }
`;

const EventDescription = styled.p`
  font-size: 0.95rem;
  color: var(--text-medium);
  line-height: 1.7;
`;

const TimeSide = styled.div`
  font-family: var(--font-handwritten);
  font-size: 2.5rem;
  color: var(--green-sage);
  opacity: 0.5;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Der Tag';
  const events = timelineData.events || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultEvents = [
    { time: '14:00', title: 'Trauung', location: 'Waldkapelle', description: 'Die Zeremonie im Grünen unter alten Eichen.', icon: '💒' },
    { time: '15:30', title: 'Sektempfang', location: 'Lichtung', description: 'Stoßt mit uns auf die Liebe an!', icon: '🥂' },
    { time: '17:00', title: 'Dinner', location: 'Scheune', description: 'Ein festliches Menü mit regionalen Köstlichkeiten.', icon: '🍽️' },
    { time: '20:00', title: 'Tanz', location: 'Festsaal', description: 'Lasst uns gemeinsam tanzen und feiern!', icon: '💃' },
    { time: '23:00', title: 'Mitternachtssnack', location: 'Garten', description: 'Kleine Stärkung unter den Sternen.', icon: '🌙' },
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
      {/* Background decorations */}
      <BackgroundLeaf $size="200px" $color="var(--green-mint)" $opacity={0.1} style={{ top: '10%', left: '-5%' }} />
      <BackgroundLeaf $size="150px" $color="var(--green-sage)" $opacity={0.08} style={{ bottom: '20%', right: '-3%' }} $duration="15s" />
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>🌿 Der Ablauf</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <RiverContainer>
          <River />
          <Events>
            {items.map((item, index) => (
              <EventItem key={index} $index={index} $visible={visible}>
                <ContentCard className="content">
                  <TimeDisplay>
                    <span>⏰</span>
                    {item.time}
                  </TimeDisplay>
                  <EventTitle>{item.title}</EventTitle>
                  {item.location && <EventLocation>📍 {item.location}</EventLocation>}
                  {item.description && <EventDescription>{item.description}</EventDescription>}
                </ContentCard>
                
                <Stone className="stone">
                  {item.icon || '🌸'}
                </Stone>
                
                <TimeSide className="time-side">
                  {item.time}
                </TimeSide>
              </EventItem>
            ))}
          </Events>
        </RiverContainer>
      </Container>
    </Section>
  );
}

export default Timeline;
