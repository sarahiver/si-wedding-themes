// src/components/marketing/ThemeSwitcher.js
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const SwitcherContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  border-radius: 12px;
  
  ${p => p.$themeId === 'editorial' && css`
    background: rgba(255,255,255,0.95);
    border: 1px solid #E0E0E0;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  `}
  ${p => p.$themeId === 'video' && css`
    background: rgba(10,10,10,0.95);
    border: 1px solid rgba(212,175,55,0.2);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  `}
  ${p => p.$themeId === 'botanical' && css`
    background: rgba(248,246,240,0.95);
    border: 1px solid rgba(139,157,131,0.2);
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    border-radius: 16px;
  `}
  ${p => p.$themeId === 'contemporary' && css`
    background: #FFFFFF;
    border: 3px solid #0D0D0D;
    box-shadow: 8px 8px 0 #0D0D0D;
    border-radius: 0;
  `}
  ${p => p.$themeId === 'luxe' && css`
    background: rgba(10,10,10,0.95);
    border: 1px solid rgba(212,175,55,0.15);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  `}
  ${p => p.$themeId === 'neon' && css`
    background: rgba(10,10,15,0.95);
    border: 1px solid rgba(0,255,255,0.2);
    box-shadow: 0 0 30px rgba(0,255,255,0.1);
  `}
  
  @media (max-width: 600px) {
    bottom: 15px;
    right: 15px;
    padding: 10px;
  }
`;

const Label = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 5px;
  
  ${p => p.$themeId === 'editorial' && css`font-family: 'Inter', sans-serif; color: #999;`}
  ${p => p.$themeId === 'video' && css`font-family: 'Montserrat', sans-serif; color: #D4AF37;`}
  ${p => p.$themeId === 'botanical' && css`font-family: 'Lato', sans-serif; color: #8B9D83;`}
  ${p => p.$themeId === 'contemporary' && css`font-family: 'Space Grotesk', sans-serif; color: #0D0D0D;`}
  ${p => p.$themeId === 'luxe' && css`font-family: 'Montserrat', sans-serif; color: rgba(212,175,55,0.6);`}
  ${p => p.$themeId === 'neon' && css`font-family: 'Space Grotesk', sans-serif; color: #00ffff;`}
`;

const ThemeButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  max-width: 150px;
`;

const ThemeButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }
  
  ${p => p.$active && css`
    border-color: ${p.$themeId === 'neon' ? '#00ffff' : 
                    p.$themeId === 'video' || p.$themeId === 'luxe' ? '#D4AF37' : 
                    p.$themeId === 'botanical' ? '#8B9D83' :
                    p.$themeId === 'contemporary' ? '#FF6B6B' : '#1A1A1A'};
    &::after {
      content: '✓';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: ${p.$buttonTheme === 'video' || p.$buttonTheme === 'neon' || p.$buttonTheme === 'luxe' ? '#FFF' : '#FFF'};
    }
  `}
`;

const themes = [
  { id: 'editorial', color: '#FFFFFF', border: '#E0E0E0' },
  { id: 'video', color: '#B8976A', border: '#B8976A' },
  { id: 'botanical', color: '#8B9D83', border: '#8B9D83' },
  { id: 'contemporary', color: '#FF6B6B', border: '#FF6B6B' },
  { id: 'luxe', color: '#1A1520', border: '#D4AF37' },
  { id: 'neon', color: '#00ffff', border: '#00ffff' },
  { id: 'classic', color: '#C4A87C', border: '#C4A87C' }
];

function ThemeSwitcher() {
  const { currentTheme, switchTheme } = useTheme();

  return (
    <SwitcherContainer $themeId={currentTheme}>
      <Label $themeId={currentTheme}>Theme</Label>
      <ThemeButtons>
        {themes.map(theme => (
          <ThemeButton
            key={theme.id}
            $themeId={currentTheme}
            $buttonTheme={theme.id}
            $active={currentTheme === theme.id}
            onClick={() => switchTheme(theme.id)}
            style={{ 
              background: theme.color,
              borderColor: currentTheme === theme.id ? undefined : theme.border
            }}
            title={theme.id.charAt(0).toUpperCase() + theme.id.slice(1)}
          />
        ))}
      </ThemeButtons>
    </SwitcherContainer>
  );
}

export default ThemeSwitcher;
