// Botanical MobileMenu - Clean Fullscreen Navigation
import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--bark-dark);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 2rem;
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(250, 248, 245, 0.1);
  border-radius: 50%;
  color: var(--cream);
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(250, 248, 245, 0.2);
    transform: rotate(90deg);
  }
`;

const NavList = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
`;

const NavLink = styled.a`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 400;
  color: var(--cream);
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${slideIn} 0.5s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  
  &:hover {
    color: var(--gold-light);
  }
`;

const AdminButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--bark-light);
  background: transparent;
  border: 1px solid var(--bark-light);
  border-radius: 2px;
  opacity: 0;
  animation: ${slideIn} 0.5s ease forwards;
  animation-delay: 0.6s;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--cream);
    border-color: var(--cream);
  }
`;

const navItems = [
  { href: '#hero', label: 'Start' },
  { href: '#story', label: 'Unsere Geschichte' },
  { href: '#timeline', label: 'Ablauf' },
  { href: '#gallery', label: 'Galerie' },
  { href: '#rsvp', label: 'Zusagen' },
  { href: '#faq', label: 'FAQ' },
];

function MobileMenu({ onClose, onAdminLogin }) {
  const handleNavClick = () => {
    onClose();
  };

  return (
    <Overlay>
      <Header>
        <CloseButton onClick={onClose}>×</CloseButton>
      </Header>
      
      <NavList>
        {navItems.map((item, i) => (
          <NavLink 
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            $delay={`${0.1 + i * 0.05}s`}
          >
            {item.label}
          </NavLink>
        ))}
        
        <AdminButton onClick={onAdminLogin}>
          Admin
        </AdminButton>
      </NavList>
    </Overlay>
  );
}

export default MobileMenu;
