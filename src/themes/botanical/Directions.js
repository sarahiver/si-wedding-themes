// Botanical Directions - Clean layout
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 600px;
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
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${p => p.$dark ? 'var(--forest-deep)' : 'var(--cream-dark)'};
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 500;
  color: ${p => p.$dark ? 'var(--cream)' : 'var(--forest-deep)'};
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: ${p => p.$dark ? 'var(--forest-mist)' : 'var(--bark-medium)'};
  line-height: 1.6;
`;

const AddressCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: var(--cream-dark);
`;

const Address = styled.p`
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--bark-medium);
  margin-bottom: 1.5rem;
`;

const MapsButton = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--forest-deep);
  color: var(--cream);
  transition: background 0.3s ease;
  
  &:hover {
    background: var(--forest-main);
  }
`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};
  
  const title = data.title || 'Anfahrt';
  const address = data.address || 'Waldweg 12, 12345 Naturstadt';
  const parkingInfo = data.parking_info || 'Kostenlose Parkplätze vor Ort.';
  const publicTransport = data.public_transport || 'Bus 123 bis Haltestelle Waldkapelle.';

  return (
    <Section id="directions" data-section="directions">
      <Content>
        <Header>
          <Eyebrow>So kommt ihr hin</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          <Card $dark>
            <CardTitle $dark>Mit dem Auto</CardTitle>
            <CardText $dark>{parkingInfo}</CardText>
          </Card>
          <Card>
            <CardTitle>ÖPNV</CardTitle>
            <CardText>{publicTransport}</CardText>
          </Card>
        </Grid>
        
        <AddressCard>
          <Address>{address}</Address>
          <MapsButton 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
          >
            In Google Maps öffnen
          </MapsButton>
        </AddressCard>
      </Content>
    </Section>
  );
}

export default Directions;
