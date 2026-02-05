// Luxe Timeline - Elegant Vertical
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const expandHeight = keyframes`from { height: 0; } to { height: 100%; }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-cream); color: var(--luxe-anthracite);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-anthracite); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const TimelineWrapper = styled.div`position: relative; padding-left: 4rem; @media (max-width: 600px) { padding-left: 2.5rem; }
  &::before { content: ''; position: absolute; left: 0; top: 0; width: 1px; background: var(--luxe-gold); height: ${p => p.$visible ? '100%' : '0'}; transition: height 1.5s var(--ease-out-expo); }
`;

const TimelineItem = styled.div`position: relative; padding-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s;
  &:last-child { padding-bottom: 0; }
  &::before { content: ''; position: absolute; left: -4rem; top: 0.5rem; width: 7px; height: 7px; background: var(--luxe-cream); border: 1px solid var(--luxe-gold); border-radius: 50%; @media (max-width: 600px) { left: -2.5rem; } }
`;

const Time = styled.span`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase; color: var(--luxe-gold); display: block; margin-bottom: 0.75rem;`;
const ItemTitle = styled.h3`font-family: var(--font-display); font-size: 1.5rem; font-weight: 400; font-style: italic; color: var(--luxe-anthracite); margin-bottom: 0.5rem;`;
const ItemDesc = styled.p`font-family: var(--font-body); font-size: 0.9rem; font-weight: 300; line-height: 1.7; color: var(--luxe-graphite);`;

function Timeline() {
  const { content } = useWedding();
  const data = content?.timeline || {};
  const title = data.title || 'Tagesablauf';

  // FIX: Content uses 'events' key, not 'items'
  const defaultEvents = [
    { time: '14:00', title: 'Empfang', description: 'Willkommensgetraenke im Garten' },
    { time: '15:00', title: 'Zeremonie', description: 'Die Trauung in der Kapelle' },
    { time: '16:30', title: 'Aperitif', description: 'Haeppchen und Champagner' },
    { time: '18:00', title: 'Dinner', description: 'Festliches Abendessen' },
    { time: '21:00', title: 'Party', description: 'Musik und Tanz' }
  ];
  const items = Array.isArray(data.events) && data.events.length > 0 ? data.events : defaultEvents;
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="timeline">
      <Container>
        <Header><Eyebrow $visible={visible}>Der Tag</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <TimelineWrapper $visible={visible}>
          {items.map((item, i) => (
            <TimelineItem key={i} $visible={visible} $index={i}>
              <Time>{item.time} Uhr</Time>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDesc>{item.description}</ItemDesc>
            </TimelineItem>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default Timeline;
