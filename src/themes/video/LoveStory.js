import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 700px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Timeline = styled.div`display: flex; flex-direction: column; gap: 2.5rem; text-align: left;`;

const Item = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.15}s;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const Year = styled.span`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--video-accent);
  line-height: 1.2;
  min-width: 100px;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 1.15rem;
    min-width: unset;
  }
`;

const ItemContent = styled.div`padding-top: 0.25rem;`;
const ItemTitle = styled.h3`font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--video-white); margin-bottom: 0.5rem;`;
const ItemText = styled.p`font-family: var(--font-primary); font-size: 0.9rem; font-weight: 400; color: var(--video-silver); line-height: 1.7;`;

const ItemImage = styled.div`
  margin-top: 1rem;
  width: 100%;
  max-width: 280px;
  aspect-ratio: 4/3;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    opacity: 0.85;
    transition: all 0.5s ease;
  }

  &:hover img {
    filter: grayscale(50%);
    opacity: 1;
    transform: scale(1.02);
  }
`;

function LoveStory() {
  const { content } = useWedding();
  const data = content?.lovestory || {};
  const title = data.title || 'Unsere Geschichte';
  const defaultEvents = [
    { date: '2019', title: 'Der erste Blick', description: 'Bei einem gemeinsamen Abend trafen sich unsere Blicke zum ersten Mal.' },
    { date: '2020', title: 'Das erste Date', description: 'Ein Spaziergang, der alles veraenderte.' },
    { date: '2024', title: 'Die Frage', description: 'Unter dem Sternenhimmel stellte er die wichtigste Frage.' }
  ];
  const items = data.events?.length > 0 ? data.events : defaultEvents;
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="story">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Unsere Reise</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Timeline>
          {items.map((item, i) => (
            <Item key={i} $visible={visible} $index={i}>
              <Year>{item.date || item.year}</Year>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemText>{item.description || item.text}</ItemText>
                {item.image && (
                  <ItemImage>
                    <img src={item.image} alt={item.title} />
                  </ItemImage>
                )}
              </ItemContent>
            </Item>
          ))}
        </Timeline>
      </Content>
    </SectionWrapper>
  );
}

export default LoveStory;
