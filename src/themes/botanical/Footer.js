import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const FooterSection = styled.footer`
  padding: 5rem 2rem;
  background: var(--zen-bg);
  text-align: center;
  border-top: 1px solid var(--zen-line);
`;

const Names = styled.p`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--zen-text);
  margin-bottom: 0.5rem;
`;

const DateText = styled.p`
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  color: var(--zen-text-light);
`;

const BackToTop = styled.a`
  display: inline-block;
  margin-top: 2rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--zen-text-muted);
  &:hover { color: var(--zen-text); opacity: 1; }
`;

function Footer() {
  const { coupleNames, weddingDate } = useWedding();
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} · ${month} · ${year}`;
  };

  return (
    <FooterSection>
      <Names>{coupleNames || 'Anna & Thomas'}</Names>
      {weddingDate && <DateText>{formatDate(weddingDate)}</DateText>}
      <BackToTop href="#top">↑ Nach oben</BackToTop>
    </FooterSection>
  );
}

export default Footer;
