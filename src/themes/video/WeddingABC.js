import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 900px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; text-align: left;`;
const Card = styled.div`padding: 1.25rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.05}s; transition: border-color 0.3s ease; &:hover { border-color: var(--video-accent); }`;
const Letter = styled.span`font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--video-accent); display: block; margin-bottom: 0.5rem;`;
const CardTitle = styled.h3`font-family: var(--font-primary); font-size: 0.85rem; font-weight: 600; color: var(--video-white); margin-bottom: 0.35rem;`;
const CardText = styled.p`font-family: var(--font-primary); font-size: 0.8rem; color: var(--video-gray); line-height: 1.5;`;

function WeddingABC() {
  const { content } = useWedding();
  const data = content?.weddingabc || {};
  const title = data.title || 'Hochzeits-ABC';
  const entries = data.entries || [];

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Keine Default-Einträge - zeige nichts wenn keine Einträge angelegt
  if (entries.length === 0) return null;

  return (
    <SectionWrapper id="abc">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Alles Wissenswerte</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Grid>
          {entries.map((entry, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Letter>{entry.letter}</Letter>
              <CardTitle>{entry.word}</CardTitle>
              <CardText>{entry.description}</CardText>
            </Card>
          ))}
        </Grid>
      </Content>
    </SectionWrapper>
  );
}

export default WeddingABC;
