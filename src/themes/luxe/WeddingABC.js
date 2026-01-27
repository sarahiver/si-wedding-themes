import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-white);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const GoldLine = styled.div`
  width: 1px;
  height: 30px;
  background: var(--luxe-gold);
  margin: 0 auto 1.5rem;
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
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const AlphabetNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
`;

const LetterButton = styled.button`
  width: 32px;
  height: 32px;
  font-family: var(--font-serif);
  font-size: 0.9rem;
  font-style: italic;
  background: ${p => p.$active ? 'var(--luxe-cream)' : 'transparent'};
  color: ${p => p.$hasEntry ? 'var(--luxe-text)' : 'var(--luxe-text-muted)'};
  border: 1px solid ${p => p.$active ? 'var(--luxe-gold)' : p.$hasEntry ? 'var(--luxe-border)' : 'transparent'};
  cursor: ${p => p.$hasEntry ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  ${p => p.$hasEntry && !p.$active && `
    &:hover { border-color: var(--luxe-gold); }
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  padding: 1.5rem;
  background: var(--luxe-cream);
`;

const Letter = styled.span`
  font-family: var(--font-serif);
  font-size: 2rem;
  font-style: italic;
  color: var(--luxe-gold);
  display: block;
  margin-bottom: 0.5rem;
`;

const EntryTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 0.5rem;
`;

const EntryText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--luxe-text-light);
  line-height: 1.7;
`;

function WeddingABC({ entries }) {
  const [activeLetter, setActiveLetter] = useState(null);
  
  const defaultEntries = [
    { letter: 'A', title: 'Anfahrt', text: 'Parkplätze stehen kostenlos zur Verfügung.' },
    { letter: 'D', title: 'Dresscode', text: 'Festlich elegant. Bitte verzichtet auf Weiß.' },
    { letter: 'F', title: 'Fotos', text: 'Wir haben einen Fotografen. Unplugged Trauung!' },
    { letter: 'G', title: 'Geschenke', text: 'Eure Anwesenheit ist das schönste Geschenk.' },
    { letter: 'K', title: 'Kinder', text: 'Feier nur für Erwachsene.' },
    { letter: 'P', title: 'Party', text: 'Nach dem Dinner wird getanzt!' },
  ];
  
  const abcEntries = entries || defaultEntries;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const usedLetters = abcEntries.map(e => e.letter);
  const filtered = activeLetter ? abcEntries.filter(e => e.letter === activeLetter) : abcEntries;
  
  return (
    <Section id="abc">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Von A bis Z</Eyebrow>
          <Title>Alles Wissenswerte</Title>
        </Header>
        
        <AlphabetNav>
          {alphabet.map(letter => {
            const hasEntry = usedLetters.includes(letter);
            return (
              <LetterButton
                key={letter}
                $active={activeLetter === letter}
                $hasEntry={hasEntry}
                onClick={() => hasEntry && setActiveLetter(activeLetter === letter ? null : letter)}
              >
                {letter}
              </LetterButton>
            );
          })}
        </AlphabetNav>
        
        <Grid>
          {filtered.map((entry, index) => (
            <Card key={index}>
              <Letter>{entry.letter}</Letter>
              <EntryTitle>{entry.title}</EntryTitle>
              <EntryText>{entry.text}</EntryText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
