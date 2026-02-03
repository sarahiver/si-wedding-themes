// Contemporary ContactWitnesses (Trauzeugen) - Privacy Protected
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

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
  border: 4px solid var(--black);
  box-shadow: 8px 8px 0 var(--black);
  padding: 2rem;
  text-align: center;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--gray-200)'};
  border: 4px solid var(--black);
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
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--black);
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 3px solid var(--black);
  background: var(--gray-100);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--yellow);
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 var(--black);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const witnessesData = content?.witnesses || {};

  const title = witnessesData.title || 'Trauzeugen';
  const subtitle = witnessesData.subtitle || 'Bei Fragen zu Überraschungen könnt ihr euch an unsere Trauzeugen wenden';
  const persons = witnessesData.persons || [];
  const showDetails = witnessesData.showContactDetails || false;

  // Keine Defaults - nur rendern wenn Personen vorhanden
  if (persons.length === 0) return null;

  const getWhatsAppNumber = (person) => (person.whatsapp || person.phone || '').replace(/\D/g, '');

  return (
    <Section id="witnesses">
      <Container>
        <Header>
          <Eyebrow>💬 Eure Ansprechpartner</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>

        <Grid>
          {persons.map((person, i) => (
            <Card key={i}>
              <Avatar $image={person.image}>
                {!person.image && (person.role?.toLowerCase().includes('zeugin') ? '👩' : '👨')}
              </Avatar>
              <Name>{person.name}</Name>
              <Role>{person.role}</Role>
              {getWhatsAppNumber(person) && (
                <ContactLink href={`https://wa.me/${getWhatsAppNumber(person)}`} target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp
                </ContactLink>
              )}
              {person.phone && (
                <ContactLink href={`tel:${person.phone.replace(/\s/g, '')}`}>
                  📞 {showDetails ? person.phone : 'Anrufen'}
                </ContactLink>
              )}
              {person.email && (
                <ContactLink href={`mailto:${person.email}`}>
                  📧 {showDetails ? person.email : 'E-Mail'}
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
