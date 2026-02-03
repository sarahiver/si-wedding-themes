import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-light-gray);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MapSection = styled.div`
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const MapFrame = styled.div`
  position: relative;
  background: var(--editorial-white);
  padding-top: 80%;
  overflow: hidden;

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    filter: grayscale(100%);
    transition: filter 0.4s ease;
  }

  &:hover iframe {
    filter: grayscale(0%);
  }
`;

const MapPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: var(--editorial-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  span {
    font-size: 3rem;
  }

  p {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--editorial-gray);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoBlock = styled.div`
  background: var(--editorial-white);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: ${0.4 + p.$index * 0.1}s;
  `}
`;

const InfoLabel = styled.h3`
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-red);
  margin-bottom: 1rem;
`;

const InfoTitle = styled.h4`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--editorial-gray);
  line-height: 1.7;
  margin: 0;

  & + & {
    margin-top: 0.75rem;
  }
`;

const Divider = styled.div`
  width: 40px;
  height: 2px;
  background: var(--editorial-red);
  margin: 1rem 0;
  transform: scaleX(0);
  transform-origin: left;

  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: ${0.6 + p.$index * 0.1}s;
  `}
`;

const TransportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TransportItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--editorial-light-gray);
`;

const TransportIcon = styled.span`
  font-size: 1.5rem;
`;

const TransportText = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--editorial-black);
  line-height: 1.5;

  strong {
    display: block;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
`;

// ============================================
// COMPONENT
// ============================================

function Directions() {
  const { content } = useWedding();
  const directionsData = content?.directions || {};

  const title = directionsData.title || 'Anfahrt';
  const address = directionsData.address || 'Schlossstraße 1, 69117 Heidelberg';
  const mapsEmbed = directionsData.maps_embed || '';

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultItems = [
    { icon: '🚗', title: 'Mit dem Auto', description: 'Kostenfreie Parkplätze stehen am Schloss zur Verfügung.' },
    { icon: '🚆', title: 'ÖPNV', description: 'Mit der S-Bahn bis Heidelberg Hbf, dann Bus 33 bis Schloss.' },
  ];

  // Support new items array format
  const getDisplayItems = () => {
    // New format: items array from editor
    if (directionsData.items && directionsData.items.length > 0) {
      return directionsData.items.map(item => ({
        icon: item.icon || '📍',
        title: item.title || '',
        description: item.description || ''
      }));
    }

    // Legacy format: fixed fields
    const legacyItems = [];
    if (directionsData.parking_info) {
      legacyItems.push({ icon: '🚗', title: 'Mit dem Auto', description: directionsData.parking_info });
    }
    if (directionsData.public_transport) {
      legacyItems.push({ icon: '🚆', title: 'ÖPNV', description: directionsData.public_transport });
    }
    if (directionsData.taxi_info) {
      legacyItems.push({ icon: '🚕', title: 'Taxi', description: directionsData.taxi_info });
    }

    return legacyItems.length > 0 ? legacyItems : defaultItems;
  };

  const displayItems = getDisplayItems();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="directions" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>So findet ihr uns</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>

        <Grid>
          <MapSection $visible={visible}>
            <MapFrame>
              {mapsEmbed ? (
                <iframe
                  src={mapsEmbed}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Anfahrtskarte"
                />
              ) : (
                <MapPlaceholder>
                  <span>📍</span>
                  <p>Karte wird geladen</p>
                </MapPlaceholder>
              )}
            </MapFrame>
          </MapSection>

          <InfoSection>
            <InfoBlock $visible={visible} $index={0}>
              <InfoLabel>Adresse</InfoLabel>
              <InfoTitle>Location</InfoTitle>
              <Divider $visible={visible} $index={0} />
              <InfoText>{address}</InfoText>
            </InfoBlock>

            {displayItems.length > 0 && (
              <InfoBlock $visible={visible} $index={1}>
                <InfoLabel>Anreise</InfoLabel>
                <InfoTitle>So kommt ihr hin</InfoTitle>
                <Divider $visible={visible} $index={1} />

                <TransportGrid>
                  {displayItems.map((item, i) => (
                    <TransportItem key={i}>
                      <TransportIcon>{item.icon}</TransportIcon>
                      <TransportText>
                        <strong>{item.title}</strong>
                        {item.description}
                      </TransportText>
                    </TransportItem>
                  ))}
                </TransportGrid>
              </InfoBlock>
            )}
          </InfoSection>
        </Grid>
      </Container>
    </Section>
  );
}

export default Directions;
