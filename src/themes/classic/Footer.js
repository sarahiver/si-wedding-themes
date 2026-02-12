import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const FooterSection = styled.footer`
  padding: clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 4rem) 2rem;
  background: var(--classic-charcoal);
  text-align: center;
`;

const CoupleNames = styled.h2`
  font-family: var(--font-script);
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--classic-gold);
  margin-bottom: 1rem;
`;

const DateText = styled.p`
  font-family: var(--font-display);
  font-size: 1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2rem;
`;

const Divider = styled.div`
  width: 40px;
  height: 1px;
  background: var(--classic-gold);
  margin: 0 auto 2rem;
  opacity: 0.5;
`;

const HashTag = styled.p`
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
`;

const Brand = styled.p`
  font-family: var(--font-body);
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.15em;
  text-transform: uppercase;

  a {
    color: rgba(255, 255, 255, 0.3);
    text-decoration: none;
    transition: color 0.3s;
    &:hover { color: var(--classic-gold); }
  }
`;

function Footer() {
  const { project, content, weddingDate } = useWedding();
  const coupleNames = project?.couple_names || 'Anna & Max';
  const hashtag = project?.hashtag || content?.footer?.hashtag;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <FooterSection>
      <CoupleNames>{coupleNames}</CoupleNames>
      {weddingDate && <DateText>{formatDate(weddingDate)}</DateText>}
      <Divider />
      {hashtag && <HashTag>#{hashtag}</HashTag>}
      <Brand>Made with love by <a href="https://sarahiver.com" target="_blank" rel="noopener noreferrer">S&I.</a></Brand>
    </FooterSection>
  );
}

export default Footer;
