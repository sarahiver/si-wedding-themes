import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

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

  @media (max-width: 768px) { display: none; }
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
  background: var(--editorial-light-gray);

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

const HotelMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const MetaRow = styled.div`
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

const AddressLink = styled.a`
  color: var(--editorial-gray);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--editorial-red);
    text-decoration: underline;
  }
`;

const PriceTag = styled.div`
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--editorial-black);
  margin-bottom: 1rem;
`;

const BookingCode = styled.div`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--editorial-gray);
  padding: 0.75rem;
  background: var(--editorial-white);
  margin-bottom: 1rem;

  strong {
    color: var(--editorial-red);
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

// ============================================
// HELPER
// ============================================

const getMapsUrl = (hotel) => hotel.maps_url || (hotel.address ? `https://maps.google.com/?q=${encodeURIComponent(hotel.address)}` : null);
const getBookingUrl = (hotel) => hotel.booking_url || hotel.url || '';

// ============================================
// COMPONENT
// ============================================

/* Mobile Accordion */
const AccordionList = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid rgba(0,0,0,0.08);
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 1rem;
`;

const AccordionHeaderText = styled.div`
  flex: 1;
`;

const AccordionTitle = styled.span`
  font-family: var(--font-display, Georgia, serif);
  font-size: 1.05rem;
  font-weight: 400;
  color: var(--editorial-black, #1a1a1a);
  display: block;
`;

const AccordionMeta = styled.span`
  font-size: 0.75rem;
  color: var(--editorial-gray, #888);
  margin-top: 0.15rem;
  display: block;
`;

const AccordionChevron = styled.span`
  font-size: 1rem;
  color: var(--editorial-red, #C41E3A);
  transition: transform 0.3s ease;
  transform: rotate(${p => p.$open ? '180deg' : '0deg'});
`;

const AccordionBody = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const AccordionContent = styled.div`
  padding: 0 0 1.25rem;
`;


function Accommodations() {
  const { content } = useWedding();
  const accommodationsData = content?.accommodations || {};

  const title = accommodationsData.title || 'Unterkünfte';
  const description = accommodationsData.description || 'Wir haben für euch Zimmerkontingente reserviert.';
  const hotels = accommodationsData.hotels || [];

  const [visible, setVisible] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);
  const sectionRef = useRef(null);

  const defaultHotels = [
    {
      name: 'Hotel Schlossblick',
      address: 'Schlossstraße 10, 69117 Heidelberg',
      distance: '5 Minuten zur Location',
      price_range: '€€€',
      booking_code: 'WEDDING2026',
      url: '#',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    },
    {
      name: 'Gasthaus zur Linde',
      address: 'Lindenweg 5, 69117 Heidelberg',
      distance: '10 Minuten zur Location',
      price_range: '€€',
      url: '#',
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
          {description && <Description $visible={visible}>{description}</Description>}
        </Header>

        <HotelsGrid>
          {items.map((hotel, i) => (
            <HotelCard key={i} $visible={visible} $index={i}>
              {hotel.image && (
                <HotelImage>
                  <img src={optimizedUrl.card(hotel.image)} alt={hotel.name} />
                </HotelImage>
              )}

              <HotelContent>
                <HotelName>{hotel.name}</HotelName>
                <Divider $visible={visible} $index={i} />

                <HotelMeta>
                  {hotel.address && (
                    <MetaRow>
                      <span>📍</span>
                      <AddressLink href={getMapsUrl(hotel)} target="_blank" rel="noopener noreferrer">
                        {hotel.address}
                      </AddressLink>
                    </MetaRow>
                  )}
                  {hotel.distance && (
                    <MetaRow>
                      <span>🚶</span>
                      <span>{hotel.distance}</span>
                    </MetaRow>
                  )}
                </HotelMeta>

                {hotel.price_range && <PriceTag>{hotel.price_range}</PriceTag>}

                {hotel.booking_code && (
                  <BookingCode>
                    Buchungscode: <strong>{hotel.booking_code}</strong>
                  </BookingCode>
                )}

                {getBookingUrl(hotel) && (
                  <BookButton href={getBookingUrl(hotel)} target="_blank" rel="noopener noreferrer">
                    Jetzt buchen →
                  </BookButton>
                )}
              </HotelContent>
            </HotelCard>
          ))}
        </HotelsGrid>

        {/* Mobile Accordion */}
        <AccordionList>
          {items.map((hotel, i) => (
            <AccordionItem key={i}>
              <AccordionHeader onClick={() => toggle(i)}>
                <AccordionHeaderText>
                  <AccordionTitle>{hotel.name}</AccordionTitle>
                  <AccordionMeta>{hotel.price_range ? `${hotel.price_range} · ` : ''}{hotel.distance || ''}</AccordionMeta>
                </AccordionHeaderText>
                <AccordionChevron $open={openIndex === i}>▾</AccordionChevron>
              </AccordionHeader>
              <AccordionBody $open={openIndex === i}>
                <AccordionContent>
                  {hotel.address && <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>📍 {hotel.address}</p>}
                  {hotel.booking_code && <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Code: <strong>{hotel.booking_code}</strong></p>}
                  {(hotel.booking_url || hotel.url) && <a href={hotel.booking_url || hotel.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem' }}>Buchen →</a>}
                </AccordionContent>
              </AccordionBody>
            </AccordionItem>
          ))}
        </AccordionList>
      </Container>
    </Section>
  );
}

export default Accommodations;
