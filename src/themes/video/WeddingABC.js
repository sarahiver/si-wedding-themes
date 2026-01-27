// src/components/WeddingABC.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #1A1A1A;
  position: relative;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.3);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #FFFFFF;

  span {
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 15px;
`;

const LetterNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 50px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease 0.1s;
`;

const LetterButton = styled.button`
  width: 40px;
  height: 40px;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.1rem;
  color: ${p => p.$active ? '#1A1A1A' : 'rgba(255, 255, 255, 0.5)'};
  background: ${p => p.$active ? '#B8976A' : 'transparent'};
  border: 1px solid ${p => p.$active ? '#B8976A' : 'rgba(255, 255, 255, 0.15)'};
  transition: all 0.3s ease;

  &:hover {
    border-color: #B8976A;
    color: ${p => p.$active ? '#1A1A1A' : '#B8976A'};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const EntriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const EntryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease ${p => p.$delay}s, border-color 0.3s ease;

  &:hover {
    border-color: rgba(184, 151, 106, 0.3);
  }
`;

const EntryLetter = styled.span`
  display: inline-block;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2.5rem;
  font-style: italic;
  color: #B8976A;
  line-height: 1;
  margin-bottom: 15px;
`;

const EntryTitle = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.4rem;
  color: #FFFFFF;
  margin-bottom: 12px;
`;

const EntryText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
`;

function WeddingABC() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const entries = [
    { letter: 'A', title: 'Anfahrt', text: 'Parkplätze sind ausreichend vorhanden. Nutzt gerne auch Fahrgemeinschaften!' },
    { letter: 'B', title: 'Blumen', text: 'Bitte bringt keine zusätzlichen Blumen mit – wir haben uns um die Dekoration gekümmert.' },
    { letter: 'D', title: 'Dresscode', text: 'Festlich elegant. Damen bitte nicht in Weiß, Herren gerne mit Anzug.' },
    { letter: 'F', title: 'Fotos', text: 'Während der Trauung bitten wir euch, die Handys wegzulassen. Später gerne!' },
    { letter: 'G', title: 'Geschenke', text: 'Eure Anwesenheit ist das größte Geschenk. Wer möchte, kann zur Hochzeitsreise beitragen.' },
    { letter: 'K', title: 'Kinder', text: 'Wir feiern an diesem Tag nur mit Erwachsenen. Wir hoffen auf euer Verständnis.' },
    { letter: 'P', title: 'Parken', text: 'Kostenlose Parkplätze befinden sich direkt an der Location.' },
    { letter: 'R', title: 'Reden', text: 'Möchtet ihr eine Rede halten? Meldet euch bitte vorher bei den Trauzeugen.' },
    { letter: 'S', title: 'Spiele', text: 'Spiele sind willkommen! Bitte sprecht euch mit den Trauzeugen ab.' },
    { letter: 'T', title: 'Taxi', text: 'Wir organisieren Shuttles zurück in die Stadt. Meldet euren Bedarf bei der RSVP an.' },
    { letter: 'U', title: 'Unterkunft', text: 'Empfehlungen für Hotels in der Nähe findet ihr unter "Übernachtung".' },
    { letter: 'W', title: 'Wetter', text: 'Die Feier findet bei jedem Wetter statt. Bringt für draußen evtl. einen Schal mit.' },
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const availableLetters = entries.map(e => e.letter);

  const filteredEntries = activeLetter
    ? entries.filter(e => e.letter === activeLetter)
    : entries;

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Hochzeits-ABC</Eyebrow>
          <Title>Alles <span>Wissenswerte</span></Title>
          <Subtitle>Von A wie Anfahrt bis W wie Wetter</Subtitle>
        </Header>

        <LetterNav $visible={isVisible}>
          <LetterButton
            $active={activeLetter === null}
            onClick={() => setActiveLetter(null)}
          >
            ★
          </LetterButton>
          {alphabet.map(letter => (
            <LetterButton
              key={letter}
              $active={activeLetter === letter}
              disabled={!availableLetters.includes(letter)}
              onClick={() => setActiveLetter(letter)}
            >
              {letter}
            </LetterButton>
          ))}
        </LetterNav>

        <EntriesGrid>
          {filteredEntries.map((entry, index) => (
            <EntryCard 
              key={entry.letter} 
              $visible={isVisible}
              $delay={0.2 + index * 0.05}
            >
              <EntryLetter>{entry.letter}</EntryLetter>
              <EntryTitle>{entry.title}</EntryTitle>
              <EntryText>{entry.text}</EntryText>
            </EntryCard>
          ))}
        </EntriesGrid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
