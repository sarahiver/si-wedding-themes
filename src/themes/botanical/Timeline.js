// Botanical Tree Timeline
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Event = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--off-white);
  
  &:last-child { border-bottom: none; }
`;

const Time = styled.div`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--black);
  min-width: 55px;
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
  font-size: 0.75rem;
  color: var(--light);
`;

const EventDescription = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--medium);
  margin-top: 0.25rem;
`;

function Timeline({ side = 'right' }) {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Der Ablauf';
  const events = timelineData.events || [];

  const defaultEvents = [
    { time: '14:00', title: 'Trauung', location: 'Standesamt', description: '' },
    { time: '15:30', title: 'Sektempfang', location: 'Terrasse', description: 'Stoßt mit uns an!' },
    { time: '17:00', title: 'Gruppenfotos', location: 'Garten', description: '' },
    { time: '18:30', title: 'Dinner', location: 'Festsaal', description: 'Festliches Abendessen' },
    { time: '21:00', title: 'Eröffnungstanz', location: 'Tanzfläche', description: '' },
    { time: '22:00', title: 'Party', location: 'Festsaal', description: '' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  return (
    <ContentBranch side={side} eyebrow="Der Tag" title={title}>
      <EventsList>
        {items.map((item, i) => (
          <Event key={i}>
            <Time>{item.time}</Time>
            <EventContent>
              <EventTitle>{item.title}</EventTitle>
              {item.location && <EventLocation>{item.location}</EventLocation>}
              {item.description && <EventDescription>{item.description}</EventDescription>}
            </EventContent>
          </Event>
        ))}
      </EventsList>
    </ContentBranch>
  );
}

export default Timeline;
