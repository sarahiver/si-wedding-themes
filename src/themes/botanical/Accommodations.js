// Botanical Accommodations - Clean hotel cards
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
  max-width: 700px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const HotelCard = styled.div`
  background: var(--cream);
  padding: 1.5rem;
`;

const HotelName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--forest-deep);
  margin-bottom: 0.5rem;
`;

const HotelAddress = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--bark-medium);
  margin-bottom: 0.25rem;
`;

const HotelDistance = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--bark-light);
  margin-bottom: 0.75rem;
`;

const HotelPrice = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 1rem;
`;

const BookButton = styled.a`
  display: inline-block;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--forest-deep);
  border-bottom: 1px solid var(--forest-deep);
  padding-bottom: 2px;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  
  const title = data.title || 'Übernachten';
  const hotels = data.hotels || [];

  const defaultHotels = [
    { name: 'Waldhotel am See', address: 'Seestraße 15', price: 'ab 95€/Nacht', distance: '5 min zur Location', url: '#' },
    { name: 'Landgasthof Grüne Wiese', address: 'Hauptstr. 42', price: 'ab 75€/Nacht', distance: '10 min zur Location', url: '#' },
  ];

  const items = hotels.length > 0 ? hotels : defaultHotels;

  return (
    <Section id="accommodations" data-section="accommodations">
      <Content>
        <Header>
          <Eyebrow>Übernachten</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((hotel, i) => (
            <HotelCard key={i}>
              <HotelName>{hotel.name}</HotelName>
              <HotelAddress>{hotel.address}</HotelAddress>
              {hotel.distance && <HotelDistance>{hotel.distance}</HotelDistance>}
              {hotel.price && <HotelPrice>{hotel.price}</HotelPrice>}
              {hotel.url && (
                <BookButton href={hotel.url} target="_blank">
                  Buchen →
                </BookButton>
              )}
            </HotelCard>
          ))}
        </Grid>
      </Content>
    </Section>
  );
}

export default Accommodations;
