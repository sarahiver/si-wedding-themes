// Botanical Directions - Directions in hole
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
  padding: 1.5rem 1rem;
  text-align: center;
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

const InfoGrid = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
  margin-bottom: 1rem;
`;

const InfoCard = styled.div`
  flex: 1;
  background: ${p => p.$dark ? 'var(--dark)' : 'var(--off-white)'};
  padding: 0.75rem;
  text-align: left;
`;

const InfoTitle = styled.h3`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$dark ? 'var(--pale)' : 'var(--light)'};
  margin-bottom: 0.4rem;
`;

const InfoText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: ${p => p.$dark ? 'var(--off-white)' : 'var(--medium)'};
  line-height: 1.5;
`;

const Address = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--medium);
  margin-bottom: 1rem;
`;

const MapsBtn = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--black);
  color: var(--white);
  
  &:hover { opacity: 0.8; }
`;

function Directions() {
  const { content } = useWedding();
  const { mainHole } = useKnotholes();
  const data = content?.directions || {};
  
  const title = data.title || 'Anfahrt';
  const address = data.address || 'Waldweg 12, 12345 Naturstadt';
  const parking = data.parking_info || 'Kostenlose Parkplätze vor Ort.';
  const publicTransport = data.public_transport || 'Bus 123 bis Waldkapelle.';

  return (
    <Section data-section="directions">
      <HoleContent $hole={mainHole}>
        <Eyebrow>So kommt ihr hin</Eyebrow>
        <Title>{title}</Title>
        
        <InfoGrid>
          <InfoCard $dark>
            <InfoTitle $dark>Auto</InfoTitle>
            <InfoText $dark>{parking}</InfoText>
          </InfoCard>
          <InfoCard>
            <InfoTitle>ÖPNV</InfoTitle>
            <InfoText>{publicTransport}</InfoText>
          </InfoCard>
        </InfoGrid>
        
        <Address>{address}</Address>
        
        <MapsBtn 
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
        >
          Google Maps
        </MapsBtn>
      </HoleContent>
    </Section>
  );
}

export default Directions;
