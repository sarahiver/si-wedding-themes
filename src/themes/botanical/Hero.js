// Botanical Hero - Adapts to knothole position
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Content positioned within the main hole
const Content = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease 0.2s forwards;
`;

const Names = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 300;
  color: var(--black);
  line-height: 0.95;
  letter-spacing: -0.02em;
  opacity: 0;
  animation: ${fadeIn} 1s ease 0.3s forwards;
`;

const Ampersand = styled.span`
  display: block;
  font-style: italic;
  font-size: 0.35em;
  color: var(--medium);
  margin: 0.4em 0;
`;

const DateLocation = styled.div`
  margin-top: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease 0.5s forwards;
`;

const WeddingDate = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  color: var(--dark);
  margin-bottom: 0.3rem;
`;

const Location = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--light);
  letter-spacing: 0.05em;
`;

const CTAButton = styled.a`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.9rem 2rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--white);
  background: var(--black);
  border: 1px solid var(--black);
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease 0.6s forwards;
  
  &:hover {
    background: transparent;
    color: var(--black);
  }
`;

function Hero() {
  const { content, project } = useWedding();
  const { mainHole } = useKnotholes();
  const heroData = content?.hero || {};
  
  const name1 = heroData.name1 || project?.partner1_name || 'Anna';
  const name2 = heroData.name2 || project?.partner2_name || 'Thomas';
  const tagline = heroData.tagline || 'Wir heiraten';
  const date = heroData.date || project?.wedding_date;
  const location = heroData.location_short || project?.location || '';

  const formattedDate = date ? new Date(date).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '';

  return (
    <Section data-section="hero">
      <Content $hole={mainHole}>
        <Eyebrow>{tagline}</Eyebrow>
        <Names>
          {name1}
          <Ampersand>&</Ampersand>
          {name2}
        </Names>
        <DateLocation>
          <WeddingDate>{formattedDate}</WeddingDate>
          {location && <Location>{location}</Location>}
        </DateLocation>
        <CTAButton href="#rsvp">Zusagen</CTAButton>
      </Content>
    </Section>
  );
}

export default Hero;
