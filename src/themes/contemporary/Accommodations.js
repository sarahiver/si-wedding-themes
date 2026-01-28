import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--white);
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)'];

const Card = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.6s ease ${p => 0.2 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
`;

const CardImage = styled.div`
  height: 180px;
  background: ${p => p.$color};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const PriceBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--white);
  background: var(--black);
  padding: 0.5rem 1rem;
  border: 2px solid var(--black);
`;

const RecommendBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--black);
  background: var(--yellow);
  padding: 0.35rem 0.7rem;
  border: 2px solid var(--black);
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const CardLocation = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Feature = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--gray-600);
  background: var(--gray-100);
  padding: 0.35rem 0.75rem;
  border: 2px solid var(--gray-300);
`;

const BookButton = styled.a`
  display: block;
  width: 100%;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 1rem;
  border: 2px solid var(--black);
  text-align: center;
  text-transform: uppercase;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--black);
  }
`;

const TipBox = styled.div`
  margin-top: 3rem;
  background: var(--electric);
  padding: 1.5rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.5s;
`;

const TipText = styled.p`
  font-size: 0.9rem;
  color: var(--black);
  margin: 0;
  
  strong { font-weight: 700; }
`;

function Accommodations() {
  const { content, projectId } = useWedding();
  const accommodationsData = content?.accommodations || {};
  const hotels = accommodationsData.hotels || [];
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultHotels = [
    { name: 'Hotel Heidelberg', location: '500m zur Location', price: 'ab €129', features: ['Spa', 'Frühstück', 'Parken'], recommended: true, emoji: '🏨' },
    { name: 'Boutique Rose', location: '1.2km zur Location', price: 'ab €99', features: ['Charme', 'Frühstück'], emoji: '🌹' },
    { name: 'Hotel am Schloss', location: '300m zur Location', price: 'ab €149', features: ['Luxus', 'Restaurant'], emoji: '🏰' },
  ];

  const items = hotels.length > 0 ? hotels : defaultHotels;

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
      <Container>
        <Header>
          <Eyebrow $visible={visible}>🏨 Übernachtung</Eyebrow>
          <Title $visible={visible}>Where to Stay</Title>
        </Header>
        
        <Grid>
          {items.map((hotel, i) => (
            <Card key={i} $index={i} $visible={visible}>
              <CardImage $color={colors[i % colors.length]}>
                {hotel.emoji}
                <PriceBadge>{hotel.price}</PriceBadge>
                {hotel.recommended && <RecommendBadge>Empfohlen</RecommendBadge>}
              </CardImage>
              <CardContent>
                <CardTitle>{hotel.name}</CardTitle>
                <CardLocation>📍 {hotel.location}</CardLocation>
                <Features>
                  {hotel.features?.map((f, j) => <Feature key={j}>{f}</Feature>)}
                </Features>
                <BookButton href="#">Buchen →</BookButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
        
        <TipBox $visible={visible}>
          <TipText>
            <strong>💡 Tipp:</strong> Nennt bei der Buchung "Hochzeit Sophie & Max" für Sonderkonditionen!
          </TipText>
        </TipBox>
      </Container>
    </Section>
  );
}

export default Accommodations;
