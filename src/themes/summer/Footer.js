import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const FooterWrap = styled.div`
  padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem) clamp(2rem, 4vw, 3rem);
  background: var(--c-text);
  position: relative;
  z-index: 2;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--c-accent), var(--c-gold), var(--c-accent));
  }
`;

const FooterInner = styled.div`
  max-width: var(--content-w);
  margin: 0 auto;
  text-align: center;
`;

const FooterNames = styled.p`
  font-family: var(--font-s);
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: rgba(255,255,255,0.9);
  margin-bottom: 0.5rem;
  line-height: 1.1;
`;

const FooterDateLine = styled.p`
  font-family: var(--font-b);
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 2.5rem;
`;

const FooterDivider = styled.div`
  width: 40px;
  height: 1px;
  background: rgba(193,57,43,0.5);
  margin: 0 auto 2rem;
`;

const FooterTagline = styled.p`
  font-family: var(--font-d);
  font-style: italic;
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  color: rgba(255,255,255,0.3);
  margin-bottom: 2.5rem;
`;

const FooterCredit = styled.p`
  font-family: var(--font-b);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.15);

  a {
    color: rgba(193,127,36,0.5);
    transition: color 0.2s;
    &:hover { color: rgba(193,127,36,0.8); }
  }
`;

function formatWeddingDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new window.Date(dateStr).toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return '';
  }
}

function Footer() {
  const { project } = useWedding();
  const cn = project?.couple_names || 'Lena & Jonas';
  const formattedDate = formatWeddingDate(project?.wedding_date);

  return (
    <FooterWrap>
      <FooterInner>
        <FooterNames>{cn}</FooterNames>
        {formattedDate && <FooterDateLine>{formattedDate}</FooterDateLine>}
        <FooterDivider />
        <FooterTagline>Für immer und einen Sommer</FooterTagline>
        <FooterCredit>
          Erstellt mit{' '}
          <a href="https://siwedding.de" target="_blank" rel="noopener noreferrer">
            S&amp;I. Wedding
          </a>
        </FooterCredit>
      </FooterInner>
    </FooterWrap>
  );
}

export default Footer;
