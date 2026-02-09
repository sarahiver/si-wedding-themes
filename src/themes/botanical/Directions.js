import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  overflow: hidden;
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.1s;
  `}
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  padding: clamp(2rem, 4vw, 3rem);
  position: relative;
  overflow: hidden;
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.2s;
  `}

  /* Top highlight */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,0.15) 20%,
      rgba(255,255,255,0.25) 50%,
      rgba(255,255,255,0.15) 80%,
      transparent 100%
    );
    pointer-events: none;
  }
`;

const DirectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 calc(-1 * var(--section-padding-x, 24px));
    padding: 0 var(--section-padding-x, 24px);
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const DirectionItem = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 768px) {
    flex: 0 0 85vw;
    max-width: 85vw;
    scroll-snap-align: center;
  }
`;

const ItemIcon = styled.span`
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.75rem;
`;

const ItemText = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
`;

const MapEmbed = styled.div`
  margin-bottom: 2rem;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  padding-top: 50%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    filter: brightness(0.85) contrast(1.1) saturate(0.7);
    transition: filter 0.4s ease;
  }

  &:hover iframe {
    filter: brightness(1) contrast(1) saturate(1);
  }
`;

const Note = styled.div`
  margin-top: 2rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 0 12px 12px 0;

  p {
    font-family: var(--font-display);
    font-size: 1rem;
    font-style: italic;
    color: var(--text-muted);
    margin: 0;
  }
`;

// ============================================
// COMPONENT
// ============================================

function Directions() {
  const { content } = useWedding();
  const directionsData = content?.directions || {};

  const title = directionsData.title || 'Anfahrt';
  const note = directionsData.note || '';
  const mapsEmbed = directionsData.maps_embed || '';

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultItems = [
    { icon: '🚗', title: 'Mit dem Auto', description: 'Parkplätze sind vor Ort vorhanden. Navigation: Landhaus Walter, Elbchaussee 547, Hamburg' },
    { icon: '🚇', title: 'Öffentliche Verkehrsmittel', description: 'S-Bahn bis Blankenese, dann Bus 286 bis Teufelsbrück. Von dort 5 Minuten zu Fuß.' },
    { icon: '🚕', title: 'Taxi', description: 'Für den Rückweg organisieren wir gerne Taxis. Bitte am Empfang Bescheid geben.' },
  ];

  // Support new items array format
  const getDisplayItems = () => {
    // New format: items array from editor
    if (directionsData.items && directionsData.items.length > 0) {
      return directionsData.items.map(item => ({
        icon: item.icon || '📍',
        title: item.title || '',
        description: item.description || ''
      }));
    }

    // Legacy format: fixed fields
    const legacyItems = [];
    if (directionsData.parking_info) {
      legacyItems.push({ icon: '🚗', title: 'Mit dem Auto', description: directionsData.parking_info });
    }
    if (directionsData.public_transport) {
      legacyItems.push({ icon: '🚇', title: 'Öffentliche Verkehrsmittel', description: directionsData.public_transport });
    }
    if (directionsData.taxi_info) {
      legacyItems.push({ icon: '🚕', title: 'Taxi', description: directionsData.taxi_info });
    }

    return legacyItems.length > 0 ? legacyItems : defaultItems;
  };

  const displayItems = getDisplayItems();

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
    <Section id="directions" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>So kommt ihr hin</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>

        {mapsEmbed && (
          <MapEmbed $visible={visible}>
            <iframe
              src={mapsEmbed}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Anfahrtskarte"
            />
          </MapEmbed>
        )}

        <GlassCard $visible={visible}>
          <DirectionsGrid>
            {displayItems.map((item, i) => (
              <DirectionItem key={i}>
                {item.icon && <ItemIcon>{item.icon}</ItemIcon>}
                <ItemTitle>{item.title}</ItemTitle>
                <ItemText>{item.description}</ItemText>
              </DirectionItem>
            ))}
          </DirectionsGrid>

          {note && (
            <Note>
              <p>{note}</p>
            </Note>
          )}
        </GlassCard>
      </Container>
    </Section>
  );
}

export default Directions;
