// Botanical Timeline - Clean day schedule
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream-dark);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 700px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--forest-deep);
`;

const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Event = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--cream);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Time = styled.div`
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--forest-deep);
  min-width: 80px;
`;

const EventContent = styled.div``;

const EventTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--forest-deep);
  margin-bottom: 0.25rem;
`;

const EventLocation = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--bark-light);
  margin-bottom: 0.5rem;
`;

const EventDescription = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--bark-medium);
  line-height: 1.6;
`;

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Der Tag';
  const events = timelineData.events || [];

  const defaultEvents = [
    { time: '14:00', title: 'Trauung', location: 'Waldkapelle', description: 'Die Zeremonie im Grünen.' },
    { time: '15:30', title: 'Sektempfang', location: 'Lichtung', description: 'Stoßt mit uns an!' },
    { time: '17:00', title: 'Dinner', location: 'Scheune', description: 'Ein festliches Menü.' },
    { time: '20:00', title: 'Tanz', location: 'Festsaal', description: 'Lasst uns feiern!' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  return (
    <Section id="timeline" data-section="timeline">
      <Content>
        <Header>
          <Eyebrow>Der Ablauf</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Events>
          {items.map((item, index) => (
            <Event key={index}>
              <Time>{item.time}</Time>
              <EventContent>
                <EventTitle>{item.title}</EventTitle>
                {item.location && <EventLocation>{item.location}</EventLocation>}
                {item.description && <EventDescription>{item.description}</EventDescription>}
              </EventContent>
            </Event>
          ))}
        </Events>
      </Content>
    </Section>
  );
}

export default Timeline;
