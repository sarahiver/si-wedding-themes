import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 700px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0;
`;

const Item = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--zen-line-light);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay}s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Letter = styled.span`
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 300;
  color: var(--zen-text-muted);
  min-width: 40px;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 400;
  color: var(--zen-text);
  margin-bottom: 0.25rem;
`;

const ItemText = styled.p`
  font-size: 0.85rem;
  color: var(--zen-text-light);
  margin: 0;
`;

function WeddingABC() {
  const { content } = useWedding();
  const data = content?.weddingabc || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Hochzeits-ABC';
  const items = data.items || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <Section id="weddingabc" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Grid>
          {items.map((item, i) => (
            <Item key={i} className={visible ? 'visible' : ''} $delay={0.03 * i}>
              <Letter>{item.letter}</Letter>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemText>{item.text}</ItemText>
              </ItemContent>
            </Item>
          ))}
        </Grid>
      </Content>
    </Section>
  );
}

export default WeddingABC;
