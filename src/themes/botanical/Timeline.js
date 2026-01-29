// Botanical Timeline - Schedule fits in holes
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 1.5rem 1rem;
  overflow: hidden;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 1rem;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-height: 75%;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: var(--pale); }
`;

const Event = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  text-align: left;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--off-white);
  
  &:last-child { border-bottom: none; }
`;

const Time = styled.div`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--black);
  min-width: 50px;
  flex-shrink: 0;
`;

const EventContent = styled.div`
  flex: 1;
`;

const EventTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 0.1rem;
`;

const EventLocation = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--light);
`;

// Small decorative content for secondary hole
const SmallContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--pale);
`;

function Timeline() {
  const { content } = useWedding();
  const { mainHole, secondaryHoles } = useKnotholes();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Der Tag';
  const events = timelineData.events || [];

  const defaultEvents = [
    { time: '14:00', title: 'Trauung', location: 'Standesamt' },
    { time: '15:30', title: 'Sektempfang', location: 'Terrasse' },
    { time: '17:00', title: 'Gruppenfotos', location: 'Garten' },
    { time: '18:30', title: 'Dinner', location: 'Festsaal' },
    { time: '21:00', title: 'Eröffnungstanz', location: 'Tanzfläche' },
    { time: '22:00', title: 'Party', location: 'Festsaal' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  return (
    <Section data-section="timeline">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Der Ablauf</Eyebrow>
        <Title>{title}</Title>
        <EventsList>
          {items.map((item, i) => (
            <Event key={i}>
              <Time>{item.time}</Time>
              <EventContent>
                <EventTitle>{item.title}</EventTitle>
                {item.location && <EventLocation>{item.location}</EventLocation>}
              </EventContent>
            </Event>
          ))}
        </EventsList>
      </HoleContent>
      
      {/* Small decorative element in secondary hole */}
      {secondaryHoles[0] && (
        <SmallContent $hole={secondaryHoles[0]}>
          ♡
        </SmallContent>
      )}
    </Section>
  );
}

export default Timeline;
