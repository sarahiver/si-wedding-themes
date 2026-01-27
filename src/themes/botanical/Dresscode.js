import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ═══════════════════════════════════════════════════════════════════════════
   DRESSCODE - BOTANICAL THEME
   Informationen zur Kleiderordnung für die Hochzeit
   ═══════════════════════════════════════════════════════════════════════════ */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const Section = styled.section`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--sage-lightest) 0%, var(--cream) 100%);
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '2rem'};
  opacity: 0.12;
  animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  bottom: ${p => p.$bottom};
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const DressIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
`;

const Eyebrow = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sage);
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1.5rem;
  
  span {
    font-style: italic;
    color: var(--sage);
  }
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.8;
  max-width: 550px;
  margin: 0 auto;
`;

const MainCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 4rem;
  border: 1px solid rgba(139, 157, 131, 0.2);
  box-shadow: 0 30px 80px rgba(139, 157, 131, 0.15);
  margin-bottom: 3rem;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--sage-light), var(--sage), var(--sage-light));
  }
`;

const DresscodeTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const DresscodeLabel = styled.div`
  display: inline-block;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
  background: var(--sage);
  padding: 0.6rem 2rem;
  border-radius: 50px;
  margin: 1.5rem 0;
`;

const DresscodeDescription = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.9;
  max-width: 600px;
  margin: 0 auto;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
`;

const ColorSwatch = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 3px solid white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
`;

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GenderCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 30px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 157, 131, 0.15);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay || '0.3s'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(139, 157, 131, 0.15);
  }
`;

const GenderIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const GenderTitle = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const SuggestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SuggestionItem = styled.li`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  padding: 0.6rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(139, 157, 131, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: '🌿';
    font-size: 0.9rem;
  }
`;

const TipsSection = styled.div`
  margin-top: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.5s;
`;

const TipsTitle = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--forest);
  text-align: center;
  margin-bottom: 2rem;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TipCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(139, 157, 131, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.85);
    transform: translateY(-3px);
  }
`;

const TipIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`;

const TipTitle = styled.h5`
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const TipText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: var(--text-light);
  line-height: 1.6;
`;

const Dresscode = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const colors = [
    { color: '#8B9D83', name: 'Sage' },
    { color: '#2D3B2D', name: 'Forest' },
    { color: '#C9B8A8', name: 'Taupe' },
    { color: '#E8DFD6', name: 'Cream' },
    { color: '#D4A574', name: 'Gold' },
    { color: '#F5F1ED', name: 'Ivory' }
  ];

  return (
    <Section ref={sectionRef} id="dresscode">
      <FloatingElement $top="10%" $left="5%" $size="2.5rem" $duration="7s">👗</FloatingElement>
      <FloatingElement $top="20%" $right="8%" $size="2rem" $duration="5s" $delay="1s">🌿</FloatingElement>
      <FloatingElement $top="60%" $left="3%" $size="2rem" $duration="8s" $delay="2s">🤵</FloatingElement>
      <FloatingElement $bottom="15%" $right="5%" $size="2.5rem" $duration="6s" $delay="0.5s">✨</FloatingElement>

      <Container>
        <Header $visible={isVisible}>
          <DressIcon>👔</DressIcon>
          <Eyebrow>Was ziehe ich an?</Eyebrow>
          <Title>Dress<span>code</span></Title>
          <Subtitle>
            Damit ihr wisst, was euch erwartet – hier findet ihr alle Informationen 
            zu unserem gewünschten Dresscode.
          </Subtitle>
        </Header>

        <MainCard $visible={isVisible}>
          <DresscodeTitle>Garden Party Elegance</DresscodeTitle>
          <DresscodeLabel>Semi-Formal / Festlich</DresscodeLabel>
          <DresscodeDescription>
            Wir freuen uns auf einen eleganten, aber entspannten Look. 
            Denkt an sommerliche Festlichkeit mit einem Hauch von Natur – 
            passend zu unserem botanischen Thema. Bequeme Schuhe empfohlen, 
            da die Feier teilweise im Freien stattfindet!
          </DresscodeDescription>
          
          <ColorPalette>
            {colors.map((c, i) => (
              <ColorSwatch key={i} $color={c.color} title={c.name} />
            ))}
          </ColorPalette>
        </MainCard>

        <GenderGrid>
          <GenderCard $visible={isVisible} $delay="0.3s">
            <GenderIcon>👗</GenderIcon>
            <GenderTitle>Für die Damen</GenderTitle>
            <SuggestionList>
              <SuggestionItem>Elegantes Cocktailkleid</SuggestionItem>
              <SuggestionItem>Fließender Maxirock mit Bluse</SuggestionItem>
              <SuggestionItem>Jumpsuit in gedeckten Tönen</SuggestionItem>
              <SuggestionItem>Midi-Kleid mit Blumenmuster</SuggestionItem>
              <SuggestionItem>Keil- oder Blockabsätze für den Rasen</SuggestionItem>
            </SuggestionList>
          </GenderCard>

          <GenderCard $visible={isVisible} $delay="0.4s">
            <GenderIcon>🤵</GenderIcon>
            <GenderTitle>Für die Herren</GenderTitle>
            <SuggestionList>
              <SuggestionItem>Anzug ohne Krawatte (optional)</SuggestionItem>
              <SuggestionItem>Chino mit Hemd und Sakko</SuggestionItem>
              <SuggestionItem>Helle Sommeranzüge willkommen</SuggestionItem>
              <SuggestionItem>Leinenhose mit elegantem Hemd</SuggestionItem>
              <SuggestionItem>Elegante Lederschuhe oder Loafer</SuggestionItem>
            </SuggestionList>
          </GenderCard>
        </GenderGrid>

        <TipsSection $visible={isVisible}>
          <TipsTitle>💡 Gut zu wissen</TipsTitle>
          <TipsGrid>
            <TipCard>
              <TipIcon>🚫</TipIcon>
              <TipTitle>Bitte vermeiden</TipTitle>
              <TipText>Weiß, Creme und Elfenbein sind der Braut vorbehalten</TipText>
            </TipCard>
            <TipCard>
              <TipIcon>👟</TipIcon>
              <TipTitle>Outdoor-Tipp</TipTitle>
              <TipText>Teile der Feier finden auf Rasen statt – Absätze mit Bedacht wählen</TipText>
            </TipCard>
            <TipCard>
              <TipIcon>🌡️</TipIcon>
              <TipTitle>Wetter</TipTitle>
              <TipText>Leichte Jacke oder Stola für den Abend einpacken</TipText>
            </TipCard>
          </TipsGrid>
        </TipsSection>
      </Container>
    </Section>
  );
};

export default Dresscode;
