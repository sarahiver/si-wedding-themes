// Botanical WeddingABC - Clean letter navigation
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--forest-deep);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 700px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-mist);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--cream);
`;

const LettersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Letter = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 1.1rem;
  background: ${p => p.$active ? 'var(--gold)' : p.$hasContent ? 'var(--forest-light)' : 'transparent'};
  color: ${p => p.$active || p.$hasContent ? 'var(--cream)' : 'var(--forest-light)'};
  border: 1px solid ${p => p.$hasContent ? 'var(--forest-light)' : 'var(--forest-main)'};
  cursor: ${p => p.$hasContent ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  &:hover {
    ${p => p.$hasContent && `
      background: var(--gold);
      border-color: var(--gold);
    `}
  }
`;

const ContentPanel = styled.div`
  background: var(--cream);
  padding: 2rem;
  min-height: 150px;
`;

const ContentLetter = styled.span`
  font-family: var(--font-serif);
  font-size: 3rem;
  font-weight: 300;
  color: var(--gold);
  display: block;
  margin-bottom: 0.5rem;
`;

const ContentWord = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--forest-deep);
  margin-bottom: 0.75rem;
`;

const ContentText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--bark-medium);
  line-height: 1.7;
`;

const EmptyState = styled.div`
  text-align: center;
  color: var(--bark-light);
  font-family: var(--font-sans);
  font-size: 0.9rem;
`;

function WeddingABC() {
  const { content } = useWedding();
  const abcData = content?.weddingabc || {};
  
  const title = abcData.title || 'Hochzeits-ABC';
  const entries = abcData.entries || [];
  
  const [activeLetter, setActiveLetter] = useState(null);

  const defaultEntries = [
    { letter: 'A', word: 'Anfahrt', description: 'Parkplätze sind vorhanden. Infos unter Anfahrt.' },
    { letter: 'D', word: 'Dresscode', description: 'Festlich elegant. Denkt an bequeme Schuhe!' },
    { letter: 'F', word: 'Fotos', description: 'Während der Trauung bitte Handypause. Danach gerne!' },
    { letter: 'G', word: 'Geschenke', description: 'Eure Anwesenheit ist das schönste Geschenk.' },
    { letter: 'K', word: 'Kinder', description: 'Kinder sind herzlich willkommen!' },
    { letter: 'M', word: 'Musik', description: 'Habt ihr einen Musikwunsch? Teilt ihn uns mit!' },
  ];

  const items = entries.length > 0 ? entries : defaultEntries;
  
  const letterMap = {};
  items.forEach(item => {
    letterMap[item.letter.toUpperCase()] = item;
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const activeContent = activeLetter ? letterMap[activeLetter] : null;

  return (
    <Section id="abc" data-section="abc">
      <Content>
        <Header>
          <Eyebrow>Von A bis Z</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <LettersGrid>
          {alphabet.map(letter => (
            <Letter
              key={letter}
              $hasContent={!!letterMap[letter]}
              $active={activeLetter === letter}
              onClick={() => letterMap[letter] && setActiveLetter(letter)}
            >
              {letter}
            </Letter>
          ))}
        </LettersGrid>
        
        <ContentPanel>
          {activeContent ? (
            <>
              <ContentLetter>{activeLetter}</ContentLetter>
              <ContentWord>{activeContent.word}</ContentWord>
              <ContentText>{activeContent.description}</ContentText>
            </>
          ) : (
            <EmptyState>
              Wähle einen Buchstaben aus
            </EmptyState>
          )}
        </ContentPanel>
      </Content>
    </Section>
  );
}

export default WeddingABC;
