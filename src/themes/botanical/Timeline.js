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
  max-width: 800px;
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

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: var(--glass-shadow);
  padding: clamp(1.25rem, 3vw, 1.75rem);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: ${0.2 + p.$index * 0.1}s;
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
  
  &:hover {
    background: var(--glass-bg-hover);
    transform: translateX(10px);
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const TimeBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  text-align: center;
  min-width: 80px;
  flex-shrink: 0;
`;

const Time = styled.span`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--text-light);
  display: block;
`;

const Icon = styled.span`
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.4rem);
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.25rem;
`;

const ItemDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
`;

// ============================================
// COMPONENT
// ============================================

function Timeline() {
  const { content } = useWedding();
  const timelineData = content?.timeline || {};
  
  const title = timelineData.title || 'Tagesablauf';
  const items = timelineData.items || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultItems = [
    { time: '14:00', title: 'Standesamtliche Trauung', description: 'Standesamt Hamburg-Mitte', icon: '💒' },
    { time: '15:30', title: 'Sektempfang', description: 'Im Garten des Landhauses', icon: '🥂' },
    { time: '17:00', title: 'Kaffee & Kuchen', description: 'Süße Stärkung für alle', icon: '☕' },
    { time: '19:00', title: 'Abendessen', description: 'Festliches Menü im Saal', icon: '🍽️' },
    { time: '21:00', title: 'Eröffnungstanz', description: 'Der erste Tanz als Ehepaar', icon: '💃' },
    { time: '22:00', title: 'Party', description: 'Tanzen bis in die Nacht', icon: '🎉' },
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
    <Section id="timeline" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Der große Tag</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <TimelineList>
          {displayItems.map((item, i) => (
            <GlassCard key={i} $visible={visible} $index={i}>
              <TimeBox>
                <Time>{item.time}</Time>
              </TimeBox>
              {item.icon && <Icon>{item.icon}</Icon>}
              <Content>
                <ItemTitle>{item.title}</ItemTitle>
                {item.description && (
                  <ItemDescription>{item.description}</ItemDescription>
                )}
              </Content>
            </GlassCard>
          ))}
        </TimelineList>
      </Container>
    </Section>
  );
}

export default Timeline;
