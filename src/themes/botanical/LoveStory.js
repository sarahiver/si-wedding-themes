// Botanical LoveStory - Content split between holes
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
  justify-content: ${p => p.$justify || 'center'};
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
  gap: 1rem;
  width: 100%;
  max-height: 80%;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: var(--pale); }
`;

const Event = styled.div`
  text-align: ${p => p.$align || 'left'};
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--off-white);
  
  &:last-child { border-bottom: none; }
`;

const EventYear = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: var(--light);
  margin-bottom: 0.2rem;
`;

const EventTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--black);
  margin-bottom: 0.2rem;
`;

const EventText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--medium);
  line-height: 1.5;
`;

function LoveStory() {
  const { content } = useWedding();
  const { mainHole, secondaryHoles } = useKnotholes();
  const lovestoryData = content?.lovestory || {};
  
  const title = lovestoryData.title || 'Unsere Geschichte';
  const events = lovestoryData.events || [];

  const defaultEvents = [
    { date: '2019', title: 'Das erste Treffen', description: 'Bei Freunden lernten wir uns kennen.' },
    { date: '2020', title: 'Das erste Date', description: 'Ein Spaziergang, der nie enden sollte.' },
    { date: '2022', title: 'Zusammengezogen', description: 'Endlich unter einem Dach.' },
    { date: '2024', title: 'Der Antrag', description: 'Unter dem Sternenhimmel.' },
  ];

  const items = events.length > 0 ? events : defaultEvents;
  
  // Split events between holes if we have secondary hole
  const hasSecondary = secondaryHoles.length > 0;
  const midPoint = Math.ceil(items.length / 2);
  const firstHalf = hasSecondary ? items.slice(0, midPoint) : items;
  const secondHalf = hasSecondary ? items.slice(midPoint) : [];

  return (
    <Section data-section="story">
      {/* Main hole: Title + first events */}
      <HoleContent $hole={mainHole} $justify="flex-start">
        <Eyebrow>Wie alles begann</Eyebrow>
        <Title>{title}</Title>
        <EventsList>
          {firstHalf.map((item, i) => (
            <Event key={i}>
              <EventYear>{item.date}</EventYear>
              <EventTitle>{item.title}</EventTitle>
              <EventText>{item.description}</EventText>
            </Event>
          ))}
        </EventsList>
      </HoleContent>
      
      {/* Secondary hole: remaining events */}
      {secondaryHoles[0] && secondHalf.length > 0 && (
        <HoleContent $hole={secondaryHoles[0]} $justify="flex-start">
          <EventsList>
            {secondHalf.map((item, i) => (
              <Event key={i} $align="left">
                <EventYear>{item.date}</EventYear>
                <EventTitle>{item.title}</EventTitle>
                <EventText>{item.description}</EventText>
              </Event>
            ))}
          </EventsList>
        </HoleContent>
      )}
    </Section>
  );
}

export default LoveStory;
