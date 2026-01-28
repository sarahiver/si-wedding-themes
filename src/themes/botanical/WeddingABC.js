import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
  text-align: center;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Entry = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--sage-light);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.5s ease;
  transition-delay: ${p => p.$index * 0.05}s;
`;

const Letter = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-style: italic;
  color: var(--sage);
  margin-bottom: 0.5rem;
`;

const Word = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const Definition = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.6;
`;

function WeddingABC() {
  const { content } = useWedding();
  const weddingabcData = content?.weddingabc || {};
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const title = weddingabcData.title || 'Das Hochzeits-ABC';
  const entries = weddingabcData.entries || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Title>{title}</Title>
        
        <Grid>
          {entries.map((entry, i) => (
            <Entry key={i} $visible={visible} $index={i}>
              <Letter>{entry.letter}</Letter>
              <Word>{entry.word}</Word>
              <Definition>{entry.definition}</Definition>
            </Entry>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
