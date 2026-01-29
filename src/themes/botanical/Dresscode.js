// Botanical Dresscode - Clean style guide
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--forest-deep);
`;

const MainCard = styled.div`
  background: var(--cream-dark);
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const DresscodeName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--forest-deep);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--bark-medium);
  line-height: 1.7;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ColorDot = styled.div`
  width: 36px;
  height: 36px;
  background: ${p => p.$color};
  border-radius: 50%;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const TipCard = styled.div`
  background: ${p => p.$do ? 'var(--forest-deep)' : 'var(--cream-dark)'};
  padding: 1.5rem;
`;

const TipTitle = styled.h4`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$do ? 'var(--gold-light)' : 'var(--bark-light)'};
  margin-bottom: 1rem;
`;

const TipList = styled.ul`
  list-style: none;
`;

const TipItem = styled.li`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: ${p => p.$do ? 'var(--cream)' : 'var(--bark-medium)'};
  padding: 0.35rem 0;
`;

function Dresscode() {
  const { content } = useWedding();
  const dresscodeData = content?.dresscode || {};
  
  const title = dresscodeData.title || 'Dresscode';
  const code = dresscodeData.code || 'Festlich Elegant';
  const description = dresscodeData.description || 'Wir freuen uns, wenn ihr euch schick macht. Denkt an bequeme Schuhe!';
  const colors = dresscodeData.colors || ['#3D5E3D', '#5A7A5A', '#8BA888', '#B8956B', '#FAF8F5'];
  const dos = dresscodeData.dos || ['Elegante Kleider', 'Anzüge', 'Natürliche Farben'];
  const donts = dresscodeData.donts || ['Komplett weiß', 'Jeans', 'Sneakers'];

  return (
    <Section id="dresscode" data-section="dresscode">
      <Content>
        <Header>
          <Eyebrow>Was anziehen?</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <MainCard>
          <DresscodeName>{code}</DresscodeName>
          <Description>{description}</Description>
          {colors.length > 0 && (
            <ColorPalette>
              {colors.map((color, i) => (
                <ColorDot key={i} $color={color} />
              ))}
            </ColorPalette>
          )}
        </MainCard>
        
        <TipsGrid>
          <TipCard $do>
            <TipTitle $do>Gerne</TipTitle>
            <TipList>
              {dos.map((item, i) => (
                <TipItem key={i} $do>✓ {item}</TipItem>
              ))}
            </TipList>
          </TipCard>
          <TipCard>
            <TipTitle>Lieber nicht</TipTitle>
            <TipList>
              {donts.map((item, i) => (
                <TipItem key={i}>✗ {item}</TipItem>
              ))}
            </TipList>
          </TipCard>
        </TipsGrid>
      </Content>
    </Section>
  );
}

export default Dresscode;
