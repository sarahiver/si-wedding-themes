// src/components/Timeline.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #1A1A1A;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.3);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #FFFFFF;

  span {
    font-style: italic;
  }
`;

const TimelineWrapper = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, #B8976A 10%, #B8976A 90%, transparent);
    transform: translateX(-50%);

    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 40px;
  align-items: center;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease ${p => 0.1 + p.$index * 0.1}s;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr;
    gap: 25px;
  }
`;

const TimeContent = styled.div`
  text-align: ${p => p.$align || 'right'};

  @media (max-width: 768px) {
    text-align: left;
    order: 2;
  }
`;

const Time = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2rem;
  font-weight: 300;
  color: #B8976A;
  margin-bottom: 10px;
`;

const EventTitle = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #FFFFFF;
  margin-bottom: 10px;
`;

const EventDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
`;

const TimelineDot = styled.div`
  width: 16px;
  height: 16px;
  background: #1A1A1A;
  border: 2px solid #B8976A;
  border-radius: 50%;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    order: 1;
  }
`;

const Placeholder = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

function Timeline() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const events = [
    {
      time: '14:00',
      title: 'Trauung',
      description: 'Die standesamtliche Trauung findet in der historischen Villa am See statt.'
    },
    {
      time: '15:30',
      title: 'Sektempfang',
      description: 'Genießt kühlen Champagner und kleine Häppchen im wunderschönen Garten.'
    },
    {
      time: '17:00',
      title: 'Gruppenfoto',
      description: 'Wir bitten alle Gäste für ein gemeinsames Foto vor der Location.'
    },
    {
      time: '18:30',
      title: 'Dinner',
      description: 'Ein 4-Gänge-Menü erwartet euch im festlich geschmückten Saal.'
    },
    {
      time: '21:00',
      title: 'Eröffnungstanz',
      description: 'Seid dabei, wenn wir unseren ersten Tanz als Ehepaar wagen.'
    },
    {
      time: '22:00',
      title: 'Party',
      description: 'Die Tanzfläche ist eröffnet! Feiert mit uns bis in die frühen Morgenstunden.'
    }
  ];

  return (
    <Section ref={sectionRef} id="timeline">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Der Tag</Eyebrow>
          <Title>Unser <span>Tagesablauf</span></Title>
        </Header>

        <TimelineWrapper>
          {events.map((event, index) => (
            <TimelineItem key={index} $visible={isVisible} $index={index}>
              {index % 2 === 0 ? (
                <>
                  <TimeContent $align="right">
                    <Time>{event.time}</Time>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDescription>{event.description}</EventDescription>
                  </TimeContent>
                  <TimelineDot />
                  <Placeholder />
                </>
              ) : (
                <>
                  <Placeholder />
                  <TimelineDot />
                  <TimeContent $align="left">
                    <Time>{event.time}</Time>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDescription>{event.description}</EventDescription>
                  </TimeContent>
                </>
              )}
            </TimelineItem>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default Timeline;
