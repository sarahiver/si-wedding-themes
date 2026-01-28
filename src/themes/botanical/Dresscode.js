import { useWedding } from '../../context/WeddingContext';
import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const Code = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-style: italic;
  color: var(--sage);
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const ColorSwatch = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 2px solid var(--cream-dark);
  box-shadow: var(--shadow-sm);
`;

const Lists = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  text-align: left;
  
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const List = styled.div`
  h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: ${p => p.$type === 'do' ? 'var(--sage)' : 'var(--terracotta)'};
    margin-bottom: 1rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      font-family: 'Lato', sans-serif;
      font-size: 0.9rem;
      color: var(--text-light);
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
      
      &::before {
        content: '${p => p.$type === 'do' ? '✓' : '✕'}';
        position: absolute;
        left: 0;
        color: ${p => p.$type === 'do' ? 'var(--sage)' : 'var(--terracotta)'};
      }
    }
  }
`;

function Dresscode({ content = {} }) {
  const title = content.title || 'Dresscode';
  const code = content.code || 'Garden Party Elegance';
  const description = content.description || '';
  const colors = content.colors || [];
  const dos = content.dos || [];
  const donts = content.donts || [];

  return (
    <Section id="dresscode">
      <Container>
        <Title>{title}</Title>
        <Code>{code}</Code>
        {description && <Description>{description}</Description>}
        
        {colors.length > 0 && (
          <ColorPalette>
            {colors.map((color, i) => (
              <ColorSwatch key={i} $color={color} title={color} />
            ))}
          </ColorPalette>
        )}
        
        {(dos.length > 0 || donts.length > 0) && (
          <Lists>
            {dos.length > 0 && (
              <List $type="do">
                <h4>Gerne gesehen</h4>
                <ul>
                  {dos.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </List>
            )}
            {donts.length > 0 && (
              <List $type="dont">
                <h4>Bitte vermeiden</h4>
                <ul>
                  {donts.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </List>
            )}
          </Lists>
        )}
      </Container>
    </Section>
  );
}

export default Dresscode;
