// Botanical Timeline - Garden Party Schedule
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(3deg); }`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--botanical-cream);
  position: relative;
  overflow: hidden;
`;

const BgPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q40 15 35 30 Q30 40 25 30 Q20 15 30 5' fill='%234A5D41'/%3E%3C/svg%3E");
  background-size: 60px 60px;
`;

const Container = styled.div`max-width: 800px; margin: 0 auto; position: relative; z-index: 1;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const TimelineGrid = styled.div`display: flex; flex-direction: column; gap: 1rem;`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 1.5rem;
  align-items: start;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.1}s;
  
  @media (max-width: 500px) {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
`;

const TimeBox = styled.div`
  background: linear-gradient(135deg, var(--botanical-sage), var(--botanical-olive));
  border-radius: 15px;
  padding: 1rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '🌿';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.25rem;
    animation: ${float} 3s ease-in-out infinite;
    animation-delay: ${p => p.$index * 0.3}s;
  }
`;

const Time = styled.span`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  display: block;
`;

const TimeLabel = styled.span`
  font-family: var(--font-body);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.8);
`;

const Content = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 15px rgba(107, 127, 94, 0.1);
  border-left: 4px solid var(--botanical-mint);
`;

const ItemTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  color: var(--botanical-forest);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemIcon = styled.span`font-size: 1.25rem;`;

const ItemDesc = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--botanical-brown);
  line-height: 1.6;
`;

function Timeline() {
  const { content } = useWedding();
  const data = content?.timeline || {};
  const title = data.title || 'Der grosse Tag';
  const items = data.items || [
    { time: '14:00', title: 'Empfang', description: 'Willkommensgetraenke im Garten', icon: '🥂' },
    { time: '15:00', title: 'Trauung', description: 'Die Zeremonie unter freiem Himmel', icon: '💒' },
    { time: '16:30', title: 'Aperitif', description: 'Haeppchen und Cocktails', icon: '🍸' },
    { time: '18:00', title: 'Dinner', description: 'Festliches Abendessen im Pavillon', icon: '🍽️' },
    { time: '21:00', title: 'Party', description: 'Tanzen unter den Sternen', icon: '💃' }
  ];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="timeline">
      <BgPattern />
      <Container>
        <Header>
          <Eyebrow $visible={visible}><span>🌸</span> Ablauf <span>🌸</span></Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        <TimelineGrid>
          {items.map((item, i) => (
            <TimelineItem key={i} $visible={visible} $index={i}>
              <TimeBox $index={i}>
                <Time>{item.time}</Time>
                <TimeLabel>Uhr</TimeLabel>
              </TimeBox>
              <Content>
                <ItemTitle><ItemIcon>{item.icon}</ItemIcon>{item.title}</ItemTitle>
                <ItemDesc>{item.description}</ItemDesc>
              </Content>
            </TimelineItem>
          ))}
        </TimelineGrid>
      </Container>
    </Section>
  );
}

export default Timeline;
