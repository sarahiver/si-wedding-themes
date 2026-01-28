import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: var(--cream-light);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--sage-light);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$index * 0.15}s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
  }
`;

const CardImage = styled.div`
  height: 220px;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--cream-dark)'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  .placeholder {
    font-size: 3rem;
    opacity: 0.5;
  }
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const CardType = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage);
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const CardAddress = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const CardLink = styled.a`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: var(--sage);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover { color: var(--sage-dark); }
`;

function Locations() {
  const { content } = useWedding();
  const locationsData = content?.locations || {};
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const title = locationsData.title || 'Locations';
  const locations = locationsData.locations || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="location">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Wo wir feiern</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Grid>
          {locations.map((loc, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <CardImage $image={loc.image}>
                {!loc.image && <span className="placeholder">🌿</span>}
              </CardImage>
              <CardContent>
                <CardType>{loc.type || 'Location'}</CardType>
                <CardTitle>{loc.name}</CardTitle>
                <CardAddress>{loc.address}</CardAddress>
                {loc.mapsUrl && (
                  <CardLink href={loc.mapsUrl} target="_blank" rel="noopener">
                    Auf Karte anzeigen →
                  </CardLink>
                )}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Locations;
