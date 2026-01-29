// Botanical WeddingABC - Scattered Leaves with Content
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; max-height: 0; transform: translateY(-10px); }
  to { opacity: 1; max-height: 300px; transform: translateY(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(180deg, var(--bg-moss) 0%, var(--bg-cream) 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-light);
  margin-top: 0.5rem;
`;

// Letters arranged like scattered leaves
const LettersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

// Organic leaf shapes for each letter
const leafShapes = [
  '60% 40% 50% 50% / 50% 50% 40% 60%',
  '50% 50% 40% 60% / 60% 40% 50% 50%',
  '55% 45% 45% 55% / 45% 55% 55% 45%',
  '45% 55% 55% 45% / 55% 45% 45% 55%',
  '50% 50% 50% 50% / 40% 60% 60% 40%',
];

const colors = [
  'var(--green-mint)',
  'var(--green-sage)',
  'var(--green-leaf)',
  'var(--green-fern)',
  'var(--water-stream)',
];

const LetterLeaf = styled.button`
  width: clamp(45px, 7vw, 60px);
  height: clamp(45px, 7vw, 60px);
  background: ${p => p.$hasContent 
    ? colors[p.$colorIndex % colors.length] 
    : 'var(--bg-fog)'};
  color: ${p => p.$hasContent 
    ? (p.$colorIndex % 2 === 0 ? 'var(--green-forest)' : 'var(--bg-cream)') 
    : 'var(--text-muted)'};
  border: ${p => p.$active 
    ? '3px solid var(--green-forest)' 
    : '2px solid transparent'};
  border-radius: ${p => leafShapes[p.$shapeIndex % leafShapes.length]};
  font-family: var(--font-handwritten);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 600;
  cursor: ${p => p.$hasContent ? 'pointer' : 'default'};
  transition: all 0.4s var(--ease-nature);
  position: relative;
  box-shadow: ${p => p.$hasContent ? 'var(--shadow-soft)' : 'none'};
  
  ${p => p.$hasContent && css`
    animation: ${sway} ${8 + (p.$colorIndex % 4)}s ease-in-out infinite;
    animation-delay: ${p.$colorIndex * 0.2}s;
    
    &:hover {
      transform: scale(1.15) rotate(5deg);
      box-shadow: var(--shadow-medium);
    }
  `}
  
  ${p => p.$active && css`
    transform: scale(1.2);
    box-shadow: var(--shadow-medium), 0 0 20px rgba(92, 138, 77, 0.3);
    animation: none;
  `}
  
  /* Small indicator dot */
  ${p => p.$hasContent && css`
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: ${p.$active ? 'var(--bg-cream)' : 'var(--green-forest)'};
      border-radius: 50%;
      opacity: 0.7;
    }
  `}
`;

// Content panel that shows below
const ContentPanel = styled.div`
  background: var(--bg-cream);
  border-radius: 40px 40px 35px 45px / 35px 45px 40px 40px;
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  animation: ${slideDown} 0.4s var(--ease-nature) forwards;
  margin-bottom: 1rem;
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: ${p => colors[p.$colorIndex % colors.length]};
`;

const ContentLetter = styled.div`
  width: 60px;
  height: 60px;
  background: var(--bg-cream);
  border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-handwritten);
  font-size: 2rem;
  font-weight: 600;
  color: var(--green-forest);
  flex-shrink: 0;
  box-shadow: var(--shadow-soft);
`;

const ContentTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.75rem;
  color: var(--bg-cream);
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex: 1;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--bg-cream);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255,255,255,0.4);
    transform: rotate(90deg);
  }
`;

const ContentBody = styled.div`
  padding: 1.5rem 2rem;
`;

const ContentText = styled.p`
  font-family: var(--font-body);
  font-size: 1.05rem;
  color: var(--text-medium);
  line-height: 1.8;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  
  .emoji {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
    animation: ${sway} 3s ease-in-out infinite;
  }
`;

const Hint = styled.p`
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 1.5rem;
`;

function WeddingABC() {
  const { content } = useWedding();
  const abcData = content?.weddingabc || {};
  
  const title = abcData.title || 'Hochzeits-ABC';
  const entries = abcData.entries || [];
  
  const [activeLetter, setActiveLetter] = useState(null);

  const defaultEntries = [
    { letter: 'A', word: 'Anfahrt', description: 'Parkplätze sind vorhanden. Die Location ist gut erreichbar. ÖPNV-Infos findet ihr unter Anfahrt.' },
    { letter: 'B', word: 'Blumen', description: 'Bitte keine Blumen mitbringen – wir haben bereits für wunderschöne Dekoration gesorgt!' },
    { letter: 'D', word: 'Dresscode', description: 'Festlich elegant. Bitte beachtet unsere Farbwünsche. Denkt an bequeme Schuhe für den Garten!' },
    { letter: 'F', word: 'Fotos', description: 'Während der Trauung bitten wir um Handypause. Danach freuen wir uns über eure Schnappschüsse!' },
    { letter: 'G', word: 'Geschenke', description: 'Eure Anwesenheit ist das größte Geschenk! Falls ihr uns dennoch etwas schenken möchtet, findet ihr Infos unter Geschenke.' },
    { letter: 'K', word: 'Kinder', description: 'Kinder sind herzlich willkommen! Es wird eine Kinderbetreuung und einen Spielbereich geben.' },
    { letter: 'M', word: 'Musik', description: 'Habt ihr einen Musikwunsch? Teilt ihn uns mit und wir versuchen, ihn in die Playlist aufzunehmen!' },
    { letter: 'T', word: 'Taxi', description: 'Am Ende der Feier können wir Taxis organisieren. Sprecht uns einfach an.' },
  ];

  const items = entries.length > 0 ? entries : defaultEntries;
  
  // Create map of letters with content
  const letterMap = {};
  items.forEach((item, i) => {
    letterMap[item.letter.toUpperCase()] = { ...item, index: i };
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleLetterClick = (letter) => {
    if (!letterMap[letter]) return;
    setActiveLetter(activeLetter === letter ? null : letter);
  };

  const activeContent = activeLetter ? letterMap[activeLetter] : null;

  return (
    <Section id="abc">
      <Container>
        <Header>
          <Eyebrow>🌿 Von A bis Z</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>Alles Wichtige auf einen Blick</Subtitle>
        </Header>
        
        <LettersGrid>
          {alphabet.map((letter, i) => {
            const hasContent = !!letterMap[letter];
            const colorIndex = hasContent ? letterMap[letter].index : i;
            return (
              <LetterLeaf
                key={letter}
                $hasContent={hasContent}
                $active={activeLetter === letter}
                $colorIndex={colorIndex}
                $shapeIndex={i}
                onClick={() => handleLetterClick(letter)}
                disabled={!hasContent}
              >
                {letter}
              </LetterLeaf>
            );
          })}
        </LettersGrid>
        
        {activeContent ? (
          <ContentPanel key={activeLetter}>
            <ContentHeader $colorIndex={activeContent.index}>
              <ContentLetter>{activeLetter}</ContentLetter>
              <ContentTitle>{activeContent.word}</ContentTitle>
              <CloseButton onClick={() => setActiveLetter(null)}>×</CloseButton>
            </ContentHeader>
            <ContentBody>
              <ContentText>{activeContent.description}</ContentText>
            </ContentBody>
          </ContentPanel>
        ) : (
          <EmptyState>
            <span className="emoji">🍃</span>
            Tippe auf einen farbigen Buchstaben
          </EmptyState>
        )}
        
        <Hint>Farbige Blätter enthalten Informationen</Hint>
      </Container>
    </Section>
  );
}

export default WeddingABC;
