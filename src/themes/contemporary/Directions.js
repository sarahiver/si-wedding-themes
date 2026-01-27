import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--black);
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
  color: var(--white);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MapWrapper = styled.div`
  background: var(--gray-800);
  border: 3px solid var(--gray-600);
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '-30px'});
  transition: all 0.6s ease 0.2s;
`;

const MapPlaceholder = styled.div`
  text-align: center;
  color: var(--gray-500);
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.3s;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)'];

const InfoCard = styled.div`
  background: var(--gray-800);
  border: 3px solid ${p => p.$color || 'var(--gray-600)'};
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(8px);
    box-shadow: -8px 0 0 ${p => p.$color || 'var(--coral)'};
  }
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
`;

const InfoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: var(--gray-400);
  line-height: 1.5;
  margin: 0;
`;

const TransportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 3rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TransportCard = styled.div`
  background: ${p => p.$color};
  padding: 1.5rem;
  border: 3px solid var(--black);
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.5s ease ${p => 0.4 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const TransportIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

const TransportTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const TransportDesc = styled.p`
  font-size: 0.75rem;
  color: rgba(0,0,0,0.7);
  margin: 0;
`;

function Directions({ address = 'Schloss Heidelberg, 69117 Heidelberg' }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="directions">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>🗺️ Navigation</Eyebrow>
          <Title $visible={visible}>Get There</Title>
        </Header>
        
        <Grid>
          <MapWrapper $visible={visible}>
            <MapPlaceholder>📍 Karte<br /><small>{address}</small></MapPlaceholder>
          </MapWrapper>
          
          <InfoPanel $visible={visible}>
            <InfoCard $color={colors[0]}>
              <InfoIcon>📍</InfoIcon>
              <InfoTitle>Adresse</InfoTitle>
              <InfoText>{address}</InfoText>
            </InfoCard>
            <InfoCard $color={colors[1]}>
              <InfoIcon>🅿️</InfoIcon>
              <InfoTitle>Parken</InfoTitle>
              <InfoText>Kostenlose Parkplätze direkt vor der Location</InfoText>
            </InfoCard>
            <InfoCard $color={colors[2]}>
              <InfoIcon>🚕</InfoIcon>
              <InfoTitle>Taxi</InfoTitle>
              <InfoText>Taxi Heidelberg: +49 6221 302030</InfoText>
            </InfoCard>
          </InfoPanel>
        </Grid>
        
        <TransportGrid>
          <TransportCard $color="var(--coral)" $index={0} $visible={visible}>
            <TransportIcon>🚗</TransportIcon>
            <TransportTitle>Auto</TransportTitle>
            <TransportDesc>A5 Ausfahrt Heidelberg</TransportDesc>
          </TransportCard>
          <TransportCard $color="var(--electric)" $index={1} $visible={visible}>
            <TransportIcon>🚂</TransportIcon>
            <TransportTitle>Bahn</TransportTitle>
            <TransportDesc>Heidelberg Hbf, Bus 33</TransportDesc>
          </TransportCard>
          <TransportCard $color="var(--yellow)" $index={2} $visible={visible}>
            <TransportIcon>✈️</TransportIcon>
            <TransportTitle>Flug</TransportTitle>
            <TransportDesc>Frankfurt, ICE 45 Min</TransportDesc>
          </TransportCard>
        </TransportGrid>
      </Container>
    </Section>
  );
}

export default Directions;
