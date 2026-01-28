import { useWedding } from '../../context/WeddingContext';
import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
  text-align: center;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const HotelCard = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--sage-light);
`;

const HotelImage = styled.div`
  height: 180px;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--cream)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  opacity: ${p => p.$image ? 1 : 0.3};
`;

const HotelContent = styled.div`
  padding: 1.5rem;
`;

const HotelName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const HotelAddress = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const HotelLink = styled.a`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: var(--sage);
  text-decoration: none;
  
  &:hover { color: var(--sage-dark); }
`;

function Accommodations({ content = {} }) {
  const title = content.title || 'Übernachtung';
  const description = content.description || '';
  const hotels = content.hotels || [];

  return (
    <Section id="accommodations">
      <Container>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        
        <Grid>
          {hotels.map((hotel, i) => (
            <HotelCard key={i}>
              <HotelImage $image={hotel.image}>
                {!hotel.image && '🏨'}
              </HotelImage>
              <HotelContent>
                <HotelName>{hotel.name}</HotelName>
                <HotelAddress>{hotel.address}</HotelAddress>
                {hotel.url && <HotelLink href={hotel.url} target="_blank">Zur Website →</HotelLink>}
              </HotelContent>
            </HotelCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Accommodations;
