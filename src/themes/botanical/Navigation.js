// Botanical Navigation - Organic with Leaf Decorations
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(5deg); }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${p => p.$scrolled ? 'rgba(250, 248, 245, 0.95)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${p => p.$scrolled ? '0 2px 20px rgba(75, 93, 65, 0.1)' : 'none'};
  transition: all 0.4s ease;
`;

const Logo = styled.a`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--botanical-forest);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    animation: ${float} 2s ease-in-out infinite;
  }
`;

const MenuButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: ${p => p.$open ? 'var(--botanical-sage)' : 'transparent'};
  border-radius: 8px;
  transition: all 0.3s ease;
  
  span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--botanical-forest);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  ${p => p.$open && `
    span:first-child { transform: rotate(45deg) translateY(5px); }
    span:last-child { transform: rotate(-45deg) translateY(-5px); }
  `}
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(75, 93, 65, 0.3);
  backdrop-filter: blur(5px);
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.4s ease;
  z-index: 998;
`;

const Menu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: min(380px, 90vw);
  height: 100vh;
  background: var(--botanical-cream);
  z-index: 999;
  padding: 5rem 2rem 2rem;
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow-y: auto;
  
  /* Decorative leaf pattern */
  &::before {
    content: '🌿';
    position: absolute;
    top: 2rem;
    left: 2rem;
    font-size: 2rem;
    opacity: 0.3;
  }
`;

const MenuList = styled.ul`
  list-style: none;
`;

const MenuItem = styled.li`
  margin-bottom: 0.5rem;
  opacity: ${p => p.$open ? 1 : 0};
  transform: translateX(${p => p.$open ? '0' : '20px'});
  transition: all 0.4s ease;
  transition-delay: ${p => p.$delay};
`;

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-handwritten);
  font-size: 1.75rem;
  color: var(--botanical-forest);
  padding: 0.75rem 0;
  border-bottom: 2px dashed var(--botanical-mint);
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--botanical-sage);
    padding-left: 1rem;
    
    span { transform: rotate(20deg); }
  }
  
  span {
    transition: transform 0.3s ease;
  }
`;

const MenuFooter = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--botanical-mint);
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FooterLeaf = styled.span`
  font-size: 1.5rem;
  animation: ${float} ${p => 2 + p.$i * 0.3}s ease-in-out infinite;
  animation-delay: ${p => p.$i * 0.2}s;
`;

function Navigation() {
  const { project } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const name1 = project?.partner1_name || 'E';
  const name2 = project?.partner2_name || 'N';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const menuItems = [
    { label: 'Home', href: '#hero', icon: '🏡' },
    { label: 'Unsere Geschichte', href: '#story', icon: '💕' },
    { label: 'Der Tag', href: '#timeline', icon: '📅' },
    { label: 'Location', href: '#locations', icon: '📍' },
    { label: 'Galerie', href: '#gallery', icon: '📸' },
    { label: 'RSVP', href: '#rsvp', icon: '💌' },
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
        <Logo href="#hero">
          <span>🌿</span> {name1} & {name2}
        </Logo>
        <MenuButton onClick={() => setMenuOpen(!menuOpen)} $open={menuOpen} aria-label="Menu">
          <span />
          <span />
        </MenuButton>
      </Nav>
      
      <Overlay $open={menuOpen} onClick={() => setMenuOpen(false)} />
      
      <Menu $open={menuOpen}>
        <MenuList>
          {menuItems.map((item, i) => (
            <MenuItem key={item.href} $open={menuOpen} $delay={`${0.1 + i * 0.05}s`}>
              <MenuLink href={item.href} onClick={(e) => handleClick(e, item.href)}>
                <span>{item.icon}</span>
                {item.label}
              </MenuLink>
            </MenuItem>
          ))}
        </MenuList>
        <MenuFooter>
          {['🌱', '🌿', '🍃', '🌲', '🌳'].map((leaf, i) => (
            <FooterLeaf key={i} $i={i}>{leaf}</FooterLeaf>
          ))}
        </MenuFooter>
      </Menu>
    </>
  );
}

export default Navigation;
