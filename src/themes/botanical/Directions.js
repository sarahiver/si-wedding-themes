import { useWedding } from '../../context/WeddingContext';
import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
  text-align: center;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--sage-light);
`;

const CardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: var(--forest);
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.7;
`;

function Directions({ content = {} }) {
  const title = content.title || 'Anfahrt';
  const address = content.address || '';
  const parkingInfo = content.parking_info || '';
  const publicTransport = content.public_transport || '';
  const taxiInfo = content.taxi_info || '';

  return (
    <Section id="directions">
      <Container>
        <Title>{title}</Title>
        
        <Grid>
          {address && (
            <Card>
              <CardIcon>📍</CardIcon>
              <CardTitle>Adresse</CardTitle>
              <CardText>{address}</CardText>
            </Card>
          )}
          {parkingInfo && (
            <Card>
              <CardIcon>🚗</CardIcon>
              <CardTitle>Parken</CardTitle>
              <CardText>{parkingInfo}</CardText>
            </Card>
          )}
          {publicTransport && (
            <Card>
              <CardIcon>🚇</CardIcon>
              <CardTitle>ÖPNV</CardTitle>
              <CardText>{publicTransport}</CardText>
            </Card>
          )}
          {taxiInfo && (
            <Card>
              <CardIcon>🚕</CardIcon>
              <CardTitle>Taxi</CardTitle>
              <CardText>{taxiInfo}</CardText>
            </Card>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

export default Directions;
