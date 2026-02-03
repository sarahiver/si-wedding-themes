import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.1s;
  `}
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  overflow: hidden;
  position: relative;
  transition: all 0.4s ease;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: ${0.2 + p.$index * 0.15}s;
  `}
  
  &:hover {
    background: var(--glass-bg-hover);
    transform: translateY(-5px);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.8);
    transition: all 0.5s ease;
  }
  
  ${GlassCard}:hover & img {
    filter: brightness(0.9);
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  position: relative;
  
  /* Top highlight */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255,255,255,0.15) 20%, 
      rgba(255,255,255,0.25) 50%, 
      rgba(255,255,255,0.15) 80%, 
      transparent 100%
    );
    pointer-events: none;
  }
`;

const CardIcon = styled.span`
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.5vw, 1.5rem);
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const CardSubtitle = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 0.75rem;
  line-height: 1.6;
`;

const CardAddress = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-dim);
  margin: 0;
  line-height: 1.5;
`;

const MapLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-light);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

// ============================================
// COMPONENT
// ============================================

function Locations() {
  const { content } = useWedding();
  const locationsData = content?.locations || {};
  
  const title = locationsData.title || 'Locations';
  const locations = locationsData.locations || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultLocations = [
    {
      icon: '💒',
      title: 'Standesamt',
      subtitle: 'Standesamt Hamburg-Mitte',
      address: 'Caffamacherreihe 1-3\n20355 Hamburg',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      mapsUrl: 'https://maps.google.com',
    },
    {
      icon: '🎉',
      title: 'Feier',
      subtitle: 'Landhaus Walter',
      address: 'Elbchaussee 547\n22587 Hamburg',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      mapsUrl: 'https://maps.google.com',
    },
  ];

  // Map editor field names to component field names
  const mappedLocations = locations.map(loc => ({
    icon: loc.icon || '📍',
    title: loc.name || loc.title || '',
    subtitle: loc.type || loc.subtitle || '',
    address: loc.address || '',
    image: loc.image || '',
    mapsUrl: loc.maps_url || loc.mapsUrl || '',
  }));

  const displayLocations = mappedLocations.length > 0 ? mappedLocations : defaultLocations;

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
    <Section id="locations" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Wo wir feiern</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <LocationsGrid>
          {displayLocations.map((location, i) => (
            <GlassCard key={i} $visible={visible} $index={i}>
              {location.image && (
                <CardImage>
                  <img src={location.image} alt={location.title} loading="lazy" />
                </CardImage>
              )}
              <CardContent>
                {location.icon && <CardIcon>{location.icon}</CardIcon>}
                <CardTitle>{location.title}</CardTitle>
                {location.subtitle && <CardSubtitle>{location.subtitle}</CardSubtitle>}
                {location.address && (
                  <CardAddress>
                    {location.address.split('\n').map((line, j) => (
                      <React.Fragment key={j}>
                        {line}
                        {j < location.address.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </CardAddress>
                )}
                {location.mapsUrl && (
                  <MapLink href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <span>📍</span> Route planen
                  </MapLink>
                )}
              </CardContent>
            </GlassCard>
          ))}
        </LocationsGrid>
      </Container>
    </Section>
  );
}

export default Locations;
