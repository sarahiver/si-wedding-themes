import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: 5rem 2rem;
  background: var(--background, #fff);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: var(--text-primary, #333);
`;

const Content = styled.div`
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary, #666);
`;

function Directions() {
  const { content } = useWedding();
  const data = content?.directions || {};

  return (
    <Section id="directions">
      <Container>
        <Title>{data.title || 'Anfahrt'}</Title>
        <Content>
          {data.description || 'Informationen zur Anfahrt folgen.'}
        </Content>
      </Container>
    </Section>
  );
}

export default Directions;
