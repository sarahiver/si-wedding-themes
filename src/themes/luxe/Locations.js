// Luxe Locations - Elegant mit Bildern
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: var(--container-width);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: 0;
  animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-black);
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LocationCard = styled.div`
  opacity: 0;
  animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards;
  animation-delay: ${p => 0.1 + p.$index * 0.15}s;
`;

const ImageWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const Image = styled.div`
  aspect-ratio: 16/10;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--luxe-sand)'};
`;

const TypeBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-white);
  background: var(--luxe-overlay);
  padding: 0.5rem 1rem;
  backdrop-filter: blur(5px);
`;

const CardContent = styled.div`
  padding: 0 0.5rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--luxe-black);
  margin-bottom: 0.75rem;
`;

const CardAddress = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-charcoal);
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const CardTime = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 1rem;
`;

const MapLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--luxe-charcoal);
  border-bottom: 1px solid var(--luxe-taupe);
  padding-bottom: 0.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--luxe-gold);
    border-color: var(--luxe-gold);
  }
`;

function Locations() {
  const { content } = useWedding();
  const locationsData = content?.locations || {};
  
  const title = locationsData.title || 'Veranstaltungsorte';
  const locations = locationsData.locations || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultLocations = [
    {
      name: 'Villa Medici',
      type: 'Zeremonie',
      address: 'Via della Pergola 15\n50121 Florenz, Italien',
      time: '15:00 Uhr',
      image: '',
      maps_url: ''
    },
    {
      name: 'Palazzo Vecchio',
      type: 'Empfang & Dinner',
      address: 'Piazza della Signoria\n50122 Florenz, Italien',
      time: '18:00 Uhr',
      image: '',
      maps_url: ''
    }
  ];

  const locationItems = locations.length > 0 ? locations : defaultLocations;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="locations">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Wo wir feiern</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <LocationsGrid>
          {locationItems.map((loc, i) => (
            <LocationCard key={i} $visible={visible} $index={i}>
              <ImageWrapper>
                <Image $image={loc.image} />
                <TypeBadge>{loc.type}</TypeBadge>
              </ImageWrapper>
              <CardContent>
                <CardTitle>{loc.name}</CardTitle>
                <CardTime>{loc.time}</CardTime>
                <CardAddress>{loc.address}</CardAddress>
                {loc.maps_url && (
                  <MapLink href={loc.maps_url} target="_blank" rel="noopener noreferrer">
                    Route anzeigen →
                  </MapLink>
                )}
              </CardContent>
            </LocationCard>
          ))}
        </LocationsGrid>
      </Container>
    </Section>
  );
}

export default Locations;
