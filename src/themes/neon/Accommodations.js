import { useWedding } from '../../context/WeddingContext';
// src/components/Accommodations.js - Neon Theme
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const scanlineAnim = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: 150px 5%;
  overflow: hidden;
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
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: #00ffff;
  margin-bottom: 20px;
  
  &::before {
    content: '$ ';
    color: #ff00ff;
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  
  span {
    color: #ff00ff;
    text-shadow: 0 0 20px rgba(255,0,255,0.5);
  }
`;

const Subtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  margin-top: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const AccommodationsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const AccommodationCard = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr auto;
  gap: 40px;
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$color || '#00ffff'}30;
  padding: 30px;
  position: relative;
  overflow: hidden;
  animation: ${fadeInLeft} 0.6s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;
  transition: all 0.4s ease;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${p => p.$color || '#00ffff'};
    box-shadow: 0 0 20px ${p => p.$color || '#00ffff'};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${p => p.$color || '#00ffff'}50, transparent);
    animation: ${scanlineAnim} 5s linear infinite;
    opacity: 0.3;
  }
  
  &:hover {
    border-color: ${p => p.$color || '#00ffff'};
    transform: translateX(10px);
    box-shadow: 0 0 40px ${p => p.$color || '#00ffff'}20;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
  border: 1px solid ${p => p.$color || '#00ffff'}20;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
    transition: all 0.4s ease;
    
    ${AccommodationCard}:hover & {
      filter: grayscale(0%) brightness(1.1);
      transform: scale(1.05);
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, ${p => p.$color || '#00ffff'}20, transparent);
    pointer-events: none;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.7rem;
  color: ${p => p.$color || '#00ffff'};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 12px;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${p => p.$color || '#00ffff'};
    box-shadow: 0 0 10px ${p => p.$color || '#00ffff'};
    animation: ${glowPulse} 2s ease-in-out infinite;
  }
`;

const HotelName = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
`;

const HotelDescription = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  margin-bottom: 20px;
`;

const DetailsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  
  svg {
    width: 18px;
    height: 18px;
    color: ${p => p.$color || '#00ffff'};
  }
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 15px;
  
  @media (max-width: 900px) {
    align-items: flex-start;
  }
`;

const PriceTag = styled.div`
  text-align: right;
  
  @media (max-width: 900px) {
    text-align: left;
  }
`;

const PriceLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 5px;
`;

const Price = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${p => p.$color || '#00ffff'};
  text-shadow: 0 0 15px ${p => p.$color || '#00ffff'}50;
  
  span {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.4);
  }
`;

const BookButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  background: transparent;
  border: 2px solid ${p => p.$color || '#00ffff'};
  color: ${p => p.$color || '#00ffff'};
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: ${p => p.$color || '#00ffff'};
    color: #0a0a0f;
    box-shadow: 0 0 30px ${p => p.$color || '#00ffff'}50;
  }
`;

const CodeBox = styled.div`
  margin-top: 60px;
  background: rgba(0,255,136,0.05);
  border: 1px solid rgba(0,255,136,0.2);
  padding: 30px;
  text-align: center;
  
  h4 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.2rem;
    color: #00ff88;
    margin-bottom: 15px;
    
    &::before {
      content: '🎫 ';
    }
  }
  
  p {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.6);
    
    code {
      background: rgba(0,255,136,0.1);
      padding: 5px 15px;
      border: 1px solid rgba(0,255,136,0.3);
      color: #00ff88;
      font-family: 'Space Grotesk', monospace;
      margin-left: 10px;
    }
  }
`;

function Accommodations() {
  const { content } = useWedding();
  const accommodationsData = content?.accommodations || {};
  const title = accommodationsData.title || 'Übernachtung';

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const defaultAccommodations = [
    {
      id: 1,
      name: 'Hotel Neon Nights',
      type: 'PREMIUM',
      description: 'Modernes Designhotel direkt neben der Location.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      distance: '200m zur Location',
      price: '159€',
      priceNote: 'pro Nacht',
      color: '#ff00ff',
      bookingUrl: '#'
    },
    {
      id: 2,
      name: 'Cyber Inn',
      type: 'MITTELKLASSE',
      description: 'Gemütliches Hotel mit futuristischem Flair.',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
      distance: '1.5km zur Location',
      price: '99€',
      priceNote: 'pro Nacht',
      color: '#00ffff',
      bookingUrl: '#'
    }
  ];

  const neonColors = ['#ff00ff', '#00ffff', '#00ff88', '#b347ff'];

  // Map from editor format to neon format
  const accommodations = accommodationsData.hotels?.length > 0
    ? accommodationsData.hotels.map((h, i) => ({
        id: i + 1,
        name: h.name,
        type: h.price_range || 'Hotel',
        description: '',
        image: h.image || defaultAccommodations[i % defaultAccommodations.length]?.image,
        distance: h.distance || '',
        price: h.price_range || '',
        priceNote: 'pro Nacht',
        color: neonColors[i % neonColors.length],
        bookingUrl: h.url || '#',
        bookingCode: h.booking_code || ''
      }))
    : defaultAccommodations;

  const bookingCode = accommodationsData.hotels?.[0]?.booking_code || '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="accommodations">
      <GridBG />
      
      <Container>
        <Header $visible={visible}>
          <Eyebrow>find_accommodation.exe</Eyebrow>
          <Title><span>{title}</span></Title>
          <Subtitle>Wir haben für euch ein paar Hotel-Empfehlungen zusammengestellt</Subtitle>
        </Header>
        
        <AccommodationsGrid>
          {accommodations.map((hotel, i) => (
            <AccommodationCard key={hotel.id} $color={hotel.color} $delay={`${i * 0.15}s`}>
              <ImageWrapper $color={hotel.color}>
                <img src={hotel.image} alt={hotel.name} />
              </ImageWrapper>
              
              <ContentSection>
                <TypeBadge $color={hotel.color}>{hotel.type}</TypeBadge>
                <HotelName>{hotel.name}</HotelName>
                <HotelDescription>{hotel.description}</HotelDescription>
                
                <DetailsGrid>
                  <DetailItem $color={hotel.color}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {hotel.distance}
                  </DetailItem>
                </DetailsGrid>
              </ContentSection>
              
              <PriceSection>
                <PriceTag>
                  <PriceLabel>Ab</PriceLabel>
                  <Price $color={hotel.color}>
                    {hotel.price} <span>/ {hotel.priceNote}</span>
                  </Price>
                </PriceTag>
                
                <BookButton href={hotel.bookingUrl} $color={hotel.color} target="_blank">
                  Buchen
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </BookButton>
              </PriceSection>
            </AccommodationCard>
          ))}
        </AccommodationsGrid>
        
        {bookingCode && (
          <CodeBox>
            <h4>Buchungscode für Rabatt</h4>
            <p>Nennt bei der Buchung einfach unseren Code: <code>{bookingCode}</code></p>
          </CodeBox>
        )}
      </Container>
    </Section>
  );
}

export default Accommodations;
