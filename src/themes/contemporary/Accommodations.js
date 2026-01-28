// Contemporary Accommodations
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--electric);
`;

const Container = styled.div`
  max-width: 1000px;
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
  color: var(--black);
  opacity: 0.6;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
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
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }
  
  transition: all 0.3s ease;
`;

const CardImage = styled.div`
  height: 160px;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--gray-200)'};
  border-bottom: 3px solid var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const CardInfo = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
`;

const CardPrice = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: var(--coral);
  margin: 1rem 0;
  padding: 0.5rem;
  background: var(--gray-100);
  border: 2px solid var(--black);
  text-align: center;
`;

const Button = styled.a`
  display: block;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white);
  background: var(--black);
  padding: 0.75rem;
  border: none;
  text-transform: uppercase;
  
  &:hover {
    background: var(--coral);
  }
`;

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  
  const title = data.title || 'Unterkünfte';
  const hotels = data.hotels || [];

  const defaultHotels = [
    { name: 'Hotel Amano', address: 'Auguststraße 43, 10119 Berlin', price: 'ab 120€/Nacht', url: '#', stars: 4 },
    { name: 'Motel One', address: 'Prinzessinnenstr. 1, 10969 Berlin', price: 'ab 89€/Nacht', url: '#', stars: 3 },
  ];

  const items = hotels.length > 0 ? hotels : defaultHotels;

  return (
    <Section id="accommodations">
      <Container>
        <Header>
          <Eyebrow>🏨 Übernachten</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((hotel, i) => (
            <Card key={i}>
              <CardImage $image={hotel.image}>
                {!hotel.image && '🏨'}
              </CardImage>
              <CardBody>
                <CardTitle>{hotel.name}</CardTitle>
                <CardInfo>{hotel.address}</CardInfo>
                {hotel.distance && <CardInfo>📍 {hotel.distance}</CardInfo>}
                {hotel.price && <CardPrice>{hotel.price}</CardPrice>}
                {hotel.url && (
                  <Button href={hotel.url} target="_blank" rel="noopener noreferrer">
                    Buchen →
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Accommodations;
