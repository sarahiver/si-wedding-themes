import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import BotanicalBackground from './BotanicalBackground';
import GlobalStyles from './GlobalStyles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 10;
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  box-shadow: var(--glass-shadow);
  padding: clamp(3rem, 6vw, 5rem) clamp(2rem, 4vw, 4rem);
  max-width: 550px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 1s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
    pointer-events: none;
  }
`;

const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

const Names = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 9vw, 4rem);
  font-weight: 300;
  line-height: 1;
  color: var(--text-light);
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease;
  animation-delay: 0.3s;
  animation-fill-mode: both;
`;

const Ampersand = styled.span`
  display: block;
  font-size: 0.3em;
  font-style: italic;
  color: var(--text-muted);
  margin: 0.5em 0;
`;

const DateDisplay = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease;
  animation-delay: 0.4s;
  animation-fill-mode: both;
`;

const DateText = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 400;
  color: var(--text-light);
  letter-spacing: 0.05em;
`;

const LocationText = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-top: 0.75rem;
`;

const Message = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.8;
  animation: ${fadeIn} 1s ease;
  animation-delay: 0.5s;
  animation-fill-mode: both;
`;

const Note = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-top: 2rem;
  animation: ${fadeIn} 1s ease;
  animation-delay: 0.6s;
  animation-fill-mode: both;
`;

function SaveTheDate() {
  const { coupleNames, weddingDate, content } = useWedding();
  
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Anna', 'Thomas'];
  const saveTheDate = content?.savethedate || {};
  const location = saveTheDate.location || content?.hero?.location_short || '';
  const message = saveTheDate.message || 'Wir heiraten und möchten diesen besonderen Tag mit euch feiern.';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Datum folgt';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <>
      <GlobalStyles />
      <BotanicalBackground />
      <Container>
        <GlassCard>
          <Eyebrow>Save the Date</Eyebrow>
          
          <Names>
            {names[0]}
            <Ampersand>&</Ampersand>
            {names[1]}
          </Names>
          
          <DateDisplay>
            <DateText>{formatDate(weddingDate)}</DateText>
            {location && <LocationText>{location}</LocationText>}
          </DateDisplay>
          
          <Message>{message}</Message>
          
          <Note>Einladung folgt</Note>
        </GlassCard>
      </Container>
    </>
  );
}

export default SaveTheDate;
