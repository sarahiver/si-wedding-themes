// Contemporary Directions
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--gray-100);
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
  color: var(--coral);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${p => p.$color || 'var(--white)'};
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${p => p.$light ? 'var(--white)' : 'var(--black)'};
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const CardText = styled.p`
  font-size: 0.95rem;
  color: ${p => p.$light ? 'rgba(255,255,255,0.9)' : 'var(--gray-600)'};
  line-height: 1.6;
`;

const MapContainer = styled.div`
  grid-column: span 2;
  height: 350px;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  @media (max-width: 768px) {
    grid-column: span 1;
    height: 250px;
  }
`;

const AddressCard = styled.div`
  grid-column: span 2;
  background: var(--black);
  color: var(--white);
  border: 3px solid var(--black);
  padding: 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const Address = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MapsButton = styled.a`
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--black);
  background: var(--yellow);
  padding: 0.75rem 2rem;
  border: 3px solid var(--white);
  text-transform: uppercase;
  
  &:hover {
    background: var(--coral);
    color: var(--white);
  }
`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  
  const title = data.title || 'Anfahrt';
  const address = data.address || 'Schloss Charlottenburg, Spandauer Damm 10-22, 14059 Berlin';
  const parkingInfo = data.parking_info || 'Kostenlose Parkplätze stehen direkt vor der Location zur Verfügung.';
  const publicTransport = data.public_transport || 'U-Bahn: Richard-Wagner-Platz (U7), dann 10 Min Fußweg. Bus: M45 bis Schloss Charlottenburg.';
  const mapsEmbed = data.maps_embed;

  return (
    <Section id="directions">
      <Container>
        <Header>
          <Eyebrow>🚗 So kommt ihr hin</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          <Card $color="var(--coral)">
            <CardIcon>🚗</CardIcon>
            <CardTitle $light>Mit dem Auto</CardTitle>
            <CardText $light>{parkingInfo}</CardText>
          </Card>
          
          <Card $color="var(--electric)">
            <CardIcon>🚇</CardIcon>
            <CardTitle>ÖPNV</CardTitle>
            <CardText>{publicTransport}</CardText>
          </Card>
          
          <AddressCard>
            <Address>📍 {address}</Address>
            <MapsButton 
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              In Google Maps öffnen →
            </MapsButton>
          </AddressCard>
          
          {mapsEmbed && (
            <MapContainer>
              <iframe src={mapsEmbed} title="Anfahrt" loading="lazy" allowFullScreen />
            </MapContainer>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

export default Directions;
