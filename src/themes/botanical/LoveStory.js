import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const growIn = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
  position: relative;
  overflow: hidden;
`;

// Floating decorative elements
const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  opacity: ${p => p.opacity || 0.15};
  top: ${p => p.top};
  left: ${p => p.left};
  right: ${p => p.right};
  animation: ${float} ${p => p.duration}s ease-in-out infinite;
  animation-delay: ${p => p.delay}s;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
    fill: var(--sage);
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

// Organic curved timeline
const Timeline = styled.div`
  position: relative;
  
  /* Curved vine line */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, 
      var(--sage-light) 0%, 
      var(--sage) 30%, 
      var(--sage) 70%, 
      var(--sage-light) 100%
    );
    transform: translateX(-50%);
    transform-origin: top;
    animation: ${p => p.visible ? growIn : 'none'} 1.5s ease forwards;
    animation-delay: 0.3s;
    border-radius: 10px;
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const Milestone = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 1fr;
  gap: 2rem;
  margin-bottom: 5rem;
  position: relative;
  
  &:last-child { margin-bottom: 0; }
  
  /* Alternate sides */
  &:nth-child(odd) {
    .content { grid-column: 1; text-align: right; }
    .marker { grid-column: 2; }
    .image { grid-column: 3; }
  }
  
  &:nth-child(even) {
    .content { grid-column: 3; text-align: left; }
    .marker { grid-column: 2; }
    .image { grid-column: 1; grid-row: 1; }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr;
    gap: 1.5rem;
    
    &:nth-child(odd), &:nth-child(even) {
      .marker { grid-column: 1; grid-row: 1 / 3; }
      .content { grid-column: 2; grid-row: 1; text-align: left; }
      .image { grid-column: 2; grid-row: 2; }
    }
  }
`;

const MilestoneMarker = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
  
  /* Reveal animation */
  opacity: ${p => p.visible ? 1 : 0};
  transform: scale(${p => p.visible ? 1 : 0.5});
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: ${p => p.index * 0.15}s;
`;

const MarkerCircle = styled.div`
  width: 70px;
  height: 70px;
  background: var(--cream);
  border: 3px solid var(--sage);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 20px rgba(139, 157, 131, 0.2);
  
  /* Inner decoration */
  &::before {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px dashed var(--sage-light);
    border-radius: 50%;
  }
  
  /* Year text */
  span {
    font-family: 'Playfair Display', serif;
    font-size: 0.9rem;
    font-style: italic;
    color: var(--forest);
  }
`;

const LeafOnMarker = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  animation: ${float} 3s ease-in-out infinite;
  
  svg {
    width: 100%;
    height: 100%;
    fill: var(--sage);
  }
`;

const MilestoneContent = styled.div`
  padding-top: 1rem;
  
  /* Slide in animation */
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateX(${p => p.visible ? 0 : (p.fromRight ? '40px' : '-40px')});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.1 + p.index * 0.15}s;
`;

const MilestoneTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.75rem;
`;

const MilestoneText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--text-light);
  line-height: 1.9;
`;

const MilestoneImage = styled.div`
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.2 + p.index * 0.15}s;
`;

const ImageFrame = styled.div`
  position: relative;
  border-radius: 100px 100px 20px 20px;
  overflow: hidden;
  background: var(--cream-dark);
  aspect-ratio: 3/4;
  max-width: 280px;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  /* Decorative border */
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(139,157,131,0.3);
    border-radius: 92px 92px 12px 12px;
    pointer-events: none;
    z-index: 2;
    transition: all var(--transition-normal);
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    
    &::before {
      inset: 12px;
      border-color: var(--sage);
    }
    
    img {
      transform: scale(1.08);
    }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 20px;
    
    &::before { border-radius: 12px; }
  }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--cream-dark), var(--cream));
  gap: 0.5rem;
  
  .year {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-style: italic;
    color: var(--sage-light);
  }
  
  .icon {
    font-size: 2rem;
    opacity: 0.5;
  }
`;

// Small decorative vine between milestones
const VineDecor = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 40px;
  opacity: 0.3;
  
  svg {
    width: 100%;
    height: 100%;
    fill: var(--sage);
  }
  
  @media (max-width: 768px) {
    left: 30px;
    transform: none;
  }
`;

// SVG
const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

const SmallLeafSVG = () => (
  <svg viewBox="0 0 24 24">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function LoveStory({
  milestones = [
    { 
      year: '2020', 
      title: 'Der erste Blick', 
      text: 'Zwischen blühenden Pfingstrosen im Botanischen Garten kreuzten sich unsere Wege zum ersten Mal. Ein zufälliges Gespräch über Orchideen wurde zum Beginn von allem.', 
      image: null 
    },
    { 
      year: '2021', 
      title: 'Gemeinsam wachsen', 
      text: 'Wie zwei Pflanzen, die ihre Wurzeln verschränken, wuchsen wir zusammen – durch sonnige Tage und stürmische Nächte, immer füreinander da.', 
      image: null 
    },
    { 
      year: '2023', 
      title: 'Ein neues Zuhause', 
      text: 'Mit einem kleinen Garten voller Wildblumen fanden wir unseren Ort, an dem Liebe gedeihen kann. Unser erstes gemeinsames Heim.', 
      image: null 
    },
    { 
      year: '2024', 
      title: 'Die große Frage', 
      text: 'Unter dem alten Apfelbaum, zwischen fallenden Blütenblättern, kniete Benjamin nieder – und Olivia sagte unter Freudentränen Ja.', 
      image: null 
    },
  ],
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

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
      <FloatingLeaf size={80} top="5%" left="3%" duration={8} delay={0}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf size={60} top="40%" right="5%" duration={10} delay={2}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf size={50} top="70%" left="8%" duration={7} delay={1}><LeafSVG /></FloatingLeaf>
      
      <Container>
        <Header visible={visible}>
          <Eyebrow>Unsere Reise</Eyebrow>
          <Title>Wie alles begann</Title>
        </Header>
        
        <Timeline visible={visible}>
          {milestones.map((m, i) => (
            <Milestone key={i}>
              <MilestoneContent 
                className="content" 
                index={i} 
                visible={visible} 
                fromRight={i % 2 === 1}
              >
                <MilestoneTitle>{m.title}</MilestoneTitle>
                <MilestoneText>{m.text}</MilestoneText>
              </MilestoneContent>
              
              <MilestoneMarker className="marker" index={i} visible={visible}>
                <MarkerCircle>
                  <span>{m.year}</span>
                  <LeafOnMarker>
                    <SmallLeafSVG />
                  </LeafOnMarker>
                </MarkerCircle>
              </MilestoneMarker>
              
              <MilestoneImage className="image" index={i} visible={visible}>
                <ImageFrame>
                  {m.image ? (
                    <img src={m.image} alt={m.title} />
                  ) : (
                    <Placeholder>
                      <span className="icon">🌸</span>
                      <span className="year">{m.year}</span>
                    </Placeholder>
                  )}
                </ImageFrame>
              </MilestoneImage>
            </Milestone>
          ))}
        </Timeline>
      </Container>
    </Section>
  );
}

export default LoveStory;
