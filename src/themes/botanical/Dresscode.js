// Botanical Dresscode - Style guide in hole
import React from 'react';
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
  justify-content: center;
  padding: 1.5rem 1rem;
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
  margin-bottom: 0.3rem;
`;

const DresscodeName = styled.h3`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 400;
  color: var(--black);
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--medium);
  line-height: 1.6;
  text-align: center;
  margin-bottom: 1rem;
  max-width: 280px;
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ColorDot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 1px solid var(--pale);
`;

const TipsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  text-align: left;
`;

const TipColumn = styled.div`
  flex: 1;
`;

const TipTitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$do ? 'var(--dark)' : 'var(--light)'};
  margin-bottom: 0.4rem;
`;

const TipList = styled.ul`
  list-style: none;
`;

const TipItem = styled.li`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--medium);
  padding: 0.2rem 0;
  
  &::before {
    content: '${p => p.$do ? '✓' : '✗'}';
    margin-right: 0.4rem;
    color: ${p => p.$do ? 'var(--dark)' : 'var(--light)'};
  }
`;

function Dresscode() {
  const { content } = useWedding();
  const { mainHole } = useKnotholes();
  const dresscodeData = content?.dresscode || {};
  
  const title = dresscodeData.title || 'Dresscode';
  const code = dresscodeData.code || 'Festlich Elegant';
  const description = dresscodeData.description || 'Wir freuen uns, wenn ihr euch schick macht.';
  const colors = dresscodeData.colors || ['#2d2d2d', '#666666', '#999999', '#cccccc', '#f5f5f5'];
  const dos = dresscodeData.dos || ['Elegante Kleider', 'Anzüge', 'Naturtöne'];
  const donts = dresscodeData.donts || ['Komplett weiß', 'Jeans', 'Sneakers'];

  return (
    <Section data-section="dresscode">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Was anziehen?</Eyebrow>
        <Title>{title}</Title>
        <DresscodeName>{code}</DresscodeName>
        <Description>{description}</Description>
        
        {colors.length > 0 && (
          <ColorPalette>
            {colors.slice(0, 5).map((c, i) => (
              <ColorDot key={i} $color={c} />
            ))}
          </ColorPalette>
        )}
        
        <TipsRow>
          <TipColumn>
            <TipTitle $do>Gerne</TipTitle>
            <TipList>
              {dos.slice(0, 3).map((item, i) => (
                <TipItem key={i} $do>{item}</TipItem>
              ))}
            </TipList>
          </TipColumn>
          <TipColumn>
            <TipTitle>Lieber nicht</TipTitle>
            <TipList>
              {donts.slice(0, 3).map((item, i) => (
                <TipItem key={i}>{item}</TipItem>
              ))}
            </TipList>
          </TipColumn>
        </TipsRow>
      </HoleContent>
    </Section>
  );
}

export default Dresscode;
