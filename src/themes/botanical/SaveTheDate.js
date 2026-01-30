import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  padding: 2rem;
`;

const Card = styled.div`
  max-width: 400px;
  width: 100%;
  text-align: center;
  padding: 4rem 3rem;
  border: 1px solid var(--zen-line);
`;

const Eyebrow = styled.p`
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--zen-text-muted);
  margin-bottom: 2rem;
`;

const Names = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  font-weight: 300;
  color: var(--zen-text);
  line-height: 1.1;
`;

const Ampersand = styled.span`
  display: block;
  font-size: 0.35em;
  font-style: italic;
  color: var(--zen-text-light);
  margin: 0.5em 0;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  color: var(--zen-text);
  margin-top: 2.5rem;
`;

const Location = styled.p`
  font-size: 0.8rem;
  color: var(--zen-text-light);
  margin-top: 0.5rem;
`;

function SaveTheDate() {
  const { coupleNames, weddingDate, content } = useWedding();
  const data = content?.savethedate || {};
  
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Anna', 'Thomas'];
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Section id="savethedate">
      <Card>
        <Eyebrow>Save the Date</Eyebrow>
        <Names>
          {names[0]}
          <Ampersand>&</Ampersand>
          {names[1]}
        </Names>
        {weddingDate && <DateText>{formatDate(weddingDate)}</DateText>}
        {data.location && <Location>{data.location}</Location>}
      </Card>
    </Section>
  );
}

export default SaveTheDate;
