import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const Hotel = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--zen-line);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay}s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const HotelName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--zen-text);
  margin-bottom: 0.5rem;
`;

const HotelAddress = styled.p`
  font-size: 0.85rem;
  color: var(--zen-text-light);
  margin-bottom: 0.5rem;
`;

const HotelLink = styled.a`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--zen-text);
  border-bottom: 1px solid var(--zen-line);
  &:hover { opacity: 1; border-color: var(--zen-text); }
`;

function Accommodations() {
  const { content } = useWedding();
  const data = content?.accommodations || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Unterkünfte';
  const hotels = data.hotels || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (hotels.length === 0) return null;

  return (
    <Section id="accommodations" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Grid>
          {hotels.map((hotel, i) => (
            <Hotel key={i} className={visible ? 'visible' : ''} $delay={0.1 + i * 0.1}>
              <HotelName>{hotel.name}</HotelName>
              {hotel.address && <HotelAddress>{hotel.address}</HotelAddress>}
              {hotel.url && <HotelLink href={hotel.url} target="_blank">Website →</HotelLink>}
            </Hotel>
          ))}
        </Grid>
      </Content>
    </Section>
  );
}

export default Accommodations;
