// StoryContent - Love Story timeline
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../../context/WeddingContext';

const Wrapper = styled.div``;

const Eyebrow = styled.p`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--black);
  margin-bottom: 1rem;
  text-align: center;
`;

const Events = styled.div`
  text-align: left;
`;

const Event = styled.div`
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--off-white);
  &:last-child { border-bottom: none; }
`;

const Year = styled.p`
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--light);
`;

const EventTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 500;
  color: var(--black);
`;

const Desc = styled.p`
  font-size: 0.8rem;
  color: var(--medium);
`;

function StoryContent() {
  const { content } = useWedding();
  const data = content?.lovestory || {};
  
  const title = data.title || 'Unsere Geschichte';
  const events = data.events?.length > 0 ? data.events : [
    { date: '2019', title: 'Das erste Treffen', description: 'Bei gemeinsamen Freunden' },
    { date: '2021', title: 'Zusammengezogen', description: 'Endlich unter einem Dach' },
    { date: '2024', title: 'Der Antrag', description: 'Sie hat Ja gesagt!' },
  ];

  return (
    <Wrapper>
      <Eyebrow>Wie alles begann</Eyebrow>
      <Title>{title}</Title>
      <Events>
        {events.map((e, i) => (
          <Event key={i}>
            <Year>{e.date}</Year>
            <EventTitle>{e.title}</EventTitle>
            {e.description && <Desc>{e.description}</Desc>}
          </Event>
        ))}
      </Events>
    </Wrapper>
  );
}

export default StoryContent;
