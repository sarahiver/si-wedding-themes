// Botanical Dresscode - Nature-Inspired Style Guide
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const fadeGrow = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(180deg, var(--bg-fog) 0%, var(--bg-cream) 100%);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.1};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-narrow);
  margin: 0 auto;
  position: relative;
  z-index: 1;
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

const MainCard = styled.div`
  background: var(--bg-cream);
  padding: clamp(2rem, 5vw, 3rem);
  border-radius: 40px;
  box-shadow: var(--shadow-medium);
  text-align: center;
  margin-bottom: 2rem;
`;

const DresscodeName = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 2.5rem;
  color: var(--green-forest);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--text-medium);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto;
`;

// Color palette
const ColorsSection = styled.div`
  margin-top: 2rem;
`;

const ColorLabel = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--green-fern);
  margin-bottom: 1rem;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ColorDot = styled.div`
  width: 50px;
  height: 50px;
  background: ${p => p.$color};
  border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
  box-shadow: var(--shadow-soft);
  transition: transform 0.3s var(--ease-nature);
  
  &:hover {
    transform: scale(1.15);
  }
`;

// Dos and Don'ts
const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TipCard = styled.div`
  background: ${p => p.$type === 'do' ? 'var(--green-mint)' : 'var(--earth-sand)'};
  padding: 1.5rem;
  border-radius: 30px;
  box-shadow: var(--shadow-soft);
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const TipIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--bg-cream);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const TipTitle = styled.h4`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  color: var(--green-forest);
`;

const TipList = styled.ul`
  list-style: none;
`;

const TipItem = styled.li`
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-medium);
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  
  &::before {
    content: '${p => p.$type === 'do' ? '✓' : '✗'}';
    position: absolute;
    left: 0;
    color: ${p => p.$type === 'do' ? 'var(--green-fern)' : 'var(--earth-bark)'};
    font-weight: bold;
  }
`;

function Dresscode() {
  const { content } = useWedding();
  const dresscodeData = content?.dresscode || {};
  
  const title = dresscodeData.title || 'Dresscode';
  const code = dresscodeData.code || 'Festlich Elegant';
  const description = dresscodeData.description || 'Wir freuen uns, wenn ihr euch schick macht! Denkt an bequeme Schuhe für den Garten.';
  const colors = dresscodeData.colors || ['#9CAF88', '#B8D4BE', '#D4C5A9', '#E8D5A3', '#FAF8F3'];
  const dos = dresscodeData.dos || ['Elegante Sommerkleider', 'Helle Anzüge', 'Natürliche Farbtöne', 'Bequeme Schuhe'];
  const donts = dresscodeData.donts || ['Komplett weiß', 'Zu kurze Röcke', 'Sneakers', 'Jeans'];

  return (
    <Section id="dresscode">
      <DecoLeaf $size="150px" $color="var(--green-sage)" $opacity={0.08} style={{ top: '10%', left: '-5%' }} />
      <DecoLeaf $size="100px" $color="var(--green-mint)" $opacity={0.06} style={{ bottom: '15%', right: '-3%' }} $duration="12s" />
      
      <Container>
        <Header>
          <Eyebrow>👗 Was anziehen?</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <MainCard>
          <DresscodeName>{code}</DresscodeName>
          <Description>{description}</Description>
          
          {colors.length > 0 && (
            <ColorsSection>
              <ColorLabel>Unsere Farbpalette</ColorLabel>
              <ColorPalette>
                {colors.map((color, i) => (
                  <ColorDot key={i} $color={color} title={color} />
                ))}
              </ColorPalette>
            </ColorsSection>
          )}
        </MainCard>
        
        <TipsGrid>
          {dos.length > 0 && (
            <TipCard $type="do">
              <TipHeader>
                <TipIcon>🌿</TipIcon>
                <TipTitle>Gerne</TipTitle>
              </TipHeader>
              <TipList>
                {dos.map((item, i) => (
                  <TipItem key={i} $type="do">{item}</TipItem>
                ))}
              </TipList>
            </TipCard>
          )}
          
          {donts.length > 0 && (
            <TipCard $type="dont">
              <TipHeader>
                <TipIcon>🍂</TipIcon>
                <TipTitle>Lieber nicht</TipTitle>
              </TipHeader>
              <TipList>
                {donts.map((item, i) => (
                  <TipItem key={i} $type="dont">{item}</TipItem>
                ))}
              </TipList>
            </TipCard>
          )}
        </TipsGrid>
      </Container>
    </Section>
  );
}

export default Dresscode;
