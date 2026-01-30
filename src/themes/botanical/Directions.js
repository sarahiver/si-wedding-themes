import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.1s;
  `}
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  padding: clamp(2rem, 4vw, 3rem);
  position: relative;
  overflow: hidden;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.2s;
  `}
  
  /* Top highlight */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255,255,255,0.15) 20%, 
      rgba(255,255,255,0.25) 50%, 
      rgba(255,255,255,0.15) 80%, 
      transparent 100%
    );
    pointer-events: none;
  }
`;

const DirectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const DirectionItem = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const ItemIcon = styled.span`
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.75rem;
`;

const ItemText = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
`;

const Note = styled.div`
  margin-top: 2rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 0 12px 12px 0;
  
  p {
    font-family: var(--font-display);
    font-size: 1rem;
    font-style: italic;
    color: var(--text-muted);
    margin: 0;
  }
`;

// ============================================
// COMPONENT
// ============================================

function Directions() {
  const { content } = useWedding();
  const directionsData = content?.directions || {};
  
  const title = directionsData.title || 'Anfahrt';
  const items = directionsData.items || [];
  const note = directionsData.note || '';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultItems = [
    {
      icon: '🚗',
      title: 'Mit dem Auto',
      text: 'Parkplätze sind vor Ort vorhanden. Navigation: Landhaus Walter, Elbchaussee 547, Hamburg',
    },
    {
      icon: '🚇',
      title: 'Öffentliche Verkehrsmittel',
      text: 'S-Bahn bis Blankenese, dann Bus 286 bis Teufelsbrück. Von dort 5 Minuten zu Fuß.',
    },
    {
      icon: '🚕',
      title: 'Taxi',
      text: 'Für den Rückweg organisieren wir gerne Taxis. Bitte am Empfang Bescheid geben.',
    },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

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
    <Section id="directions" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>So kommt ihr hin</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <GlassCard $visible={visible}>
          <DirectionsGrid>
            {displayItems.map((item, i) => (
              <DirectionItem key={i}>
                {item.icon && <ItemIcon>{item.icon}</ItemIcon>}
                <ItemTitle>{item.title}</ItemTitle>
                <ItemText>{item.text}</ItemText>
              </DirectionItem>
            ))}
          </DirectionsGrid>
          
          {note && (
            <Note>
              <p>{note}</p>
            </Note>
          )}
        </GlassCard>
      </Container>
    </Section>
  );
}

export default Directions;
