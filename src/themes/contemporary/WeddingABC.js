import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--black);
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.2s;
`;

const FilterButton = styled.button`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${p => p.$active ? 'var(--black)' : 'var(--white)'};
  background: ${p => p.$active ? 'var(--yellow)' : 'transparent'};
  padding: 0.5rem 1rem;
  border: 2px solid ${p => p.$active ? 'var(--black)' : 'var(--gray-600)'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--coral);
    color: var(--white);
    border-color: var(--black);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const Card = styled.div`
  background: var(--gray-800);
  border: 3px solid var(--gray-600);
  padding: 2rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.5s ease ${p => 0.2 + (p.$index % 6) * 0.05}s;
  
  &:hover {
    border-color: ${p => p.$color};
    transform: translateY(-5px);
    
    .letter {
      color: ${p => p.$color};
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Letter = styled.span`
  font-size: 3rem;
  font-weight: 700;
  color: var(--gray-500);
  line-height: 1;
  transition: color 0.3s ease;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const CardText = styled.p`
  font-size: 0.85rem;
  color: var(--gray-400);
  line-height: 1.6;
  margin: 0;
`;

function WeddingABC({ entries = [] }) {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);

  const defaultEntries = [
    { letter: 'A', title: 'Anfahrt', text: 'Nutzt unsere Wegbeschreibung oder Google Maps.' },
    { letter: 'B', title: 'Blumen', text: 'Bitte keine Blumen schenken – der Fotograf dankt!' },
    { letter: 'D', title: 'Dresscode', text: 'Elegante Abendgarderobe, kein Weiß bitte.' },
    { letter: 'F', title: 'Fotos', text: 'Teilt eure Bilder über unseren Upload-Bereich!' },
    { letter: 'G', title: 'Geschenke', text: 'Wir freuen uns über einen Beitrag zur Hochzeitsreise.' },
    { letter: 'K', title: 'Kinder', text: 'Unsere Feier ist leider nur für Erwachsene.' },
    { letter: 'M', title: 'Musik', text: 'Teilt uns eure Musikwünsche mit!' },
    { letter: 'P', title: 'Parken', text: 'Kostenlose Parkplätze vor der Location.' },
    { letter: 'T', title: 'Taxi', text: 'Taxi Heidelberg: +49 6221 302030' },
    { letter: 'U', title: 'Unterkunft', text: 'Hotels in der Nähe findet ihr auf unserer Seite.' },
  ];

  const items = entries.length > 0 ? entries : defaultEntries;
  const letters = ['all', ...new Set(items.map(i => i.letter))];
  const filtered = filter === 'all' ? items : items.filter(i => i.letter === filter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>📖 Hochzeits-ABC</Eyebrow>
          <Title $visible={visible}>Good to Know</Title>
        </Header>
        
        <FilterBar $visible={visible}>
          {letters.map(l => (
            <FilterButton key={l} $active={filter === l} onClick={() => setFilter(l)}>
              {l === 'all' ? 'Alle' : l}
            </FilterButton>
          ))}
        </FilterBar>
        
        <Grid>
          {filtered.map((entry, i) => (
            <Card key={i} $index={i} $visible={visible} $color={colors[i % colors.length]}>
              <CardHeader>
                <Letter className="letter">{entry.letter}</Letter>
                <CardTitle>{entry.title}</CardTitle>
              </CardHeader>
              <CardText>{entry.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
