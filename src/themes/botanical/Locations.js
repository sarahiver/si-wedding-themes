import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 900px;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1px;
  background: var(--zen-line);
`;

const Card = styled.div`
  background: var(--zen-bg);
  padding: 2.5rem 2rem;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay}s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const CardTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--zen-text);
`;

const CardText = styled.p`
  font-size: 0.85rem;
  color: var(--zen-text-light);
  line-height: 1.8;
  margin: 0;
`;

const MapLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--zen-text);
  border-bottom: 1px solid var(--zen-line);
  padding-bottom: 2px;
  &:hover { opacity: 1; border-color: var(--zen-text); }
`;

function Locations() {
  const { content } = useWedding();
  const data = content?.locations || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const title = data.title || 'Locations';
  const locations = data.locations?.length > 0 ? data.locations : [
    { name: 'Trauung', address: 'Standesamt Hamburg\nCaffamacherreihe 1-3', time: '14:00 Uhr' },
    { name: 'Feier', address: 'Landhaus Walter\nElbchaussee 499', time: 'Ab 16:00 Uhr' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="locations" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Grid>
          {locations.map((loc, i) => (
            <Card key={i} className={visible ? 'visible' : ''} $delay={0.1 + i * 0.1}>
              <CardTitle>{loc.name}</CardTitle>
              <CardText>{loc.time}</CardText>
              <CardText style={{whiteSpace: 'pre-line'}}>{loc.address}</CardText>
              {loc.maps_url && <MapLink href={loc.maps_url} target="_blank">Karte →</MapLink>}
            </Card>
          ))}
        </Grid>
      </Content>
    </Section>
  );
}

export default Locations;
