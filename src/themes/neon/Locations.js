import { useWedding } from '../../context/WeddingContext';
import { downloadLocationsPDF } from '../../lib/locationsPdf';
// src/components/Locations.js - Neon Theme
import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const scanline = keyframes`
  0% { top: -100%; }
  100% { top: 100%; }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
`;

const LocationBlock = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: ${p => p.$reverse ? '1fr 1fr' : '1fr 1fr'};
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }

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

const ImageSide = styled.div`
  position: relative;
  overflow: hidden;
  order: ${p => p.$reverse ? 2 : 1};
  
  @media (max-width: 968px) {
    order: 1;
    height: 50vh;
  }
`;

const Image = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
  filter: grayscale(40%) contrast(1.1);
  transition: transform 0.6s ease;
  
  ${LocationBlock}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    ${p => p.$reverse ? '90deg' : '-90deg'},
    ${p => p.$color}30 0%,
    transparent 50%
  );
  
  /* Scanline Effect */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${p => p.$color}80, transparent);
    animation: ${scanline} 4s linear infinite;
  }
`;

const ContentSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  order: ${p => p.$reverse ? 1 : 2};
  position: relative;
  
  /* Grid Background */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
  }
  
  @media (max-width: 968px) {
    order: 2;
    padding: 50px 5%;
  }
`;

const TypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${p => p.$color};
  margin-bottom: 25px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '-30px'});
  transition: all 0.6s ease;
  
  &::before {
    content: '';
    width: 40px;
    height: 2px;
    background: ${p => p.$color};
    box-shadow: 0 0 10px ${p => p.$color};
  }
`;

const LocationName = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 30px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
  
  span {
    color: ${p => p.$color};
    text-shadow: 0 0 20px ${p => p.$color}50;
  }
`;

const Description = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.6);
  margin-bottom: 40px;
  max-width: 500px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease 0.2s;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.6s ease 0.3s;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const DetailBox = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.15);
  padding: 20px;
  
  /* Corner Accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 15px;
    height: 15px;
    border-top: 2px solid ${p => p.$color};
    border-left: 2px solid ${p => p.$color};
  }
  
  position: relative;
`;

const DetailLabel = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => p.$color};
  margin-bottom: 8px;
`;

const DetailValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  color: #fff;
`;

const MapButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0a0a0f;
  background: ${p => p.$color};
  padding: 18px 35px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 0 20px ${p => p.$color}50;
  transition: all 0.3s ease;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.4s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 40px ${p => p.$color}70;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent);
`;

function LocationItem({ location, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const reverse = index % 2 === 1;

  return (
    <LocationBlock ref={ref} $reverse={reverse}>
      <ImageSide $reverse={reverse}>
        <Image $src={location.image} />
        <ImageOverlay $reverse={reverse} $color={location.color} />
      </ImageSide>
      
      <ContentSide $reverse={reverse}>
        <TypeBadge $visible={visible} $color={location.color}>
          {location.type}
        </TypeBadge>
        
        <LocationName $visible={visible} $color={location.color}>
          {location.name.split(' ').map((word, i) => 
            i === location.name.split(' ').length - 1 
              ? <span key={i}>{word}</span> 
              : word + ' '
          )}
        </LocationName>
        
        <Description $visible={visible}>
          {location.description}
        </Description>
        
        <DetailsGrid $visible={visible}>
          <DetailBox $color={location.color}>
            <DetailLabel $color={location.color}>Time</DetailLabel>
            <DetailValue>{location.time}</DetailValue>
          </DetailBox>
          <DetailBox $color={location.color}>
            <DetailLabel $color={location.color}>Address</DetailLabel>
            <DetailValue>{location.address}</DetailValue>
          </DetailBox>
        </DetailsGrid>
        
        <MapButton 
          $visible={visible} 
          $color={location.color}
          href={location.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Open in Maps
        </MapButton>
      </ContentSide>
    </LocationBlock>
  );
}

const Header = styled.div`
  padding: 80px 5% 40px;
  background: #0a0a0f;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;

  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const ExportContainer = styled.div`
  margin-top: 1rem;
`;

const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 35px;
  background: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #00ffff;
    color: #0a0a0f;
    box-shadow: 0 0 30px rgba(0,255,255,0.5);
  }
`;

function Locations() {
  const { content, project } = useWedding();
  const locationsData = content?.locations || {};

  const name1 = project?.partner1_name || 'Partner1';
  const name2 = project?.partner2_name || 'Partner2';
  const coupleName = `${name1} & ${name2}`;

  const defaultLocations = [
    {
      type: 'Ceremony',
      name: 'St. Patrick Church',
      description: 'A stunning neo-gothic cathedral where two hearts will become one. The afternoon light through stained glass creates an ethereal atmosphere.',
      time: '14:00',
      address: 'Kirchstraße 15, Berlin',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      mapUrl: 'https://maps.google.com',
      color: '#00ffff'
    },
    {
      type: 'Reception',
      name: 'The Glass Factory',
      description: 'An industrial-chic venue with floor-to-ceiling windows and exposed brick. Perfect for dancing the night away under neon lights.',
      time: '18:00',
      address: 'Fabrikweg 42, Berlin',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      mapUrl: 'https://maps.google.com',
      color: '#ff00ff'
    }
  ];

  const neonColors = ['#00ffff', '#ff00ff', '#00ff88', '#b347ff'];

  // Map from editor format to neon format
  const locations = locationsData.locations?.length > 0
    ? locationsData.locations.map((loc, i) => ({
        type: loc.type || 'Location',
        name: loc.name,
        description: loc.description || '',
        time: loc.time || '',
        address: loc.address || '',
        image: loc.image || defaultLocations[i % defaultLocations.length]?.image,
        mapUrl: loc.maps_url || '',
        color: neonColors[i % neonColors.length]
      }))
    : defaultLocations;

  return (
    <Section id="location">
      <Header>
        <HeaderTitle>Die <span>Locations</span></HeaderTitle>
        <ExportContainer>
          <ExportButton onClick={() => downloadLocationsPDF(locations, coupleName)}>
            <span>📄</span> Locations als PDF
          </ExportButton>
        </ExportContainer>
      </Header>
      {locations.map((location, i) => (
        <React.Fragment key={i}>
          <LocationItem location={location} index={i} />
          {i < locations.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Section>
  );
}

export default Locations;
