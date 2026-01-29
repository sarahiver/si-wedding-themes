// TimelineContent
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../../context/WeddingContext';

const Wrapper = styled.div``;
const Eyebrow = styled.p`font-size: 0.65rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--light); margin-bottom: 0.5rem; text-align: center;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: 1.8rem; font-weight: 300; color: var(--black); margin-bottom: 1rem; text-align: center;`;
const Events = styled.div`text-align: left; max-height: 250px; overflow-y: auto;`;
const Event = styled.div`display: flex; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px solid var(--off-white); &:last-child { border-bottom: none; }`;
const Time = styled.div`font-family: var(--font-serif); font-size: 1rem; color: var(--black); min-width: 50px;`;
const EventContent = styled.div`flex: 1;`;
const EventTitle = styled.h3`font-family: var(--font-serif); font-size: 0.95rem; font-weight: 500; color: var(--black);`;
const Location = styled.p`font-size: 0.75rem; color: var(--light);`;

function TimelineContent() {
  const { content } = useWedding();
  const data = content?.timeline || {};
  const title = data.title || 'Der Ablauf';
  const events = data.events?.length > 0 ? data.events : [
    { time: '14:00', title: 'Trauung', location: 'Standesamt' },
    { time: '15:30', title: 'Sektempfang', location: 'Terrasse' },
    { time: '18:00', title: 'Dinner', location: 'Festsaal' },
    { time: '21:00', title: 'Party', location: 'Tanzfläche' },
  ];

  return (
    <Wrapper>
      <Eyebrow>Der Tag</Eyebrow>
      <Title>{title}</Title>
      <Events>
        {events.map((e, i) => (
          <Event key={i}>
            <Time>{e.time}</Time>
            <EventContent>
              <EventTitle>{e.title}</EventTitle>
              {e.location && <Location>{e.location}</Location>}
            </EventContent>
          </Event>
        ))}
      </Events>
    </Wrapper>
  );
}

export default TimelineContent;
