import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LUXE DRESSCODE - Interactive Reveal Cards
// Elegant flip/reveal animation on scroll
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--luxe-cream);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--luxe-text-light);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const revealLeft = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-50px) rotateY(15deg); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0) rotateY(0); 
  }
`;

const revealRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(50px) rotateY(-15deg); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0) rotateY(0); 
  }
`;

const Card = styled.div`
  perspective: 1000px;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${p.$index === 0 ? revealLeft : revealRight} 0.8s ease-out forwards;
    animation-delay: ${p.$index * 0.2}s;
  `}
`;

const CardInner = styled.div`
  position: relative;
  background: var(--luxe-white);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.08);
  }
`;

const CardImage = styled.div`
  aspect-ratio: 3/4;
  background-image: url(${p => p.$image});
  background-size: cover;
  background-position: center top;
  filter: grayscale(40%);
  transition: filter 0.4s ease;
  
  ${CardInner}:hover & {
    filter: grayscale(0%);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0));
`;

const CardLabel = styled.p`
  font-family: var(--font-sans);
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const CardText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text-light);
  line-height: 1.8;
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ColorSwatch = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 1px solid var(--luxe-border);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1px solid transparent;
    transition: border-color 0.3s ease;
  }
  
  &:hover::after {
    border-color: var(--luxe-gold);
  }
`;

const Note = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background: var(--luxe-white);
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: 1rem;
    left: 2rem;
    font-family: var(--font-serif);
    font-size: 4rem;
    color: var(--luxe-gold);
    opacity: 0.3;
    line-height: 1;
  }
`;

const NoteText = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-style: italic;
  color: var(--luxe-text);
  max-width: 500px;
  margin: 0 auto;
`;

function Dresscode() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const cards = [
    {
      label: 'Für Sie',
      title: 'Elegantes Abendkleid',
      text: 'Bodenlang oder Cocktaillänge. Elegante, gedeckte Farben wie Champagner, Salbeigrün, Dusty Rose oder Marineblau.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
      colors: ['#E8D5C4', '#B8C5B9', '#D4A5A5', '#2C3E50'],
    },
    {
      label: 'Für Ihn',
      title: 'Klassischer Anzug',
      text: 'Dunkler Anzug mit Krawatte oder Fliege. Farben: Dunkelblau, Anthrazit oder klassisches Schwarz.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
      colors: ['#2C3E50', '#4A4A4A', '#1A1A1A', '#8B7355'],
    },
  ];
  
  return (
    <Section id="dresscode" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow>Dresscode</Eyebrow>
          <Title>Festlich Elegant</Title>
          <Subtitle>Wir freuen uns auf einen stilvollen Abend mit euch</Subtitle>
        </Header>
        
        <Grid>
          {cards.map((card, index) => (
            <Card key={index} $visible={visible} $index={index}>
              <CardInner>
                <CardImage $image={card.image} />
                <CardOverlay>
                  <CardLabel>{card.label}</CardLabel>
                  <CardTitle>{card.title}</CardTitle>
                  <CardText>{card.text}</CardText>
                  <ColorPalette>
                    {card.colors.map((color, i) => (
                      <ColorSwatch key={i} $color={color} title={color} />
                    ))}
                  </ColorPalette>
                </CardOverlay>
              </CardInner>
            </Card>
          ))}
        </Grid>
        
        <Note>
          <NoteText>
            Bitte verzichtet auf Weiß, Creme und Elfenbein – diese Farben sind der Braut vorbehalten.
          </NoteText>
        </Note>
      </Container>
    </Section>
  );
}

export default Dresscode;
