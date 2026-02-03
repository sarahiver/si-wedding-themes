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
  width: 60px;
  height: 60px;
  border: 2px solid ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  color: ${p => p.$color};
  
  svg {
    width: 28px;
    height: 28px;
  }
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

function Directions() {
  const { content } = useWedding();
  const directionsData = content?.directions || {};
  const title = directionsData.title || 'Anfahrt';

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const defaultDirections = [
    {
      icon: 'car',
      title: 'Mit dem Auto',
      text: 'Kostenlose Parkplätze stehen vor Ort zur Verfügung.',
      link: '',
      linkText: 'Route planen',
      color: '#00ffff'
    },
    {
      icon: 'train',
      title: 'Öffentliche Verkehrsmittel',
      text: 'Mit der U-Bahn bis zur Haltestelle, dann 5 Minuten zu Fuß.',
      link: '',
      linkText: 'Route planen',
      color: '#ff00ff'
    },
    {
      icon: 'plane',
      title: 'Taxi',
      text: 'Taxi-Service verfügbar. Wir können auch einen Shuttle organisieren.',
      link: '',
      linkText: 'Info',
      color: '#00ff88'
    }
  ];

  // Build directions from editor fields
  const buildDirections = () => {
    const dirs = [];
    if (directionsData.parking_info) {
      dirs.push({
        icon: 'car',
        title: 'Mit dem Auto',
        text: directionsData.parking_info,
        link: '',
        linkText: 'Route planen',
        color: '#00ffff'
      });
    }
    if (directionsData.public_transport) {
      dirs.push({
        icon: 'train',
        title: 'Öffentliche Verkehrsmittel',
        text: directionsData.public_transport,
        link: '',
        linkText: 'Route planen',
        color: '#ff00ff'
      });
    }
    if (directionsData.taxi_info) {
      dirs.push({
        icon: 'plane',
        title: 'Taxi / Shuttle',
        text: directionsData.taxi_info,
        link: '',
        linkText: 'Info',
        color: '#00ff88'
      });
    }
    return dirs;
  };

  const builtDirections = buildDirections();
  const directions = builtDirections.length > 0 ? builtDirections : defaultDirections;
  const mapEmbedUrl = directionsData.maps_embed || '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const icons = {
    car: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>,
    train: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
    plane: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
  };

  return (
    <Section ref={sectionRef} id="directions">
      <GridBG />
      <Container>
        <Header $visible={visible}>
          <Eyebrow>// How to Find Us</Eyebrow>
          <Title><span>{title}</span></Title>
        </Header>
        
        <Grid>
          {directions.map((dir, i) => (
            <Card key={i} $visible={visible} $delay={i * 0.15} $color={dir.color}>
              <CardIcon $color={dir.color}>{icons[dir.icon]}</CardIcon>
              <CardTitle>{dir.title}</CardTitle>
              <CardText>{dir.text}</CardText>
              <CardLink href={dir.link} target="_blank" $color={dir.color}>
                {dir.linkText}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </CardLink>
            </Card>
          ))}
        </Grid>
        
        <MapEmbed $visible={visible}>
          <iframe 
            src={mapEmbedUrl}
            title="Location Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </MapEmbed>
      </Container>
    </Section>
  );
}

export default Directions;
