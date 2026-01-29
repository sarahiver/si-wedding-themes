// Botanical Locations - Clean location cards
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream-dark);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 800px;
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
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--forest-deep);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const LocationCard = styled.div`
  background: var(--cream);
  overflow: hidden;
`;

const CardImage = styled.div`
  height: 160px;
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover` 
    : 'var(--forest-light)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const LocationType = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 0.5rem;
`;

const LocationName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--forest-deep);
  margin-bottom: 0.5rem;
`;

const LocationAddress = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--bark-medium);
  margin-bottom: 0.5rem;
`;

const LocationTime = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--bark-light);
`;

const MapButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
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

function Locations() {
  const { content } = useWedding();
  const locationsData = content?.locations || {};
  
  const title = locationsData.title || 'Locations';
  const locations = locationsData.locations || [];

  const defaultLocations = [
    { type: 'Trauung', name: 'Waldkapelle am See', address: 'Waldweg 12, 12345 Naturstadt', time: '14:00 Uhr', image: '', emoji: '💒' },
    { type: 'Feier', name: 'Gutshof Grüne Wiese', address: 'Landstraße 45, 12345 Naturstadt', time: 'ab 16:00 Uhr', image: '', emoji: '🏡' },
  ];

  const items = locations.length > 0 ? locations : defaultLocations;

  return (
    <Section id="locations" data-section="locations">
      <Content>
        <Header>
          <Eyebrow>Wo wir feiern</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((location, index) => (
            <LocationCard key={index}>
              <CardImage $image={location.image}>
                {!location.image && (location.emoji || '📍')}
              </CardImage>
              <CardBody>
                <LocationType>{location.type}</LocationType>
                <LocationName>{location.name}</LocationName>
                <LocationAddress>{location.address}</LocationAddress>
                {location.time && <LocationTime>{location.time}</LocationTime>}
                {location.maps_url && (
                  <MapButton href={location.maps_url} target="_blank">
                    Route planen →
                  </MapButton>
                )}
              </CardBody>
            </LocationCard>
          ))}
        </Grid>
      </Content>
    </Section>
  );
}

export default Locations;
