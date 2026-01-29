// Botanical Accommodations - Nature Lodge Cards
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-fog);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.08};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const HotelCard = styled.div`
  background: var(--bg-cream);
  border-radius: 35px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-medium);
  }
`;

const CardImage = styled.div`
  height: 160px;
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover` 
    : 'linear-gradient(135deg, var(--green-sage) 0%, var(--water-pond) 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const HotelName = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
`;

const HotelAddress = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const HotelDistance = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
`;

const HotelPrice = styled.p`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-golden);
  margin-bottom: 1rem;
`;

const BookButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--green-mint);
  color: var(--green-forest);
  border-radius: 25px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--green-sage);
    transform: translateX(5px);
  }
`;

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  
  const title = data.title || 'Übernachten';
  const hotels = data.hotels || [];

  const defaultHotels = [
    { name: 'Waldhotel am See', address: 'Seestraße 15, 12345 Naturstadt', price: 'ab 95€/Nacht', distance: '5 min zur Location', url: '#', image: '', emoji: '🏨' },
    { name: 'Landgasthof Grüne Wiese', address: 'Hauptstr. 42, 12345 Naturstadt', price: 'ab 75€/Nacht', distance: '10 min zur Location', url: '#', image: '', emoji: '🏡' },
  ];

  const items = hotels.length > 0 ? hotels : defaultHotels;

  return (
    <Section id="accommodations">
      <DecoLeaf $size="150px" $color="var(--green-mint)" $opacity={0.06} style={{ top: '5%', right: '-4%' }} />
      <DecoLeaf $size="100px" $color="var(--green-sage)" $opacity={0.05} style={{ bottom: '10%', left: '-3%' }} $duration="12s" />
      
      <Container>
        <Header>
          <Eyebrow>🏨 Übernachten</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((hotel, i) => (
            <HotelCard key={i}>
              <CardImage $image={hotel.image}>
                {!hotel.image && (hotel.emoji || '🏨')}
              </CardImage>
              <CardBody>
                <HotelName>{hotel.name}</HotelName>
                <HotelAddress>{hotel.address}</HotelAddress>
                {hotel.distance && <HotelDistance>📍 {hotel.distance}</HotelDistance>}
                {hotel.price && <HotelPrice>{hotel.price}</HotelPrice>}
                {hotel.url && (
                  <BookButton href={hotel.url} target="_blank" rel="noopener noreferrer">
                    Buchen →
                  </BookButton>
                )}
              </CardBody>
            </HotelCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Accommodations;
