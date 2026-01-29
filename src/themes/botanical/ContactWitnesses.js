// Botanical ContactWitnesses - Privacy Protected
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-moss);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.08};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 4.5rem);
  color: var(--green-forest);
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-light);
  margin-top: 0.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const WitnessCard = styled.div`
  background: var(--bg-cream);
  padding: 2rem;
  border-radius: 35px;
  box-shadow: var(--shadow-soft);
  text-align: center;
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: ${p => p.$image 
    ? `url(${p.$image}) center/cover` 
    : 'linear-gradient(135deg, var(--green-sage) 0%, var(--green-fern) 100%)'};
  border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: var(--shadow-soft);
`;

const WitnessName = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  color: var(--green-forest);
  margin-bottom: 0.25rem;
`;

const WitnessRole = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--green-fern);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
`;

const ContactButton = styled.a`
  display: block;
  padding: 0.75rem;
  background: var(--bg-fog);
  color: var(--green-forest);
  border-radius: 20px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    background: var(--green-mint);
    transform: translateX(5px);
  }
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const witnessesData = content?.witnesses || {};
  
  const title = witnessesData.title || 'Trauzeugen';
  const subtitle = witnessesData.subtitle || 'Bei Fragen zu Überraschungen könnt ihr euch an unsere Trauzeugen wenden';
  const persons = witnessesData.persons || [];

  const defaultPersons = [
    { name: 'Lisa Müller', role: 'Trauzeugin der Braut', email: 'lisa@example.com', phone: '+49 170 1234567', image: '', emoji: '👩' },
    { name: 'Thomas Schmidt', role: 'Trauzeuge des Bräutigams', email: 'thomas@example.com', phone: '+49 171 7654321', image: '', emoji: '👨' },
  ];

  const items = persons.length > 0 ? persons : defaultPersons;

  return (
    <Section id="witnesses">
      <DecoLeaf $size="150px" $color="var(--green-mint)" $opacity={0.06} style={{ top: '10%', left: '-4%' }} />
      <DecoLeaf $size="100px" $color="var(--green-sage)" $opacity={0.05} style={{ bottom: '15%', right: '-3%' }} $duration="12s" />
      
      <Container>
        <Header>
          <Eyebrow>🤝 Unsere Helfer</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>
        
        <Grid>
          {items.map((person, i) => (
            <WitnessCard key={i}>
              <Avatar $image={person.image}>
                {!person.image && (person.emoji || (i === 0 ? '👩' : '👨'))}
              </Avatar>
              <WitnessName>{person.name}</WitnessName>
              <WitnessRole>{person.role}</WitnessRole>
              {person.email && (
                <ContactButton href={`mailto:${person.email}`}>
                  ✉️ E-Mail schreiben
                </ContactButton>
              )}
              {person.phone && (
                <ContactButton href={`tel:${person.phone.replace(/\s/g, '')}`}>
                  📱 Anrufen
                </ContactButton>
              )}
            </WitnessCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
