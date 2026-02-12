import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: var(--classic-cream);`;
const Container = styled.div`max-width: 900px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;`;
const Card = styled.div`padding: 1.5rem; background: var(--classic-white); box-shadow: 0 2px 10px rgba(0,0,0,0.03); opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.5s ease forwards; animation-delay: ${p.$delay};`}`;
const Letter = styled.span`font-family: var(--font-display); font-size: 2rem; font-weight: 300; color: var(--classic-gold); display: block; margin-bottom: 0.25rem;`;
const Word = styled.h3`font-family: var(--font-display); font-size: 1.2rem; font-weight: 400; margin-bottom: 0.5rem;`;
const Meaning = styled.p`font-size: 0.8rem; font-weight: 300; color: var(--classic-text-light); line-height: 1.7;`;

const DEFAULT_ABC = [
  { letter: 'A', word: 'Anfang', meaning: 'Jede große Liebe hat einen Anfang – unserer begann mit einem Lächeln.' },
  { letter: 'B', word: 'Brautstrauß', meaning: 'Wer fängt ihn? Die Spannung steigt!' },
  { letter: 'D', word: 'Danke', meaning: 'Dass ihr diesen Tag mit uns feiert.' },
  { letter: 'F', word: 'Feiern', meaning: 'Bis die Schuhe drücken und die Füße glühen!' },
  { letter: 'H', word: 'Hochzeit', meaning: 'Der schönste Tag unseres Lebens – mit euch.' },
  { letter: 'L', word: 'Liebe', meaning: 'Die Basis von allem. ❤️' },
];

function WeddingABC() {
  const { content } = useWedding();
  const abc = content?.weddingabc || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const title = abc.title || 'Hochzeits-ABC';
  const items = abc.items?.length ? abc.items : DEFAULT_ABC;
  return (
    <Section id="weddingabc" ref={ref}>
      <Container>
        <Header><Eyebrow $v={visible}>Von A bis Z</Eyebrow><Title $v={visible}>{title}</Title></Header>
        <Grid>{items.map((item, i) => (
          <Card key={i} $v={visible} $delay={`${0.2 + i * 0.06}s`}>
            <Letter>{item.letter || item.buchstabe}</Letter>
            <Word>{item.word || item.wort}</Word>
            <Meaning>{item.meaning || item.bedeutung}</Meaning>
          </Card>
        ))}</Grid>
      </Container>
    </Section>
  );
}
export default WeddingABC;
