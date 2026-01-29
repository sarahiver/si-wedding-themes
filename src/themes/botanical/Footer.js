// Botanical Footer - Clean minimal
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const FooterSection = styled.footer`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bark-dark);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  text-align: center;
  max-width: 500px;
`;

const Names = styled.h3`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 300;
  color: var(--cream);
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--bark-highlight);
  margin-bottom: 1rem;
`;

const Hashtag = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 2rem;
`;

const QuickLinks = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const QuickLink = styled.a`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--bark-light);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--cream);
  }
`;

const Bottom = styled.div`
  padding-top: 2rem;
  border-top: 1px solid var(--bark-medium);
`;

const Copyright = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--bark-light);
  margin-bottom: 0.5rem;
`;

const PoweredBy = styled.a`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: var(--bark-medium);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--bark-light);
  }
`;

function Footer() {
  const { project, content } = useWedding();
  const footerData = content?.footer || {};
  
  const names = footerData.names || project?.couple_names || 'Anna & Thomas';
  const tagline = footerData.tagline || 'Für immer und ewig';
  const hashtag = footerData.hashtag;

  const currentYear = new Date().getFullYear();

  return (
    <FooterSection id="footer" data-section="footer">
      <Content>
        <Names>{names}</Names>
        <Tagline>{tagline}</Tagline>
        {hashtag && <Hashtag>{hashtag}</Hashtag>}
        
        <QuickLinks>
          <QuickLink href="#hero">Start</QuickLink>
          <QuickLink href="#story">Geschichte</QuickLink>
          <QuickLink href="#timeline">Ablauf</QuickLink>
          <QuickLink href="#rsvp">Zusagen</QuickLink>
        </QuickLinks>
        
        <Bottom>
          <Copyright>© {currentYear} {names}</Copyright>
          <PoweredBy href="https://siwedding.de" target="_blank" rel="noopener noreferrer">
            SI Wedding
          </PoweredBy>
        </Bottom>
      </Content>
    </FooterSection>
  );
}

export default Footer;
