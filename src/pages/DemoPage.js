// src/pages/DemoPage.js
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

// Theme-Demos werden von siwedding.de geladen
const MULTI_THEME_BASE = 'https://siwedding.de';

const THEMES = {
  editorial: {
    name: 'Editorial',
    url: `${MULTI_THEME_BASE}/demo?theme=editorial`,
    vibe: 'Zeitlose Magazin-Ästhetik',
    color: '#1a1a1a'
  },
  contemporary: {
    name: 'Contemporary',
    url: `${MULTI_THEME_BASE}/demo?theme=contemporary`,
    vibe: 'Modern & minimalistisch',
    color: '#2d3436'
  },
  botanical: {
    name: 'Botanical',
    url: `${MULTI_THEME_BASE}/demo?theme=botanical`,
    vibe: 'Organisch & natürlich',
    color: '#4a5c4e'
  },
  neon: {
    name: 'Neon',
    url: `${MULTI_THEME_BASE}/demo?theme=neon`,
    vibe: 'Bold & leuchtend',
    color: '#0a0a0f'
  },
  luxe: {
    name: 'Luxe',
    url: `${MULTI_THEME_BASE}/demo?theme=luxe`,
    vibe: 'Opulent & glamourös',
    color: '#1a1a2e'
  },
  video: {
    name: 'Video',
    url: `${MULTI_THEME_BASE}/demo?theme=video`,
    vibe: 'Cineastisch & dramatisch',
    color: '#0d0d0d'
  },
  classic: {
    name: 'Classic',
    url: `${MULTI_THEME_BASE}/demo?theme=classic`,
    vibe: 'Warm & zeitlos',
    color: '#3A3A3A'
  }
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ThemeNav = styled.nav`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ThemeButton = styled.button`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  background: ${p => p.$active ? '#FFFFFF' : 'transparent'};
  color: ${p => p.$active ? '#000000' : '#FFFFFF'};
  border: 1px solid ${p => p.$active ? '#FFFFFF' : 'rgba(255,255,255,0.3)'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.$active ? '#FFFFFF' : 'rgba(255,255,255,0.1)'};
    border-color: #FFFFFF;
  }
`;

const BackButton = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  
  &:hover {
    color: #FFFFFF;
  }
`;

const IframeWrapper = styled.div`
  flex: 1;
  margin-top: 70px;
  position: relative;
  background: ${p => p.$bgColor || '#1a1a1a'};
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: calc(100vh - 70px);
  border: none;
`;

const ThemeInfo = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ThemeName = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 0.25rem;
`;

const ThemeVibe = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

const NoTheme = styled.div`
  flex: 1;
  margin-top: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Inter', sans-serif;
`;

export default function DemoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentThemeId = searchParams.get('theme') || 'editorial';
  const currentTheme = THEMES[currentThemeId];

  const handleThemeChange = (themeId) => {
    setSearchParams({ theme: themeId });
  };

  return (
    <PageWrapper>
      <Header>
        <ThemeNav>
          {Object.entries(THEMES).map(([id, theme]) => (
            <ThemeButton
              key={id}
              $active={id === currentThemeId}
              onClick={() => handleThemeChange(id)}
            >
              {theme.name}
            </ThemeButton>
          ))}
        </ThemeNav>
        
        <BackButton href="/">
          ← Zurück
        </BackButton>
      </Header>

      {currentTheme ? (
        <IframeWrapper $bgColor={currentTheme.color}>
          <StyledIframe 
            src={currentTheme.url} 
            title={`${currentTheme.name} Demo`}
            loading="lazy"
          />
          <ThemeInfo>
            <ThemeName>
              {currentTheme.name}
            </ThemeName>
            <ThemeVibe>{currentTheme.vibe}</ThemeVibe>
          </ThemeInfo>
        </IframeWrapper>
      ) : (
        <NoTheme>
          Theme nicht gefunden
        </NoTheme>
      )}
    </PageWrapper>
  );
}
