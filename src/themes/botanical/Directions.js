import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ═══════════════════════════════════════════════════════════════════════════
   DIRECTIONS - BOTANICAL THEME
   Anfahrtsbeschreibung und Wegbeschreibungen zur Location
   ═══════════════════════════════════════════════════════════════════════════ */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const Section = styled.section`
  min-height: 100vh;
  background: var(--cream);
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '2rem'};
  opacity: 0.12;
  animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  bottom: ${p => p.$bottom};
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
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const MapIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
`;

const Eyebrow = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sage);
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1.5rem;
  
  span {
    font-style: italic;
    color: var(--sage);
  }
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.8;
  max-width: 550px;
  margin: 0 auto;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MapContainer = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(139, 157, 131, 0.2);
  box-shadow: 0 25px 70px rgba(139, 157, 131, 0.15);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const MapPlaceholder = styled.div`
  height: 350px;
  background: linear-gradient(135deg, var(--sage-lightest) 0%, var(--cream) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '🗺️';
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const MapNote = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
`;

const MapInfo = styled.div`
  padding: 1.5rem 2rem;
`;

const LocationName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const LocationAddress = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.6;
`;

const MapButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--sage);
  margin-top: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--sage-dark);
    transform: translateX(5px);
  }
`;

const DirectionsCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease;
  transition-delay: 0.3s;
`;

const DirectionCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 2rem;
  border: 1px solid rgba(139, 157, 131, 0.15);
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(8px);
    box-shadow: 0 15px 40px rgba(139, 157, 131, 0.12);
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const DirectionIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--sage-lightest);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
  
  @media (max-width: 600px) {
    margin: 0 auto;
  }
`;

const DirectionContent = styled.div`
  flex: 1;
`;

const DirectionTitle = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const DirectionText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.7;
`;

const DirectionHighlight = styled.span`
  color: var(--sage-dark);
  font-weight: 500;
`;

const ParkingSection = styled.div`
  margin-top: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.5s;
`;

const ParkingCard = styled.div`
  background: linear-gradient(135deg, var(--sage-lightest) 0%, rgba(255, 255, 255, 0.8) 100%);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 157, 131, 0.2);
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ParkingIcon = styled.div`
  font-size: 3rem;
`;

const ParkingContent = styled.div`
  flex: 1;
`;

const ParkingTitle = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--forest);
  margin-bottom: 0.75rem;
`;

const ParkingText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  line-height: 1.7;
`;

const Directions = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const directions = [
    {
      icon: '🚗',
      title: 'Mit dem Auto',
      text: <>Von der <DirectionHighlight>A7 Ausfahrt Seevetal</DirectionHighlight> der Beschilderung Richtung Maschen folgen. Nach ca. 3 km links auf die Waldstraße abbiegen. Das Gut Waldheim befindet sich nach 500m auf der rechten Seite.</>
    },
    {
      icon: '🚆',
      title: 'Mit öffentlichen Verkehrsmitteln',
      text: <>Vom <DirectionHighlight>Hauptbahnhof Hamburg</DirectionHighlight> mit der S3 bis Harburg Rathaus, dann weiter mit Bus 443 bis Haltestelle "Waldheim". Von dort sind es nur 5 Minuten zu Fuß.</>
    },
    {
      icon: '🚕',
      title: 'Taxi & Shuttle',
      text: <>Wir organisieren einen <DirectionHighlight>Shuttle-Service</DirectionHighlight> vom Bahnhof Harburg zur Location und zurück. Abfahrtszeiten werden noch bekannt gegeben. Taxi Hamburg: 040-211211</>
    }
  ];

  return (
    <Section ref={sectionRef} id="directions">
      <FloatingElement $top="8%" $left="5%" $size="2.5rem" $duration="7s">🗺️</FloatingElement>
      <FloatingElement $top="25%" $right="8%" $size="2rem" $duration="5s" $delay="1s">🌿</FloatingElement>
      <FloatingElement $top="55%" $left="3%" $size="2rem" $duration="8s" $delay="2s">📍</FloatingElement>
      <FloatingElement $bottom="20%" $right="5%" $size="2.5rem" $duration="6s" $delay="0.5s">🚗</FloatingElement>

      <Container>
        <Header $visible={isVisible}>
          <MapIcon>📍</MapIcon>
          <Eyebrow>So findet ihr uns</Eyebrow>
          <Title>An<span>fahrt</span></Title>
          <Subtitle>
            Hier findet ihr alle Informationen zur Anreise zu unserer Location 
            sowie hilfreiche Tipps für die Anfahrt.
          </Subtitle>
        </Header>

        <ContentGrid>
          <MapContainer $visible={isVisible}>
            <MapPlaceholder>
              <MapNote>Karte lädt...</MapNote>
            </MapPlaceholder>
            <MapInfo>
              <LocationName>🏡 Gut Waldheim</LocationName>
              <LocationAddress>
                Waldstraße 42<br />
                21220 Seevetal<br />
                Deutschland
              </LocationAddress>
              <MapButton href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                In Google Maps öffnen →
              </MapButton>
            </MapInfo>
          </MapContainer>

          <DirectionsCards $visible={isVisible}>
            {directions.map((dir, index) => (
              <DirectionCard key={index}>
                <DirectionIcon>{dir.icon}</DirectionIcon>
                <DirectionContent>
                  <DirectionTitle>{dir.title}</DirectionTitle>
                  <DirectionText>{dir.text}</DirectionText>
                </DirectionContent>
              </DirectionCard>
            ))}
          </DirectionsCards>
        </ContentGrid>

        <ParkingSection $visible={isVisible}>
          <ParkingCard>
            <ParkingIcon>🅿️</ParkingIcon>
            <ParkingContent>
              <ParkingTitle>Parkmöglichkeiten</ParkingTitle>
              <ParkingText>
                Kostenlose Parkplätze stehen direkt auf dem Gelände zur Verfügung. 
                Bitte folgt den Schildern zur "Hochzeitsparkplatz". 
                Für Gäste, die ihr Auto über Nacht stehen lassen möchten – kein Problem! 
                Die Fahrzeuge können bis zum nächsten Mittag abgeholt werden.
              </ParkingText>
            </ParkingContent>
          </ParkingCard>
        </ParkingSection>
      </Container>
    </Section>
  );
};

export default Directions;
