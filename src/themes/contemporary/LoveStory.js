import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--white);
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  gap: 2rem;
`;

const TitleGroup = styled.div``;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '-20px'});
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease 0.1s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const cardColors = [
  { bg: 'var(--coral)', text: 'var(--white)' },
  { bg: 'var(--electric)', text: 'var(--black)' },
  { bg: 'var(--yellow)', text: 'var(--black)' },
  { bg: 'var(--purple)', text: 'var(--white)' },
];

const Card = styled.div`
  background: ${p => cardColors[p.$index % cardColors.length].bg};
  padding: 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  min-height: 280px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'}) rotate(${p => p.$visible ? 0 : (p.$index % 2 === 0 ? -3 : 3)}deg);
  transition: all 0.6s ease ${p => 0.2 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateY(-8px) rotate(0deg);
    box-shadow: var(--shadow-xl);
  }
`;

const Year = styled.div`
  font-size: 5rem;
  font-weight: 700;
  color: rgba(0,0,0,0.1);
  line-height: 1;
  margin-bottom: auto;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${p => cardColors[p.$index % cardColors.length].text};
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const CardText = styled.p`
  font-size: 0.9rem;
  color: ${p => cardColors[p.$index % cardColors.length].text};
  opacity: 0.9;
  line-height: 1.6;
  margin: 0;
`;

const CardEmoji = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
`;

function LoveStory({ content = {} }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const title = content.title || 'How we got here';
  const events = content.events || [];

  const defaultMilestones = [
    { year: "'20", date: '2020', title: 'First Match', text: 'Ein Swipe nach rechts und alles begann...', emoji: '📱' },
    { year: "'21", date: '2021', title: 'First Date', text: 'Coffee turned into dinner turned into forever.', emoji: '☕' },
    { year: "'22", date: '2022', title: 'Adventures', text: 'Bali, Paris, Tokyo – die Welt gemeinsam erkunden.', emoji: '✈️' },
    { year: "'24", date: '2024', title: 'The Question', text: 'Er fragte, sie sagte JA!', emoji: '💍' },
  ];

  // Map content.events to our format if they exist
  const items = events.length > 0 
    ? events.map(e => ({
        year: e.year || `'${(e.date || '').slice(-2)}`,
        title: e.title,
        text: e.text || e.description,
        emoji: e.emoji || e.icon || '💕'
      }))
    : defaultMilestones;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="story">
      <Container>
        <Header>
          <TitleGroup>
            <Eyebrow $visible={visible}>💕 Unsere Geschichte</Eyebrow>
            <Title $visible={visible}>{title}</Title>
          </TitleGroup>
        </Header>
        
        <Grid>
          {items.map((item, i) => (
            <Card key={i} $index={i} $visible={visible}>
              <CardEmoji>{item.emoji}</CardEmoji>
              <Year>{item.year}</Year>
              <CardContent>
                <CardTitle $index={i}>{item.title}</CardTitle>
                <CardText $index={i}>{item.text}</CardText>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default LoveStory;
