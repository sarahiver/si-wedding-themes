// Botanical LoveStory - Winding Garden Path
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const fadeGrow = keyframes`
  from { opacity: 0; transform: scale(0.9) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-cream);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '120px'};
  height: ${p => p.$size || '120px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.08};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '12s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '15px'});
  transition: all 0.6s var(--ease-nature);
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s var(--ease-nature) 0.1s;
`;

// Winding path layout
const PathContainer = styled.div`
  position: relative;
  
  /* The winding path SVG */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(
      180deg,
      var(--earth-sand) 0%,
      var(--earth-clay) 100%
    );
    border-radius: 10px;
    transform: translateX(-50%);
    z-index: 0;
    
    @media (max-width: 768px) {
      left: 30px;
      transform: none;
    }
  }
`;

const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const EventItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  gap: 2rem;
  align-items: center;
  position: relative;
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? fadeGrow : 'none'} 0.8s var(--ease-nature) forwards;
  animation-delay: ${p => p.$index * 0.2}s;
  
  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr;
    gap: 1.5rem;
  }
  
  /* Alternating sides */
  &:nth-child(even) {
    .card {
      grid-column: 3;
      
      @media (max-width: 768px) {
        grid-column: 2;
      }
    }
    .year-side {
      grid-column: 1;
      text-align: right;
      
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
  
  &:nth-child(odd) {
    .card {
      grid-column: 1;
      text-align: right;
      
      @media (max-width: 768px) {
        grid-column: 2;
        text-align: left;
      }
    }
    .year-side {
      grid-column: 3;
      
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
`;

// Stone marker on the path
const StoneMarker = styled.div`
  grid-column: 2;
  width: 70px;
  height: 70px;
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover` 
    : 'linear-gradient(135deg, var(--green-sage) 0%, var(--green-fern) 100%)'};
  border: 4px solid var(--bg-cream);
  border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  box-shadow: var(--shadow-medium);
  position: relative;
  z-index: 2;
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-deep);
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
    width: 55px;
    height: 55px;
    font-size: 1.5rem;
  }
`;

const ContentCard = styled.div`
  background: var(--bg-fog);
  padding: 1.75rem;
  border-radius: 30px;
  box-shadow: var(--shadow-soft);
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
    background: var(--bg-cream);
  }
`;

const EventDate = styled.div`
  display: inline-block;
  font-family: var(--font-handwritten);
  font-size: 1.25rem;
  color: var(--accent-golden);
  margin-bottom: 0.5rem;
`;

const EventTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.75rem;
  color: var(--green-forest);
  margin-bottom: 0.75rem;
`;

const EventDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-medium);
  line-height: 1.7;
`;

const YearDisplay = styled.div`
  font-family: var(--font-handwritten);
  font-size: 3rem;
  color: var(--green-sage);
  opacity: 0.4;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

function LoveStory() {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  
  const title = lovestoryData.title || 'Unsere Geschichte';
  const events = lovestoryData.events || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultEvents = [
    { date: '2019', title: 'Das erste Treffen', description: 'Bei Freunden auf einer Gartenparty haben wir uns zum ersten Mal gesehen. Ein Blick genügte.', emoji: '✨', image: '' },
    { date: '2020', title: 'Das erste Date', description: 'Ein Spaziergang im Park, der nie enden sollte. Wir haben die Zeit vergessen.', emoji: '☕', image: '' },
    { date: '2021', title: 'Zusammengezogen', description: 'Endlich unter einem Dach! Unsere erste gemeinsame Wohnung mit Balkon voller Pflanzen.', emoji: '🏠', image: '' },
    { date: '2023', title: 'Der Antrag', description: 'Unter unserem Lieblingsbaum im Park, bei Sonnenuntergang. Sie hat "Ja" gesagt!', emoji: '💍', image: '' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="story">
      {/* Decorative leaves */}
      <DecoLeaf $size="200px" $color="var(--green-mint)" $opacity={0.06} style={{ top: '5%', right: '-5%' }} />
      <DecoLeaf $size="150px" $color="var(--green-sage)" $opacity={0.05} style={{ bottom: '10%', left: '-3%' }} $duration="15s" />
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>💕 Wie alles begann</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <PathContainer>
          <Events>
            {items.map((item, index) => (
              <EventItem key={index} $index={index} $visible={visible}>
                <ContentCard className="card">
                  <EventDate>{item.date}</EventDate>
                  <EventTitle>{item.title}</EventTitle>
                  <EventDescription>{item.description}</EventDescription>
                </ContentCard>
                
                <StoneMarker $image={item.image}>
                  {!item.image && (item.emoji || '🌿')}
                </StoneMarker>
                
                <YearDisplay className="year-side">
                  {item.date}
                </YearDisplay>
              </EventItem>
            ))}
          </Events>
        </PathContainer>
      </Container>
    </Section>
  );
}

export default LoveStory;
