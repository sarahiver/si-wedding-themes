import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FooterSection = styled.footer`
  position: relative;
  z-index: 10;
  padding: 5rem 2rem;
  text-align: center;
`;

const Names = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 300;
  color: var(--text-light);
  animation: ${fadeIn} 0.8s ease;
`;

const Ampersand = styled.span`
  font-style: italic;
  color: var(--text-muted);
  margin: 0 0.3em;
`;

const DateText = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-top: 0.75rem;
  animation: ${fadeIn} 0.8s ease;
  animation-delay: 0.1s;
`;

const Divider = styled.div`
  width: 60px;
  height: 1px;
  background: rgba(255,255,255,0.15);
  margin: 2rem auto;
`;

const Hashtag = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
`;

const Credits = styled.p`
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  
  a {
    color: var(--text-muted);
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--text-light);
    }
  }
`;

const ScrollTop = styled.button`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.1);
    color: var(--text-light);
  }
`;

function Footer() {
  const { coupleNames, weddingDate, project } = useWedding();

  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Anna', 'Thomas'];
  const hashtag = project?.hashtag;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FooterSection>
      <Names>
        {names[0]}<Ampersand>&</Ampersand>{names[1]}
      </Names>
      
      {weddingDate && (
        <DateText>{formatDate(weddingDate)}</DateText>
      )}
      
      {hashtag && <Hashtag>#{hashtag}</Hashtag>}

      <Divider />

      <Credits>
        Powered by <a href="https://siwedding.de" target="_blank" rel="noopener noreferrer">S&I.</a>
      </Credits>
      
      <ScrollTop onClick={scrollToTop}>
        ↑ Nach oben
      </ScrollTop>
    </FooterSection>
  );
}

export default Footer;
