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

const Subtitle = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.2s;
  `}
`;

const HotelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: var(--glass-shadow);
  overflow: hidden;
  position: relative;
  transition: all 0.4s ease;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: ${0.3 + p.$index * 0.1}s;
  `}
  
  &:hover {
    background: var(--glass-bg-hover);
    transform: translateY(-5px);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 160px;
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
  padding: 1.25rem;
`;

const HotelName = styled.h3`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const HotelDetails = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem;
  line-height: 1.5;
`;

const HotelPrice = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-dim);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  margin-bottom: 1rem;
`;

const BookButton = styled.a`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.08);
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
    background: rgba(255, 255, 255, 0.15);
    color: var(--text-light);
  }
`;

// ============================================
// COMPONENT
// ============================================

function Accommodations() {
  const { content } = useWedding();
  const accommodationsData = content?.accommodations || {};
  
  const title = accommodationsData.title || 'Übernachtung';
  const subtitle = accommodationsData.subtitle || 'Unterkünfte in der Nähe';
  const hotels = accommodationsData.hotels || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultHotels = [
    {
      name: 'Hotel Louis C. Jacob',
      details: '5-Sterne Luxushotel direkt an der Elbe',
      price: 'ab 250€/Nacht',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      url: 'https://hotel-jacob.de',
    },
    {
      name: 'Strandhotel Blankenese',
      details: 'Gemütliches Hotel mit Elbblick',
      price: 'ab 120€/Nacht',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      url: 'https://booking.com',
    },
    {
      name: 'Gastwerk Hotel',
      details: 'Design-Hotel in altem Gaswerk',
      price: 'ab 140€/Nacht',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      url: 'https://booking.com',
    },
  ];

  const displayHotels = hotels.length > 0 ? hotels : defaultHotels;

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
    <Section id="accommodations" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Für Übernachtungsgäste</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          {subtitle && <Subtitle $visible={visible}>{subtitle}</Subtitle>}
        </Header>
        
        <HotelsGrid>
          {displayHotels.map((hotel, i) => (
            <GlassCard key={i} $visible={visible} $index={i}>
              {hotel.image && (
                <CardImage>
                  <img src={hotel.image} alt={hotel.name} loading="lazy" />
                </CardImage>
              )}
              <CardContent>
                <HotelName>{hotel.name}</HotelName>
                {hotel.details && <HotelDetails>{hotel.details}</HotelDetails>}
                {hotel.price && <HotelPrice>{hotel.price}</HotelPrice>}
                {hotel.url && (
                  <BookButton href={hotel.url} target="_blank" rel="noopener noreferrer">
                    Zur Buchung
                  </BookButton>
                )}
              </CardContent>
            </GlassCard>
          ))}
        </HotelsGrid>
      </Container>
    </Section>
  );
}

export default Accommodations;
