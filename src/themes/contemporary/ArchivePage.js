// ArchivePage.js
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
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--text-primary, #333);
`;

const Message = styled.p`
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary, #666);
`;

const Heart = styled.span`
  color: var(--accent, #8B9D83);
  font-size: 2rem;
  display: block;
  margin: 2rem 0;
`;

function ArchivePage() {
  const { coupleNames } = useWedding();

  return (
    <Container>
      <Card>
        <Title>Vielen Dank!</Title>
        <Heart>♥</Heart>
        <Message>
          Die Hochzeit von {coupleNames} hat stattgefunden.
          <br /><br />
          Danke an alle, die diesen besonderen Tag mit uns gefeiert haben.
        </Message>
      </Card>
    </Container>
  );
}

export default ArchivePage;
