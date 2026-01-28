import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--gray-100);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--gray-600);
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.2s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--white);
  padding: 2.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease ${p => 0.3 + p.$index * 0.15}s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
`;

const CardIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const CardIconDelayed = styled(CardIcon)`
  animation-delay: 0.5s;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
`;

const CardList = styled.ul`
  text-align: left;
`;

const CardItem = styled.li`
  font-size: 0.9rem;
  color: var(--gray-600);
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
  border-bottom: 2px solid var(--gray-200);
  
  &:last-child { border: none; }
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--electric);
    font-weight: 700;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.5s;
`;

const ColorItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ColorSwatch = styled.div`
  width: 50px;
  height: 50px;
  background: ${p => p.$color};
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
`;

const ColorName = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-600);
`;

const TipBox = styled.div`
  margin-top: 3rem;
  background: var(--yellow);
  padding: 1.5rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.6s;
`;

const TipText = styled.p`
  font-size: 0.9rem;
  color: var(--black);
  margin: 0;
  
  strong { font-weight: 700; }
`;

function Dresscode() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const colors = [
    { color: 'var(--black)', name: 'Schwarz' },
    { color: '#4b5563', name: 'Anthrazit' },
    { color: 'var(--white)', name: 'Weiß' },
    { color: '#d4af37', name: 'Gold' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="dresscode">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>👔👗 Dresscode</Eyebrow>
          <Title $visible={visible}>What to Wear</Title>
          <Subtitle $visible={visible}>Elegante Abendgarderobe in festlichem Rahmen</Subtitle>
        </Header>
        
        <Grid>
          <Card $index={0} $visible={visible}>
            <CardIcon>🤵</CardIcon>
            <CardTitle>Für die Herren</CardTitle>
            <CardList>
              <CardItem>Dunkler Anzug</CardItem>
              <CardItem>Hemd mit Krawatte/Fliege</CardItem>
              <CardItem>Elegante Lederschuhe</CardItem>
              <CardItem>Optional: Einstecktuch</CardItem>
            </CardList>
          </Card>
          
          <Card $index={1} $visible={visible}>
            <CardIconDelayed>👰</CardIconDelayed>
            <CardTitle>Für die Damen</CardTitle>
            <CardList>
              <CardItem>Cocktail- oder Abendkleid</CardItem>
              <CardItem>Eleganter Jumpsuit</CardItem>
              <CardItem>Absatzschuhe oder elegante Flats</CardItem>
              <CardItem>Bitte kein Weiß/Creme</CardItem>
            </CardList>
          </Card>
        </Grid>
        
        <ColorPalette $visible={visible}>
          {colors.map((c, i) => (
            <ColorItem key={i}>
              <ColorSwatch $color={c.color} />
              <ColorName>{c.name}</ColorName>
            </ColorItem>
          ))}
        </ColorPalette>
        
        <TipBox $visible={visible}>
          <TipText>
            <strong>💡 Tipp:</strong> Die Feier findet teils im Freien statt – denkt an einen Überwurf für den Abend!
          </TipText>
        </TipBox>
      </Container>
    </Section>
  );
}

export default Dresscode;
