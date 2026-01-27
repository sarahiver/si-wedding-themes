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

const WeddingABC = ({ config = {} }) => {
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
    { letter: 'B', word: 'Blumen', description: 'Ihr müsst keine Blumen mitbringen - für die Dekoration ist gesorgt. Aber über kleine Aufmerksamkeiten freuen wir uns natürlich!' },
    { letter: 'C', word: 'Countdown', description: 'Die Tage bis zu unserem großen Tag könnt ihr oben im Countdown verfolgen. Wir sind schon sehr aufgeregt!' },
    { letter: 'D', word: 'Dresscode', description: 'Elegante Abendgarderobe. Details findet ihr unter "Dresscode". Bitte keine weißen Outfits - das ist der Braut vorbehalten.' },
    { letter: 'E', word: 'Essen', description: 'Es erwartet euch ein köstliches Menü. Bitte teilt uns Allergien oder Unverträglichkeiten bei der RSVP mit.' },
    { letter: 'F', word: 'Fotos', description: 'Während der Zeremonie bitten wir euch, auf Fotos zu verzichten. Bei der Feier dürft ihr gerne knipsen!' },
    { letter: 'G', word: 'Geschenke', description: 'Eure Anwesenheit ist das größte Geschenk! Falls ihr uns etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise.' },
    { letter: 'H', word: 'Hotel', description: 'Unterkünfte in der Nähe findet ihr unter "Unterkünfte". Reserviert frühzeitig!' },
    { letter: 'I', word: 'Instagram', description: 'Teilt eure Bilder gerne mit unserem Hashtag! Den findet ihr auf der Startseite.' },
    { letter: 'J', word: 'Ja-Wort', description: 'Das Ja-Wort geben wir uns um 14:00 Uhr in der Kirche. Bitte seid pünktlich!' },
    { letter: 'K', word: 'Kinder', description: 'Wir haben uns für eine Feier nur für Erwachsene entschieden. Wir hoffen auf euer Verständnis.' },
    { letter: 'L', word: 'Location', description: 'Die Zeremonie findet in der Kirche statt, die Feier anschließend in der Eventlocation. Details unter "Locations".' },
    { letter: 'M', word: 'Musik', description: 'Ihr habt Musikwünsche? Teilt sie uns mit unter "Musikwünsche"! Wir freuen uns auf eure Vorschläge.' },
    { letter: 'N', word: 'Notfall', description: 'Bei Notfällen oder dringenden Fragen wendet euch an unsere Trauzeugen. Kontaktdaten unter "Trauzeugen".' },
    { letter: 'O', word: 'Outfit', description: 'Elegante Abendgarderobe. Denkt an bequeme Schuhe für die Tanzfläche!' },
    { letter: 'P', word: 'Party', description: 'Nach dem Dinner wird gefeiert! Die Tanzfläche öffnet gegen 22:00 Uhr.' },
    { letter: 'Q', word: 'Quatsch', description: 'Lustige Einlagen und Spiele sind willkommen - aber bitte koordiniert euch mit unseren Trauzeugen.' },
    { letter: 'R', word: 'RSVP', description: 'Bitte bestätigt eure Teilnahme bis zum angegebenen Datum. Das hilft uns enorm bei der Planung!' },
    { letter: 'S', word: 'Sektempfang', description: 'Nach der Zeremonie laden wir zum Sektempfang ein. Stoßt mit uns an!' },
    { letter: 'T', word: 'Trauzeugen', description: 'Unsere Trauzeugen sind eure Ansprechpartner für alle Fragen rund um die Hochzeit.' },
    { letter: 'U', word: 'Unterkunft', description: 'Hotels in der Nähe findet ihr unter "Unterkünfte". Reserviert frühzeitig!' },
    { letter: 'V', word: 'Verspätung', description: 'Bitte plant genug Zeit für die Anreise ein. Die Zeremonie beginnt pünktlich!' },
    { letter: 'W', word: 'Wetter', description: 'Egal ob Sonne oder Regen - wir feiern! Plant aber sicherheitshalber für beide Szenarien.' },
    { letter: 'X', word: 'X-tra', description: 'Alle weiteren Infos findet ihr in unserem FAQ oder fragt einfach nach!' },
    { letter: 'Y', word: 'Yeah!', description: 'Wir freuen uns riesig auf die Feier mit euch! Es wird ein unvergesslicher Tag!' },
    { letter: 'Z', word: 'Zeit', description: 'Nehmt euch Zeit, diesen besonderen Tag mit uns zu genießen. Die Feier geht bis in die frühen Morgenstunden!' }
  ];
  
  const abcItems = config.abcItems || defaultABC;
  
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
          <Title>Wedding ABC</Title>
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
