import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const Nav = styled.nav`
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 3rem);
  max-width: 1200px;
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: 6px 6px 0 var(--black);
  animation: ${slideDown} 0.5s ease;
  
  @media (max-width: 768px) {
    top: 1rem;
    width: calc(100% - 2rem);
  }
`;

const NavInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const Logo = styled.a`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  
  .ampersand {
    color: var(--coral);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--black);
  padding: 0.6rem 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: var(--yellow);
    border-color: var(--black);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 900px) {
    gap: 0.5rem;
  }
`;

const CTAButton = styled.a`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 0.75rem 1.5rem;
  border: 3px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--black);
  }
  
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 var(--black);
  }
  
  @media (max-width: 500px) {
    padding: 0.6rem 1rem;
    font-size: 0.75rem;
  }
`;

const MobileButton = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  background: var(--yellow);
  border: 3px solid var(--black);
  box-shadow: 3px 3px 0 var(--black);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 var(--black);
  }
  
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 var(--black);
  }
  
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Hamburger = styled.div`
  width: 18px;
  height: 12px;
  position: relative;
  
  span {
    position: absolute;
    width: 100%;
    height: 2px;
    background: var(--black);
    transition: all 0.3s ease;
    
    &:nth-child(1) { 
      top: 0; 
      transform: ${p => p.$open ? 'rotate(45deg) translate(3px, 3px)' : 'none'}; 
    }
    &:nth-child(2) { 
      top: 5px; 
      opacity: ${p => p.$open ? 0 : 1}; 
    }
    &:nth-child(3) { 
      top: 10px; 
      transform: ${p => p.$open ? 'rotate(-45deg) translate(3px, -3px)' : 'none'}; 
    }
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 6rem;
  left: 1rem;
  right: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: 6px 6px 0 var(--black);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transform: translateY(${p => p.$open ? 0 : '-10px'});
  transition: all 0.3s ease;
  z-index: 999;
  
  @media (max-width: 768px) {
    top: 5rem;
  }
`;

const MobileLink = styled.a`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--black);
  padding: 0.75rem 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--yellow);
    border-color: var(--black);
  }
`;

const MobileCTA = styled.a`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 1rem;
  border: 3px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--black);
  }
`;

function Navigation({ 
  coupleNames = 'Sophie & Max', 
  weddingDate = '15.08.2025',
  links = [],
  showBadge = false,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const defaultLinks = [
    { label: 'Story', href: '#story' },
    { label: 'Location', href: '#location' },
    { label: 'Ablauf', href: '#timeline' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ];

  const navLinks = links.length > 0 ? links : defaultLinks;

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  // Parse couple names for styled display
  const names = coupleNames.split(' & ');
  const displayName = names.length === 2 
    ? <>{names[0]} <span className="ampersand">&</span> {names[1]}</>
    : coupleNames;

  return (
    <>
      <Nav>
        <NavInner>
          <Logo href="#">
            {displayName}
          </Logo>
          
          <NavLinks>
            {navLinks.map((link, i) => (
              <NavLink key={i} href={link.href}>{link.label}</NavLink>
            ))}
          </NavLinks>
          
          <RightSection>
            <CTAButton href="#rsvp">RSVP</CTAButton>
            <MobileButton onClick={() => setMobileOpen(!mobileOpen)}>
              <Hamburger $open={mobileOpen}>
                <span /><span /><span />
              </Hamburger>
            </MobileButton>
          </RightSection>
        </NavInner>
      </Nav>
      
      <MobileMenu $open={mobileOpen}>
        {navLinks.map((link, i) => (
          <MobileLink key={i} href={link.href} onClick={() => setMobileOpen(false)}>
            {link.label}
          </MobileLink>
        ))}
        <MobileCTA href="#rsvp" onClick={() => setMobileOpen(false)}>
          RSVP
        </MobileCTA>
      </MobileMenu>
    </>
  );
}

export default Navigation;
