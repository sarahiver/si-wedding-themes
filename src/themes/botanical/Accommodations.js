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

const Description = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
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
  margin-bottom: 0.75rem;
`;

const HotelMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;

  span:first-child {
    flex-shrink: 0;
  }
`;

const AddressLink = styled.a`
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--text-light);
    text-decoration: underline;
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-dim);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
`;

const BookingCode = styled.div`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  strong {
    color: var(--text-light);
    font-weight: 600;
  }
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
// HELPER
// ============================================

const getMapsUrl = (address) => {
  if (!address) return null;
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
};

// ============================================
// COMPONENT
// ============================================

function Accommodations() {
  const { content } = useWedding();
  const accommodationsData = content?.accommodations || {};

  const title = accommodationsData.title || 'Übernachtung';
  const description = accommodationsData.description || '';
  const hotels = accommodationsData.hotels || [];

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultHotels = [
    {
      name: 'Hotel Louis C. Jacob',
      address: 'Elbchaussee 401, 22609 Hamburg',
      distance: '5 Min zur Location',
      price_range: '€€€',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      url: 'https://hotel-jacob.de',
    },
    {
      name: 'Strandhotel Blankenese',
      address: 'Strandweg 13, 22587 Hamburg',
      distance: '10 Min zur Location',
      price_range: '€€',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
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
          {description && <Description $visible={visible}>{description}</Description>}
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

                <HotelMeta>
                  {hotel.address && (
                    <MetaItem>
                      <span>📍</span>
                      <AddressLink href={getMapsUrl(hotel.address)} target="_blank" rel="noopener noreferrer">
                        {hotel.address}
                      </AddressLink>
                    </MetaItem>
                  )}
                  {hotel.distance && (
                    <MetaItem>
                      <span>🚶</span>
                      <span>{hotel.distance}</span>
                    </MetaItem>
                  )}
                </HotelMeta>

                <TagsRow>
                  {hotel.price_range && <Tag>{hotel.price_range}</Tag>}
                </TagsRow>

                {hotel.booking_code && (
                  <BookingCode>
                    Buchungscode: <strong>{hotel.booking_code}</strong>
                  </BookingCode>
                )}

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
