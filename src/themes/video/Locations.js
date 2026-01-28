import { useWedding } from '../../context/WeddingContext';
// src/components/Locations.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #FAF8F5;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.5);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #1A1A1A;

  span {
    font-style: italic;
  }
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LocationCard = styled.div`
  position: relative;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease ${p => 0.2 + p.$index * 0.15}s;
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;

  ${LocationCard}:hover & {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  z-index: 1;
`;

const LocationType = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 15px;
`;

const LocationName = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2rem;
  font-weight: 400;
  color: #FFFFFF;
  margin-bottom: 10px;
`;

const LocationAddress = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
`;

const DirectionsButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
  padding: 12px 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: #FFFFFF;
    color: #1A1A1A;
    border-color: #FFFFFF;
  }
`;

const MapSection = styled.div`
  margin-top: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease 0.5s;
`;

const MapWrapper = styled.div`
  position: relative;
  aspect-ratio: 21/9;
  background: #E0DCD5;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    filter: grayscale(100%);
    transition: filter 0.5s ease;

    &:hover {
      filter: grayscale(0%);
    }
  }
`;

function Locations() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const locations = [
    {
      type: 'Trauung',
      name: 'Standesamt Blankenese',
      address: 'Blankeneser Bahnhofstraße 31, 22587 Hamburg',
      image: 'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
      mapsUrl: 'https://maps.google.com'
    },
    {
      type: 'Feier',
      name: 'Gut Karlshöhe',
      address: 'Karlshöhe 60d, 22175 Hamburg',
      image: 'https://res.cloudinary.com/si-weddings/image/upload/v1769078167/si_comming_soon_about_pbqwny.jpg',
      mapsUrl: 'https://maps.google.com'
    }
  ];

  return (
    <Section ref={sectionRef} id="location">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Location</Eyebrow>
          <Title>Wo wir <span>feiern</span></Title>
        </Header>

        <LocationsGrid>
          {locations.map((location, index) => (
            <LocationCard key={index} $visible={isVisible} $index={index}>
              <ImageWrapper>
                <Image src={location.image} alt={location.name} />
              </ImageWrapper>
              <CardContent>
                <LocationType>{location.type}</LocationType>
                <LocationName>{location.name}</LocationName>
                <LocationAddress>{location.address}</LocationAddress>
                <DirectionsButton href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Route planen
                  <span>→</span>
                </DirectionsButton>
              </CardContent>
            </LocationCard>
          ))}
        </LocationsGrid>

        <MapSection $visible={isVisible}>
          <MapWrapper>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2369.4!2d9.8!3d53.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDMzJzAwLjAiTiA5wrA0OCcwMC4wIkU!5e0!3m2!1sde!2sde!4v1600000000000!5m2!1sde!2sde"
              title="Location Map"
              loading="lazy"
              allowFullScreen
            />
          </MapWrapper>
        </MapSection>
      </Container>
    </Section>
  );
}

export default Locations;
