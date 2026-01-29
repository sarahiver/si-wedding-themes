// HeroContent - Names and wedding date
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../../context/WeddingContext';

const Wrapper = styled.div`
  text-align: center;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Names = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 6vw, 2.8rem);
  font-weight: 300;
  color: var(--black);
  line-height: 1;
`;

const Amp = styled.span`
  display: block;
  font-size: 0.4em;
  font-style: italic;
  color: var(--medium);
  margin: 0.3em 0;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: var(--dark);
  margin-top: 1.25rem;
`;

const Location = styled.p`
  font-size: 0.85rem;
  color: var(--light);
  margin-top: 0.25rem;
`;

function HeroContent() {
  const { content, project } = useWedding();
  const hero = content?.hero || {};
  
  const name1 = hero.name1 || project?.partner1_name || 'Anna';
  const name2 = hero.name2 || project?.partner2_name || 'Thomas';
  const tagline = hero.tagline || 'Wir heiraten';
  const date = hero.date || project?.wedding_date;
  const location = hero.location_short || project?.location || '';

  const formattedDate = date ? new Date(date).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '';

  return (
    <Wrapper>
      <Eyebrow>{tagline}</Eyebrow>
      <Names>
        {name1}
        <Amp>&</Amp>
        {name2}
      </Names>
      {formattedDate && <DateText>{formattedDate}</DateText>}
      {location && <Location>{location}</Location>}
    </Wrapper>
  );
}

export default HeroContent;
