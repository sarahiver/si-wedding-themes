import React from 'react';
import styled, { keyframes } from 'styled-components';

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const Section = styled.footer`
  padding: 6rem 2rem 3rem;
  background: var(--forest);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Names = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 400;
  color: var(--cream);
  margin-bottom: 1rem;
  
  span {
    font-style: italic;
    color: var(--sage-light);
  }
`;

const Tagline = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--sage-light);
  margin-bottom: 2rem;
`;

const Hashtag = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-style: italic;
  color: var(--cream);
  margin-bottom: 3rem;
`;

const Divider = styled.div`
  width: 60px;
  height: 1px;
  background: var(--sage-light);
  margin: 0 auto 2rem;
  opacity: 0.5;
`;

const Legal = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  
  a {
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    color: var(--sage-light);
    text-decoration: none;
    opacity: 0.7;
    
    &:hover { opacity: 1; }
  }
`;

const Leaf = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  opacity: 0.05;
  animation: ${sway} 6s ease-in-out infinite;
  
  &.left { left: 5%; bottom: 20%; }
  &.right { right: 5%; bottom: 30%; }
  
  svg { width: 100%; height: 100%; fill: var(--sage-light); }
`;

const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

function Footer({ coupleNames = 'Olivia & Benjamin', content = {} }) {
  const hashtag = content.hashtag || '';
  const tagline = content.tagline || 'Wir freuen uns auf euch!';

  const names = coupleNames.split(/\s*[&+]\s*/);

  return (
    <Section>
      <Leaf className="left"><LeafSVG /></Leaf>
      <Leaf className="right"><LeafSVG /></Leaf>
      
      <Container>
        <Names>
          {names[0]} <span>&</span> {names[1]}
        </Names>
        <Tagline>{tagline}</Tagline>
        {hashtag && <Hashtag>{hashtag}</Hashtag>}
        
        <Divider />
        
        <Legal>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
        </Legal>
      </Container>
    </Section>
  );
}

export default Footer;
