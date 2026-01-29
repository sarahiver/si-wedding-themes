// Botanical MobileMenu - Fullscreen navigation overlay
import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 250;
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--dark);
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.3s;
  
  &:hover { transform: rotate(90deg); }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const NavLink = styled.a`
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 400;
  color: var(--dark);
  transition: color 0.2s;
  opacity: 0;
  animation: ${slideIn} 0.5s ease forwards;
  animation-delay: ${p => p.$delay}s;
  
  &:hover { color: var(--light); }
`;

const AdminBtn = styled.button`
  position: absolute;
  bottom: 2rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pale);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0;
  animation: ${slideIn} 0.5s ease 0.8s forwards;
  
  &:hover { color: var(--light); }
`;

const navItems = [
  { label: 'Start', href: '#hero' },
  { label: 'Geschichte', href: '#story' },
  { label: 'Ablauf', href: '#timeline' },
  { label: 'Locations', href: '#locations' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'Zusagen', href: '#rsvp' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontakt', href: '#contact' },
];

function MobileMenu({ onClose, onAdminLogin }) {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Overlay>
      <CloseBtn onClick={onClose}>×</CloseBtn>
      
      <Nav>
        {navItems.map((item, i) => (
          <NavLink 
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            $delay={0.1 + i * 0.05}
          >
            {item.label}
          </NavLink>
        ))}
      </Nav>
      
      <AdminBtn onClick={onAdminLogin}>
        Admin
      </AdminBtn>
    </Overlay>
  );
}

export default MobileMenu;
