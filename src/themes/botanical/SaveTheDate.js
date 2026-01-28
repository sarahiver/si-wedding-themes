// SaveTheDate.js - Botanical Theme
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream, #F5F1EB);
  position: relative;
  overflow: hidden;
  padding: 2rem;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || 80}px;
  height: ${p => p.$size || 80}px;
  opacity: 0.15;
  animation: ${float} ${p => p.$duration || 8}s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s;
  
  svg {
    width: 100%;
    height: 100%;
    fill: var(--sage, #8B9D83);
  }
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
  animation: ${fadeIn} 1s ease;
`;

const Eyebrow = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage, #8B9D83);
  margin-bottom: 1.5rem;
`;

const Names = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 400;
  color: var(--forest, #2D3B2D);
  line-height: 1.2;
  margin-bottom: 2rem;
  
  span {
    display: block;
    font-style: italic;
    color: var(--sage, #8B9D83);
    font-size: 2rem;
    margin: 0.5rem 0;
  }
  
  @media (max-width: 600px) {
    font-size: 2.5rem;
    span { font-size: 1.5rem; }
  }
`;

const DateText = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-style: italic;
  color: var(--text-primary, #333);
  margin-bottom: 1rem;
`;

const Location = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-secondary, #666);
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-secondary, #666);
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--sage-light, rgba(139, 157, 131, 0.3));
`;

const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

function SaveTheDate() {
  const { coupleNames, weddingDate, content } = useWedding();
  const data = content?.savethedate || {};
  
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Olivia', 'Benjamin'];
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Page>
      <FloatingLeaf $size={100} $duration={8} $delay={0} style={{ top: '10%', left: '5%' }}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={70} $duration={10} $delay={2} style={{ top: '20%', right: '10%' }}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={80} $duration={7} $delay={1} style={{ bottom: '15%', left: '8%' }}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={60} $duration={9} $delay={3} style={{ bottom: '25%', right: '5%' }}><LeafSVG /></FloatingLeaf>
      
      <Content>
        <Eyebrow>{data.tagline || 'Save the Date'}</Eyebrow>
        
        <Names>
          {names[0]}
          <span>&</span>
          {names[1]}
        </Names>
        
        <DateText>{formatDate(weddingDate)}</DateText>
        <Location>{data.location || ''}</Location>
        
        {data.message && <Message>{data.message}</Message>}
      </Content>
    </Page>
  );
}

export default SaveTheDate;
