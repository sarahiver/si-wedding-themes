// src/components/marketing/MarketingNav.js
// Theme Switcher + Mobile Burger Menu
import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const THEMES = [
  { id: 'editorial', name: 'Editorial' },
  { id: 'botanical', name: 'Botanical' },
  { id: 'contemporary', name: 'Contemporary' },
  { id: 'luxe', name: 'Luxe' },
  { id: 'neon', name: 'Neon' },
  { id: 'video', name: 'Video' },
];

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = keyframes`from { transform: translateX(100%); } to { transform: translateX(0); }`;

// ============================================
// NAV STYLES
// ============================================
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem clamp(1.5rem, 5vw, 4rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s ease;

  /* Mobile: Immer Hintergrund für bessere Lesbarkeit */
  @media (max-width: 768px) {
    background: ${p => p.$theme === 'contemporary' ? 'rgba(255,255,255,0.95)' : 'rgba(10, 10, 10, 0.95)'};
    backdrop-filter: blur(10px);
    padding: 1rem 1.5rem;
  }

  ${p => p.$scrolled && css`
    background: ${p.$theme === 'contemporary' ? 'rgba(255,255,255,0.95)' : 'rgba(10, 10, 10, 0.95)'};
    backdrop-filter: blur(10px);
    padding: 1rem clamp(1.5rem, 5vw, 4rem);
  `}
  
  ${p => p.$theme === 'botanical' && css`
    top: 1.5rem;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: auto;
    max-width: calc(100% - 3rem);
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    padding: 0.6rem 1.5rem;
    gap: 0.5rem;
    
    @media (max-width: 768px) {
      top: 0;
      left: 0;
      right: 0;
      transform: none;
      max-width: none;
      width: 100%;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(4, 10, 4, 0.95);
      padding: 1rem 1.5rem;
    }
  `}
  
  ${p => p.$theme === 'contemporary' && css`
    padding: 10px clamp(1rem, 3vw, 5%);
    background: transparent;
  `}
`;

const ContemporaryInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  background: #FFFFFF;
  border: 3px solid #0D0D0D;
  padding: 0 20px;
  transition: all 0.3s ease;
  
  ${p => p.$scrolled && css`box-shadow: 6px 6px 0 #FF6B6B;`}
  
  @media (min-width: 600px) {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    height: 50px;
    padding: 0 15px;
  }
`;

// LOGO: S&I. - bold, white, Roboto, letter-spacing -0.06em
const Logo = styled.a`
  font-family: 'Roboto', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.06em;
  text-decoration: none;
  color: #fff;
  background: #000;
  padding: 6px 12px;
  transition: all 0.3s ease;
  
  ${p => p.$theme === 'contemporary' && css`
    background: #0D0D0D;
    color: #fff;
  `}
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 5px 10px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : 'rgba(255,255,255,0.7)'};
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover { 
    color: ${p => p.$theme === 'contemporary' ? '#FF6B6B' : '#fff'}; 
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// ============================================
// THEME SWITCHER
// ============================================

const bounceX = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(6px); }
`;

const hintFadeOut = keyframes`
  to { opacity: 0; visibility: hidden; }
`;

const ThemeHint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${p => {
    switch (p.$theme) {
      case 'editorial': return '#C41E3A';
      case 'botanical': return 'rgba(255,255,255,0.5)';
      case 'contemporary': return '#FF6B6B';
      case 'luxe': return '#C9A962';
      case 'neon': return '#00ffff';
      case 'video': return '#6B8CAE';
      default: return '#C9A962';
    }
  }};
  white-space: nowrap;
  animation: ${p => p.$dismissed ? css`${hintFadeOut} 0.4s ease forwards` : 'none'};

  @media (max-width: 768px) { display: none; }

  span {
    display: inline-block;
    animation: ${bounceX} 1.5s ease-in-out infinite;
  }
`;

const ThemeSwitcherWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  border-left: 1px solid ${p => p.$theme === 'contemporary' ? '#0D0D0D' : 'rgba(255,255,255,0.2)'};
  
  @media (max-width: 768px) { display: none; }
`;

const CurrentThemeBtn = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : '#fff'};
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  
  &::after {
    content: '▼';
    font-size: 0.5rem;
    transition: transform 0.2s ease;
    ${p => p.$open && css`transform: rotate(180deg);`}
  }
  
  &:hover { opacity: 0.8; }
`;

const ThemeDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 140px;
  background: ${p => p.$theme === 'contemporary' ? '#fff' : 'rgba(10, 10, 10, 0.95)'};
  border: ${p => p.$theme === 'contemporary' ? '2px solid #0D0D0D' : '1px solid rgba(255,255,255,0.15)'};
  ${p => p.$theme === 'contemporary' && css`box-shadow: 4px 4px 0 #0D0D0D;`}
  padding: 0.5rem 0;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transform: ${p => p.$open ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  z-index: 100;
`;

const ThemeOption = styled.button`
  display: block;
  width: 100%;
  padding: 0.6rem 1rem;
  text-align: left;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : 'rgba(255,255,255,0.7)'};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.$theme === 'contemporary' ? '#FFE66D' : 'rgba(255,255,255,0.1)'};
    color: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : '#fff'};
  }
`;

// ============================================
// BURGER BUTTON + MOBILE MENU
// ============================================
const BurgerBtn = styled.button`
  background: transparent;
  border: none;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1300;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const BurgerLine = styled.span`
  display: block;
  width: 22px;
  height: 2px;
  background: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : '#fff'};
  position: relative;
  transition: all 0.3s ease;
  
  ${p => p.$open && css`
    background: transparent;
  `}
  
  &::before, &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 22px;
    height: 2px;
    background: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : '#fff'};
    transition: all 0.3s ease;
  }
  
  &::before {
    top: -7px;
    ${p => p.$open && css`
      top: 0;
      transform: rotate(45deg);
    `}
  }
  
  &::after {
    top: 7px;
    ${p => p.$open && css`
      top: 0;
      transform: rotate(-45deg);
    `}
  }
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1100;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1200;
  padding: 100px 2rem 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;

  background-color: ${p => {
    switch(p.$theme) {
      case 'botanical': return '#040604';
      case 'contemporary': return '#FFFFFF';
      case 'luxe': return '#0A0A0A';
      case 'neon': return '#0a0a0f';
      case 'editorial': return '#0A0A0A';
      case 'video': return '#0A0A0A';
      default: return '#0A0A0A';
    }
  }};

  @media (min-width: 769px) {
    display: none !important;
  }
`;

const MobileCloseBtn = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${p => p.$theme === 'contemporary' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'};
  border-radius: ${p => p.$theme === 'contemporary' ? '8px' : p.$theme === 'botanical' ? '50%' : '0'};
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  font-size: 1.25rem;
  line-height: 1;
  color: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : p.$theme === 'neon' ? '#00ffff' : p.$theme === 'luxe' ? '#D4AF37' : 'rgba(255,255,255,0.8)'};
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  padding: 0;

  &:hover {
    border-color: ${p => {
      switch(p.$theme) {
        case 'contemporary': return '#FF6B6B';
        case 'neon': return '#FF006E';
        case 'luxe': return '#D4AF37';
        case 'editorial': return '#C41E3A';
        default: return 'rgba(255,255,255,0.4)';
      }
    }};
    color: ${p => {
      switch(p.$theme) {
        case 'contemporary': return '#FF6B6B';
        case 'neon': return '#FF006E';
        case 'luxe': return '#D4AF37';
        case 'editorial': return '#C41E3A';
        default: return '#fff';
      }
    }};
  }
`;

const MobileNavLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 1rem 0;
  border-bottom: 1px solid ${p => p.$theme === 'contemporary' ? '#E5E5E5' : 'rgba(255,255,255,0.1)'};
  transition: all 0.3s ease;
  
  color: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : 'rgba(255,255,255,0.8)'};
  
  &:hover {
    color: ${p => {
      switch(p.$theme) {
        case 'contemporary': return '#FF6B6B';
        case 'neon': return '#00ffff';
        case 'luxe': return '#C9A962';
        default: return '#fff';
      }
    }};
  }
`;

const MobileThemeSection = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid ${p => p.$theme === 'contemporary' ? '#E5E5E5' : 'rgba(255,255,255,0.1)'};
`;

const MobileThemeTitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${p => p.$theme === 'contemporary' ? '#999' : 'rgba(255,255,255,0.4)'};
  margin-bottom: 1rem;
`;

const MobileThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const MobileThemeBtn = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background: ${p => p.$active 
    ? (p.$theme === 'contemporary' ? '#FFE66D' : 'rgba(255,255,255,0.15)') 
    : (p.$theme === 'contemporary' ? '#F5F5F5' : 'rgba(255,255,255,0.05)')
  };
  
  color: ${p => p.$theme === 'contemporary' ? '#0D0D0D' : 'rgba(255,255,255,0.8)'};
  
  border: ${p => p.$active 
    ? (p.$theme === 'contemporary' ? '2px solid #0D0D0D' : '1px solid rgba(255,255,255,0.3)') 
    : (p.$theme === 'contemporary' ? '1px solid #E5E5E5' : '1px solid rgba(255,255,255,0.1)')
  };
  
  &:hover {
    background: ${p => p.$theme === 'contemporary' ? '#FFE66D' : 'rgba(255,255,255,0.1)'};
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================
const MarketingNav = () => {
  const { currentTheme, setCurrentTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [hintGone, setHintGone] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    setDropdownOpen(false);
    setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navItems = [
    { id: 'features', label: 'Features' },
    { id: 'themes', label: 'Designs' },
    { id: 'pricing', label: 'Preise' },
    { id: 'contact', label: 'Kontakt' },
  ];

  const currentThemeData = THEMES.find(t => t.id === currentTheme);

  const renderNavContent = () => (
    <>
      <Logo href="#" onClick={(e) => handleLinkClick(e, 'hero')} $theme={currentTheme}>
        S&I.
      </Logo>
      
      <NavLinks $theme={currentTheme}>
        {navItems.map(item => (
          <NavLink 
            key={item.id} 
            href={`#${item.id}`} 
            onClick={(e) => handleLinkClick(e, item.id)}
            $theme={currentTheme}
          >
            {item.label}
          </NavLink>
        ))}
      </NavLinks>
      
      <RightSection>
        {!hintGone && (
          <ThemeHint $theme={currentTheme} $dismissed={hintDismissed}>
            Design wechseln <span>→</span>
          </ThemeHint>
        )}
        <ThemeSwitcherWrapper $theme={currentTheme} ref={dropdownRef}>
          <CurrentThemeBtn 
            $theme={currentTheme} 
            $open={dropdownOpen}
            onClick={() => { setDropdownOpen(!dropdownOpen); if (!hintDismissed) { setHintDismissed(true); setTimeout(() => setHintGone(true), 500); } }}
          >
            {currentThemeData?.name || 'Theme'}
          </CurrentThemeBtn>
          <ThemeDropdown $theme={currentTheme} $open={dropdownOpen}>
            {THEMES.filter(t => t.id !== currentTheme).map(t => (
              <ThemeOption 
                key={t.id}
                $theme={currentTheme}
                onClick={() => { setCurrentTheme(t.id); setDropdownOpen(false); }}
              >
                {t.name}
              </ThemeOption>
            ))}
          </ThemeDropdown>
        </ThemeSwitcherWrapper>
        
        <BurgerBtn $theme={currentTheme} onClick={() => setMenuOpen(!menuOpen)}>
          <BurgerLine $theme={currentTheme} $open={menuOpen} />
        </BurgerBtn>
      </RightSection>
    </>
  );

  const renderMobileMenu = () => (
    <>
      <MobileMenuOverlay $open={menuOpen} onClick={() => setMenuOpen(false)} />
      <MobileMenu $theme={currentTheme} $open={menuOpen}>
        <MobileCloseBtn $theme={currentTheme} onClick={() => setMenuOpen(false)}>✕</MobileCloseBtn>
        {navItems.map(item => (
          <MobileNavLink 
            key={item.id} 
            href={`#${item.id}`} 
            onClick={(e) => handleLinkClick(e, item.id)}
            $theme={currentTheme}
          >
            {item.label}
          </MobileNavLink>
        ))}
        
        <MobileThemeSection $theme={currentTheme}>
          <MobileThemeTitle $theme={currentTheme}>Theme wählen</MobileThemeTitle>
          <MobileThemeGrid>
            {THEMES.map(t => (
              <MobileThemeBtn 
                key={t.id}
                $theme={currentTheme}
                $active={t.id === currentTheme}
                onClick={() => { setCurrentTheme(t.id); setMenuOpen(false); }}
              >
                {t.name}
              </MobileThemeBtn>
            ))}
          </MobileThemeGrid>
        </MobileThemeSection>
      </MobileMenu>
    </>
  );

  // Contemporary hat ein inneres Frame
  if (currentTheme === 'contemporary') {
    return (
      <>
        <Nav $theme={currentTheme} $scrolled={scrolled}>
          <ContemporaryInner $scrolled={scrolled}>
            {renderNavContent()}
          </ContemporaryInner>
        </Nav>
        {renderMobileMenu()}
      </>
    );
  }

  return (
    <>
      <Nav $theme={currentTheme} $scrolled={scrolled}>
        {renderNavContent()}
      </Nav>
      {renderMobileMenu()}
    </>
  );
};

export default MarketingNav;
