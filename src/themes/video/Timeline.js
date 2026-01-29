// Video Theme - Timeline Section
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 600px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Schedule = styled.div`display: flex; flex-direction: column; gap: 1.5rem;`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1.5rem;
  align-items: center;
  text-align: left;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.1}s;
`;

const Time = styled.span`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--video-accent);
`;

const ItemContent = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const ItemTitle = styled.h3`font-family: var(--font-display); font-size: 1rem; font-weight: 600; color: var(--video-white); margin-bottom: 0.25rem;`;
const ItemDesc = styled.p`font-family: var(--font-primary); font-size: 0.85rem; color: var(--video-gray);`;

function Timeline() {
  const { content } = useWedding();
  const data = content?.timeline || {};
  const title = data.title || 'Tagesablauf';
  const items = data.items || [
    { time: '14:00', title: 'Empfang', description: 'Willkommensgetraenke' },
    { time: '15:00', title: 'Zeremonie', description: 'Die Trauung' },
    { time: '17:00', title: 'Dinner', description: 'Festliches Abendessen' },
    { time: '21:00', title: 'Party', description: 'Musik & Tanz' }
  ];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Der Tag</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Schedule>
          {items.map((item, i) => (
            <Item key={i} $visible={visible} $index={i}>
              <Time>{item.time}</Time>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDesc>{item.description}</ItemDesc>
              </ItemContent>
            </Item>
          ))}
        </Schedule>
      </Content>
    </SectionWrapper>
  );
}

export default Timeline;
