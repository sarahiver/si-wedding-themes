import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { height: 0; }
  to { height: 100%; }
`;

const dotPulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
  50% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(255,255,255,0); }
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

const Subtitle = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.2s;
  `}
`;

const TimelineContainer = styled.div`
  position: relative;
  padding-left: 3rem;
  
  @media (max-width: 768px) {
    padding-left: 2rem;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
    
    ${p => p.$visible && css`
      animation: ${lineGrow} 1.5s ease forwards;
      animation-delay: 0.5s;
    `}
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 3rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: ${0.3 + p.$index * 0.15}s;
  `}
  
  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  left: -2.5rem;
  top: 0.5rem;
  width: 18px;
  height: 18px;
  background: var(--bg-dark);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  z-index: 2;
  
  ${TimelineItem}:hover & {
    animation: ${dotPulse} 1.5s ease infinite;
    border-color: var(--text-light);
  }
  
  @media (max-width: 768px) {
    left: -1.75rem;
    width: 14px;
    height: 14px;
  }
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: var(--glass-shadow);
  padding: clamp(1.5rem, 3vw, 2rem);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
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
    transform: translateX(5px);
  }
`;

const Year = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 0.75rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.75rem;
`;

const ItemDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 1rem;
  filter: brightness(0.9);
  transition: all 0.4s ease;
  
  ${GlassCard}:hover & {
    filter: brightness(1);
  }
`;

// ============================================
// COMPONENT
// ============================================

function LoveStory() {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  
  const title = lovestoryData.title || 'Unsere Geschichte';
  const subtitle = lovestoryData.subtitle || '';
  const events = lovestoryData.events || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultItems = [
    { year: '2019', title: 'Das erste Treffen', description: 'Bei gemeinsamen Freunden auf einer Sommerparty.' },
    { year: '2021', title: 'Zusammengezogen', description: 'Endlich unter einem Dach – unsere erste gemeinsame Wohnung.' },
    { year: '2024', title: 'Der Antrag', description: 'Bei Sonnenuntergang am Strand. Sie hat Ja gesagt!' },
  ];

  const displayItems = events.length > 0 ? events : defaultItems;

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
    <Section id="lovestory" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Wie alles begann</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          {subtitle && <Subtitle $visible={visible}>{subtitle}</Subtitle>}
        </Header>
        
        <TimelineContainer>
          <TimelineLine $visible={visible} />
          
          {displayItems.map((item, i) => (
            <TimelineItem key={i} $visible={visible} $index={i}>
              <TimelineDot />
              <GlassCard>
                <Year>{item.date || item.year}</Year>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
                {item.image && <ItemImage src={optimizedUrl.card(item.image)} alt={item.title} loading="lazy" />}
              </GlassCard>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </Container>
    </Section>
  );
}

export default LoveStory;
