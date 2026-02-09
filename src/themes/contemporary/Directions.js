// Contemporary Directions
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  overflow: hidden;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 calc(-1 * var(--section-padding-x, 24px));
    padding: 0 var(--section-padding-x, 24px);
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

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

// Check if color should have light text
const isLightText = (colorIndex) => colorIndex !== 2; // Yellow (index 2) needs dark text

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};

  const title = data.title || 'Anfahrt';
  const address = data.address || 'Schloss Charlottenburg, Spandauer Damm 10-22, 14059 Berlin';
  const mapsEmbed = data.maps_embed;

  const defaultItems = [
    { icon: '🚗', title: 'Mit dem Auto', description: 'Kostenlose Parkplätze stehen direkt vor der Location zur Verfügung.' },
    { icon: '🚇', title: 'ÖPNV', description: 'U-Bahn: Richard-Wagner-Platz (U7), dann 10 Min Fußweg. Bus: M45 bis Schloss Charlottenburg.' },
  ];

  // Support new items array format
  const getDisplayItems = () => {
    // New format: items array from editor
    if (data.items && data.items.length > 0) {
      return data.items.map(item => ({
        icon: item.icon || '📍',
        title: item.title || '',
        description: item.description || ''
      }));
    }

    // Legacy format: fixed fields
    const legacyItems = [];
    if (data.parking_info) {
      legacyItems.push({ icon: '🚗', title: 'Mit dem Auto', description: data.parking_info });
    }
    if (data.public_transport) {
      legacyItems.push({ icon: '🚇', title: 'ÖPNV', description: data.public_transport });
    }
    if (data.taxi_info) {
      legacyItems.push({ icon: '🚕', title: 'Taxi', description: data.taxi_info });
    }

    return legacyItems.length > 0 ? legacyItems : defaultItems;
  };

  const displayItems = getDisplayItems();

  return (
    <Section id="directions">
      <Container>
        <Header>
          <Eyebrow>🚗 So kommt ihr hin</Eyebrow>
          <Title>{title}</Title>
        </Header>

        <Grid>
          {displayItems.map((item, i) => {
            const colorIndex = i % colors.length;
            const light = isLightText(colorIndex);
            return (
              <Card key={i} $color={colors[colorIndex]}>
                <CardIcon>{item.icon}</CardIcon>
                <CardTitle $light={light}>{item.title}</CardTitle>
                <CardText $light={light}>{item.description}</CardText>
              </Card>
            );
          })}

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
