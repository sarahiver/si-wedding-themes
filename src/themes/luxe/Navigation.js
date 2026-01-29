// Luxe Navigation - Minimal Dark with Fullscreen Menu
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const revealText = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem var(--section-padding-x);
  display: flex;
  justify-content: space-between;
  align-items: center;
  mix-blend-mode: ${p => p.$menuOpen ? 'normal' : 'difference'};
  transition: mix-blend-mode 0.3s ease;
`;

const Logo = styled.a`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--luxe-cream);
  letter-spacing: 0.02em;
  z-index: 1001;
`;

const MenuToggle = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  z-index: 1001;
`;

const MenuLine = styled.span`
  display: block;
  width: 24px;
  height: 1px;
  background: var(--luxe-cream);
  transition: all 0.4s var(--ease-out-expo);
  
  &:first-child {
    transform: ${p => p.$open ? 'rotate(45deg) translateY(0.5px)' : 'translateY(-4px)'};
  }
  
  &:last-child {
    transform: ${p => p.$open ? 'rotate(-45deg) translateY(-0.5px)' : 'translateY(4px)'};
  }
`;

const FullscreenMenu = styled.div`
  position: fixed;
  inset: 0;
  background: var(--luxe-void);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: opacity 0.6s var(--ease-out-expo), visibility 0.6s;
`;

const MenuContent = styled.div`
  text-align: center;
`;

const MenuList = styled.ul`
  list-style: none;
  margin-bottom: 3rem;
`;

const MenuItem = styled.li`
  overflow: hidden;
  margin: 0.5rem 0;
`;

const MenuLink = styled.a`
  display: inline-block;
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-cream);
  padding: 0.5rem 0;
  transform: translateY(${p => p.$open ? '0' : '100%'});
  transition: transform 0.8s var(--ease-out-expo), color 0.3s ease;
  transition-delay: ${p => p.$delay || '0s'};
  
  &:hover {
    color: var(--luxe-gold);
  }
`;

const MenuFooter = styled.div`
  opacity: ${p => p.$open ? 1 : 0};
  transform: translateY(${p => p.$open ? '0' : '20px'});
  transition: all 0.8s var(--ease-out-expo);
  transition-delay: 0.5s;
`;

const MenuDate = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-slate);
`;

function Navigation() {
  const { project } = useWedding();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const name1 = project?.partner1_name || 'A';
  const name2 = project?.partner2_name || 'B';

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const menuItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Unsere Geschichte', href: '#story' },
    { label: 'Der Tag', href: '#timeline' },
    { label: 'Location', href: '#locations' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'RSVP', href: '#rsvp' },
  ];

  const handleClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  return (
    <>
      <Nav $menuOpen={menuOpen}>
        <Logo href="#hero">{name1[0]} & {name2[0]}</Logo>
        <MenuToggle onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <MenuLine $open={menuOpen} />
          <MenuLine $open={menuOpen} />
        </MenuToggle>
      </Nav>
      
      <FullscreenMenu $open={menuOpen}>
        <MenuContent>
          <MenuList>
            {menuItems.map((item, i) => (
              <MenuItem key={item.href}>
                <MenuLink 
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  $open={menuOpen}
                  $delay={`${0.1 + i * 0.05}s`}
                >
                  {item.label}
                </MenuLink>
              </MenuItem>
            ))}
          </MenuList>
          <MenuFooter $open={menuOpen}>
            <MenuDate>Save the Date</MenuDate>
          </MenuFooter>
        </MenuContent>
      </FullscreenMenu>
    </>
  );
}

export default Navigation;
