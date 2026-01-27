import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: 900px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  padding: 2rem;
  background: var(--luxe-white);
  text-align: center;
`;

const CardTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const CardText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--luxe-text-light);
  line-height: 1.8;
`;

function Directions() {
  const directions = [
    {
      title: 'Mit dem Auto',
      text: 'Kostenlose Parkplätze stehen am Schloss zur Verfügung. Folgt der Ausschilderung.',
    },
    {
      title: 'Mit der Bahn',
      text: 'S-Bahn S6 bis Benrath, dann 10 Minuten Fußweg zum Schloss.',
    },
    {
      title: 'Taxi',
      text: 'Taxistand direkt am Bahnhof. Fahrtzeit ca. 3 Minuten.',
    },
  ];
  
  return (
    <Section id="directions">
      <Container>
        <Header>
          <GoldLine />
          <Eyebrow>Anreise</Eyebrow>
          <Title>So findet ihr uns</Title>
        </Header>
        
        <Grid>
          {directions.map((item, index) => (
            <Card key={index}>
              <CardTitle>{item.title}</CardTitle>
              <CardText>{item.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Directions;
