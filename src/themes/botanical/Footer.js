import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const FooterWrapper = styled.div`text-align: center; padding: 2rem;`;
const Names = styled.h3`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3rem); font-weight: 300; color: var(--black); margin-bottom: 0.3rem;`;
const Tagline = styled.p`font-family: var(--font-serif); font-size: 1rem; font-style: italic; color: var(--medium); margin-bottom: 0.75rem;`;
const Hashtag = styled.p`font-size: 0.8rem; font-weight: 600; color: var(--light); margin-bottom: 1.5rem;`;
const QuickLinks = styled.div`display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;`;
const QuickLink = styled.a`font-size: 0.75rem; color: var(--light); &:hover { color: var(--dark); }`;
const Copyright = styled.p`font-size: 0.65rem; color: var(--pale); margin-bottom: 0.25rem;`;
const PoweredBy = styled.a`font-size: 0.6rem; color: var(--pale); &:hover { color: var(--light); }`;

function Footer() {
  const { project, content } = useWedding();
  const d = content?.footer || {};
  const names = d.names || project?.couple_names || 'Anna & Thomas';

  return (
    <FooterWrapper>
      <Names>{names}</Names>
      <Tagline>{d.tagline || 'Für immer und ewig'}</Tagline>
      {d.hashtag && <Hashtag>{d.hashtag}</Hashtag>}
      <QuickLinks>
        <QuickLink href="#hero">Start</QuickLink>
        <QuickLink href="#story">Geschichte</QuickLink>
        <QuickLink href="#timeline">Ablauf</QuickLink>
        <QuickLink href="#rsvp">Zusagen</QuickLink>
      </QuickLinks>
      <Copyright>© {new Date().getFullYear()} {names}</Copyright>
      <PoweredBy href="https://siwedding.de" target="_blank">SI Wedding</PoweredBy>
    </FooterWrapper>
  );
}
export default Footer;
