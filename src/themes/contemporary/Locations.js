// Contemporary Locations - Colorful Cards
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--white);
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  margin-bottom: 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const Card = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.6s ease ${p => p.$index * 0.15}s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
`;

const CardHeader = styled.div`
  background: ${p => colors[p.$index % colors.length]};
  padding: 1.5rem;
  border-bottom: 3px solid var(--black);
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${p => p.$index === 2 ? 'var(--black)' : 'var(--white)'};
  text-transform: uppercase;
`;

const CardType = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$index === 2 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)'};
  margin-top: 0.25rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const Address = styled.p`
  font-size: 1rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
  line-height: 1.5;
  
  &::before {
    content: '📍 ';
  }
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gray-500);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const Time = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--black);
  background: var(--yellow);
  padding: 0.5rem 1rem;
  border: 2px solid var(--black);
  margin-bottom: 1rem;
  
  &::before {
    content: '⏰ ';
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Button = styled.a`
  flex: 1;
  min-width: 120px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${p => p.$primary ? 'var(--white)' : 'var(--black)'};
  background: ${p => p.$primary ? 'var(--coral)' : 'var(--white)'};
  padding: 0.75rem 1rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-md);
  }
`;

const MapEmbed = styled.div`
  width: 100%;
  height: 200px;
  border-top: 3px solid var(--black);
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

function Locations() {
  const { content } = useWedding();
  const locationsData = content?.locations || {};
  
  const title = locationsData.title || 'Locations';
  const locations = locationsData.locations || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultLocations = [
    {
      name: 'Kirche St. Marien',
      type: 'Trauung',
      address: 'Kirchstraße 15, 10178 Berlin',
      time: '14:00 Uhr',
      description: 'Die wunderschöne gotische Kirche im Herzen Berlins wird der Ort unserer Trauung sein.',
      icon: '⛪',
      maps_url: 'https://maps.google.com/?q=St.+Marien+Kirche+Berlin'
    },
    {
      name: 'Schloss Charlottenburg',
      type: 'Feier',
      address: 'Spandauer Damm 10-22, 14059 Berlin',
      time: '16:00 Uhr',
      description: 'Nach der Trauung feiern wir im prachtvollen Orangerie-Saal mit Blick auf den Schlossgarten.',
      icon: '🏰',
      maps_url: 'https://maps.google.com/?q=Schloss+Charlottenburg'
    }
  ];

  const items = locations.length > 0 ? locations : defaultLocations;

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
        <Header>
          <Eyebrow $visible={visible}>📍 Wo wir feiern</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((location, index) => (
            <Card key={index} $index={index} $visible={visible}>
              <CardHeader $index={index}>
                <CardIcon>{location.icon || '📍'}</CardIcon>
                <CardTitle $index={index}>{location.name}</CardTitle>
                <CardType $index={index}>{location.type}</CardType>
              </CardHeader>
              
              <CardBody>
                {location.time && <Time>{location.time}</Time>}
                <Address>{location.address}</Address>
                {location.description && <Description>{location.description}</Description>}
                
                <ButtonGroup>
                  {location.maps_url && (
                    <Button href={location.maps_url} target="_blank" rel="noopener noreferrer" $primary>
                      → Maps
                    </Button>
                  )}
                  <Button 
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(location.address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Route
                  </Button>
                </ButtonGroup>
              </CardBody>
              
              {location.maps_embed && (
                <MapEmbed>
                  <iframe 
                    src={location.maps_embed} 
                    title={location.name}
                    loading="lazy"
                    allowFullScreen
                  />
                </MapEmbed>
              )}
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Locations;
