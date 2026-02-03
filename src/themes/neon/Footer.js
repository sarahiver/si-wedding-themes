// Footer.js - neon Theme (Supabase integrated)
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const FooterSection = styled.footer`
  padding: 4rem 2rem;
  background: var(--footer-bg, #1a1a1a);
  color: var(--footer-text, #fff);
  text-align: center;
`;

const Names = styled.h3`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 1.8rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--footer-accent, #8B9D83);
`;

const Tagline = styled.p`
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--footer-text-secondary, rgba(255,255,255,0.6));
  margin-bottom: 0.5rem;
`;

const Hashtag = styled.p`
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 1rem;
  color: var(--footer-text-secondary, rgba(255,255,255,0.7));
  margin-bottom: 2rem;
`;

const Divider = styled.div`
  width: 60px;
  height: 1px;
  background: var(--footer-divider, rgba(255,255,255,0.2));
  margin: 2rem auto;
`;

const Copyright = styled.p`
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.75rem;
  color: var(--footer-text-muted, rgba(255,255,255,0.5));
  margin-bottom: 1rem;
`;

const AdminLink = styled.button`
  background: none;
  border: none;
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.7rem;
  color: var(--footer-text-muted, rgba(255,255,255,0.3));
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--footer-text-secondary, rgba(255,255,255,0.7));
  }
`;

const PoweredBy = styled.a`
  display: block;
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.65rem;
  color: var(--footer-text-muted, rgba(255,255,255,0.3));
  text-decoration: none;
  margin-top: 1rem;
  
  &:hover {
    color: var(--footer-text-secondary, rgba(255,255,255,0.5));
  }
`;

function Footer() {
  const { content, coupleNames, slug } = useWedding();
  const footerData = content?.footer || {};
  const hashtag = footerData.hashtag;
  const tagline = footerData.tagline;

  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Name', 'Name'];
  const year = new Date().getFullYear();
  
  const handleAdminClick = () => {
    const adminPath = slug ? `/${slug}/admin` : '/admin';
    window.location.href = adminPath;
  };

  return (
    <FooterSection>
      <Names>{names[0]} & {names[1]}</Names>
      {tagline && <Tagline>{tagline}</Tagline>}
      {hashtag && <Hashtag>#{hashtag}</Hashtag>}
      <Divider />
      <Copyright>© {year} {names[0]} & {names[1]}</Copyright>
      <AdminLink onClick={handleAdminClick}>Admin</AdminLink>
      <PoweredBy href="https://siwedding.de" target="_blank" rel="noopener">
        Powered by IverLasting
      </PoweredBy>
    </FooterSection>
  );
}

export default Footer;
