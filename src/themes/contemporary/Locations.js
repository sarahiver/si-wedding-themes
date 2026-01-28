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
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const CardsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.6s ease ${p => 0.2 + p.$index * 0.15}s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CardImage = styled.div`
  height: 300px;
  background: ${p => p.$color || colors[0]};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const CardNumber = styled.div`
  font-size: 8rem;
  font-weight: 700;
  color: rgba(0,0,0,0.1);
  line-height: 1;
`;

const CardBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white);
  background: var(--black);
  padding: 0.4rem 0.8rem;
  border: 2px solid var(--black);
`;

const CardContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CardTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const CardAddress = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 1.5rem;
`;

const CardDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--gray-600);
  padding: 0.5rem 1rem;
  background: var(--gray-100);
  border: 2px solid var(--gray-300);
`;

const CardButton = styled.a`
  display: inline-block;
  width: fit-content;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 0.75rem 1.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-md);
  }
`;

function Locations({ locations = [] }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultLocations = [
    { type: 'Zeremonie', name: 'Alte Kapelle', address: 'Schlossallee 1, 69117 Heidelberg', time: '14:00 Uhr', emoji: '⛪' },
    { type: 'Empfang', name: 'Schlossterrasse', address: 'Schlossallee 1, 69117 Heidelberg', time: '15:30 Uhr', emoji: '🥂' },
    { type: 'Dinner & Party', name: 'Festsaal', address: 'Schlossallee 1, 69117 Heidelberg', time: 'ab 17:00 Uhr', emoji: '🎉' },
  ];

  const items = locations.length > 0 ? locations : defaultLocations;

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
        <Header>
          <Eyebrow $visible={visible}>📍 Locations</Eyebrow>
          <Title $visible={visible}>Where it happens</Title>
        </Header>
        
        <CardsStack>
          {items.map((loc, i) => (
            <Card key={i} $index={i} $visible={visible}>
              <CardImage $color={colors[i % colors.length]}>
                <CardNumber>0{i + 1}</CardNumber>
                <CardBadge>{loc.type}</CardBadge>
              </CardImage>
              <CardContent>
                <CardTitle>{loc.name}</CardTitle>
                <CardAddress>{loc.address}</CardAddress>
                <CardDetails>
                  <DetailItem>🕐 {loc.time}</DetailItem>
                  <DetailItem>{loc.emoji} {loc.type}</DetailItem>
                </CardDetails>
                <CardButton href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`} target="_blank">
                  Route planen →
                </CardButton>
              </CardContent>
            </Card>
          ))}
        </CardsStack>
      </Container>
    </Section>
  );
}

export default Locations;
