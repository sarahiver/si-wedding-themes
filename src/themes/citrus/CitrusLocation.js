// src/themes/citrus/CitrusLocation.js
// Location Section with citrus-themed map styling
import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { CitrusFruit } from './components/Citrus3D';
import { colors, fonts } from './GlobalStyles';

// ============================================
// 3D DECORATIVE SCENE
// ============================================
function DecoScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <CitrusFruit position={[-2, 0, 0]} scale={0.6} color={colors.lime} speed={0.5} />
      <CitrusFruit position={[2, -0.5, 0]} scale={0.4} color={colors.lemon} speed={0.7} />
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
const CitrusLocation = ({
  title = 'Wo wir feiern',
  locations = [
    {
      type: 'Trauung',
      name: 'Alte Gärtnerei',
      address: 'Gartenweg 12',
      city: '12345 Musterstadt',
      time: '14:00 Uhr',
      description: 'Die standesamtliche Trauung findet im wunderschönen Glashaus statt.',
      mapUrl: 'https://maps.google.com'
    },
    {
      type: 'Feier',
      name: 'Zitronenhain Restaurant',
      address: 'Sonnenallee 45',
      city: '12345 Musterstadt',
      time: '16:00 Uhr',
      description: 'Hier werden wir bis in die Nacht tanzen und feiern.',
      mapUrl: 'https://maps.google.com'
    }
  ]
}) => {
  return (
    <SectionWrapper id="location">
      <Container>
        <Header>
          <Eyebrow>📍 Location</Eyebrow>
          <Title>{title}</Title>
        </Header>

        <LocationsGrid>
          {locations.map((location, index) => (
            <LocationCard key={index} $delay={index * 0.2}>
              <CardHeader>
                <LocationType>{location.type}</LocationType>
                <LocationTime>{location.time}</LocationTime>
              </CardHeader>

              <LocationName>{location.name}</LocationName>

              <LocationAddress>
                <AddressLine>{location.address}</AddressLine>
                <AddressLine>{location.city}</AddressLine>
              </LocationAddress>

              {location.description && (
                <LocationDescription>{location.description}</LocationDescription>
              )}

              <MapButton href={location.mapUrl} target="_blank" rel="noopener noreferrer">
                <MapIcon>🗺️</MapIcon>
                <span>Auf Karte anzeigen</span>
              </MapButton>

              {/* 3D Decoration */}
              <CardDecoration>
                <Canvas>
                  <Suspense fallback={null}>
                    <DecoScene />
                  </Suspense>
                </Canvas>
              </CardDecoration>
            </LocationCard>
          ))}
        </LocationsGrid>

        {/* Additional Info */}
        <InfoSection>
          <InfoCard>
            <InfoIcon>🚗</InfoIcon>
            <InfoTitle>Anfahrt</InfoTitle>
            <InfoText>
              Parkplätze sind vor Ort vorhanden. Bitte plant ca. 10 Minuten Fußweg vom Parkplatz ein.
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoIcon>🚕</InfoIcon>
            <InfoTitle>Shuttle</InfoTitle>
            <InfoText>
              Ein Shuttle-Service zwischen den Locations wird ab 15:30 Uhr bereitgestellt.
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoIcon>🏨</InfoIcon>
            <InfoTitle>Übernachtung</InfoTitle>
            <InfoText>
              Wir haben Zimmer im Hotel Sonnenschein reserviert. Stichwort: "Hochzeit Anna & Max"
            </InfoText>
          </InfoCard>
        </InfoSection>
      </Container>

      {/* Background Decoration */}
      <BackgroundDeco />
    </SectionWrapper>
  );
};

export default CitrusLocation;

// ============================================
// ANIMATIONS
// ============================================
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const SectionWrapper = styled.section`
  position: relative;
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: ${colors.cream};
  overflow: hidden;
`;

const BackgroundDeco = styled.div`
  position: absolute;
  top: 0;
  right: -200px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: ${colors.lime}10;
  filter: blur(100px);
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.p`
  font-family: ${fonts.body};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: ${colors.lime};
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: ${fonts.heading};
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  font-style: italic;
  color: ${colors.charcoal};
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LocationCard = styled.div`
  position: relative;
  background: ${colors.warmWhite};
  border-radius: 24px;
  padding: 2.5rem;
  border: 2px solid ${colors.lime}30;
  overflow: hidden;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: ${p => p.$delay}s;
  opacity: 0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: ${colors.lime};
    box-shadow: 0 20px 50px rgba(164, 210, 51, 0.15);
  }
`;

const CardDecoration = styled.div`
  position: absolute;
  top: -20px;
  right: -20px;
  width: 150px;
  height: 150px;
  opacity: 0.2;
  pointer-events: none;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const LocationType = styled.span`
  font-family: ${fonts.body};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${colors.warmWhite};
  background: ${colors.leafGreen};
  padding: 0.4rem 1rem;
  border-radius: 20px;
`;

const LocationTime = styled.span`
  font-family: ${fonts.heading};
  font-size: 1.1rem;
  font-weight: 500;
  color: ${colors.lime};
`;

const LocationName = styled.h3`
  font-family: ${fonts.heading};
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
  color: ${colors.charcoal};
  margin-bottom: 1rem;
`;

const LocationAddress = styled.div`
  margin-bottom: 1rem;
`;

const AddressLine = styled.p`
  font-family: ${fonts.body};
  font-size: 1rem;
  color: ${colors.charcoal};
  opacity: 0.7;
  line-height: 1.5;
`;

const LocationDescription = styled.p`
  font-family: ${fonts.body};
  font-size: 0.95rem;
  color: ${colors.charcoal};
  opacity: 0.8;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.sand};
`;

const MapButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: ${fonts.body};
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.leafGreen};
  padding: 0.75rem 1.5rem;
  border: 2px solid ${colors.lime};
  border-radius: 50px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    background: ${colors.lime};
    color: ${colors.charcoal};
  }
`;

const MapIcon = styled.span`
  font-size: 1.2rem;
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: ${colors.sand}50;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.sand};
  }
`;

const InfoIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const InfoTitle = styled.h4`
  font-family: ${fonts.heading};
  font-size: 1.2rem;
  font-weight: 500;
  color: ${colors.charcoal};
  margin-bottom: 0.75rem;
`;

const InfoText = styled.p`
  font-family: ${fonts.body};
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${colors.charcoal};
  opacity: 0.7;
`;
