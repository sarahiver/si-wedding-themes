// Botanical Accommodations - Hotels in hole
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1.5rem 1rem;
  overflow: hidden;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 1rem;
`;

const HotelsList = styled.div`
  width: 100%;
  max-height: 70%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: var(--pale); }
`;

const HotelCard = styled.div`
  background: var(--off-white);
  padding: 1rem;
  text-align: left;
`;

const HotelName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 0.25rem;
`;

const HotelAddress = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--medium);
`;

const HotelMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const HotelPrice = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--dark);
`;

const HotelDistance = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: var(--light);
`;

const BookLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--black);
  border-bottom: 1px solid var(--black);
  
  &:hover { opacity: 0.6; }
`;

function Accommodations() {
  const { content } = useWedding();
  const { mainHole } = useKnotholes();
  const data = content?.accommodations || {};
  
  const title = data.title || 'Übernachten';
  const hotels = data.hotels || [];

  const defaultHotels = [
    { name: 'Waldhotel am See', address: 'Seestraße 15', price: 'ab 95€/Nacht', distance: '5 min', url: '' },
    { name: 'Landgasthof Grüne Wiese', address: 'Hauptstr. 42', price: 'ab 75€/Nacht', distance: '10 min', url: '' },
  ];

  const items = hotels.length > 0 ? hotels : defaultHotels;

  return (
    <Section data-section="accommodations">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Schlafen</Eyebrow>
        <Title>{title}</Title>
        
        <HotelsList>
          {items.map((hotel, i) => (
            <HotelCard key={i}>
              <HotelName>{hotel.name}</HotelName>
              <HotelAddress>{hotel.address}</HotelAddress>
              <HotelMeta>
                {hotel.price && <HotelPrice>{hotel.price}</HotelPrice>}
                {hotel.distance && <HotelDistance>{hotel.distance}</HotelDistance>}
              </HotelMeta>
              {hotel.url && (
                <BookLink href={hotel.url} target="_blank">Buchen →</BookLink>
              )}
            </HotelCard>
          ))}
        </HotelsList>
      </HoleContent>
    </Section>
  );
}

export default Accommodations;
