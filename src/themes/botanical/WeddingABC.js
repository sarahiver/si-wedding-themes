// Botanical WeddingABC - Letters in hole
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1.5rem 0.75rem;
  overflow: hidden;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.75rem;
`;

const LetterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const Letter = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 0.8rem;
  background: ${p => p.$active ? 'var(--black)' : p.$has ? 'var(--off-white)' : 'transparent'};
  color: ${p => p.$active ? 'var(--white)' : p.$has ? 'var(--black)' : 'var(--pale)'};
  border: 1px solid ${p => p.$has || p.$active ? 'var(--pale)' : 'transparent'};
  cursor: ${p => p.$has ? 'pointer' : 'default'};
  transition: all 0.2s;
  
  &:hover {
    ${p => p.$has && !p.$active && 'background: var(--pale);'}
  }
`;

const ContentPanel = styled.div`
  width: 100%;
  flex: 1;
  background: var(--off-white);
  padding: 1rem;
  text-align: left;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: var(--pale); }
`;

const ContentLetter = styled.span`
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 300;
  color: var(--black);
`;

const ContentWord = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--black);
  margin: 0.25rem 0;
`;

const ContentText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--medium);
  line-height: 1.6;
`;

const EmptyState = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--light);
  text-align: center;
  padding: 1rem;
`;

function WeddingABC() {
  const { content } = useWedding();
  const { mainHole } = useKnotholes();
  const abcData = content?.weddingabc || {};
  
  const title = abcData.title || 'Hochzeits-ABC';
  const entries = abcData.entries || [];
  
  const [active, setActive] = useState(null);

  const defaultEntries = [
    { letter: 'A', word: 'Anfahrt', description: 'Parkplätze vorhanden. Details unter Anfahrt.' },
    { letter: 'D', word: 'Dresscode', description: 'Festlich elegant.' },
    { letter: 'F', word: 'Fotos', description: 'Während der Trauung bitte keine Handys.' },
    { letter: 'G', word: 'Geschenke', description: 'Eure Anwesenheit ist das schönste Geschenk.' },
    { letter: 'K', word: 'Kinder', description: 'Kinder sind herzlich willkommen!' },
  ];

  const items = entries.length > 0 ? entries : defaultEntries;
  
  const letterMap = {};
  items.forEach(item => { letterMap[item.letter.toUpperCase()] = item; });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const activeItem = active ? letterMap[active] : null;

  return (
    <Section data-section="abc">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Von A bis Z</Eyebrow>
        <Title>{title}</Title>
        
        <LetterGrid>
          {alphabet.map(l => (
            <Letter
              key={l}
              $has={!!letterMap[l]}
              $active={active === l}
              onClick={() => letterMap[l] && setActive(l)}
            >
              {l}
            </Letter>
          ))}
        </LetterGrid>
        
        <ContentPanel>
          {activeItem ? (
            <>
              <ContentLetter>{active}</ContentLetter>
              <ContentWord>{activeItem.word}</ContentWord>
              <ContentText>{activeItem.description}</ContentText>
            </>
          ) : (
            <EmptyState>Wähle einen Buchstaben</EmptyState>
          )}
        </ContentPanel>
      </HoleContent>
    </Section>
  );
}

export default WeddingABC;
