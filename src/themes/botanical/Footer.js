// Botanical Footer - Forest Floor Design
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const Footer = styled.footer`
  position: relative;
  padding: 4rem 2rem 2rem;
  background: linear-gradient(
    180deg,
    var(--green-forest) 0%,
    var(--green-deep) 100%
  );
  overflow: hidden;
`;

// Decorative forest elements at top
const ForestTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: 
    radial-gradient(ellipse 80px 50px at 10% 100%, var(--green-sage) 50%, transparent 50%),
    radial-gradient(ellipse 100px 60px at 30% 100%, var(--green-moss) 50%, transparent 50%),
    radial-gradient(ellipse 70px 45px at 50% 100%, var(--green-fern) 50%, transparent 50%),
    radial-gradient(ellipse 90px 55px at 70% 100%, var(--green-sage) 50%, transparent 50%),
    radial-gradient(ellipse 80px 50px at 90% 100%, var(--green-moss) 50%, transparent 50%);
  transform: rotate(180deg);
  opacity: 0.3;
`;

const Container = styled.div`
  max-width: var(--container-narrow);
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Names = styled.h3`
  font-family: var(--font-handwritten);
  font-size: clamp(2.5rem, 8vw, 4rem);
  color: var(--bg-cream);
  margin-bottom: 0.5rem;
  text-shadow: 0 3px 15px rgba(0,0,0,0.2);
`;

const Tagline = styled.p`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-style: italic;
  color: var(--green-mint);
  margin-bottom: 1.5rem;
  opacity: 0.9;
`;

const Hashtag = styled.p`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-golden);
  margin-bottom: 2rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  &::before, &::after {
    content: '';
    width: 60px;
    height: 2px;
    background: var(--green-sage);
    opacity: 0.4;
  }
  
  span {
    font-size: 1.5rem;
    animation: ${sway} 4s ease-in-out infinite;
  }
`;

const QuickLinks = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuickLink = styled.a`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--green-mint);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  opacity: 0.8;
  
  &:hover {
    background: rgba(255,255,255,0.1);
    opacity: 1;
  }
`;

const AdminButton = styled.button`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--green-sage);
  background: transparent;
  border: 1px solid var(--green-sage);
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.5;
  margin-bottom: 2rem;
  
  &:hover {
    opacity: 1;
    background: rgba(255,255,255,0.05);
  }
`;

const Bottom = styled.div`
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const Copyright = styled.p`
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--green-sage);
  opacity: 0.5;
  margin-bottom: 0.5rem;
`;

const PoweredBy = styled.a`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--green-sage);
  opacity: 0.4;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

function FooterComponent({ onAdminLogin }) {
  const { project, content } = useWedding();
  const footerData = content?.footer || {};
  
  const names = footerData.names || project?.couple_names || 'Emma & Oliver';
  const tagline = footerData.tagline || 'Für immer und ewig';
  const hashtag = footerData.hashtag || '#LoveInBloom';

  const currentYear = new Date().getFullYear();

  return (
    <Footer>
      <ForestTop />
      
      <Container>
        <Names>{names}</Names>
        <Tagline>{tagline}</Tagline>
        {hashtag && <Hashtag>{hashtag}</Hashtag>}
        
        <Divider>
          <span>🌿</span>
        </Divider>
        
        <QuickLinks>
          <QuickLink href="#hero">Start</QuickLink>
          <QuickLink href="#story">Geschichte</QuickLink>
          <QuickLink href="#timeline">Ablauf</QuickLink>
          <QuickLink href="#rsvp">Zusagen</QuickLink>
          <QuickLink href="#faq">FAQ</QuickLink>
        </QuickLinks>
        
        {onAdminLogin && (
          <AdminButton onClick={onAdminLogin}>
            🔐 Admin
          </AdminButton>
        )}
        
        <Bottom>
          <Copyright>© {currentYear} {names}</Copyright>
          <PoweredBy href="https://siwedding.de" target="_blank" rel="noopener noreferrer">
            Made with 💚 by SI Wedding
          </PoweredBy>
        </Bottom>
      </Container>
    </Footer>
  );
}

export default FooterComponent;
