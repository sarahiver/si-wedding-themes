import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-black);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(4rem, 8vw, 6rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const CodeBadge = styled.div`
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  border: 2px solid var(--editorial-red);
  font-family: var(--font-headline);
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-red);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.8vw, 1.3rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.45s;
  `}
`;

const ColorsSection = styled.div`
  margin-bottom: 4rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.5s;
  `}
`;

const ColorsLabel = styled.h3`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin-bottom: 2rem;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const ColorSwatch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${scaleIn} 0.5s ease forwards;
    animation-delay: ${0.6 + p.$index * 0.1}s;
  `}
`;

const ColorCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${p => p.$color || '#888'};
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

const ColorName = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const ListBlock = styled.div`
  background: ${p => p.$type === 'do' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(196, 30, 58, 0.1)'};
  padding: clamp(2rem, 4vw, 3rem);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: ${p.$type === 'do' ? '0.7s' : '0.8s'};
  `}
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ListIcon = styled.span`
  font-size: 2rem;
`;

const ListTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-transform: uppercase;
  color: ${p => p.$type === 'do' ? 'var(--editorial-white)' : 'var(--editorial-red)'};
`;

const Divider = styled.div`
  width: 40px;
  height: 2px;
  background: ${p => p.$type === 'do' ? 'var(--editorial-white)' : 'var(--editorial-red)'};
  margin-bottom: 1.5rem;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: ${p.$type === 'do' ? '0.9s' : '1s'};
  `}
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  font-family: var(--font-serif);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  
  &::before {
    content: '${p => p.$type === 'do' ? '✓' : '✗'}';
    color: ${p => p.$type === 'do' ? '#4CAF50' : 'var(--editorial-red)'};
    font-weight: bold;
    flex-shrink: 0;
  }
`;

// ============================================
// COMPONENT
// ============================================

function Dresscode() {
  const { content } = useWedding();
  const dresscodeData = content?.dresscode || {};
  
  const title = dresscodeData.title || 'Dresscode';
  const code = dresscodeData.code || 'Festlich Elegant';
  const description = dresscodeData.description || 'Wir freuen uns, wenn ihr euch schick macht – aber vor allem sollt ihr euch wohlfühlen.';
  const colors = dresscodeData.colors || [];
  const dos = dresscodeData.dos || [];
  const donts = dresscodeData.donts || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultColors = [
    { name: 'Bordeaux', hex: '#800020' },
    { name: 'Navy', hex: '#1a1a4e' },
    { name: 'Champagner', hex: '#F7E7CE' },
    { name: 'Salbei', hex: '#9CAF88' },
  ];

  const defaultDos = [
    'Anzug oder elegantes Kleid',
    'Festliche Schuhe',
    'Schicke Accessoires',
    'Bequem genug zum Tanzen'
  ];

  const defaultDonts = [
    'Komplett weißes Outfit',
    'Jeans und Sneaker',
    'Zu kurze Kleider',
    'Zu auffällige Muster'
  ];

  // Support both old format (string) and new format (object with hex/name)
  const mappedColors = colors.length > 0
    ? colors.map(c => typeof c === 'string' ? { hex: c, name: '' } : { hex: c?.hex || c?.color || '#888', name: c?.name || '' })
    : defaultColors;
  const displayColors = mappedColors;
  const displayDos = dos.length > 0 ? dos : defaultDos;
  const displayDonts = donts.length > 0 ? donts : defaultDonts;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="dresscode" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Was ihr anzieht</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <CodeBadge $visible={visible}>{code}</CodeBadge>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        {displayColors.length > 0 && (
          <ColorsSection $visible={visible}>
            <ColorsLabel>Unsere Farbpalette</ColorsLabel>
            <ColorPalette>
              {displayColors.map((c, i) => (
                <ColorSwatch key={i} $visible={visible} $index={i}>
                  <ColorCircle $color={c.hex} />
                  {c.name && <ColorName>{c.name}</ColorName>}
                </ColorSwatch>
              ))}
            </ColorPalette>
          </ColorsSection>
        )}
        
        <Grid>
          <ListBlock $type="do" $visible={visible}>
            <ListHeader>
              <ListIcon>👍</ListIcon>
              <ListTitle $type="do">Do's</ListTitle>
            </ListHeader>
            <Divider $type="do" $visible={visible} />
            <List>
              {displayDos.map((item, i) => (
                <ListItem key={i} $type="do">{item}</ListItem>
              ))}
            </List>
          </ListBlock>
          
          <ListBlock $type="dont" $visible={visible}>
            <ListHeader>
              <ListIcon>👎</ListIcon>
              <ListTitle $type="dont">Don'ts</ListTitle>
            </ListHeader>
            <Divider $type="dont" $visible={visible} />
            <List>
              {displayDonts.map((item, i) => (
                <ListItem key={i} $type="dont">{item}</ListItem>
              ))}
            </List>
          </ListBlock>
        </Grid>
      </Container>
    </Section>
  );
}

export default Dresscode;
