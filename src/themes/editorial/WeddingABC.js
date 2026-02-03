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
  margin-bottom: clamp(3rem, 6vw, 5rem);
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
  font-size: clamp(3rem, 12vw, 7rem);
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

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 1.5rem;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const ABCGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 2rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const ABCItem = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid var(--editorial-red);
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    flex-shrink: 0;
    width: 80vw;
    max-width: 320px;
    scroll-snap-align: start;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(5px);
  }
`;

const Letter = styled.span`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 8vw, 4rem);
  font-weight: 700;
  color: var(--editorial-red);
  line-height: 0.9;
  flex-shrink: 0;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-white);
  margin-bottom: 0.5rem;
`;

const ItemText = styled.p`
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0;
`;

// ============================================
// COMPONENT
// ============================================

function WeddingABC() {
  const { content } = useWedding();
  const abcData = content?.weddingabc || {};
  
  const title = abcData.title || 'Hochzeits-ABC';
  const description = abcData.description || 'Von A wie Anfahrt bis Z wie Zeitplan – alles Wichtige auf einen Blick.';
  const items = abcData.entries || [];

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

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

  // Keine Default-Einträge - zeige nichts wenn keine Einträge angelegt
  if (items.length === 0) return null;

  return (
    <Section id="weddingabc" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Alles Wichtige</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        <ABCGrid $visible={visible}>
          {items.map((item, i) => (
            <ABCItem key={i}>
              <Letter>{item.letter}</Letter>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemText>{item.text}</ItemText>
              </ItemContent>
            </ABCItem>
          ))}
        </ABCGrid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
