// Botanical Footer - Minimal footer in hole
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.footer`
  min-height: 60vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
`;

const Names = styled.h3`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.3rem;
`;

const Tagline = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-style: italic;
  color: var(--medium);
  margin-bottom: 0.75rem;
`;

const Hashtag = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--light);
  margin-bottom: 1.5rem;
`;

const QuickLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const QuickLink = styled.a`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--light);
  transition: color 0.2s;
  
  &:hover { color: var(--dark); }
`;

const Copyright = styled.p`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  color: var(--pale);
  margin-bottom: 0.25rem;
`;

const PoweredBy = styled.a`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  color: var(--pale);
  
  &:hover { color: var(--light); }
`;

function Footer() {
  const { project, content } = useWedding();
  const { mainHole } = useKnotholes();
  const footerData = content?.footer || {};
  
  const names = footerData.names || project?.couple_names || 'Anna & Thomas';
  const tagline = footerData.tagline || 'Für immer und ewig';
  const hashtag = footerData.hashtag;
  const currentYear = new Date().getFullYear();

  return (
    <Section data-section="footer">
      <HoleContent $hole={mainHole}>
        <Names>{names}</Names>
        <Tagline>{tagline}</Tagline>
        {hashtag && <Hashtag>{hashtag}</Hashtag>}
        
        <QuickLinks>
          <QuickLink href="#hero">Start</QuickLink>
          <QuickLink href="#story">Geschichte</QuickLink>
          <QuickLink href="#timeline">Ablauf</QuickLink>
          <QuickLink href="#rsvp">Zusagen</QuickLink>
        </QuickLinks>
        
        <Copyright>© {currentYear} {names}</Copyright>
        <PoweredBy href="https://siwedding.de" target="_blank">
          SI Wedding
        </PoweredBy>
      </HoleContent>
    </Section>
  );
}

export default Footer;
