// Botanical Hero - Content visible through knothole overlay
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    var(--forest-deep) 0%,
    var(--forest-main) 50%,
    var(--forest-light) 100%
  );
  position: relative;
  scroll-snap-align: start;
`;

// Subtle background texture
const BackgroundTexture = styled.div`
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.02) 0%, transparent 40%);
  pointer-events: none;
`;

const Content = styled.div`
  text-align: center;
  padding: 2rem;
  max-width: 700px;
  animation: ${fadeIn} 1s var(--ease-out) forwards;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-mist);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s var(--ease-out) 0.2s forwards;
`;

const Names = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 12vw, 8rem);
  font-weight: 300;
  color: var(--cream);
  line-height: 0.95;
  margin-bottom: 0.25em;
  letter-spacing: -0.03em;
  opacity: 0;
  animation: ${fadeIn} 1s var(--ease-out) 0.4s forwards;
  
  span {
    display: block;
  }
`;

const Ampersand = styled.span`
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.5em;
  color: var(--gold-light);
  display: block;
  margin: 0.2em 0;
`;

const DateLocation = styled.div`
  margin-top: 2.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s var(--ease-out) 0.6s forwards;
`;

const WeddingDate = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 400;
  color: var(--cream);
  margin-bottom: 0.5rem;
`;

const Location = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--forest-mist);
`;

const CTAButton = styled.a`
  display: inline-block;
  margin-top: 3rem;
  padding: 1rem 2.5rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--forest-deep);
  background: var(--cream);
  border-radius: 2px;
  transition: all 0.4s var(--ease-smooth);
  opacity: 0;
  animation: ${fadeIn} 0.8s var(--ease-out) 0.8s forwards;
  
  &:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
`;

function Hero() {
  const { content, project } = useWedding();
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
  }) : '15. August 2025';

  return (
    <Section id="hero" data-section="hero">
      <BackgroundTexture />
      <Content>
        <Eyebrow>{tagline}</Eyebrow>
        <Names>
          <span>{name1}</span>
          <Ampersand>&</Ampersand>
          <span>{name2}</span>
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
