// Luxe Locations - Cinematic Split
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const scaleReveal = keyframes`from { opacity: 0; transform: scale(1.1); } to { opacity: 1; transform: scale(1); }`;

const Section = styled.section`background: var(--luxe-void);`;

const Header = styled.div`text-align: center; padding: var(--section-padding-y) var(--section-padding-x) 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const LocationsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); @media (max-width: 600px) { grid-template-columns: 1fr; }`;

const LocationCard = styled.div`position: relative; min-height: 70vh; display: flex; flex-direction: column; @media (max-width: 600px) { min-height: 60vh; }`;

const ImageSection = styled.div`flex: 1; position: relative; overflow: hidden;`;
const Image = styled.div`position: absolute; inset: 0; background: ${p => p.$image ? `url(${p.$image})` : 'linear-gradient(135deg, var(--luxe-charcoal) 0%, var(--luxe-graphite) 100%)'}; background-size: cover; background-position: center; opacity: 0; transform: scale(1.1); animation: ${p => p.$visible ? css`${scaleReveal} 1.2s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => p.$delay || '0s'};`;

const ContentSection = styled.div`padding: 2.5rem var(--section-padding-x); background: var(--luxe-charcoal); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => p.$delay || '0s'};`;

const TypeBadge = styled.span`font-family: var(--font-body); font-size: 0.6rem; font-weight: 400; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-gold); display: block; margin-bottom: 0.75rem;`;
const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.75rem; font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 1rem;`;
const CardAddress = styled.p`font-family: var(--font-body); font-size: 0.85rem; line-height: 1.6; color: var(--luxe-pearl); white-space: pre-line;`;
const CardTime = styled.p`font-family: var(--font-body); font-size: 0.75rem; letter-spacing: 0.15em; color: var(--luxe-gold); margin-top: 1rem;`;

function Locations() {
  const { content } = useWedding();
  const data = content?.locations || {};
  const title = data.title || 'Veranstaltungsorte';

  // FIX: Proper array validation and default locations
  const defaultLocations = [
    { name: 'Villa Rothschild', type: 'Zeremonie', address: 'Im Rothschildpark 1\n61462 Koenigstein', time: '15:00 Uhr', image: '' },
    { name: 'Schloss Johannisberg', type: 'Empfang & Dinner', address: 'Schloss Johannisberg\n65366 Geisenheim', time: '18:00 Uhr', image: '' }
  ];
  const locations = Array.isArray(data.locations) && data.locations.length > 0 ? data.locations : defaultLocations;

  // FIX: Handle both string and object formats for images
  const getImageUrl = (img) => img?.url || img || '';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="locations">
      <Header><Eyebrow $visible={visible}>Wo wir feiern</Eyebrow><Title $visible={visible}>{title}</Title></Header>
      <LocationsGrid>
        {locations.map((loc, i) => (
          <LocationCard key={i}>
            <ImageSection><Image $image={getImageUrl(loc.image)} $visible={visible} $delay={`${0.2 + i * 0.2}s`} /></ImageSection>
            <ContentSection $visible={visible} $delay={`${0.3 + i * 0.2}s`}>
              <TypeBadge>{loc.type}</TypeBadge>
              <CardTitle>{loc.name}</CardTitle>
              <CardAddress>{loc.address}</CardAddress>
              <CardTime>{loc.time}</CardTime>
            </ContentSection>
          </LocationCard>
        ))}
      </LocationsGrid>
    </Section>
  );
}

export default Locations;
