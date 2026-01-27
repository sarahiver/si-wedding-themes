import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-white);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const GoldLine = styled.div`
  width: 1px;
  height: 30px;
  background: var(--luxe-gold);
  margin: 0 auto 1.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text-light);
  max-width: 500px;
  margin: 1rem auto 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--luxe-cream);
  overflow: hidden;
`;

const CardImage = styled.div`
  aspect-ratio: 16/10;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const HotelName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 0.5rem;
`;

const HotelInfo = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--luxe-text-light);
  margin-bottom: 0.25rem;
`;

const HotelPrice = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: var(--luxe-gold);
  margin-top: 0.5rem;
`;

function Accommodations({ hotels }) {
  const defaultHotels = [
    {
      name: 'Schlosshotel Benrath',
      distance: '2 Minuten Fußweg',
      price: 'ab 120€ / Nacht',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    },
    {
      name: 'Hotel Am Zault',
      distance: '5 Minuten mit dem Auto',
      price: 'ab 85€ / Nacht',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600',
    },
  ];
  
  const hotelData = hotels || defaultHotels;
  
  return (
    <Section id="accommodations">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Unterkünfte</Eyebrow>
          <Title>Übernachten</Title>
          <Subtitle>Einige Empfehlungen für eure Übernachtung in der Nähe.</Subtitle>
        </Header>
        
        <Grid>
          {hotelData.map((hotel, index) => (
            <Card key={index}>
              <CardImage>
                <img src={hotel.image} alt={hotel.name} loading="lazy" />
              </CardImage>
              <CardContent>
                <HotelName>{hotel.name}</HotelName>
                <HotelInfo>{hotel.distance}</HotelInfo>
                <HotelPrice>{hotel.price}</HotelPrice>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Accommodations;
