// Luxe Navigation - Minimalistisch, Elegant
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.5s ease;
  background: ${p => p.$scrolled ? 'var(--luxe-overlay-light)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(10px)' : 'none'};
`;

const Logo = styled.a`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-style: italic;
  color: ${p => p.$scrolled ? 'var(--luxe-black)' : 'var(--luxe-white)'};
  transition: color 0.5s ease;
`;

const MenuButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  
  span {
    display: block;
    width: 24px;
    height: 1px;
    background: ${p => p.$scrolled ? 'var(--luxe-black)' : 'var(--luxe-white)'};
    transition: all 0.3s ease;
  }
  
  &:hover span {
    background: var(--luxe-gold);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--luxe-black);
  z-index: 999;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.5s ease;
`;

const Menu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: min(400px, 100vw);
  height: 100vh;
  background: var(--luxe-cream);
  z-index: 1001;
  padding: 6rem 3rem 3rem;
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 1.5rem;
  color: var(--luxe-charcoal);
  
  &:hover {
    color: var(--luxe-gold);
  }
`;

const MenuList = styled.ul`
  list-style: none;
`;

const MenuItem = styled.li`
  margin-bottom: 0.5rem;
`;

const MenuLink = styled.a`
  display: block;
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 300;
  color: var(--luxe-charcoal);
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--luxe-sand);
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--luxe-gold);
    padding-left: 1rem;
  }
`;

const MenuFooter = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--luxe-sand);
`;

const MenuDate = styled.p`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
`;

function Navigation() {
  const { project } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const name1 = project?.partner1_name || 'Emma';
  const name2 = project?.partner2_name || 'James';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const menuItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Unsere Geschichte', href: '#story' },
    { label: 'Details', href: '#details' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'RSVP', href: '#rsvp' },
  ];

  const handleClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Logo href="#hero" $scrolled={scrolled}>{name1} & {name2}</Logo>
        <MenuButton onClick={() => setMenuOpen(true)} $scrolled={scrolled} aria-label="Menu">
          <span />
          <span />
        </MenuButton>
      </Nav>
      
      <Overlay $open={menuOpen} onClick={() => setMenuOpen(false)} />
      
      <Menu $open={menuOpen}>
        <CloseButton onClick={() => setMenuOpen(false)} aria-label="Close">×</CloseButton>
        <MenuList>
          {menuItems.map(item => (
            <MenuItem key={item.href}>
              <MenuLink href={item.href} onClick={(e) => handleClick(e, item.href)}>
                {item.label}
              </MenuLink>
            </MenuItem>
          ))}
        </MenuList>
        <MenuFooter>
          <MenuDate>Save the Date</MenuDate>
        </MenuFooter>
      </Menu>
    </>
  );
}

export default Navigation;
