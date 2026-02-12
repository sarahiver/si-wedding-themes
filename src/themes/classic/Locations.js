import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const imageReveal = keyframes`from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0); }`;

const Section = styled.section`
  padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem);
  background: var(--classic-cream);
`;

const Container = styled.div`max-width: var(--content-width); margin: 0 auto;`;

const Header = styled.div`
  text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.p`
  font-family: var(--font-body); font-size: 0.65rem; font-weight: 400;
  letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold);
  margin-bottom: 1rem; opacity: 0;
  ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const Title = styled.h2`
  font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300; opacity: 0;
  ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}
`;

const LocationsGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const LocationCard = styled.div`
  background: var(--classic-white); overflow: hidden;
  box-shadow: 0 2px 20px rgba(0,0,0,0.04);
  opacity: 0;
  ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: ${p.$delay};`}
`;

const CardImage = styled.div`
  overflow: hidden;
  img {
    width: 100%; aspect-ratio: 16/10; object-fit: cover;
    transition: transform 0.6s var(--ease-smooth);
  }
  &:hover img { transform: scale(1.05); }
`;

const CardBody = styled.div`padding: 2rem;`;

const CardLabel = styled.p`
  font-family: var(--font-body); font-size: 0.6rem; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--classic-gold);
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-display); font-size: 1.6rem; font-weight: 400;
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-size: 0.85rem; font-weight: 300; color: var(--classic-text-light);
  line-height: 1.7; margin-bottom: 1rem;
`;

const CardAddress = styled.p`
  font-size: 0.75rem; font-weight: 400; color: var(--classic-text-muted);
  font-style: italic;
`;

const MapLink = styled.a`
  display: inline-block; margin-top: 1rem;
  font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--classic-gold-dark);
  border-bottom: 1px solid var(--classic-gold);
  padding-bottom: 2px; transition: all 0.3s ease;
  &:hover { color: var(--classic-charcoal); border-color: var(--classic-charcoal); }
`;

const DEFAULT_LOCATIONS = [
  { label: 'Trauung', name: 'Schloss Charlottenburg', description: 'Die Zeremonie findet in der wunderschönen Orangerie statt.', address: 'Spandauer Damm 10, 14059 Berlin', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', maps_url: '' },
  { label: 'Feier', name: 'Soho House Berlin', description: 'Die Feier findet im Dachgarten mit Blick über die Stadt statt.', address: 'Torstraße 1, 10119 Berlin', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', maps_url: '' },
];

function Locations() {
  const { content } = useWedding();
  const locData = content?.locations || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const title = locData.title || 'Unsere Locations';
  const locations = locData.locations?.length ? locData.locations : DEFAULT_LOCATIONS;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Section id="locations" ref={ref}>
      <Container>
        <Header>
          <Eyebrow $v={visible}>Wo wir feiern</Eyebrow>
          <Title $v={visible}>{title}</Title>
        </Header>
        <LocationsGrid>
          {locations.map((loc, i) => (
            <LocationCard key={i} $v={visible} $delay={`${0.3 + i * 0.15}s`}>
              <CardImage>
                <img src={loc.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'}
                  alt={loc.name} loading="lazy" />
              </CardImage>
              <CardBody>
                {loc.label && <CardLabel>{loc.label}</CardLabel>}
                <CardTitle>{loc.name || loc.titel}</CardTitle>
                {(loc.description || loc.beschreibung) && <CardText>{loc.description || loc.beschreibung}</CardText>}
                {(loc.address || loc.adresse) && <CardAddress>{loc.address || loc.adresse}</CardAddress>}
                {loc.maps_url && <MapLink href={loc.maps_url} target="_blank" rel="noopener">Route anzeigen →</MapLink>}
              </CardBody>
            </LocationCard>
          ))}
        </LocationsGrid>
      </Container>
    </Section>
  );
}

export default Locations;
