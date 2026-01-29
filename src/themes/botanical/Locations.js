// Botanical Tree Locations
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const LocationCard = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid var(--off-white);
  &:last-child { border-bottom: none; }
  &:first-child { padding-top: 0; }
`;

const LocationType = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.25rem;
`;

const LocationName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 0.25rem;
`;

const Address = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--medium);
`;

const Time = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--light);
  margin-top: 0.25rem;
`;

const MapLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dark);
  border-bottom: 1px solid var(--dark);
  &:hover { opacity: 0.6; }
`;

function Locations({ side = 'left' }) {
  const { content } = useWedding();
  const locationsData = content?.locations || {};
  const title = locationsData.title || 'Locations';
  const locations = locationsData.locations || [
    { type: 'Trauung', name: 'Standesamt Hamburg', address: 'Rathausmarkt 1', time: '14:00 Uhr' },
    { type: 'Feier', name: 'Gut Karlshöhe', address: 'Karlshöhe 60d', time: 'ab 16:00 Uhr' },
  ];

  return (
    <ContentBranch side={side} eyebrow="Wo wir feiern" title={title}>
      {locations.map((loc, i) => (
        <LocationCard key={i}>
          <LocationType>{loc.type}</LocationType>
          <LocationName>{loc.name}</LocationName>
          <Address>{loc.address}</Address>
          {loc.time && <Time>{loc.time}</Time>}
          {loc.maps_url && <MapLink href={loc.maps_url} target="_blank">Route →</MapLink>}
        </LocationCard>
      ))}
    </ContentBranch>
  );
}

export default Locations;
