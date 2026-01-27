import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const leafFloat = keyframes`
  0%, 100% { transform: rotate(-5deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.05); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  transition: all 0.4s ease;
  
  ${p => p.scrolled && css`
    background: rgba(245, 241, 235, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 4px 30px rgba(45, 59, 45, 0.1);
    padding: 0.75rem 2rem;
  `}

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${fadeIn} 0.8s ease;
`;

const LogoIcon = styled.span`
  font-size: 1.5rem;
  animation: ${leafFloat} 4s ease-in-out infinite;
`;

const LogoText = styled.span`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-style: italic;
  color: var(--forest);
  transition: color var(--transition-normal);
  
  ${p => p.scrolled && css`
    color: var(--sage-dark);
  `}
`;

const DesktopLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  animation: ${fadeIn} 0.8s ease 0.2s both;

  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled.li`
  a {
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-light);
    position: relative;
    padding: 0.5rem 0;
    transition: color var(--transition-normal);
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--sage);
      transition: width var(--transition-normal);
    }
    
    &:hover {
      color: var(--sage-dark);
      
      &::after {
        width: 100%;
      }
    }
  }
`;

const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: var(--sage-muted);
  border: 1px solid rgba(139, 157, 131, 0.3);
  border-radius: 30px;
  animation: ${fadeIn} 0.8s ease 0.4s both;
  
  span {
    font-family: 'Lato', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--sage-dark);
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  background: var(--sage-muted);
  border-radius: 50%;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--sage);
    
    span, span::before, span::after {
      background: var(--cream);
    }
  }

  @media (max-width: 968px) {
    display: flex;
  }
`;

const MenuIcon = styled.span`
  position: relative;
  width: 18px;
  height: 2px;
  background: var(--sage-dark);
  transition: all var(--transition-normal);
  
  &::before, &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--sage-dark);
    transition: all var(--transition-normal);
  }
  
  &::before { top: -6px; }
  &::after { bottom: -6px; }
  
  ${p => p.isOpen && css`
    background: transparent;
    
    &::before {
      top: 0;
      transform: rotate(45deg);
    }
    
    &::after {
      bottom: 0;
      transform: rotate(-45deg);
    }
  `}
`;

// Mobile Menu
const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: var(--cream);
  z-index: 999;
  padding: 6rem 2rem 2rem;
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  
  ${p => p.isOpen && css`
    transform: translateX(0);
    animation: ${slideIn} 0.4s ease;
  `}
`;

const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(45, 59, 45, 0.5);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  ${p => p.isOpen && css`
    opacity: 1;
    visibility: visible;
  `}
`;

const MobileLinks = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MobileLink = styled.li`
  opacity: 0;
  transform: translateX(20px);
  animation: ${p => p.isOpen ? css`${fadeIn} 0.4s ease forwards` : 'none'};
  animation-delay: ${p => 0.1 + p.index * 0.05}s;
  
  a {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--forest);
    border-bottom: 1px solid var(--sage-muted);
    transition: all var(--transition-normal);
    
    &:hover {
      color: var(--sage-dark);
      padding-left: 1rem;
    }
  }
`;

const MobileDateBadge = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--sage-muted);
  border-radius: var(--radius-lg);
  text-align: center;
  
  .icon { font-size: 2rem; margin-bottom: 0.5rem; }
  .date {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-style: italic;
    color: var(--forest);
  }
`;

// Decorative Leaf
const LeafDecor = styled.div`
  position: absolute;
  bottom: -30px;
  right: 2rem;
  width: 60px;
  height: 60px;
  opacity: 0.1;
  animation: ${leafFloat} 6s ease-in-out infinite;
  
  svg {
    width: 100%;
    height: 100%;
    fill: var(--sage);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// SVG
// ═══════════════════════════════════════════════════════════════════════════

const LeafSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z M50 20 C50 20 50 80 50 80" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Navigation({
  coupleNames = 'Olivia & Benjamin',
  weddingDate = '21. Juni 2025',
  links = [
    { label: 'Unsere Geschichte', href: '#story' },
    { label: 'Hochzeit', href: '#location' },
    { label: 'Ablauf', href: '#timeline' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'Galerie', href: '#gallery' },
  ],
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <Nav scrolled={scrolled}>
        <Container>
          <Logo href="#top">
            <LogoIcon>🌿</LogoIcon>
            <LogoText scrolled={scrolled}>{coupleNames}</LogoText>
          </Logo>

          <DesktopLinks>
            {links.map((link, i) => (
              <NavLink key={i}>
                <a href={link.href}>{link.label}</a>
              </NavLink>
            ))}
          </DesktopLinks>

          <DateBadge>
            <span>🗓</span>
            <span>{weddingDate}</span>
          </DateBadge>

          <MobileMenuBtn onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon isOpen={menuOpen} />
          </MobileMenuBtn>
        </Container>
        
        {scrolled && (
          <LeafDecor>
            <LeafSVG />
          </LeafDecor>
        )}
      </Nav>

      <MobileOverlay isOpen={menuOpen} onClick={() => setMenuOpen(false)} />
      
      <MobileMenu isOpen={menuOpen}>
        <MobileLinks>
          {links.map((link, i) => (
            <MobileLink key={i} index={i} isOpen={menuOpen}>
              <a href={link.href} onClick={handleLinkClick}>
                {link.label}
              </a>
            </MobileLink>
          ))}
        </MobileLinks>
        
        <MobileDateBadge>
          <div className="icon">🌸</div>
          <div className="date">{weddingDate}</div>
        </MobileDateBadge>
      </MobileMenu>
    </>
  );
}

export default Navigation;
