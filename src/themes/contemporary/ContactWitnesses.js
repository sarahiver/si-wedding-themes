// Contemporary ContactWitnesses (Trauzeugen)
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--purple);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--yellow);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin-top: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  text-align: center;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--gray-200)'};
  border: 3px solid var(--black);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
`;

const Name = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const Role = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--purple);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
`;

const ContactLink = styled.a`
  display: block;
  font-size: 0.9rem;
  color: var(--gray-600);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 2px solid var(--gray-200);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--yellow);
    border-color: var(--black);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const witnessesData = content?.witnesses || {};
  
  const title = witnessesData.title || 'Trauzeugen';
  const persons = witnessesData.persons || [];

  const defaultPersons = [
    { name: 'Julia Schmidt', role: 'Trauzeugin der Braut', email: 'julia@example.com', phone: '+49 170 1234567' },
    { name: 'Thomas Mueller', role: 'Trauzeuge des Braeutigams', email: 'thomas@example.com', phone: '+49 171 7654321' },
  ];

  const items = persons.length > 0 ? persons : defaultPersons;

  return (
    <Section id="witnesses">
      <Container>
        <Header>
          <Eyebrow>Unsere Helfer</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>Bei Fragen zu Ueberraschungen koennt ihr euch an unsere Trauzeugen wenden</Subtitle>
        </Header>
        
        <Grid>
          {items.map((person, i) => (
            <Card key={i}>
              <Avatar $image={person.image} />
              <Name>{person.name}</Name>
              <Role>{person.role}</Role>
              {person.email && (
                <ContactLink href={`mailto:${person.email}`}>
                  {person.email}
                </ContactLink>
              )}
              {person.phone && (
                <ContactLink href={`tel:${person.phone.replace(/\s/g, '')}`}>
                  {person.phone}
                </ContactLink>
              )}
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
