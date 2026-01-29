import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`0%, 100% { transform: translateY(0) rotate(var(--rotation)); } 50% { transform: translateY(-5px) rotate(calc(var(--rotation) + 2deg)); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-paper);`;
const Container = styled.div`max-width: 1100px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;`;
const Card = styled.div`
  --rotation: ${p => p.$rotation}deg;
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(107, 127, 94, 0.1);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.05}s;
  transition: transform 0.3s ease;
  
  &:hover { transform: translateY(-5px) rotate(0deg); }
`;
const Letter = styled.span`font-family: var(--font-handwritten); font-size: 3rem; font-weight: 700; color: var(--botanical-sage); display: block; margin-bottom: 0.5rem;`;
const CardTitle = styled.h3`font-family: var(--font-handwritten); font-size: 1.25rem; color: var(--botanical-forest); margin-bottom: 0.5rem;`;
const CardText = styled.p`font-family: var(--font-body); font-size: 0.85rem; line-height: 1.6; color: var(--botanical-brown);`;

function WeddingABC() {
  const { content } = useWedding();
  const data = content?.weddingabc || {};
  const title = data.title || 'Hochzeits-ABC';
  const entries = data.entries || [
    { letter: 'A', title: 'Anfahrt', text: 'Details unter "Anfahrt" 🗺️' },
    { letter: 'B', title: 'Blumen', text: 'Bitte keine Blumengeschenke 🌸' },
    { letter: 'D', title: 'Dresscode', text: 'Garden Party Chic 👗' },
    { letter: 'F', title: 'Fotos', text: 'Unplugged Ceremony - Handys weg! 📵' },
    { letter: 'K', title: 'Kinder', text: 'Herzlich willkommen! 👶' },
    { letter: 'P', title: 'Parken', text: 'Kostenlos vor Ort 🚗' }
  ];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const rotations = [-2, 1, -1, 2, -1.5, 1.5];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Header><Eyebrow $visible={visible}>📖 Alles Wissenswerte</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Grid>
          {entries.map((entry, i) => (
            <Card key={i} $visible={visible} $index={i} $rotation={rotations[i % rotations.length]}>
              <Letter>{entry.letter}</Letter>
              <CardTitle>🌿 {entry.title}</CardTitle>
              <CardText>{entry.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
