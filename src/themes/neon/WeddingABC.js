import { useWedding } from '../../context/WeddingContext';
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0%, 100% { 
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }
  50% { 
    text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
  }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.8; }
  94% { opacity: 1; }
  96% { opacity: 0.9; }
  97% { opacity: 1; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const Section = styled.section`
  min-height: 100vh;
  background: var(--neon-bg);
  padding: 120px 5vw;
  position: relative;
  overflow: hidden;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 255, 255, 0.1),
    transparent
  );
  animation: ${scanline} 8s linear infinite;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const CommandLine = styled.div`
  font-family: 'Space Grotesk', monospace;
  color: var(--neon-green);
  font-size: 0.9rem;
  margin-bottom: 15px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.5s ease;
  
  &::before {
    content: '$ ';
    color: var(--neon-cyan);
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: white;
  margin-bottom: 15px;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 30px rgba(0, 255, 255, 0.4);
  animation: ${flicker} 4s infinite;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  font-family: 'Space Grotesk', sans-serif;
`;

const ABCGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
`;

const LetterCard = styled.div`
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid ${props => props.isActive ? props.color : 'rgba(255, 255, 255, 0.1)'};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-top: 2px solid ${props => props.color};
    border-left: 2px solid ${props => props.color};
    opacity: ${props => props.isActive ? 1 : 0.3};
    transition: opacity 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-bottom: 2px solid ${props => props.color};
    border-right: 2px solid ${props => props.color};
    opacity: ${props => props.isActive ? 1 : 0.3};
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: ${props => props.color};
    box-shadow: 
      0 0 20px ${props => props.color}40,
      inset 0 0 20px ${props => props.color}10;
    transform: scale(1.05);
    
    &::before, &::after {
      opacity: 1;
    }
  }
`;

const Letter = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.color};
  transition: all 0.3s ease;
  animation: ${props => props.isActive ? glowPulse : 'none'} 2s infinite;
  
  ${LetterCard}:hover & {
    animation: ${glowPulse} 1s infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 15, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background: var(--neon-bg);
  border: 1px solid var(--neon-cyan);
  max-width: 600px;
  width: 100%;
  position: relative;
  box-shadow: 
    0 0 50px rgba(0, 255, 255, 0.3),
    inset 0 0 30px rgba(0, 255, 255, 0.05);
`;

const ModalHeader = styled.div`
  background: rgba(0, 255, 255, 0.1);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 8px ${props => props.color};
`;

const ModalTitle = styled.span`
  color: var(--neon-cyan);
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  margin-left: 12px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 15px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--neon-pink);
    text-shadow: 0 0 10px var(--neon-pink);
  }
`;

const ModalBody = styled.div`
  padding: 40px;
  text-align: center;
`;

const ModalLetter = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 6rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 20px;
  animation: ${glowPulse} 2s infinite;
`;

const ModalWord = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const ModalDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
`;

const NavButton = styled.button`
  padding: 10px 25px;
  background: transparent;
  border: 1px solid ${props => props.disabled ? 'rgba(255,255,255,0.2)' : 'var(--neon-cyan)'};
  color: ${props => props.disabled ? 'rgba(255,255,255,0.3)' : 'var(--neon-cyan)'};
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: var(--neon-cyan);
    color: var(--neon-bg);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }
`;

const Counter = styled.span`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
`;

const WeddingABC = () => {
  const { content } = useWedding();
  const abcData = content?.weddingabc || {};
  const title = abcData.title || 'Wedding ABC';

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const neonColors = [
    '#00ffff', '#ff00ff', '#00ff88', '#b347ff', '#ff6b6b',
    '#00ffff', '#ff00ff', '#00ff88', '#b347ff', '#ff6b6b',
    '#00ffff', '#ff00ff', '#00ff88', '#b347ff', '#ff6b6b',
    '#00ffff', '#ff00ff', '#00ff88', '#b347ff', '#ff6b6b',
    '#00ffff', '#ff00ff', '#00ff88', '#b347ff', '#ff6b6b', '#00ffff'
  ];

  const defaultABC = [
    { letter: 'A', word: 'Anfahrt', description: 'Alle Informationen zur Anreise findet ihr unter "Anfahrt". Parkplätze sind ausreichend vorhanden.' },
    { letter: 'D', word: 'Dresscode', description: 'Elegante Abendgarderobe. Details findet ihr unter "Dresscode".' },
    { letter: 'G', word: 'Geschenke', description: 'Eure Anwesenheit ist das größte Geschenk!' },
    { letter: 'H', word: 'Hotel', description: 'Unterkünfte in der Nähe findet ihr unter "Unterkünfte".' },
    { letter: 'K', word: 'Kinder', description: 'Wir haben uns für eine Feier nur für Erwachsene entschieden.' },
    { letter: 'P', word: 'Party', description: 'Nach dem Dinner wird gefeiert!' },
  ];

  // Map from editor format to neon format
  const abcItems = abcData.entries?.length > 0
    ? abcData.entries.map(e => ({
        letter: e.letter,
        word: e.word,
        description: e.description
      }))
    : defaultABC;
  
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
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight' && selectedIndex < abcItems.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, abcItems.length]);
  
  const selectedItem = selectedIndex !== null ? abcItems[selectedIndex] : null;
  
  return (
    <Section ref={sectionRef} id="wedding-abc">
      <GridOverlay />
      <Scanline />
      
      <Container>
        <Header>
          <CommandLine visible={visible}>
            ./wedding_abc.sh --display-all
          </CommandLine>
          <Title>{title}</Title>
          <Subtitle>Von A wie Anfahrt bis Z wie Zeit</Subtitle>
        </Header>
        
        <ABCGrid>
          {abcItems.map((item, index) => (
            <LetterCard
              key={item.letter}
              color={neonColors[index]}
              isActive={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.4s ease ${index * 0.03}s`
              }}
            >
              <Letter color={neonColors[index]} isActive={selectedIndex === index}>
                {item.letter}
              </Letter>
            </LetterCard>
          ))}
        </ABCGrid>
      </Container>
      
      <Modal isOpen={selectedIndex !== null} onClick={() => setSelectedIndex(null)}>
        {selectedItem && (
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Dot color="#ff5f56" />
              <Dot color="#ffbd2e" />
              <Dot color="#27ca40" />
              <ModalTitle>abc_entry_{selectedItem.letter.toLowerCase()}.md</ModalTitle>
            </ModalHeader>
            <CloseButton onClick={() => setSelectedIndex(null)}>×</CloseButton>
            
            <ModalBody>
              <ModalLetter color={neonColors[selectedIndex]}>
                {selectedItem.letter}
              </ModalLetter>
              <ModalWord>{selectedItem.word}</ModalWord>
              <ModalDescription>{selectedItem.description}</ModalDescription>
            </ModalBody>
            
            <NavButtons>
              <NavButton 
                disabled={selectedIndex === 0}
                onClick={() => setSelectedIndex(selectedIndex - 1)}
              >
                ← Zurück
              </NavButton>
              <Counter>{selectedIndex + 1} / {abcItems.length}</Counter>
              <NavButton 
                disabled={selectedIndex === abcItems.length - 1}
                onClick={() => setSelectedIndex(selectedIndex + 1)}
              >
                Weiter →
              </NavButton>
            </NavButtons>
          </ModalContent>
        )}
      </Modal>
    </Section>
  );
};

export default WeddingABC;
