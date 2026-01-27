import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-white);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const GoldLine = styled.div`
  width: 1px;
  height: 30px;
  background: var(--luxe-gold);
  margin: 0 auto 1.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const LocationCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  
  &:nth-child(even) {
    direction: rtl;
    > * { direction: ltr; }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    &:nth-child(even) { direction: ltr; }
  }
`;

const ImageWrapper = styled.div`
  aspect-ratio: 4/3;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LocationType = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 0.75rem;
`;

const LocationName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const LocationText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text-light);
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const Address = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--luxe-text-muted);
`;

function Locations({ locations }) {
  const defaultLocations = [
    {
      type: 'Trauung',
      name: 'Schloss Benrath',
      text: 'Die Trauung findet in der historischen Orangerie statt. Ein magischer Ort für den Beginn unserer Reise.',
      address: 'Benrather Schloßallee 100, 40597 Düsseldorf',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    },
    {
      type: 'Feier',
      name: 'Spiegelsaal',
      text: 'Im prachtvollen Spiegelsaal werden wir gemeinsam speisen, tanzen und feiern.',
      address: 'Im Schloss Benrath',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    },
  ];
  
  const locationData = locations || defaultLocations;
  
  return (
    <Section id="location">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Location</Eyebrow>
          <Title>Wo wir feiern</Title>
        </Header>
        
        {locationData.map((loc, index) => (
          <LocationCard key={index}>
            <ImageWrapper>
              <img src={loc.image} alt={loc.name} loading="lazy" />
            </ImageWrapper>
            <Content>
              <LocationType>{loc.type}</LocationType>
              <LocationName>{loc.name}</LocationName>
              <LocationText>{loc.text}</LocationText>
              <Address>{loc.address}</Address>
            </Content>
          </LocationCard>
        ))}
      </Container>
    </Section>
  );
}

export default Locations;
