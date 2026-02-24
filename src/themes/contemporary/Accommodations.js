// Contemporary Accommodations
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--electric);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--black);
  opacity: 0.6;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: var(--black);
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) { display: none; }
`;

const Card = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }

  transition: all 0.3s ease;
`;

const CardImage = styled.div`
  height: 160px;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--gray-200)'};
  border-bottom: 3px solid var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--gray-600);
`;

const AddressLink = styled.a`
  color: var(--gray-600);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--coral);
  }
`;

const CardPrice = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: var(--coral);
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: var(--gray-100);
  border: 2px solid var(--black);
  text-align: center;
`;

const BookingCode = styled.div`
  font-size: 0.8rem;
  color: var(--gray-600);
  background: var(--gray-100);
  border: 2px solid var(--black);
  padding: 0.75rem;
  margin-bottom: 1rem;
  text-align: center;

  strong {
    color: var(--coral);
    font-weight: 700;
  }
`;

const Button = styled.a`
  display: block;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white);
  background: var(--black);
  padding: 0.75rem;
  border: none;
  text-transform: uppercase;

  &:hover {
    background: var(--coral);
  }
`;

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
  font-family: var(--font-primary, sans-serif);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--black, #000);
  display: block;
`;

const AccordionMeta = styled.span`
  font-size: 0.75rem;
  color: var(--gray-500, #888);
  margin-top: 0.15rem;
  display: block;
`;

const AccordionChevron = styled.span`
  font-size: 1rem;
  color: var(--electric, #4444FF);
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
  const data = content?.accommodations || {};

  const title = data.title || 'Unterkünfte';
  const description = data.description || '';
  const hotels = data.hotels || [];

  const defaultHotels = [
    { name: 'Hotel Amano', address: 'Auguststraße 43, 10119 Berlin', distance: '10 Min zur Location', price_range: '€€', url: '#' },
    { name: 'Motel One', address: 'Prinzessinnenstr. 1, 10969 Berlin', distance: '15 Min zur Location', price_range: '€', url: '#' },
  ];

  const items = hotels.length > 0 ? hotels : defaultHotels;

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <Section id="accommodations">
      <Container>
        <Header>
          <Eyebrow>🏨 Übernachten</Eyebrow>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </Header>

        <Grid>
          {items.map((hotel, i) => (
            <Card key={i}>
              <CardImage $image={hotel.image ? optimizedUrl.card(hotel.image) : hotel.image}>
                {!hotel.image && '🏨'}
              </CardImage>
              <CardBody>
                <CardTitle>{hotel.name}</CardTitle>
                <CardMeta>
                  {hotel.address && (
                    <MetaItem>
                      <span>📍</span>
                      <AddressLink href={getMapsUrl(hotel)} target="_blank" rel="noopener noreferrer">
                        {hotel.address}
                      </AddressLink>
                    </MetaItem>
                  )}
                  {hotel.distance && <MetaItem><span>🚶</span><span>{hotel.distance}</span></MetaItem>}
                </CardMeta>
                {hotel.price_range && <CardPrice>{hotel.price_range}</CardPrice>}
                {hotel.booking_code && (
                  <BookingCode>
                    Code: <strong>{hotel.booking_code}</strong>
                  </BookingCode>
                )}
                {getBookingUrl(hotel) && (
                  <Button href={getBookingUrl(hotel)} target="_blank" rel="noopener noreferrer">
                    Buchen →
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </Grid>

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
