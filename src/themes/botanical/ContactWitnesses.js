// Botanical ContactWitnesses - Clean privacy protected
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--forest-deep);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-mist);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--cream);
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--forest-mist);
  margin-top: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const WitnessCard = styled.div`
  background: var(--cream);
  padding: 2rem;
  text-align: center;
`;

const WitnessName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--forest-deep);
  margin-bottom: 0.25rem;
`;

const WitnessRole = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--bark-light);
  margin-bottom: 1.5rem;
`;

const ContactButton = styled.a`
  display: block;
  padding: 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--cream-dark);
  color: var(--forest-deep);
  margin-bottom: 0.5rem;
  transition: background 0.3s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    background: var(--forest-mist);
  }
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const witnessesData = content?.witnesses || {};
  
  const title = witnessesData.title || 'Trauzeugen';
  const subtitle = witnessesData.subtitle || 'Bei Fragen zu Überraschungen';
  const persons = witnessesData.persons || [];

  const defaultPersons = [
    { name: 'Lisa Müller', role: 'Trauzeugin', email: 'lisa@example.com', phone: '' },
    { name: 'Thomas Schmidt', role: 'Trauzeuge', email: 'thomas@example.com', phone: '' },
  ];

  const items = persons.length > 0 ? persons : defaultPersons;

  return (
    <Section id="witnesses" data-section="witnesses">
      <Content>
        <Header>
          <Eyebrow>Eure Ansprechpartner</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>
        
        <Grid>
          {items.map((person, i) => (
            <WitnessCard key={i}>
              <WitnessName>{person.name}</WitnessName>
              <WitnessRole>{person.role}</WitnessRole>
              {person.email && (
                <ContactButton href={`mailto:${person.email}`}>
                  E-Mail
                </ContactButton>
              )}
              {person.phone && (
                <ContactButton href={`tel:${person.phone.replace(/\s/g, '')}`}>
                  Anrufen
                </ContactButton>
              )}
            </WitnessCard>
          ))}
        </Grid>
      </Content>
    </Section>
  );
}

export default ContactWitnesses;
