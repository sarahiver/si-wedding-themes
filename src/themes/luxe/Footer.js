import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const FooterSection = styled.footer`padding: 5rem var(--section-padding-x); background: var(--luxe-void); text-align: center;`;
const Names = styled.h2`font-family: var(--font-display); font-size: clamp(3rem, 8vw, 6rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 1rem;`;
const DateText = styled.p`font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-slate); margin-bottom: 2rem;`;
const Tagline = styled.p`font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--luxe-pearl); margin-bottom: 0.5rem;`;
const Hashtag = styled.p`font-family: var(--font-display); font-size: 1.25rem; font-style: italic; color: var(--luxe-gold); margin-bottom: 2rem;`;
const AdminBtn = styled.button`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-graphite); margin-top: 2rem; &:hover { color: var(--luxe-gold); }`;
const Copyright = styled.p`font-family: var(--font-body); font-size: 0.65rem; color: var(--luxe-graphite); margin-top: 2rem;`;
const PoweredBy = styled.a`display: block; font-family: var(--font-body); font-size: 0.6rem; color: var(--luxe-graphite); margin-top: 1rem; text-decoration: none; &:hover { color: var(--luxe-gold); }`;


function Footer() {
  const { project, content, slug } = useWedding();
  const footerData = content?.footer || {};
  const name1 = project?.partner1_name || 'Alexandra';
  const name2 = project?.partner2_name || 'Benjamin';
  const date = project?.wedding_date;
  const hashtag = footerData.hashtag;
  const tagline = footerData.tagline;

  const formattedDate = date ? new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const handleAdminClick = () => {
    const adminPath = slug ? `/${slug}/admin` : '/admin';
    window.location.href = adminPath;
  };

  return (
    <FooterSection>
      <Names>{name1} & {name2}</Names>
      {formattedDate && <DateText>{formattedDate}</DateText>}
      {tagline && <Tagline>{tagline}</Tagline>}
      {hashtag && <Hashtag>#{hashtag}</Hashtag>}
      <AdminBtn onClick={handleAdminClick}>Admin</AdminBtn>
      <Copyright>© {new Date().getFullYear()} {name1} & {name2}</Copyright>
      <PoweredBy href="https://siwedding.de" target="_blank" rel="noopener noreferrer">Powered by S&I.</PoweredBy>
      <Copyright style={{ marginTop: '0.5rem' }}>
        <a href="/datenschutz" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Datenschutz</a>
        {' · '}
        <a href="/impressum" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Impressum</a>
      </Copyright>
    </FooterSection>
  );
}

export default Footer;
