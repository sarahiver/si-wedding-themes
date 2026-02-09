import { useWedding } from '../../context/WeddingContext';
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

  @media (max-width: 768px) { display: none; }
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
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'rgba(255,255,255,0.02)'};
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

const HotelMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
`;

const AddressLink = styled.a`
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${p => p.$color || '#00ffff'};
  }
`;

const BookingCodeBox = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
  background: rgba(0,255,136,0.05);
  border: 1px solid rgba(0,255,136,0.2);
  padding: 10px 15px;
  margin-top: 10px;

  code {
    color: #00ff88;
    font-weight: 600;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: ${p => p.$color || '#00ffff'};
  text-shadow: 0 0 15px ${p => p.$color || '#00ffff'}50;
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

  &:hover {
    background: ${p => p.$color || '#00ffff'};
    color: #0a0a0f;
    box-shadow: 0 0 30px ${p => p.$color || '#00ffff'}50;
  }
`;

const neonColors = ['#ff00ff', '#00ffff', '#00ff88', '#b347ff'];

const getMapsUrl = (hotel) => hotel.maps_url || (hotel.address ? `https://maps.google.com/?q=${encodeURIComponent(hotel.address)}` : null);
const getBookingUrl = (hotel) => hotel.booking_url || hotel.url || '';

/* Mobile Accordion */
const AccordionList = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid rgba(0,255,255,0.15);
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
  font-family: var(--font-display, sans-serif);
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  display: block;
`;

const AccordionMeta = styled.span`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  margin-top: 0.15rem;
  display: block;
`;

const AccordionChevron = styled.span`
  font-size: 1rem;
  color: #00ffff;
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
  const title = accommodationsData.title || 'Übernachtung';
  const description = accommodationsData.description || 'Wir haben für euch ein paar Hotel-Empfehlungen zusammengestellt';

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  const defaultAccommodations = [
    {
      name: 'Hotel Neon Nights',
      address: 'Hauptstraße 15, Berlin',
      distance: '200m zur Location',
      price_range: '€€€',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      url: '#'
    },
    {
      name: 'Cyber Inn',
      address: 'Technostraße 42, Berlin',
      distance: '1.5km zur Location',
      price_range: '€€',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
      url: '#'
    }
  ];

  const accommodations = accommodationsData.hotels?.length > 0
    ? accommodationsData.hotels.map((h, i) => ({
        name: h.name,
        address: h.address || '',
        distance: h.distance || '',
        price_range: h.price_range || '',
        image: h.image || '',
        url: h.url || '',
        maps_url: h.maps_url || '',
        booking_url: h.booking_url || '',
        booking_code: h.booking_code || '',
        color: neonColors[i % neonColors.length]
      }))
    : defaultAccommodations.map((h, i) => ({ ...h, color: neonColors[i % neonColors.length] }));

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
          {description && <Subtitle>{description}</Subtitle>}
        </Header>

        <AccommodationsGrid>
          {accommodations.map((hotel, i) => (
            <AccommodationCard key={i} $color={hotel.color} $delay={`${i * 0.15}s`}>
              {hotel.image && <ImageWrapper $color={hotel.color} $image={hotel.image} />}

              <ContentSection>
                {hotel.price_range && <TypeBadge $color={hotel.color}>{hotel.price_range}</TypeBadge>}
                <HotelName>{hotel.name}</HotelName>

                <HotelMeta>
                  {hotel.address && (
                    <MetaItem>
                      <span>📍</span>
                      <AddressLink href={getMapsUrl(hotel)} target="_blank" rel="noopener noreferrer" $color={hotel.color}>
                        {hotel.address}
                      </AddressLink>
                    </MetaItem>
                  )}
                  {hotel.distance && <MetaItem><span>🚶</span><span>{hotel.distance}</span></MetaItem>}
                </HotelMeta>

                {hotel.booking_code && (
                  <BookingCodeBox>
                    Buchungscode: <code>{hotel.booking_code}</code>
                  </BookingCodeBox>
                )}
              </ContentSection>

              <PriceSection>
                {getBookingUrl(hotel) && (
                  <BookButton href={getBookingUrl(hotel)} $color={hotel.color} target="_blank">
                    Buchen →
                  </BookButton>
                )}
              </PriceSection>
            </AccommodationCard>
          ))}
        </AccommodationsGrid>

        {/* Mobile Accordion */}
        <AccordionList>
          {accommodations.map((hotel, i) => (
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
