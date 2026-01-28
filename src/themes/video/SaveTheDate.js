// SaveTheDate.js
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--background, #fff);
`;

const Card = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
  padding: 4rem 2rem;
`;

const Title = styled.h1`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--text-primary, #333);
`;

const Date = styled.p`
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 1.5rem;
  color: var(--text-secondary, #666);
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary, #666);
`;

function SaveTheDate() {
  const { coupleNames, weddingDate, content } = useWedding();
  const data = content?.savethedate || {};
  
  const formattedDate = weddingDate 
    ? new Date(weddingDate).toLocaleDateString('de-DE', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : '';

  return (
    <Container>
      <Card>
        <Title>{data.title || 'Save the Date'}</Title>
        <Date>{coupleNames}</Date>
        <Date>{formattedDate}</Date>
        <Message>{data.message || 'Einladung folgt'}</Message>
      </Card>
    </Container>
  );
}

export default SaveTheDate;
