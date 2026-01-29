// Botanical Locations - Locations in holes
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
  justify-content: center;
  text-align: center;
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
  font-size: clamp(1.3rem, 3vw, 2rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.75rem;
`;

const LocationType = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.3rem;
`;

const LocationName = styled.h3`
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  color: var(--black);
  margin-bottom: 0.4rem;
`;

const Address = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--medium);
  margin-bottom: 0.3rem;
`;

const Time = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--light);
`;

const MapLink = styled.a`
  display: inline-block;
  margin-top: 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--black);
  border-bottom: 1px solid var(--black);
  transition: opacity 0.3s;
  
  &:hover { opacity: 0.6; }
`;

const Divider = styled.div`
  width: 30px;
  height: 1px;
  background: var(--pale);
  margin: 1rem 0;
`;

function Locations() {
  const { content } = useWedding();
  const { mainHole, secondaryHoles } = useKnotholes();
  const locationsData = content?.locations || {};
  
  const title = locationsData.title || 'Locations';
  const locations = locationsData.locations || [];

  const defaultLocations = [
    { type: 'Trauung', name: 'Standesamt Hamburg', address: 'Rathausmarkt 1', time: '14:00 Uhr', maps_url: '' },
    { type: 'Feier', name: 'Gut Karlshöhe', address: 'Karlshöhe 60d', time: 'ab 16:00 Uhr', maps_url: '' },
  ];

  const items = locations.length > 0 ? locations : defaultLocations;
  const hasSecondary = secondaryHoles.length > 0 && items.length > 1;

  return (
    <Section data-section="locations">
      {/* Main hole */}
      <HoleContent $hole={mainHole}>
        <Eyebrow>Wo wir feiern</Eyebrow>
        <Title>{title}</Title>
        
        <LocationType>{items[0]?.type}</LocationType>
        <LocationName>{items[0]?.name}</LocationName>
        <Address>{items[0]?.address}</Address>
        {items[0]?.time && <Time>{items[0].time}</Time>}
        {items[0]?.maps_url && (
          <MapLink href={items[0].maps_url} target="_blank">Route →</MapLink>
        )}
        
        {/* If no secondary hole, show both locations here */}
        {!hasSecondary && items[1] && (
          <>
            <Divider />
            <LocationType>{items[1].type}</LocationType>
            <LocationName>{items[1].name}</LocationName>
            <Address>{items[1].address}</Address>
            {items[1].time && <Time>{items[1].time}</Time>}
          </>
        )}
      </HoleContent>
      
      {/* Secondary hole: second location */}
      {hasSecondary && (
        <HoleContent $hole={secondaryHoles[0]}>
          <LocationType>{items[1].type}</LocationType>
          <LocationName>{items[1].name}</LocationName>
          <Address>{items[1].address}</Address>
          {items[1].time && <Time>{items[1].time}</Time>}
          {items[1].maps_url && (
            <MapLink href={items[1].maps_url} target="_blank">Route →</MapLink>
          )}
        </HoleContent>
      )}
    </Section>
  );
}

export default Locations;
