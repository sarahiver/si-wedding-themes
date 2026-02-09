import { useWedding } from '../../context/WeddingContext';
// src/components/Dresscode.js - Neon Theme
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const holographicShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(0,255,255,0.5); }
`;

const scanlineAnim = keyframes`
  0% { top: -100%; }
  100% { top: 100%; }
`;

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: 150px 5%;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,0,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,0,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 20px;
  
  &::before, &::after {
    content: '//';
    margin: 0 15px;
    color: #00ffff;
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  
  span {
    background: linear-gradient(90deg, #00ffff, #ff00ff, #00ffff);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${holographicShift} 3s ease-in-out infinite;
  }
`;

const Subtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  margin-top: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    margin: 0 calc(-1 * var(--section-padding-x, 24px));
    padding: 0 var(--section-padding-x, 24px);
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const DressCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$color || '#00ffff'}40;
  padding: 50px;
  position: relative;
  overflow: hidden;
  animation: ${fadeInScale} 0.6s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;
  transition: all 0.4s ease;

  @media (max-width: 768px) {
    flex: 0 0 85vw;
    max-width: 85vw;
    scroll-snap-align: center;
    padding: 30px 25px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${p => p.$color || '#00ffff'};
    box-shadow: 0 0 20px ${p => p.$color || '#00ffff'};
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${p => p.$color || '#00ffff'}30, transparent);
    animation: ${scanlineAnim} 4s linear infinite;
    pointer-events: none;
  }
  
  &:hover {
    border-color: ${p => p.$color || '#00ffff'};
    box-shadow: 0 0 40px ${p => p.$color || '#00ffff'}30;
    transform: translateY(-5px);
  }
`;

const CardIcon = styled.div`
  width: 80px;
  height: 80px;
  border: 2px solid ${p => p.$color || '#00ffff'}50;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  position: relative;
  animation: ${glowPulse} 3s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 1px solid ${p => p.$color || '#00ffff'}30;
  }
  
  svg {
    width: 40px;
    height: 40px;
    color: ${p => p.$color || '#00ffff'};
  }
`;

const CardLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: ${p => p.$color || '#00ffff'};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 15px;
  
  &::before {
    content: '// ';
    opacity: 0.5;
  }
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 25px;
`;

const CardDescription = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
  margin-bottom: 30px;
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  
  &::before {
    content: '>';
    color: ${p => p.$color || '#00ffff'};
    font-family: 'Space Grotesk', monospace;
  }
`;

const AvoidSection = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const AvoidLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: #ff4444;
  letter-spacing: 0.1em;
  margin-bottom: 15px;
  
  &::before {
    content: '⚠ ';
  }
`;

const AvoidItem = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  text-decoration: line-through;
  margin-right: 15px;
`;

const InfoBox = styled.div`
  margin-top: 60px;
  background: rgba(0,255,136,0.05);
  border: 1px solid rgba(0,255,136,0.2);
  padding: 30px;
  text-align: center;
  
  &::before {
    content: '💡';
    display: block;
    font-size: 2rem;
    margin-bottom: 15px;
  }
  
  p {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    
    strong {
      color: #00ff88;
    }
  }
`;

function Dresscode() {
  const { content } = useWedding();
  const dresscodeData = content?.dresscode || {};
  const title = dresscodeData.title || 'Dresscode';
  const code = dresscodeData.code || 'Festlich Elegant';
  const description = dresscodeData.description || '';

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const defaultDresscodes = [
    {
      id: 'ladies',
      icon: 'dress',
      label: 'FOR HER',
      title: 'Ladies',
      description: 'Cocktailkleid, elegantes Abendkleid oder schicker Jumpsuit.',
      color: '#ff00ff',
      suggestions: dresscodeData.dos?.length > 0 ? dresscodeData.dos : ['Cocktailkleid', 'Elegantes Jumpsuit', 'Midi/Maxi Kleid'],
      avoid: dresscodeData.donts?.length > 0 ? dresscodeData.donts : ['Weiß', 'Casual Jeans']
    },
    {
      id: 'gents',
      icon: 'suit',
      label: 'FOR HIM',
      title: 'Gentlemen',
      description: 'Anzug mit oder ohne Krawatte, gerne auch Hemd mit Chinos.',
      color: '#00ffff',
      suggestions: dresscodeData.dos?.length > 0 ? dresscodeData.dos : ['Anzug', 'Hemd + Chinos', 'Bequeme Schuhe'],
      avoid: dresscodeData.donts?.length > 0 ? dresscodeData.donts : ['Jeans', 'Sneakers']
    }
  ];

  const dresscodes = defaultDresscodes;
  const tip = description || 'Die Location ist teilweise im Freien. Denkt an einen Blazer oder Stola für den Abend!';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getIcon = (type) => {
    if (type === 'dress') {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L9 7H6l3 7-3 8h12l-3-8 3-7h-3l-3-5zm0 2.5L13.5 7h-3L12 4.5z"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2v6l2 2v12h8V10l2-2V2h-2v4l-1 1V2h-2v5l-1-1V2H10v5L9 6V2H6zm3 2v2l1 1V4H9zm4 0v3l1-1V4h-1z"/>
      </svg>
    );
  };

  return (
    <Section ref={sectionRef} id="dresscode">
      <GridBG />
      
      <Container>
        <Header $visible={visible}>
          <Eyebrow>What to Wear</Eyebrow>
          <Title><span>{title}</span></Title>
          <Subtitle>Festlich & Elegant – aber das Wichtigste ist, dass ihr euch wohlfühlt!</Subtitle>
        </Header>
        
        <CardsGrid>
          {dresscodes.map((code, i) => (
            <DressCard key={code.id} $color={code.color} $delay={`${i * 0.2}s`}>
              <CardIcon $color={code.color}>
                {getIcon(code.icon)}
              </CardIcon>
              
              <CardLabel $color={code.color}>{code.label}</CardLabel>
              <CardTitle>{code.title}</CardTitle>
              <CardDescription>{code.description}</CardDescription>
              
              <SuggestionsList>
                {code.suggestions.map((item, j) => (
                  <SuggestionItem key={j} $color={code.color}>
                    {item}
                  </SuggestionItem>
                ))}
              </SuggestionsList>
              
              {code.avoid && code.avoid.length > 0 && (
                <AvoidSection>
                  <AvoidLabel>BITTE NICHT</AvoidLabel>
                  <div>
                    {code.avoid.map((item, j) => (
                      <AvoidItem key={j}>{item}</AvoidItem>
                    ))}
                  </div>
                </AvoidSection>
              )}
            </DressCard>
          ))}
        </CardsGrid>
        
        {tip && (
          <InfoBox>
            <p><strong>PRO TIP:</strong> {tip}</p>
          </InfoBox>
        )}
      </Container>
    </Section>
  );
}

export default Dresscode;
