// src/components/Dresscode.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #FAF8F5;
  position: relative;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.5);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #1A1A1A;

  span {
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #888;
  margin-top: 15px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Card = styled.div`
  text-align: center;
  padding: 60px 40px;
  background: #FFFFFF;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.06);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease ${p => 0.2 + p.$index * 0.15}s;
`;

const CardIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 30px;
`;

const CardTitle = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.8rem;
  color: #1A1A1A;
  margin-bottom: 20px;
`;

const CardDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 25px;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
`;

const ColorSwatch = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 2px solid ${p => p.$color === '#FFFFFF' ? '#E0E0E0' : p.$color};
  position: relative;

  ${p => p.$forbidden && `
    &::after {
      content: '×';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #CC0000;
      font-size: 1.5rem;
      font-weight: bold;
    }
  `}
`;

const Note = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #B8976A;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

function Dresscode() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="dresscode">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Dresscode</Eyebrow>
          <Title>Festlich <span>Elegant</span></Title>
          <Subtitle>Wir freuen uns, wenn ihr euch schick macht für unseren großen Tag</Subtitle>
        </Header>

        <Grid>
          <Card $visible={isVisible} $index={0}>
            <CardIcon>👔</CardIcon>
            <CardTitle>Für die Herren</CardTitle>
            <CardDescription>
              Anzug mit oder ohne Krawatte. Dunkle, gedeckte Farben sind ideal. 
              Bei warmem Wetter ist auch ein eleganter Sommerlook angemessen.
            </CardDescription>
            <ColorPalette>
              <ColorSwatch $color="#1A1A1A" title="Schwarz" />
              <ColorSwatch $color="#2F4F4F" title="Anthrazit" />
              <ColorSwatch $color="#4A4A6A" title="Navy" />
              <ColorSwatch $color="#6B5B4A" title="Braun" />
            </ColorPalette>
          </Card>

          <Card $visible={isVisible} $index={1}>
            <CardIcon>👗</CardIcon>
            <CardTitle>Für die Damen</CardTitle>
            <CardDescription>
              Ein schickes Cocktailkleid, eleganter Hosenanzug oder ein langes Abendkleid. 
              Bequeme Schuhe für die Tanzfläche nicht vergessen!
            </CardDescription>
            <ColorPalette>
              <ColorSwatch $color="#B8976A" title="Gold" />
              <ColorSwatch $color="#4A6B5A" title="Grün" />
              <ColorSwatch $color="#5A4A6B" title="Lila" />
              <ColorSwatch $color="#FFFFFF" $forbidden title="Weiß - bitte nicht" />
            </ColorPalette>
            <Note>Bitte verzichtet auf Weiß – das ist der Braut vorbehalten ✨</Note>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
}

export default Dresscode;
