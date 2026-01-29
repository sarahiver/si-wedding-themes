import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const Code = styled.h3`font-family: var(--font-serif); font-size: 1.5rem; text-align: center; margin-bottom: 0.5rem;`;
const Desc = styled.p`font-size: 0.9rem; color: var(--medium); text-align: center; margin-bottom: 1rem;`;
const Colors = styled.div`display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;`;
const ColorDot = styled.div`width: 28px; height: 28px; border-radius: 50%; background: ${p => p.$c}; border: 1px solid var(--pale);`;
const TipsRow = styled.div`display: flex; gap: 1.5rem;`;
const TipCol = styled.div`flex: 1;`;
const TipTitle = styled.p`font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${p => p.$do ? 'var(--dark)' : 'var(--light)'}; margin-bottom: 0.4rem;`;
const TipItem = styled.p`font-size: 0.8rem; color: var(--medium); padding: 0.15rem 0; &::before { content: '${p => p.$do ? '✓' : '✗'}'; margin-right: 0.4rem; }`;

function Dresscode({ side = 'left' }) {
  const { content } = useWedding();
  const d = content?.dresscode || {};
  const colors = d.colors || ['#2d2d2d', '#666', '#999', '#ccc', '#f5f5f5'];
  const dos = d.dos || ['Elegante Kleider', 'Anzüge', 'Naturtöne'];
  const donts = d.donts || ['Komplett weiß', 'Jeans', 'Sneakers'];

  return (
    <ContentBranch side={side} eyebrow="Was anziehen?" title={d.title || 'Dresscode'}>
      <Code>{d.code || 'Festlich Elegant'}</Code>
      <Desc>{d.description || 'Wir freuen uns, wenn ihr euch schick macht.'}</Desc>
      <Colors>{colors.slice(0,5).map((c,i) => <ColorDot key={i} $c={c} />)}</Colors>
      <TipsRow>
        <TipCol><TipTitle $do>Gerne</TipTitle>{dos.slice(0,3).map((x,i) => <TipItem key={i} $do>{x}</TipItem>)}</TipCol>
        <TipCol><TipTitle>Lieber nicht</TipTitle>{donts.slice(0,3).map((x,i) => <TipItem key={i}>{x}</TipItem>)}</TipCol>
      </TipsRow>
    </ContentBranch>
  );
}
export default Dresscode;
