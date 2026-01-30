import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import BotanicalBackground from './BotanicalBackground';
import GlobalStyles from './GlobalStyles';

const ArchiveContainer = styled.div`
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
  padding: clamp(2.5rem, 5vw, 4rem);
  max-width: 600px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
    pointer-events: none;
  }
`;

const Icon = styled.span`
  font-size: 4rem;
  display: block;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--text-light);
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const DateText = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
`;

function ArchivePage() {
  const { coupleNames, weddingDate, content } = useWedding();
  
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Anna', 'Thomas'];
  const archiveMessage = content?.archive?.message || 'Die Hochzeit liegt nun hinter uns. Danke an alle, die diesen besonderen Tag mit uns gefeiert haben!';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
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
      <ArchiveContainer>
        <GlassCard>
          <Icon>💒</Icon>
          <Title>{names[0]} & {names[1]}</Title>
          <Message>{archiveMessage}</Message>
          {weddingDate && (
            <DateText>Verheiratet seit {formatDate(weddingDate)}</DateText>
          )}
        </GlassCard>
      </ArchiveContainer>
    </>
  );
}

export default ArchivePage;
