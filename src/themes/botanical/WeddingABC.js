import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const LetterGrid = styled.div`
  display: flex; flex-wrap: wrap; justify-content: center; gap: 0.25rem; margin-bottom: 1rem;
`;
const Letter = styled.button`
  width: 26px; height: 26px; font-family: var(--font-serif); font-size: 0.85rem;
  background: ${p => p.$active ? 'var(--black)' : p.$has ? 'var(--off-white)' : 'transparent'};
  color: ${p => p.$active ? 'var(--white)' : p.$has ? 'var(--black)' : 'var(--pale)'};
  border: 1px solid ${p => p.$has || p.$active ? 'var(--pale)' : 'transparent'};
  cursor: ${p => p.$has ? 'pointer' : 'default'};
`;
const Panel = styled.div`background: var(--off-white); padding: 1rem; min-height: 100px;`;
const ContentLetter = styled.span`font-family: var(--font-serif); font-size: 2rem; color: var(--black);`;
const ContentWord = styled.h3`font-family: var(--font-serif); font-size: 1.1rem; margin: 0.25rem 0;`;
const ContentText = styled.p`font-size: 0.85rem; color: var(--medium); line-height: 1.6;`;

function WeddingABC({ side = 'right' }) {
  const { content } = useWedding();
  const abcData = content?.weddingabc || {};
  const entries = abcData.entries || [
    { letter: 'A', word: 'Anfahrt', description: 'Parkplätze vorhanden.' },
    { letter: 'D', word: 'Dresscode', description: 'Festlich elegant.' },
    { letter: 'F', word: 'Fotos', description: 'Während der Trauung bitte keine Handys.' },
    { letter: 'K', word: 'Kinder', description: 'Kinder sind herzlich willkommen!' },
  ];
  const [active, setActive] = useState(null);
  const letterMap = {}; entries.forEach(e => { letterMap[e.letter.toUpperCase()] = e; });
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <ContentBranch side={side} eyebrow="Von A bis Z" title={abcData.title || 'Hochzeits-ABC'}>
      <LetterGrid>
        {alphabet.map(l => <Letter key={l} $has={!!letterMap[l]} $active={active === l} onClick={() => letterMap[l] && setActive(l)}>{l}</Letter>)}
      </LetterGrid>
      <Panel>
        {active && letterMap[active] ? (
          <><ContentLetter>{active}</ContentLetter><ContentWord>{letterMap[active].word}</ContentWord><ContentText>{letterMap[active].description}</ContentText></>
        ) : <ContentText style={{textAlign:'center',color:'var(--light)'}}>Wähle einen Buchstaben</ContentText>}
      </Panel>
    </ContentBranch>
  );
}
export default WeddingABC;
