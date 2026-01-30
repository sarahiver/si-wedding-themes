import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 1.5rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: var(--zen-text-light);
  line-height: 1.8;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.1s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Colors = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.2s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const ColorSwatch = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 1px solid var(--zen-line);
`;

function Dresscode() {
  const { content } = useWedding();
  const data = content?.dresscode || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Dresscode';
  const description = data.description || 'Festlich elegant in gedeckten Farben.';
  const colors = data.colors || ['#2d2a26', '#6d6860', '#a09890', '#d4cfc7', '#f5f4f0'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="dresscode" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Description className={visible ? 'visible' : ''}>{description}</Description>
        {colors?.length > 0 && (
          <Colors className={visible ? 'visible' : ''}>
            {colors.map((color, i) => <ColorSwatch key={i} $color={color} />)}
          </Colors>
        )}
      </Content>
    </Section>
  );
}

export default Dresscode;
