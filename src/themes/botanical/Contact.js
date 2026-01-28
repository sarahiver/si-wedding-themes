import { useWedding } from '../../context/WeddingContext';
import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 6rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const PersonCard = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--sage-light);
`;

const PersonName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--forest);
  margin-bottom: 0.25rem;
`;

const PersonRole = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage);
  margin-bottom: 1rem;
`;

const ContactLink = styled.a`
  display: block;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  text-decoration: none;
  margin-bottom: 0.5rem;
  
  &:hover { color: var(--sage); }
`;

function Contact() {
  const { content } = useWedding();
  const contactData = content?.contact || {};
  const title = contactData.title || 'Eure Ansprechpartner';
  const persons = contactData.persons || [];

  return (
    <Section id="contact">
      <Container>
        <Title>{title}</Title>
        
        <Grid>
          {persons.map((person, i) => (
            <PersonCard key={i}>
              <PersonName>{person.name}</PersonName>
              <PersonRole>{person.role}</PersonRole>
              {person.phone && <ContactLink href={`tel:${person.phone}`}>📞 {person.phone}</ContactLink>}
              {person.email && <ContactLink href={`mailto:${person.email}`}>✉️ {person.email}</ContactLink>}
            </PersonCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Contact;
