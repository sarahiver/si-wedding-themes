import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
  position: relative;
  overflow: hidden;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  opacity: 0.1;
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
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
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

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  margin-top: 1rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

// Alphabet Navigation
const AlphabetNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--cream-dark);
  border-radius: 20px;
  opacity: ${p => p.visible ? 1 : 0};
  transition: opacity 0.8s ease;
  transition-delay: 0.2s;
`;

const AlphabetLetter = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-style: italic;
  background: ${p => p.active ? 'var(--sage)' : 'transparent'};
  color: ${p => p.active ? 'var(--cream)' : p.hasEntry ? 'var(--forest)' : 'var(--sage-light)'};
  border: 1px solid ${p => p.active ? 'var(--sage)' : p.hasEntry ? 'var(--sage-light)' : 'transparent'};
  border-radius: 50%;
  cursor: ${p => p.hasEntry ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  &:hover {
    ${p => p.hasEntry && !p.active && `
      background: var(--sage-light);
      color: var(--forest);
      transform: scale(1.1);
    `}
  }
  
  @media (max-width: 600px) {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }
`;

// Grid
const ABCGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ABCCard = styled.div`
  background: var(--cream-dark);
  border-radius: 25px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.index * 0.08}s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(45, 59, 45, 0.1);
    
    .letter-bg {
      transform: scale(1.1) rotate(5deg);
      opacity: 0.08;
    }
  }
`;

const LetterBg = styled.div`
  position: absolute;
  top: -20px;
  right: -10px;
  font-family: 'Playfair Display', serif;
  font-size: 8rem;
  font-style: italic;
  color: var(--sage);
  opacity: 0.05;
  pointer-events: none;
  transition: all 0.4s ease;
  line-height: 1;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CardLetter = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sage);
  color: var(--cream);
  border-radius: 50%;
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-style: italic;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.7;
`;

// All button
const ShowAllButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  padding: 1rem 2rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage-dark);
  background: transparent;
  border: 1px solid var(--sage);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--sage);
    color: var(--cream);
  }
`;

// SVG
const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function WeddingABC({
  entries = [
    { letter: 'A', title: 'Anfahrt', text: 'Der Botanische Garten ist mit der U1 (Haltestelle Rotkreuzplatz) gut erreichbar. Parkplätze sind begrenzt – wir empfehlen öffentliche Verkehrsmittel.' },
    { letter: 'B', title: 'Blumen', text: 'Bitte keine Schnittblumen mitbringen – die Natur im Botanischen Garten ist unsere Dekoration. Wir unterstützen damit Nachhaltigkeit.' },
    { letter: 'D', title: 'Dresscode', text: 'Festlich in natürlichen, gedeckten Farben. Denkt an bequeme Schuhe für den Garten! Kein Weiß oder Creme.' },
    { letter: 'F', title: 'Fotos', text: 'Unplugged Trauung – genießt den Moment. Bei der Feier dürft ihr gerne fotografieren und Bilder später hochladen.' },
    { letter: 'G', title: 'Geschenke', text: 'Eure Anwesenheit ist das größte Geschenk. Wer möchte, kann zu unserer Hochzeitsreise beitragen.' },
    { letter: 'K', title: 'Kinder', text: 'Herzlich willkommen! Es gibt einen betreuten Spielbereich und Kindermenü.' },
    { letter: 'P', title: 'Parken', text: 'Begrenzte Parkplätze am Botanischen Garten. Wir empfehlen die Anreise mit der U-Bahn.' },
    { letter: 'S', title: 'Shuttle', text: 'Kein Shuttle nötig – Trauung und Feier finden am selben Ort statt.' },
    { letter: 'U', title: 'Unterkunft', text: 'Hotelkontingente sind im Hotel Laimer Hof reserviert. Codewort "Olivia & Benjamin" für Sonderkonditionen.' },
    { letter: 'W', title: 'Wetter', text: 'Bei Regen findet die Trauung im wunderschönen Gewächshaus statt. Bringt vorsichtshalber einen Schirm mit.' },
  ],
}) {
  const [visible, setVisible] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const sectionRef = useRef(null);

  // Generate alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const entryLetters = entries.map(e => e.letter.toUpperCase());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredEntries = showAll 
    ? entries 
    : activeLetter 
      ? entries.filter(e => e.letter.toUpperCase() === activeLetter)
      : entries;

  const handleLetterClick = (letter) => {
    if (entryLetters.includes(letter)) {
      if (activeLetter === letter) {
        setActiveLetter(null);
        setShowAll(true);
      } else {
        setActiveLetter(letter);
        setShowAll(false);
      }
    }
  };

  return (
    <Section ref={sectionRef} id="abc">
      {/* Floating decorations */}
      <FloatingLeaf size={100} top="10%" left="3%" duration={9} delay={0}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf size={70} top="60%" right="5%" duration={11} delay={2}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf size={50} top="85%" left="15%" duration={8} delay={1}><LeafSVG /></FloatingLeaf>

      <Container>
        <Header visible={visible}>
          <Eyebrow>Von A bis Z</Eyebrow>
          <Title>Hochzeits-ABC</Title>
          <Subtitle>Alles Wichtige auf einen Blick – von Anfahrt bis Zeitplan.</Subtitle>
        </Header>

        <AlphabetNav visible={visible}>
          {alphabet.map(letter => (
            <AlphabetLetter
              key={letter}
              hasEntry={entryLetters.includes(letter)}
              active={activeLetter === letter}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </AlphabetLetter>
          ))}
        </AlphabetNav>

        <ABCGrid>
          {filteredEntries.map((entry, i) => (
            <ABCCard key={entry.letter} index={i} visible={visible}>
              <LetterBg className="letter-bg">{entry.letter}</LetterBg>
              <CardContent>
                <CardLetter>{entry.letter}</CardLetter>
                <CardTitle>{entry.title}</CardTitle>
                <CardText>{entry.text}</CardText>
              </CardContent>
            </ABCCard>
          ))}
        </ABCGrid>

        {!showAll && (
          <ShowAllButton onClick={() => { setShowAll(true); setActiveLetter(null); }}>
            Alle anzeigen
          </ShowAllButton>
        )}
      </Container>
    </Section>
  );
}

export default WeddingABC;
