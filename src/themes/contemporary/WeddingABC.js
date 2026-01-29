// Contemporary WeddingABC - Click Letters to Show Text
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const pop = keyframes`
  0% { transform: scale(1) translate(2px, 2px); }
  50% { transform: scale(1.1) translate(2px, 2px); }
  100% { transform: scale(1) translate(2px, 2px); }
`;

const slideDown = keyframes`
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 400px; }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--yellow);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1000px;
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

const LettersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const LetterButton = styled.button`
  width: clamp(45px, 8vw, 65px);
  height: clamp(45px, 8vw, 65px);
  background: ${p => p.$active ? p.$color : 'var(--white)'};
  border: 4px solid var(--black);
  box-shadow: ${p => p.$active ? '0 0 0 var(--black)' : '4px 4px 0 var(--black)'};
  font-family: inherit;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  color: ${p => p.$active ? 'var(--white)' : (p.$hasContent ? 'var(--black)' : 'var(--gray-300)')};
  cursor: ${p => p.$hasContent ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;
  
  ${p => p.$hasContent && !p.$active && css`
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 var(--black);
      background: ${p.$color};
      color: var(--white);
    }
  `}
  
  ${p => p.$active && css`
    transform: translate(2px, 2px);
    animation: ${pop} 0.3s ease;
  `}
  
  ${p => p.$hasContent && css`
    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: ${p.$active ? 'var(--white)' : p.$color};
      border-radius: 50%;
    }
  `}
`;

const ContentPanel = styled.div`
  background: var(--white);
  border: 4px solid var(--black);
  box-shadow: 8px 8px 0 var(--black);
  overflow: hidden;
  animation: ${slideDown} 0.3s ease forwards;
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: ${p => p.$color};
  border-bottom: 4px solid var(--black);
`;

const ContentLetter = styled.div`
  width: 60px;
  height: 60px;
  background: var(--white);
  border: 4px solid var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
  flex-shrink: 0;
`;

const ContentTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  text-shadow: 2px 2px 0 var(--black);
  flex: 1;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  background: var(--white);
  border: 3px solid var(--black);
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: var(--black);
    color: var(--white);
    transform: rotate(90deg);
  }
`;

const ContentBody = styled.div`
  padding: 2rem;
`;

const ContentText = styled.p`
  font-size: 1.1rem;
  color: var(--gray-700);
  line-height: 1.7;
`;

const Hint = styled.p`
  text-align: center;
  font-size: 0.8rem;
  color: var(--black);
  opacity: 0.5;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const EmptyHint = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--black);
  opacity: 0.4;
  
  span {
    display: block;
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--purple)', 'var(--pink)', 'var(--black)'];

function WeddingABC() {
  const { content } = useWedding();
  const abcData = content?.weddingabc || {};
  
  const title = abcData.title || 'Hochzeits-ABC';
  const entries = abcData.entries || [];
  
  const [activeLetter, setActiveLetter] = useState(null);

  const defaultEntries = [
    { letter: 'A', word: 'Anfahrt', description: 'Parkplätze sind vorhanden. ÖPNV-Infos findet ihr unter Anfahrt. Die Location ist gut mit dem Auto und öffentlichen Verkehrsmitteln erreichbar.' },
    { letter: 'B', word: 'Blumen', description: 'Bitte keine Blumen mitbringen – wir haben bereits für wunderschöne Dekoration gesorgt!' },
    { letter: 'D', word: 'Dresscode', description: 'Festlich elegant. Bitte beachtet unsere Farbwünsche auf der Dresscode-Seite. Wir freuen uns auf eure schicken Outfits!' },
    { letter: 'F', word: 'Fotos', description: 'Während der Trauung bitten wir um Handypause. Unser Fotograf hält alles fest. Danach freuen wir uns über eure Schnappschüsse!' },
    { letter: 'G', word: 'Geschenke', description: 'Eure Anwesenheit ist das größte Geschenk! Falls ihr uns dennoch etwas schenken möchtet, findet ihr Infos unter Geschenke.' },
    { letter: 'K', word: 'Kinder', description: 'Unsere Feier ist eine Erwachsenen-Party. Wir bitten um Verständnis und hoffen auf einen ausgelassenen Abend mit euch!' },
    { letter: 'M', word: 'Musik', description: 'Habt ihr einen Musikwunsch? Teilt ihn uns mit und wir versuchen, ihn in die Playlist aufzunehmen!' },
    { letter: 'T', word: 'Taxi', description: 'Am Ende der Feier stehen Taxis bereit. Sprecht uns an, wenn ihr Hilfe bei der Heimfahrt braucht.' },
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
  const getColor = (index) => colors[index % colors.length];

  return (
    <Section id="abc">
      <Container>
        <Header>
          <Eyebrow>📖 Von A bis Z</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <LettersGrid>
          {alphabet.map((letter, i) => {
            const hasContent = !!letterMap[letter];
            const colorIndex = hasContent ? letterMap[letter].index : i;
            return (
              <LetterButton
                key={letter}
                $color={getColor(colorIndex)}
                $hasContent={hasContent}
                $active={activeLetter === letter}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </LetterButton>
            );
          })}
        </LettersGrid>
        
        {activeContent ? (
          <ContentPanel key={activeLetter}>
            <ContentHeader $color={getColor(activeContent.index)}>
              <ContentLetter>{activeLetter}</ContentLetter>
              <ContentTitle>{activeContent.word}</ContentTitle>
              <CloseButton onClick={() => setActiveLetter(null)}>×</CloseButton>
            </ContentHeader>
            <ContentBody>
              <ContentText>{activeContent.description}</ContentText>
            </ContentBody>
          </ContentPanel>
        ) : (
          <EmptyHint>
            <span>👆</span>
            Klicke auf einen farbigen Buchstaben
          </EmptyHint>
        )}
        
        <Hint>Buchstaben mit Punkt haben Inhalt</Hint>
      </Container>
    </Section>
  );
}

export default WeddingABC;
