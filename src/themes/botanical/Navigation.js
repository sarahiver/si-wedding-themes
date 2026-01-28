import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Nav = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: ${p => p.$scrolled 
    ? 'rgba(245, 241, 235, 0.95)' 
    : 'transparent'
  };
  backdrop-filter: ${p => p.$scrolled ? 'blur(20px)' : 'none'};
  border-bottom: ${p => p.$scrolled ? '1px solid rgba(139, 157, 131, 0.2)' : 'none'};
  transition: all 0.4s ease;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.a`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--forest);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${fadeIn} 0.6s ease;
  
  .leaf {
    width: 24px;
    height: 24px;
    fill: var(--sage);
    animation: ${sway} 4s ease-in-out infinite;
  }
  
  span {
    font-style: italic;
    color: var(--sage);
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-light);
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
  animation: ${fadeIn} 0.6s ease;
  animation-delay: ${p => p.$delay}s;
  animation-fill-mode: both;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 1px;
    background: var(--sage);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover {
    color: var(--forest);
    
    &::after {
      width: 100%;
    }
  }
`;

const DateBadge = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--forest);
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--sage-light);
  border-radius: 30px;
  background: rgba(255,255,255,0.5);
  animation: ${fadeIn} 0.6s ease;
  animation-delay: 0.4s;
  animation-fill-mode: both;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
  
  span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--forest);
    transition: all 0.3s ease;
    border-radius: 2px;
  }
  
  @media (max-width: 900px) {
    display: flex;
  }
  
  ${p => p.$open && `
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  `}
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--cream);
  z-index: 999;
  padding: 6rem 2rem 2rem;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.4s ease;
  
  @media (max-width: 900px) {
    display: flex;
  }
`;

const MobileNavLink = styled.a`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--forest);
  text-decoration: none;
  opacity: ${p => p.$open ? 1 : 0};
  transform: translateY(${p => p.$open ? 0 : '20px'});
  transition: all 0.4s ease;
  transition-delay: ${p => p.$delay}s;
  
  &:hover {
    color: var(--sage);
  }
`;

const LeafSVG = () => (
  <svg viewBox="0 0 24 24" className="leaf">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Navigation({
  coupleNames = 'Olivia & Benjamin',
  weddingDate = '21. Juni 2025',
  links = [],
  showBadge = true,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const defaultLinks = [
    { label: 'Unsere Geschichte', href: '#story' },
    { label: 'Ablauf', href: '#timeline' },
    { label: 'Location', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'FAQ', href: '#faq' },
  ];

  const navItems = links.length > 0 ? links : defaultLinks;

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Container>
          <Logo href="#top">
            <LeafSVG />
            {coupleNames.split(' & ')[0]} <span>&</span> {coupleNames.split(' & ')[1] || coupleNames.split('&')[1]}
          </Logo>
          
          <NavLinks>
            {navItems.map((link, i) => (
              <NavLink 
                key={i} 
                href={link.href} 
                $delay={0.1 + i * 0.05}
              >
                {link.label}
              </NavLink>
            ))}
          </NavLinks>
          
          {showBadge && (
            <DateBadge>{weddingDate}</DateBadge>
          )}
          
          <MobileMenuButton 
            $open={mobileOpen} 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </MobileMenuButton>
        </Container>
      </Nav>

      <MobileMenu $open={mobileOpen}>
        {navItems.map((link, i) => (
          <MobileNavLink 
            key={i} 
            href={link.href}
            $open={mobileOpen}
            $delay={0.1 + i * 0.08}
            onClick={handleLinkClick}
          >
            {link.label}
          </MobileNavLink>
        ))}
      </MobileMenu>
    </>
  );
}

export default Navigation;
