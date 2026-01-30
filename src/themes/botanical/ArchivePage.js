// ArchivePage.js - Zen Theme
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import Navigation from './Navigation';
import Footer from './Footer';
import Gallery from './Gallery';
import Guestbook from './Guestbook';

const Container = styled.div`
  min-height: 100vh;
  background: var(--zen-bg);
`;

const Header = styled.div`
  padding: 8rem 2rem 4rem;
  text-align: center;
`;

const Title = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--zen-text);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--zen-text-light);
`;

function ArchivePage() {
  const { coupleNames, weddingDate } = useWedding();
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Container>
      <Navigation />
      <Header>
        <Title>{coupleNames || 'Anna & Thomas'}</Title>
        <Subtitle>{formatDate(weddingDate)} — Archiv</Subtitle>
      </Header>
      <Gallery />
      <Guestbook />
      <Footer />
    </Container>
  );
}

export default ArchivePage;
