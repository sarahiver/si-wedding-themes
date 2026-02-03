import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-charcoal);`;
const Container = styled.div`max-width: var(--container-max); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;`;
const Card = styled.div`padding: 2rem; background: var(--luxe-anthracite); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.05}s;`;
const Letter = styled.span`font-family: var(--font-display); font-size: 2.5rem; font-style: italic; color: var(--luxe-gold); display: block; margin-bottom: 0.5rem;`;
const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--luxe-cream); margin-bottom: 0.75rem;`;
const CardText = styled.p`font-family: var(--font-body); font-size: 0.85rem; line-height: 1.7; color: var(--luxe-pearl);`;

function WeddingABC() {
  const { content } = useWedding();
  const data = content?.weddingabc || {};
  const title = data.title || 'Hochzeits-ABC';
  const entries = data.entries || [];

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Keine Default-Einträge - zeige nichts wenn keine Einträge angelegt
  if (entries.length === 0) return null;

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Header><Eyebrow $visible={visible}>Alles Wissenswerte</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Grid>
          {entries.map((entry, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Letter>{entry.letter}</Letter>
              <CardTitle>{entry.word}</CardTitle>
              <CardText>{entry.description}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
