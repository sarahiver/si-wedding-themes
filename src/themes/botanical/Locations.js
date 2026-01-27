import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const LocationCard = styled.div`
  background: var(--cream);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid rgba(139, 157, 131, 0.2);
  transition: all 0.4s ease;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '40px'});
  transition-delay: ${p => p.index * 0.15}s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--sage);
    
    .image-wrapper img {
      transform: scale(1.08);
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--sage-muted), var(--cream-dark));
  gap: 0.5rem;
  
  .icon {
    font-size: 3rem;
    animation: ${float} 3s ease-in-out infinite;
  }
  
  .text {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-style: italic;
    color: var(--sage-dark);
  }
`;

const TypeBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: var(--cream);
  border-radius: 20px;
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage-dark);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: var(--shadow-sm);
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const LocationName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const LocationAddress = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  .icon { opacity: 0.6; }
`;

const LocationTime = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: var(--sage-muted);
  border-radius: 30px;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--sage-dark);
  margin-bottom: 1.5rem;
`;

const LocationDesc = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const MapButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.8rem;
  background: var(--sage);
  color: var(--cream);
  border-radius: 30px;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--sage-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .arrow {
    transition: transform var(--transition-normal);
  }
  
  &:hover .arrow {
    transform: translateX(4px);
  }
`;

// Info Box
const InfoBox = styled.div`
  margin-top: 3rem;
  padding: 2.5rem;
  background: var(--cream);
  border-radius: var(--radius-xl);
  border: 1px dashed var(--sage-light);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.4s;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const InfoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: var(--sage-muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  
  @media (max-width: 600px) {
    margin: 0 auto;
  }
`;

const InfoContent = styled.div`
  h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--forest);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    color: var(--text-light);
    line-height: 1.7;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Locations({
  locations = [
    { 
      type: 'Trauung', 
      name: 'Botanischer Garten', 
      address: 'Menzinger Straße 65, 80638 München', 
      time: '15:00 Uhr', 
      description: 'Freie Trauung unter der alten Linde im Rosengarten.', 
      image: null, 
      mapUrl: 'https://maps.google.com',
      icon: '💒'
    },
    { 
      type: 'Feier', 
      name: 'Die Orangerie', 
      address: 'Menzinger Straße 65, 80638 München', 
      time: '18:00 Uhr', 
      description: 'Festliches Dinner zwischen exotischen Pflanzen und warmem Kerzenlicht.', 
      image: null, 
      mapUrl: 'https://maps.google.com',
      icon: '🎉'
    },
  ],
  infoTitle = 'Anreise',
  infoText = 'Der Botanische Garten ist mit öffentlichen Verkehrsmitteln gut erreichbar (U1 Rotkreuzplatz). Parkplätze sind begrenzt vorhanden.',
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="location">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Locations</Eyebrow>
          <Title>Wo wir feiern</Title>
        </Header>

        <LocationsGrid>
          {locations.map((loc, i) => (
            <LocationCard key={i} index={i} visible={visible}>
              <ImageWrapper className="image-wrapper">
                {loc.image ? (
                  <img src={loc.image} alt={loc.name} />
                ) : (
                  <ImagePlaceholder>
                    <span className="icon">{loc.icon || '📍'}</span>
                    <span className="text">{loc.name}</span>
                  </ImagePlaceholder>
                )}
                <TypeBadge>
                  <span>{loc.icon || '📍'}</span>
                  {loc.type}
                </TypeBadge>
              </ImageWrapper>
              
              <CardContent>
                <LocationName>{loc.name}</LocationName>
                <LocationAddress>
                  <span className="icon">📍</span>
                  {loc.address}
                </LocationAddress>
                <LocationTime>
                  <span>🕐</span>
                  {loc.time}
                </LocationTime>
                <LocationDesc>{loc.description}</LocationDesc>
                <MapButton href={loc.mapUrl} target="_blank" rel="noopener noreferrer">
                  Route planen
                  <span className="arrow">→</span>
                </MapButton>
              </CardContent>
            </LocationCard>
          ))}
        </LocationsGrid>

        <InfoBox visible={visible}>
          <InfoIcon>🚗</InfoIcon>
          <InfoContent>
            <h4>{infoTitle}</h4>
            <p>{infoText}</p>
          </InfoContent>
        </InfoBox>
      </Container>
    </Section>
  );
}

export default Locations;
