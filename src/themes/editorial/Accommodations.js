import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-white);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  margin-bottom: clamp(3rem, 6vw, 5rem);
  max-width: 800px;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 1.5rem;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const HotelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1.5rem;
    padding-bottom: 2rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const HotelCard = styled.article`
  background: var(--editorial-light-gray);
  display: flex;
  flex-direction: column;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: ${0.3 + p.$index * 0.1}s;
  `}
  
  @media (max-width: 768px) {
    flex-shrink: 0;
    width: 85vw;
    max-width: 350px;
    scroll-snap-align: start;
  }
`;

const HotelImage = styled.div`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    display: block;
    padding-top: 60%;
  }
  
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
    transition: all 0.5s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

const HotelBadge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: var(--editorial-red);
  color: var(--editorial-white);
  padding: 0.5rem 1rem;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HotelContent = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const HotelName = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 0.5rem;
`;

const HotelStars = styled.div`
  color: var(--editorial-red);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
`;

const Divider = styled.div`
  width: 40px;
  height: 2px;
  background: var(--editorial-red);
  margin-bottom: 1rem;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: ${0.5 + p.$index * 0.1}s;
  `}
`;

const HotelDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--editorial-gray);
  
  span:first-child {
    flex-shrink: 0;
  }
`;

const PriceTag = styled.div`
  font-family: var(--font-headline);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--editorial-black);
  margin-bottom: 1rem;
  
  span {
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--editorial-gray);
  }
`;

const BookButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--editorial-black);
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: auto;
  
  &:hover {
    background: var(--editorial-red);
  }
`;

const CodeNote = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--editorial-gray);
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--editorial-white);
  
  strong {
    color: var(--editorial-red);
  }
`;

// ============================================
// COMPONENT
// ============================================

function Accommodations() {
  const { content } = useWedding();
  const accommodationsData = content?.accommodations || {};
  
  const title = accommodationsData.title || 'Unterkünfte';
  const description = accommodationsData.description || 'Wir haben für euch Zimmerkontingente reserviert.';
  const hotels = accommodationsData.hotels || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultHotels = [
    {
      name: 'Hotel Schlossblick',
      stars: 4,
      address: 'Schlossstraße 10, 69117 Heidelberg',
      distance: '5 Minuten zur Location',
      price: 'ab 120€',
      booking_code: 'WEDDING2026',
      booking_url: '#',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      recommended: true
    },
    {
      name: 'Gasthaus zur Linde',
      stars: 3,
      address: 'Lindenweg 5, 69117 Heidelberg',
      distance: '10 Minuten zur Location',
      price: 'ab 85€',
      booking_url: '#',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600'
    }
  ];

  const items = hotels.length > 0 ? hotels : defaultHotels;

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
          <Eyebrow $visible={visible}>Übernachten</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        <HotelsGrid>
          {items.map((hotel, i) => (
            <HotelCard key={i} $visible={visible} $index={i}>
              <HotelImage>
                {hotel.image && <img src={hotel.image} alt={hotel.name} />}
                {hotel.recommended && <HotelBadge>Empfohlen</HotelBadge>}
              </HotelImage>
              
              <HotelContent>
                <HotelName>{hotel.name}</HotelName>
                {hotel.stars && (
                  <HotelStars>{'★'.repeat(hotel.stars)}</HotelStars>
                )}
                <Divider $visible={visible} $index={i} />
                
                <HotelDetails>
                  {hotel.address && (
                    <DetailRow>
                      <span>📍</span>
                      <span>{hotel.address}</span>
                    </DetailRow>
                  )}
                  {hotel.distance && (
                    <DetailRow>
                      <span>🚶</span>
                      <span>{hotel.distance}</span>
                    </DetailRow>
                  )}
                </HotelDetails>
                
                {hotel.price && (
                  <PriceTag>
                    {hotel.price} <span>/ Nacht</span>
                  </PriceTag>
                )}
                
                {hotel.booking_url && (
                  <BookButton href={hotel.booking_url} target="_blank" rel="noopener noreferrer">
                    Jetzt buchen →
                  </BookButton>
                )}
                
                {hotel.booking_code && (
                  <CodeNote>
                    Buchungscode: <strong>{hotel.booking_code}</strong>
                  </CodeNote>
                )}
              </HotelContent>
            </HotelCard>
          ))}
        </HotelsGrid>
      </Container>
    </Section>
  );
}

export default Accommodations;
