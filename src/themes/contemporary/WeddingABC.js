// Contemporary WeddingABC
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--yellow);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--black);
  opacity: 0.6;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--purple)', 'var(--pink)'];

const Card = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
  
  transition: all 0.3s ease;
`;

const Letter = styled.div`
  position: absolute;
  top: -10px;
  right: 10px;
  font-size: 5rem;
  font-weight: 700;
  color: ${p => colors[p.$index % colors.length]};
  opacity: 0.15;
  line-height: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  position: relative;
  
  &::before {
    content: '${p => p.$letter}';
    display: inline-block;
    width: 28px;
    height: 28px;
    background: ${p => colors[p.$index % colors.length]};
    color: var(--white);
    text-align: center;
    line-height: 28px;
    font-size: 0.85rem;
    margin-right: 0.75rem;
    border: 2px solid var(--black);
  }
`;

const CardText = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  line-height: 1.5;
  position: relative;
`;

function WeddingABC() {
  const { content } = useWedding();
  const abcData = content?.weddingabc || {};
  
  const title = abcData.title || 'Hochzeits-ABC';
  const entries = abcData.entries || [];

  const defaultEntries = [
    { letter: 'A', title: 'Anfahrt', text: 'Parkplätze sind vorhanden. ÖPNV-Infos findet ihr unter Anfahrt.' },
    { letter: 'B', title: 'Blumen', text: 'Bitte keine Blumen mitbringen – wir haben bereits dafür gesorgt!' },
    { letter: 'D', title: 'Dresscode', text: 'Festlich elegant. Bitte beachtet unsere Farbwünsche.' },
    { letter: 'F', title: 'Fotos', text: 'Während der Trauung bitten wir um Handypause. Danach freuen wir uns über eure Schnappschüsse!' },
    { letter: 'K', title: 'Kinder', text: 'Unsere Feier ist eine Erwachsenen-Party. Wir bitten um Verständnis.' },
    { letter: 'M', title: 'Mitbringsel', text: 'Eure Anwesenheit ist Geschenk genug! Infos zur Hochzeitskasse findet ihr unter Geschenke.' },
  ];

  const items = entries.length > 0 ? entries : defaultEntries;

  return (
    <Section id="abc">
      <Container>
        <Header>
          <Eyebrow>📖 Von A bis Z</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((item, i) => (
            <Card key={i}>
              <Letter $index={i}>{item.letter}</Letter>
              <CardTitle $letter={item.letter} $index={i}>{item.title}</CardTitle>
              <CardText>{item.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
