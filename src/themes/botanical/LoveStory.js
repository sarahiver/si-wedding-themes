// Botanical LoveStory - Clean vertical timeline
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--forest-deep);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 600px;
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
  color: var(--forest-mist);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--cream);
`;

const Timeline = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--forest-light);
    
    @media (min-width: 600px) {
      left: 50%;
    }
  }
`;

const Event = styled.div`
  position: relative;
  padding-left: 2rem;
  padding-bottom: 2.5rem;
  
  @media (min-width: 600px) {
    width: 50%;
    padding-left: 0;
    padding-right: 2.5rem;
    text-align: right;
    
    &:nth-child(even) {
      margin-left: 50%;
      padding-left: 2.5rem;
      padding-right: 0;
      text-align: left;
    }
  }
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 0.5rem;
    width: 9px;
    height: 9px;
    background: var(--gold);
    border-radius: 50%;
    
    @media (min-width: 600px) {
      left: auto;
      right: -4.5px;
      
      &:nth-child(even) {
        left: -4.5px;
        right: auto;
      }
    }
  }
  
  &:nth-child(even)::before {
    @media (min-width: 600px) {
      left: -4.5px;
      right: auto;
    }
  }
`;

const EventYear = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--gold-light);
  margin-bottom: 0.5rem;
`;

const EventTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--cream);
  margin-bottom: 0.5rem;
`;

const EventText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--forest-mist);
  line-height: 1.6;
`;

function LoveStory() {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  
  const title = lovestoryData.title || 'Unsere Geschichte';
  const events = lovestoryData.events || [];

  const defaultEvents = [
    { date: '2019', title: 'Das erste Treffen', description: 'Bei Freunden lernten wir uns kennen. Ein Blick genügte.' },
    { date: '2020', title: 'Das erste Date', description: 'Ein Spaziergang, der nie enden sollte.' },
    { date: '2022', title: 'Zusammengezogen', description: 'Endlich unter einem Dach.' },
    { date: '2024', title: 'Der Antrag', description: 'Unter dem Sternenhimmel sagte sie Ja.' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  return (
    <Section id="story" data-section="story">
      <Content>
        <Header>
          <Eyebrow>Wie alles begann</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Timeline>
          {items.map((item, index) => (
            <Event key={index}>
              <EventYear>{item.date}</EventYear>
              <EventTitle>{item.title}</EventTitle>
              <EventText>{item.description}</EventText>
            </Event>
          ))}
        </Timeline>
      </Content>
    </Section>
  );
}

export default LoveStory;
