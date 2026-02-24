import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-void);`;
const Container = styled.div`max-width: var(--container-max); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Description = styled.p`font-family: var(--font-body); font-size: 1rem; color: var(--luxe-pearl); margin-top: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.8; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.15s;`;

/* Desktop: Grid */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  @media (max-width: 768px) { display: none; }
`;

const Card = styled.div`opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.15}s;`;
const CardImage = styled.div`aspect-ratio: 16/10; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--luxe-charcoal)'}; margin-bottom: 1.5rem; overflow: hidden;`;
const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.5rem; font-style: italic; color: var(--luxe-cream); margin-bottom: 0.75rem;`;
const CardMeta = styled.div`display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;`;
const MetaItem = styled.div`display: flex; align-items: flex-start; gap: 0.5rem; font-family: var(--font-body); font-size: 0.85rem; color: var(--luxe-pearl); line-height: 1.5;`;
const AddressLink = styled.a`color: var(--luxe-pearl); text-decoration: none; transition: color 0.3s ease; &:hover { color: var(--luxe-gold); }`;
const CardPrice = styled.span`display: inline-block; font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 0.75rem;`;
const BookingCode = styled.div`font-family: var(--font-body); font-size: 0.8rem; color: var(--luxe-pearl); background: rgba(255,255,255,0.02); border: 1px solid rgba(212,175,55,0.1); padding: 0.75rem; margin-bottom: 1rem; strong { color: var(--luxe-gold); }`;
const CardLink = styled.a`display: inline-block; font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-pearl); border-bottom: 1px solid var(--luxe-graphite); padding-bottom: 0.25rem; transition: all 0.3s ease; &:hover { color: var(--luxe-gold); border-color: var(--luxe-gold); }`;

/* Mobile: Accordion */
const AccordionList = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid rgba(212,175,55,0.1);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.1}s;
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const AccordionHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const AccordionName = styled.span`
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--luxe-cream);
`;

const AccordionMeta = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--luxe-slate);
`;

const AccordionChevron = styled.span`
  font-size: 1.25rem;
  color: var(--luxe-gold);
  transition: transform 0.3s ease;
  transform: rotate(${p => p.$open ? '180deg' : '0deg'});
`;

const AccordionBody = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s var(--ease-out-expo);
`;

const AccordionContent = styled.div`
  padding: 0 0 1.5rem;
`;

const getMapsUrl = (hotel) => hotel.maps_url || (hotel.address ? `https://maps.google.com/?q=${encodeURIComponent(hotel.address)}` : null);
const getBookingUrl = (hotel) => hotel.booking_url || hotel.url || '';
const getImageUrl = (img) => img?.url || img || '';

function HotelDetails({ hotel }) {
  return (
    <>
      {getImageUrl(hotel.image) && <CardImage $image={optimizedUrl.card(getImageUrl(hotel.image))} style={{ marginBottom: '1rem' }} />}
      <CardMeta>
        {hotel.address && (
          <MetaItem>
            <span>📍</span>
            <AddressLink href={getMapsUrl(hotel)} target="_blank" rel="noopener noreferrer">{hotel.address}</AddressLink>
          </MetaItem>
        )}
        {hotel.distance && <MetaItem><span>🚶</span><span>{hotel.distance}</span></MetaItem>}
      </CardMeta>
      {hotel.price_range && <CardPrice>{hotel.price_range}</CardPrice>}
      {hotel.booking_code && <BookingCode>Buchungscode: <strong>{hotel.booking_code}</strong></BookingCode>}
      {getBookingUrl(hotel) && <CardLink href={getBookingUrl(hotel)} target="_blank" rel="noopener">Buchen →</CardLink>}
    </>
  );
}

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  const title = data.title || 'Unterkünfte';
  const description = data.description || '';

  const defaultHotels = [
    { name: 'Grand Hotel', address: 'Hauptstraße 1, München', distance: '5 Min zur Location', price_range: '€€€', image: '', url: '' },
    { name: 'Boutique Hotel', address: 'Altstadt 15, München', distance: '10 Min zur Location', price_range: '€€', image: '', url: '' }
  ];
  const hotels = Array.isArray(data.hotels) && data.hotels.length > 0 ? data.hotels : defaultHotels;

  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="accommodations">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Übernachten</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          {description && <Description $visible={visible}>{description}</Description>}
        </Header>

        {/* Desktop: Grid Cards */}
        <Grid>
          {hotels.map((hotel, i) => (
            <Card key={i} $visible={visible} $index={i}>
              {getImageUrl(hotel.image) && <CardImage $image={optimizedUrl.card(getImageUrl(hotel.image))} />}
              <CardTitle>{hotel.name}</CardTitle>
              <CardMeta>
                {hotel.address && (
                  <MetaItem>
                    <span>📍</span>
                    <AddressLink href={getMapsUrl(hotel)} target="_blank" rel="noopener noreferrer">{hotel.address}</AddressLink>
                  </MetaItem>
                )}
                {hotel.distance && <MetaItem><span>🚶</span><span>{hotel.distance}</span></MetaItem>}
              </CardMeta>
              {hotel.price_range && <CardPrice>{hotel.price_range}</CardPrice>}
              {hotel.booking_code && <BookingCode>Buchungscode: <strong>{hotel.booking_code}</strong></BookingCode>}
              {getBookingUrl(hotel) && <CardLink href={getBookingUrl(hotel)} target="_blank" rel="noopener">Buchen →</CardLink>}
            </Card>
          ))}
        </Grid>

        {/* Mobile: Accordion */}
        <AccordionList>
          {hotels.map((hotel, i) => (
            <AccordionItem key={i} $visible={visible} $index={i}>
              <AccordionHeader onClick={() => toggle(i)}>
                <AccordionHeaderLeft>
                  <AccordionName>{hotel.name}</AccordionName>
                  {hotel.price_range && <AccordionMeta>{hotel.price_range} {hotel.distance ? `· ${hotel.distance}` : ''}</AccordionMeta>}
                </AccordionHeaderLeft>
                <AccordionChevron $open={openIndex === i}>▾</AccordionChevron>
              </AccordionHeader>
              <AccordionBody $open={openIndex === i}>
                <AccordionContent>
                  <HotelDetails hotel={hotel} />
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
