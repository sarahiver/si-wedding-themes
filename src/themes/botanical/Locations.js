// Botanical Locations - Organic Location Cards
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const fadeGrow = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-moss);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.1};
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const LocationCard = styled.div`
  background: var(--bg-cream);
  border-radius: 40px 40px 35px 45px / 35px 45px 40px 40px;
  overflow: hidden;
  box-shadow: var(--shadow-medium);
  transition: all 0.4s var(--ease-nature);
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? fadeGrow : 'none'} 0.6s var(--ease-nature) forwards;
  animation-delay: ${p => p.$index * 0.15}s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-deep);
  }
`;

const CardImage = styled.div`
  height: 180px;
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover` 
    : 'linear-gradient(135deg, var(--green-sage) 0%, var(--green-fern) 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

const CardBody = styled.div`
  padding: 1.75rem;
`;

const LocationType = styled.div`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--green-fern);
  background: var(--green-mint);
  padding: 0.35rem 0.75rem;
  border-radius: 15px;
  margin-bottom: 0.75rem;
`;

const LocationName = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.75rem;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
`;

const LocationAddress = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const LocationTime = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-medium);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MapButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  background: var(--bg-fog);
  color: var(--green-forest);
  border-radius: 25px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--green-mint);
    transform: translateX(5px);
  }
`;

function Locations() {
  const { content } = useWedding();
  const locationsData = content?.locations || {};
  
  const title = locationsData.title || 'Locations';
  const locations = locationsData.locations || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultLocations = [
    {
      type: 'Trauung',
      name: 'Waldkapelle am See',
      address: 'Waldweg 12, 12345 Naturstadt',
      time: '14:00 Uhr',
      image: '',
      emoji: '💒',
      maps_url: ''
    },
    {
      type: 'Feier',
      name: 'Gutshof Grüne Wiese',
      address: 'Landstraße 45, 12345 Naturstadt',
      time: 'ab 16:00 Uhr',
      image: '',
      emoji: '🏡',
      maps_url: ''
    },
  ];

  const items = locations.length > 0 ? locations : defaultLocations;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="locations">
      <DecoLeaf $size="180px" $color="var(--green-mint)" $opacity={0.08} style={{ top: '5%', left: '-5%' }} />
      <DecoLeaf $size="120px" $color="var(--green-sage)" $opacity={0.06} style={{ bottom: '10%', right: '-4%' }} $duration="14s" />
      
      <Container>
        <Header>
          <Eyebrow>📍 Wo wir feiern</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((location, index) => (
            <LocationCard key={index} $index={index} $visible={visible}>
              <CardImage $image={location.image}>
                {!location.image && (location.emoji || '📍')}
              </CardImage>
              <CardBody>
                <LocationType>{location.type}</LocationType>
                <LocationName>{location.name}</LocationName>
                <LocationAddress>
                  <span>📍</span>
                  {location.address}
                </LocationAddress>
                {location.time && (
                  <LocationTime>
                    <span>⏰</span>
                    {location.time}
                  </LocationTime>
                )}
                {location.maps_url && (
                  <MapButton href={location.maps_url} target="_blank" rel="noopener noreferrer">
                    Route planen →
                  </MapButton>
                )}
              </CardBody>
            </LocationCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Locations;
