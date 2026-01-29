// Botanical Tree LoveStory
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Event = styled.div`
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--off-white);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const EventYear = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--light);
  margin-bottom: 0.3rem;
`;

const EventTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 0.3rem;
`;

const EventText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--medium);
  line-height: 1.6;
`;

function LoveStory({ side = 'left' }) {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  
  const title = lovestoryData.title || 'Unsere Geschichte';
  const events = lovestoryData.events || [];

  const defaultEvents = [
    { date: '2019', title: 'Das erste Treffen', description: 'Bei gemeinsamen Freunden lernten wir uns kennen.' },
    { date: '2020', title: 'Das erste Date', description: 'Ein Spaziergang, der nie enden sollte.' },
    { date: '2022', title: 'Zusammengezogen', description: 'Endlich unter einem Dach vereint.' },
    { date: '2024', title: 'Der Antrag', description: 'Unter dem Sternenhimmel sagte sie Ja.' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  return (
    <ContentBranch side={side} eyebrow="Wie alles begann" title={title}>
      <EventsList>
        {items.map((item, i) => (
          <Event key={i}>
            <EventYear>{item.date}</EventYear>
            <EventTitle>{item.title}</EventTitle>
            <EventText>{item.description}</EventText>
          </Event>
        ))}
      </EventsList>
    </ContentBranch>
  );
}

export default LoveStory;
