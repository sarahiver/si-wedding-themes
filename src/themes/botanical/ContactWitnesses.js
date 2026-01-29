// Botanical ContactWitnesses - Witnesses in holes
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--medium);
  margin-bottom: 1rem;
`;

const WitnessCard = styled.div`
  background: var(--off-white);
  padding: 1rem;
  width: 100%;
  max-width: 200px;
  margin-bottom: 0.5rem;
`;

const WitnessName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 0.15rem;
`;

const WitnessRole = styled.p`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.75rem;
`;

const WitnessBtn = styled.a`
  display: block;
  padding: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--white);
  color: var(--dark);
  margin-bottom: 0.3rem;
  transition: background 0.2s;
  
  &:hover { background: var(--pale); }
`;

// Smaller witness card for secondary holes
const SmallWitnessCard = styled.div`
  text-align: center;
`;

const SmallName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--black);
  margin-bottom: 0.2rem;
`;

const SmallRole = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const SmallBtn = styled.a`
  display: inline-block;
  padding: 0.4rem 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  background: var(--off-white);
  color: var(--dark);
  
  &:hover { background: var(--pale); }
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const { mainHole, secondaryHoles } = useKnotholes();
  const witnessesData = content?.witnesses || {};
  
  const title = witnessesData.title || 'Trauzeugen';
  const subtitle = witnessesData.subtitle || 'Bei Fragen zu Überraschungen';
  const persons = witnessesData.persons || [];

  const defaultPersons = [
    { name: 'Lisa Müller', role: 'Trauzeugin', email: 'lisa@example.com', phone: '' },
    { name: 'Thomas Schmidt', role: 'Trauzeuge', email: 'thomas@example.com', phone: '' },
  ];

  const items = persons.length > 0 ? persons : defaultPersons;
  const hasSecondary = secondaryHoles.length > 0 && items.length > 1;

  return (
    <Section data-section="witnesses">
      {/* Main hole: Title + first witness (or all if no secondary) */}
      <HoleContent $hole={mainHole}>
        <Eyebrow>Ansprechpartner</Eyebrow>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        
        <WitnessCard>
          <WitnessName>{items[0]?.name}</WitnessName>
          <WitnessRole>{items[0]?.role}</WitnessRole>
          {items[0]?.email && (
            <WitnessBtn href={`mailto:${items[0].email}`}>E-Mail</WitnessBtn>
          )}
          {items[0]?.phone && (
            <WitnessBtn href={`tel:${items[0].phone.replace(/\s/g, '')}`}>Anrufen</WitnessBtn>
          )}
        </WitnessCard>
        
        {/* Show second witness here if no secondary hole */}
        {!hasSecondary && items[1] && (
          <WitnessCard>
            <WitnessName>{items[1].name}</WitnessName>
            <WitnessRole>{items[1].role}</WitnessRole>
            {items[1].email && (
              <WitnessBtn href={`mailto:${items[1].email}`}>E-Mail</WitnessBtn>
            )}
          </WitnessCard>
        )}
      </HoleContent>
      
      {/* Secondary hole: second witness */}
      {hasSecondary && items[1] && (
        <HoleContent $hole={secondaryHoles[0]}>
          <SmallWitnessCard>
            <SmallName>{items[1].name}</SmallName>
            <SmallRole>{items[1].role}</SmallRole>
            {items[1].email && (
              <SmallBtn href={`mailto:${items[1].email}`}>E-Mail</SmallBtn>
            )}
          </SmallWitnessCard>
        </HoleContent>
      )}
    </Section>
  );
}

export default ContactWitnesses;
