// Botanical Directions - Nature Path Style
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-cream);
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DirectionCard = styled.div`
  background: ${p => p.$color || 'var(--green-mint)'};
  padding: 2rem;
  border-radius: 35px;
  box-shadow: var(--shadow-soft);
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }
`;

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: var(--bg-cream);
  border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  color: ${p => p.$dark ? 'var(--bg-cream)' : 'var(--green-forest)'};
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: ${p => p.$dark ? 'rgba(255,255,255,0.9)' : 'var(--text-medium)'};
  line-height: 1.7;
`;

const AddressCard = styled.div`
  background: var(--bg-fog);
  padding: 2rem;
  border-radius: 35px;
  text-align: center;
  box-shadow: var(--shadow-soft);
`;

const Address = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const MapsButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--green-fern) 0%, var(--green-forest) 100%);
  color: var(--bg-cream);
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  box-shadow: var(--shadow-medium);
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-deep);
  }
`;

const MapEmbed = styled.div`
  margin-top: 2rem;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: var(--shadow-medium);
  
  iframe {
    width: 100%;
    height: 350px;
    border: none;
  }
`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  
  const title = data.title || 'Anfahrt';
  const address = data.address || 'Waldweg 12, 12345 Naturstadt';
  const parkingInfo = data.parking_info || 'Kostenlose Parkplätze stehen direkt bei der Location zur Verfügung.';
  const publicTransport = data.public_transport || 'Mit dem Zug bis Hauptbahnhof, dann Bus 123 bis "Waldkapelle".';
  const mapsEmbed = data.maps_embed;

  return (
    <Section id="directions">
      <DecoLeaf $size="150px" $color="var(--green-sage)" $opacity={0.06} style={{ top: '10%', left: '-4%' }} />
      <DecoLeaf $size="100px" $color="var(--green-mint)" $opacity={0.05} style={{ bottom: '15%', right: '-3%' }} $duration="12s" />
      
      <Container>
        <Header>
          <Eyebrow>🚗 So kommt ihr hin</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          <DirectionCard $color="var(--green-fern)">
            <CardIcon>🚗</CardIcon>
            <CardTitle $dark>Mit dem Auto</CardTitle>
            <CardText $dark>{parkingInfo}</CardText>
          </DirectionCard>
          
          <DirectionCard $color="var(--green-mint)">
            <CardIcon>🚌</CardIcon>
            <CardTitle>ÖPNV</CardTitle>
            <CardText>{publicTransport}</CardText>
          </DirectionCard>
        </Grid>
        
        <AddressCard>
          <Address>
            <span>📍</span>
            {address}
          </Address>
          <MapsButton 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            In Google Maps öffnen →
          </MapsButton>
        </AddressCard>
        
        {mapsEmbed && (
          <MapEmbed>
            <iframe src={mapsEmbed} title="Anfahrt" loading="lazy" allowFullScreen />
          </MapEmbed>
        )}
      </Container>
    </Section>
  );
}

export default Directions;
