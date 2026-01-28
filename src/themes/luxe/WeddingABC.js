// Luxe WeddingABC
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-sand);`;
const Container = styled.div`max-width: var(--container-width); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 4rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;`;
const Card = styled.div`padding: 2rem; background: var(--luxe-white); opacity: 0; animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: ${p => 0.1 + p.$index * 0.08}s;`;
const Letter = styled.span`font-family: var(--font-serif); font-size: 2.5rem; font-style: italic; color: var(--luxe-gold); display: block; margin-bottom: 0.5rem;`;
const CardTitle = styled.h3`font-family: var(--font-serif); font-size: 1.1rem; color: var(--luxe-black); margin-bottom: 0.75rem;`;
const CardText = styled.p`font-family: var(--font-sans); font-size: 0.85rem; line-height: 1.7; color: var(--luxe-charcoal);`;

function WeddingABC() {
  const { content } = useWedding();
  const data = content?.weddingabc || {};
  const title = data.title || 'Hochzeits-ABC';
  const entries = data.entries || [
    { letter: 'A', title: 'Anfahrt', text: 'Alle Details zur Anreise findet ihr unter Anfahrt.' },
    { letter: 'B', title: 'Blumen', text: 'Wir wuenschen uns keine Blumengeschenke - die Deko ist bereits geplant.' },
    { letter: 'D', title: 'Dresscode', text: 'Elegant festlich in gedeckten Farben.' },
    { letter: 'F', title: 'Fotos', text: 'Waehrend der Trauung bitten wir euch, keine Fotos zu machen.' },
    { letter: 'K', title: 'Kinder', text: 'Kinder sind herzlich willkommen!' },
    { letter: 'P', title: 'Parken', text: 'Kostenlose Parkplaetze stehen zur Verfuegung.' }
  ];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Header $visible={visible}><Eyebrow>Alles Wissenswerte</Eyebrow><Title>{title}</Title></Header>
        <Grid>
          {entries.map((entry, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Letter>{entry.letter}</Letter>
              <CardTitle>{entry.title}</CardTitle>
              <CardText>{entry.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
