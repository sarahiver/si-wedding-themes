import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 900px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Description = styled.p`font-family: var(--font-primary); font-size: 0.95rem; color: var(--video-silver); line-height: 1.8; margin-bottom: 2.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.15s;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;`;
const Card = styled.div`background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); overflow: hidden; text-align: left; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.1}s; transition: border-color 0.3s ease; &:hover { border-color: var(--video-accent); }`;
const CardImage = styled.div`width: 100%; height: 150px; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'rgba(255,255,255,0.05)'}; border-bottom: 1px solid rgba(255,255,255,0.1);`;
const CardBody = styled.div`padding: 1.5rem;`;
const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--video-white); margin-bottom: 0.75rem;`;
const CardMeta = styled.div`display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;`;
const MetaItem = styled.div`display: flex; align-items: flex-start; gap: 0.5rem; font-family: var(--font-primary); font-size: 0.8rem; color: var(--video-gray); line-height: 1.5;`;
const AddressLink = styled.a`color: var(--video-gray); text-decoration: none; transition: color 0.3s ease; &:hover { color: var(--video-accent); }`;
const Tag = styled.span`display: inline-block; font-family: var(--font-primary); font-size: 0.7rem; font-weight: 500; color: var(--video-accent); background: rgba(255,255,255,0.05); padding: 0.3rem 0.75rem; margin-bottom: 0.75rem;`;
const BookingCode = styled.div`font-family: var(--font-primary); font-size: 0.75rem; color: var(--video-gray); background: rgba(255,255,255,0.03); padding: 0.75rem; margin-bottom: 1rem; strong { color: var(--video-accent); }`;
const CardLink = styled.a`display: inline-block; font-family: var(--font-primary); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--video-silver); padding: 0.6rem 1.2rem; border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease; &:hover { color: var(--video-accent); border-color: var(--video-accent); }`;

const getMapsUrl = (hotel) => hotel.maps_url || (hotel.address ? `https://maps.google.com/?q=${encodeURIComponent(hotel.address)}` : null);
const getBookingUrl = (hotel) => hotel.booking_url || hotel.url || '';

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  const title = data.title || 'Unterkünfte';
  const description = data.description || '';
  const hotels = data.hotels || [];

  const defaultHotels = [
    { name: 'Hotel Adlon', address: 'Unter den Linden 77, Berlin', distance: '10 Min zur Location', price_range: '€€€', url: '' },
    { name: 'The Ritz-Carlton', address: 'Potsdamer Platz 3, Berlin', distance: '15 Min zur Location', price_range: '€€€', url: '' }
  ];

  const displayHotels = hotels.length > 0 ? hotels : defaultHotels;
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="accommodations">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Übernachten</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        {description && <Description $visible={visible}>{description}</Description>}
        <Grid>
          {displayHotels.map((hotel, i) => (
            <Card key={i} $visible={visible} $index={i}>
              {hotel.image && <CardImage $image={optimizedUrl.card(hotel.image)} />}
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
                {hotel.price_range && <Tag>{hotel.price_range}</Tag>}
                {hotel.booking_code && <BookingCode>Buchungscode: <strong>{hotel.booking_code}</strong></BookingCode>}
                {getBookingUrl(hotel) && <CardLink href={getBookingUrl(hotel)} target="_blank" rel="noopener noreferrer">Buchen →</CardLink>}
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Content>
    </SectionWrapper>
  );
}

export default Accommodations;
