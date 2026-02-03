// Contemporary Dresscode
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--white);
`;

const Container = styled.div`
  max-width: 900px;
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
  color: var(--coral);
  margin-bottom: 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const CodeBadge = styled.div`
  display: inline-block;
  background: var(--black);
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  text-transform: uppercase;
  margin-top: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: var(--gray-600);
  max-width: 600px;
  margin: 1.5rem auto 0;
  line-height: 1.7;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.2s;
`;

const ColorSection = styled.div`
  margin: 3rem 0;
  text-align: center;
`;

const ColorTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray-500);
  margin-bottom: 1.5rem;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ColorSwatch = styled.div`
  width: 80px;
  height: 80px;
  background: ${p => p.$color};
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
  
  span {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    color: ${p => p.$light ? 'var(--black)' : 'var(--white)'};
    background: ${p => p.$light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'};
    padding: 0.15rem 0.3rem;
  }
  
  @media (max-width: 500px) {
    width: 60px;
    height: 60px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 3rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${p => p.$type === 'do' ? 'var(--electric)' : 'var(--coral)'};
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid rgba(0,0,0,0.1);
`;

const CardIcon = styled.span`
  font-size: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const CardList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardItem = styled.li`
  font-size: 0.95rem;
  color: var(--white);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '${p => p.$type === 'do' ? '✓' : '✗'}';
    font-weight: 700;
  }
`;

function Dresscode() {
  const { content } = useWedding();
  const dresscodeData = content?.dresscode || {};
  
  const title = dresscodeData.title || 'Dresscode';
  const code = dresscodeData.code || 'Festlich Elegant';
  const description = dresscodeData.description || 'Wir freuen uns, wenn ihr euch schick macht! Hier sind ein paar Hinweise.';
  const colors = dresscodeData.colors || [];
  const dos = dresscodeData.dos || [];
  const donts = dresscodeData.donts || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultColors = [
    { hex: '#1a365d', name: 'Navy', light: false },
    { hex: '#2d3748', name: 'Anthrazit', light: false },
    { hex: '#9b2c2c', name: 'Burgund', light: false },
    { hex: '#d4af37', name: 'Gold', light: true },
    { hex: '#f5f5f5', name: 'Creme', light: true },
  ];

  const defaultDos = [
    'Elegante Abendgarderobe',
    'Dunkle Anzüge oder Smokings',
    'Lange Kleider oder schicke Cocktailkleider',
    'Dezenter Schmuck'
  ];

  const defaultDonts = [
    'Weiß oder Creme (reserviert für die Braut)',
    'Jeans oder Sneaker',
    'Zu kurze Kleider',
    'Grelle Neonfarben'
  ];

  // Helper to determine if color is light
  const isLightColor = (hex) => {
    if (!hex || !hex.startsWith('#')) return false;
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  };

  // Support both old format (string) and new format (object with hex/name)
  const getValidHex = (c) => {
    if (typeof c === 'string' && c.startsWith('#')) return c;
    if (c?.hex && c.hex.startsWith('#')) return c.hex;
    if (c?.color && c.color.startsWith('#')) return c.color;
    return null;
  };
  const mappedColors = colors.length > 0
    ? colors.map(c => {
        const hex = getValidHex(c);
        if (!hex) return null;
        const name = typeof c === 'object' ? (c?.name || '') : '';
        return { hex, name, light: isLightColor(hex) };
      }).filter(Boolean)
    : [];
  const displayColors = mappedColors.length > 0 ? mappedColors : defaultColors;
  const displayDos = dos.length > 0 ? dos : defaultDos;
  const displayDonts = donts.length > 0 ? donts : defaultDonts;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="dresscode">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>👗 Was anziehen?</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <CodeBadge>{code}</CodeBadge>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        {displayColors.length > 0 && (
          <ColorSection>
            <ColorTitle>Unsere Farbpalette</ColorTitle>
            <ColorPalette>
              {displayColors.map((c, i) => (
                <ColorSwatch key={i} $color={c.hex} $light={c.light}>
                  {c.name && <span>{c.name}</span>}
                </ColorSwatch>
              ))}
            </ColorPalette>
          </ColorSection>
        )}
        
        <Grid>
          <Card $type="do">
            <CardHeader>
              <CardIcon>✅</CardIcon>
              <CardTitle>Do's</CardTitle>
            </CardHeader>
            <CardList>
              {displayDos.map((item, i) => (
                <CardItem key={i} $type="do">{item}</CardItem>
              ))}
            </CardList>
          </Card>
          
          <Card $type="dont">
            <CardHeader>
              <CardIcon>❌</CardIcon>
              <CardTitle>Don'ts</CardTitle>
            </CardHeader>
            <CardList>
              {displayDonts.map((item, i) => (
                <CardItem key={i} $type="dont">{item}</CardItem>
              ))}
            </CardList>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
}

export default Dresscode;
