import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg-alt);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 2rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Text = styled.div`
  font-size: 0.95rem;
  color: var(--zen-text-light);
  line-height: 1.8;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.1s;
  &.visible { opacity: 1; transform: translateY(0); }
  p { margin-bottom: 1rem; }
`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Anfahrt';
  const text = data.text || 'Weitere Informationen zur Anfahrt folgen.';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="directions" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Text className={visible ? 'visible' : ''} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
      </Content>
    </Section>
  );
}

export default Directions;
