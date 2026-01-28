// ContactWitnesses.js - Editorial Theme
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: 6rem 2rem;
  background: #fff;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: 3rem;
  color: #1a1a1a;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1px solid #e5e5e5;
`;

const Image = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  background: ${props => props.$image ? `url(${props.$image})` : '#f5f5f5'};
  background-size: cover;
  background-position: center;
`;

const Name = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
`;

const Role = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #444;
  
  a {
    color: #1a1a1a;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const data = content?.witnesses || {};
  const witnesses = data.persons || [];

  if (witnesses.length === 0) return null;

  return (
    <Section id="witnesses">
      <Container>
        <Title>{data.title || 'Trauzeugen'}</Title>
        <Grid>
          {witnesses.map((person, index) => (
            <Card key={index}>
              <Image $image={person.image} />
              <Name>{person.name}</Name>
              <Role>{person.role}</Role>
              <ContactInfo>
                {person.phone && <div>{person.phone}</div>}
                {person.email && <a href={`mailto:${person.email}`}>{person.email}</a>}
              </ContactInfo>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
