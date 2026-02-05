import { useWedding } from '../../context/WeddingContext';
// src/components/Directions.js - Neon Theme
import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(0,255,255,0.5); }
`;

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: #0a0a0f;
  padding: 150px 5%;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff00ff;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;

  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
`;

const Card = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$color}40;
  padding: 40px;
  position: relative;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease ${p => p.$delay}s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${p => p.$color};
    box-shadow: 0 0 20px ${p => p.$color};
  }

  &:hover {
    border-color: ${p => p.$color};
    box-shadow: 0 0 30px ${p => p.$color}30;
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 25px;
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 15px;
`;

const CardText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.6);
  margin-bottom: 25px;
`;

const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${p => p.$color};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;

  &:hover {
    text-shadow: 0 0 10px ${p => p.$color};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MapEmbed = styled.div`
  margin-top: 60px;
  height: 400px;
  border: 1px solid rgba(0,255,255,0.2);
  position: relative;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.8s ease 0.4s;

  iframe {
    width: 100%;
    height: 100%;
    filter: grayscale(100%) invert(92%) contrast(83%);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
`;

const neonColors = ['#00ffff', '#ff00ff', '#00ff88', '#b347ff', '#ff6b6b', '#ffd93d'];

function Directions() {
  const { content } = useWedding();
  const directionsData = content?.directions || {};
  const title = directionsData.title || 'Anfahrt';

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const defaultItems = [
    { icon: '🚗', title: 'Mit dem Auto', description: 'Kostenlose Parkplätze stehen vor Ort zur Verfügung.' },
    { icon: '🚆', title: 'Öffentliche Verkehrsmittel', description: 'Mit der U-Bahn bis zur Haltestelle, dann 5 Minuten zu Fuß.' },
    { icon: '🚕', title: 'Taxi', description: 'Taxi-Service verfügbar. Wir können auch einen Shuttle organisieren.' }
  ];

  // Support new items array format
  const getDisplayItems = () => {
    // New format: items array from editor
    if (directionsData.items && directionsData.items.length > 0) {
      return directionsData.items.map((item, i) => ({
        icon: item.icon || '📍',
        title: item.title || '',
        description: item.description || '',
        color: neonColors[i % neonColors.length]
      }));
    }

    // Legacy format: fixed fields
    const legacyItems = [];
    if (directionsData.parking_info) {
      legacyItems.push({ icon: '🚗', title: 'Mit dem Auto', description: directionsData.parking_info, color: '#00ffff' });
    }
    if (directionsData.public_transport) {
      legacyItems.push({ icon: '🚆', title: 'Öffentliche Verkehrsmittel', description: directionsData.public_transport, color: '#ff00ff' });
    }
    if (directionsData.taxi_info) {
      legacyItems.push({ icon: '🚕', title: 'Taxi / Shuttle', description: directionsData.taxi_info, color: '#00ff88' });
    }

    if (legacyItems.length > 0) return legacyItems;

    return defaultItems.map((item, i) => ({ ...item, color: neonColors[i % neonColors.length] }));
  };

  const displayItems = getDisplayItems();
  const mapEmbedUrl = directionsData.maps_embed || '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="directions">
      <GridBG />
      <Container>
        <Header $visible={visible}>
          <Eyebrow>// How to Find Us</Eyebrow>
          <Title><span>{title}</span></Title>
        </Header>

        <Grid>
          {displayItems.map((item, i) => (
            <Card key={i} $visible={visible} $delay={i * 0.15} $color={item.color}>
              <CardIcon>{item.icon}</CardIcon>
              <CardTitle>{item.title}</CardTitle>
              <CardText>{item.description}</CardText>
            </Card>
          ))}
        </Grid>

        {mapEmbedUrl && (
          <MapEmbed $visible={visible}>
            <iframe
              src={mapEmbedUrl}
              title="Location Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </MapEmbed>
        )}
      </Container>
    </Section>
  );
}

export default Directions;
