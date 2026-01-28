import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: 5rem 2rem;
  background: var(--background-alt, #f9f9f9);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: var(--text-primary, #333);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const Name = styled.h3`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary, #333);
`;

const Role = styled.p`
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const data = content?.witnesses || {};
  const witnesses = data.list || [];

  if (witnesses.length === 0) return null;

  return (
    <Section id="witnesses">
      <Container>
        <Title>{data.title || 'Trauzeugen'}</Title>
        <Grid>
          {witnesses.map((witness, i) => (
            <Card key={i}>
              <Name>{witness.name}</Name>
              <Role>{witness.role}</Role>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
