import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--gray-100);
  position: relative;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const TimelineWrapper = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    background: repeating-linear-gradient(
      to bottom,
      var(--black) 0px,
      var(--black) 10px,
      transparent 10px,
      transparent 20px
    );
    transform: translateX(-50%);
    
    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  
  &:nth-child(odd) {
    flex-direction: row;
    
    .content { margin-left: auto; padding-left: 4rem; }
    .time { text-align: right; padding-right: 4rem; }
  }
  
  &:nth-child(even) {
    flex-direction: row-reverse;
    
    .content { margin-right: auto; padding-right: 4rem; }
    .time { text-align: left; padding-left: 4rem; }
  }
  
  @media (max-width: 768px) {
    flex-direction: row !important;
    
    .content { margin-left: auto !important; padding-left: 4rem !important; padding-right: 0 !important; }
    .time { display: none; }
  }
`;

const TimelineTime = styled.div`
  width: 45%;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-400);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : (p.$side === 'left' ? '-30px' : '30px')});
  transition: all 0.6s ease ${p => 0.2 + p.$index * 0.1}s;
`;

const TimelineDot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  background: ${p => p.$highlighted ? 'var(--coral)' : 'var(--white)'};
  border: 4px solid var(--black);
  z-index: 1;
  
  @media (max-width: 768px) {
    left: 20px;
  }
`;

const TimelineContent = styled.div`
  width: 45%;
  background: var(--white);
  padding: 1.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : (p.$side === 'left' ? '30px' : '-30px')});
  transition: all 0.6s ease ${p => 0.2 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
  
  @media (max-width: 768px) {
    width: calc(100% - 60px);
  }
`;

const EventTime = styled.div`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white);
  background: ${p => p.$color || 'var(--coral)'};
  padding: 0.25rem 0.75rem;
  margin-bottom: 0.75rem;
  border: 2px solid var(--black);
`;

const EventTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const EventDesc = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

function Timeline({ events = [] }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultEvents = [
    { time: '14:00', title: 'Zeremonie', desc: 'Die Trauung beginnt in der Kapelle', highlighted: true },
    { time: '15:30', title: 'Empfang', desc: 'Sektempfang auf der Terrasse' },
    { time: '17:00', title: 'Dinner', desc: '3-Gänge-Menü im Festsaal' },
    { time: '20:00', title: 'Party', desc: 'DJ & Tanzfläche bis Mitternacht' },
    { time: '21:00', title: 'First Dance', desc: 'Unser erster Tanz als Ehepaar', highlighted: true },
    { time: '00:00', title: 'Mitternachtssnack', desc: 'Burger & Pommes für alle' },
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
      <Container>
        <Header>
          <Eyebrow $visible={visible}>📅 Tagesablauf</Eyebrow>
          <Title $visible={visible}>Schedule</Title>
        </Header>
        
        <TimelineWrapper>
          {items.map((event, i) => (
            <TimelineItem key={i}>
              <TimelineTime className="time" $visible={visible} $index={i} $side={i % 2 === 0 ? 'left' : 'right'}>
                {event.time}
              </TimelineTime>
              <TimelineDot $highlighted={event.highlighted} />
              <TimelineContent className="content" $visible={visible} $index={i} $side={i % 2 === 0 ? 'right' : 'left'}>
                <EventTime $color={colors[i % colors.length]}>{event.time}</EventTime>
                <EventTitle>{event.title}</EventTitle>
                <EventDesc>{event.desc}</EventDesc>
              </TimelineContent>
            </TimelineItem>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default Timeline;
