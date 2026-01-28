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
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Sanftes Wabern - organisch wie eine Seifenblase
const gentleWobble = keyframes`
  0%, 100% { 
    transform: translateY(0); 
    border-radius: 50px;
  }
  20% { 
    transform: translateY(-2px); 
    border-radius: 48px 52px 50px 48px;
  }
  40% { 
    transform: translateY(0px); 
    border-radius: 52px 48px 52px 50px;
  }
  60% { 
    transform: translateY(-1px); 
    border-radius: 50px 50px 48px 52px;
  }
  80% { 
    transform: translateY(-2px); 
    border-radius: 48px 52px 50px 50px;
  }
`;

const gentleWobbleCompact = keyframes`
  0%, 100% { 
    transform: translateY(0); 
    border-radius: 30px;
  }
  20% { 
    transform: translateY(-1px); 
    border-radius: 28px 32px 30px 28px;
  }
  40% { 
    transform: translateY(0px); 
    border-radius: 32px 28px 32px 30px;
  }
  60% { 
    transform: translateY(-1px); 
    border-radius: 30px 30px 28px 32px;
  }
  80% { 
    transform: translateY(-1px); 
    border-radius: 28px 32px 30px 30px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const NavWrapper = styled.div`
  position: fixed;
  top: ${p => p.$scrolled ? '1rem' : '1.5rem'};
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  animation: ${fadeIn} 0.8s ease;
  transition: top 0.4s ease;
`;

const Nav = styled.header`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${p => p.$scrolled ? '1.5rem' : '2rem'};
  padding: ${p => p.$scrolled ? '0.6rem 1.5rem' : '0.9rem 2rem'};
  background: ${p => p.$scrolled 
    ? 'rgba(245, 241, 235, 0.95)' 
    : 'rgba(245, 241, 235, 0.88)'
  };
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${p => p.$scrolled 
    ? 'rgba(139, 157, 131, 0.35)' 
    : 'rgba(139, 157, 131, 0.25)'
  };
  box-shadow: ${p => p.$scrolled 
    ? '0 8px 32px rgba(45, 59, 45, 0.15), 0 2px 8px rgba(139, 157, 131, 0.12), inset 0 1px 0 rgba(255,255,255,0.5)' 
    : '0 4px 24px rgba(45, 59, 45, 0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
  };
  animation: ${p => p.$scrolled ? gentleWobbleCompact : gentleWobble} 8s ease-in-out infinite;
  transition: padding 0.4s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, gap 0.4s ease;
`;

const Logo = styled.a`
  font-family: 'Playfair Display', serif;
  font-size: ${p => p.$scrolled ? '1rem' : '1.15rem'};
  font-weight: 400;
  color: var(--forest);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: font-size 0.4s ease;
  white-space: nowrap;
  
  .leaf {
    width: ${p => p.$scrolled ? '18px' : '20px'};
    height: ${p => p.$scrolled ? '18px' : '20px'};
    fill: var(--sage);
    animation: ${sway} 4s ease-in-out infinite;
    transition: width 0.4s ease, height 0.4s ease;
  }
  
  span {
    font-style: italic;
    color: var(--sage);
    margin: 0 0.15em;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: ${p => p.$scrolled ? '1.25rem' : '1.75rem'};
  transition: gap 0.4s ease;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: 'Lato', sans-serif;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-light);
  text-decoration: none;
  position: relative;
  padding: 0.3rem 0;
  transition: color 0.3s ease;
  
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
  font-size: 0.75rem;
  font-style: italic;
  color: var(--sage-dark);
  padding: 0.4rem 0.9rem;
  border-left: 1px solid rgba(139, 157, 131, 0.3);
  margin-left: 0.5rem;
  white-space: nowrap;
  
  @media (max-width: 1000px) {
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
  gap: 4px;
  margin-left: 0.5rem;
  
  span {
    display: block;
    width: 20px;
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
      transform: rotate(45deg) translate(4px, 4px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(4px, -4px);
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
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const defaultLinks = [
    { label: 'Story', href: '#story' },
    { label: 'Ablauf', href: '#timeline' },
    { label: 'Location', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'FAQ', href: '#faq' },
  ];

  const navItems = links.length > 0 ? links : defaultLinks;

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const names = coupleNames.split(/\s*[&+]\s*/);

  return (
    <>
      <NavWrapper $scrolled={scrolled}>
        <Nav $scrolled={scrolled}>
          <Logo href="#top" $scrolled={scrolled}>
            <LeafSVG />
            {names[0]} <span>&</span> {names[1]}
          </Logo>
          
          <NavLinks $scrolled={scrolled}>
            {navItems.map((link, i) => (
              <NavLink key={i} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </NavLinks>
          
          {showBadge && <DateBadge>{weddingDate}</DateBadge>}
          
          <MobileMenuButton 
            $open={mobileOpen} 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </MobileMenuButton>
        </Nav>
      </NavWrapper>

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
