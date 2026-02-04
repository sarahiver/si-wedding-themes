// src/pages/DemoAllPage.js
// Showcase-Seite: Alle Themes mit allen Komponenten
// Zeigt jedes Theme als Sektion mit Demo-Daten

import { lazy, Suspense, useState } from "react"
import styled from "styled-components"

// GlobalStyles per Theme
import BotanicalGlobalStyles from "../themes/botanical/GlobalStyles"
import ContemporaryGlobalStyles from "../themes/contemporary/GlobalStyles"
import EditorialGlobalStyles from "../themes/editorial/GlobalStyles"
import LuxeGlobalStyles from "../themes/luxe/GlobalStyles"
import NeonGlobalStyles from "../themes/neon/GlobalStyles"
import VideoGlobalStyles from "../themes/video/GlobalStyles"

// Demo Context Provider
import { WeddingProvider } from "../context/WeddingContext"

// ============================================
// DEMO SLUG - Ein Demo-Projekt für alle Themes
// Dieses Projekt muss in Supabase existieren mit status=demo
// und allen Komponenten aktiviert
// ============================================

const DEMO_SLUG = "lola-fredi" // Ändere dies auf deinen Demo-Projekt-Slug

// ============================================
// THEME COMPONENTS (Lazy loaded)
// ============================================

const themeComponents = {
  botanical: {
    Hero: lazy(() => import("../themes/botanical/Hero")),
    Countdown: lazy(() => import("../themes/botanical/Countdown")),
    LoveStory: lazy(() => import("../themes/botanical/LoveStory")),
    Timeline: lazy(() => import("../themes/botanical/Timeline")),
    Locations: lazy(() => import("../themes/botanical/Locations")),
    Gallery: lazy(() => import("../themes/botanical/Gallery")),
    RSVP: lazy(() => import("../themes/botanical/RSVP")),
    Dresscode: lazy(() => import("../themes/botanical/Dresscode")),
    FAQ: lazy(() => import("../themes/botanical/FAQ")),
    Gifts: lazy(() => import("../themes/botanical/Gifts")),
    Footer: lazy(() => import("../themes/botanical/Footer")),
  },
  editorial: {
    Hero: lazy(() => import("../themes/editorial/Hero")),
    Countdown: lazy(() => import("../themes/editorial/Countdown")),
    LoveStory: lazy(() => import("../themes/editorial/LoveStory")),
    Timeline: lazy(() => import("../themes/editorial/Timeline")),
    Locations: lazy(() => import("../themes/editorial/Locations")),
    Gallery: lazy(() => import("../themes/editorial/Gallery")),
    RSVP: lazy(() => import("../themes/editorial/RSVP")),
    Dresscode: lazy(() => import("../themes/editorial/Dresscode")),
    FAQ: lazy(() => import("../themes/editorial/FAQ")),
    Gifts: lazy(() => import("../themes/editorial/Gifts")),
    Footer: lazy(() => import("../themes/editorial/Footer")),
  },
  contemporary: {
    Hero: lazy(() => import("../themes/contemporary/Hero")),
    Countdown: lazy(() => import("../themes/contemporary/Countdown")),
    LoveStory: lazy(() => import("../themes/contemporary/LoveStory")),
    Timeline: lazy(() => import("../themes/contemporary/Timeline")),
    Locations: lazy(() => import("../themes/contemporary/Locations")),
    Gallery: lazy(() => import("../themes/contemporary/Gallery")),
    RSVP: lazy(() => import("../themes/contemporary/RSVP")),
    Dresscode: lazy(() => import("../themes/contemporary/Dresscode")),
    FAQ: lazy(() => import("../themes/contemporary/FAQ")),
    Gifts: lazy(() => import("../themes/contemporary/Gifts")),
    Footer: lazy(() => import("../themes/contemporary/Footer")),
  },
  luxe: {
    Hero: lazy(() => import("../themes/luxe/Hero")),
    Countdown: lazy(() => import("../themes/luxe/Countdown")),
    LoveStory: lazy(() => import("../themes/luxe/LoveStory")),
    Timeline: lazy(() => import("../themes/luxe/Timeline")),
    Locations: lazy(() => import("../themes/luxe/Locations")),
    Gallery: lazy(() => import("../themes/luxe/Gallery")),
    RSVP: lazy(() => import("../themes/luxe/RSVP")),
    Dresscode: lazy(() => import("../themes/luxe/Dresscode")),
    FAQ: lazy(() => import("../themes/luxe/FAQ")),
    Gifts: lazy(() => import("../themes/luxe/Gifts")),
    Footer: lazy(() => import("../themes/luxe/Footer")),
  },
  neon: {
    Hero: lazy(() => import("../themes/neon/Hero")),
    Countdown: lazy(() => import("../themes/neon/Countdown")),
    LoveStory: lazy(() => import("../themes/neon/LoveStory")),
    Timeline: lazy(() => import("../themes/neon/Timeline")),
    Locations: lazy(() => import("../themes/neon/Locations")),
    Gallery: lazy(() => import("../themes/neon/Gallery")),
    RSVP: lazy(() => import("../themes/neon/RSVP")),
    Dresscode: lazy(() => import("../themes/neon/Dresscode")),
    FAQ: lazy(() => import("../themes/neon/FAQ")),
    Gifts: lazy(() => import("../themes/neon/Gifts")),
    Footer: lazy(() => import("../themes/neon/Footer")),
  },
  video: {
    Hero: lazy(() => import("../themes/video/Hero")),
    Countdown: lazy(() => import("../themes/video/Countdown")),
    LoveStory: lazy(() => import("../themes/video/LoveStory")),
    Timeline: lazy(() => import("../themes/video/Timeline")),
    Locations: lazy(() => import("../themes/video/Locations")),
    Gallery: lazy(() => import("../themes/video/Gallery")),
    RSVP: lazy(() => import("../themes/video/RSVP")),
    Dresscode: lazy(() => import("../themes/video/Dresscode")),
    FAQ: lazy(() => import("../themes/video/FAQ")),
    Gifts: lazy(() => import("../themes/video/Gifts")),
    Footer: lazy(() => import("../themes/video/Footer")),
  },
}

const themeGlobalStyles = {
  botanical: BotanicalGlobalStyles,
  editorial: EditorialGlobalStyles,
  contemporary: ContemporaryGlobalStyles,
  luxe: LuxeGlobalStyles,
  neon: NeonGlobalStyles,
  video: VideoGlobalStyles,
}

const themeBackgrounds = {
  botanical: "#0a0a0a",
  editorial: "#ffffff",
  contemporary: "#faf8f5",
  luxe: "#0a0a0f",
  neon: "#0a0a0f",
  video: "#0a0a0a",
}

const themeNames = {
  botanical: "Botanical",
  editorial: "Editorial",
  contemporary: "Contemporary",
  luxe: "Luxe",
  neon: "Neon",
  video: "Video",
}

// ============================================
// STYLED COMPONENTS
// ============================================

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  font-family: system-ui, sans-serif;
`

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 1rem 2rem;
`

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  letter-spacing: -0.5px;
`

const ThemeNav = styled.nav`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ThemeButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.$active ? '#fff' : 'rgba(255,255,255,0.2)'};
  background: ${props => props.$active ? '#fff' : 'transparent'};
  color: ${props => props.$active ? '#000' : '#fff'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #fff;
    background: ${props => props.$active ? '#fff' : 'rgba(255,255,255,0.1)'};
  }
`

const ThemeSection = styled.section`
  position: relative;
  background: ${props => props.$background};
  min-height: 100vh;
`

const ThemeHeader = styled.div`
  position: sticky;
  top: 70px;
  z-index: 100;
  background: ${props => props.$dark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.9)'};
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-bottom: 1px solid ${props => props.$dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
`

const ThemeName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${props => props.$dark ? '#fff' : '#000'};
  display: flex;
  align-items: center;
  gap: 0.75rem;

  span {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    background: ${props => props.$dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`

const ComponentList = styled.div`
  padding: 1rem 2rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: ${props => props.$dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
`

const ComponentBadge = styled.span`
  padding: 0.25rem 0.5rem;
  background: ${props => props.$dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  border-radius: 4px;
`

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: rgba(255,255,255,0.3);
  font-size: 0.8rem;
`

// ============================================
// THEME SECTION COMPONENT
// ============================================

function ThemeSectionRenderer({ themeName }) {
  const components = themeComponents[themeName]
  const GlobalStyles = themeGlobalStyles[themeName]
  const background = themeBackgrounds[themeName]
  const isDark = ['botanical', 'luxe', 'neon', 'video'].includes(themeName)

  const componentNames = Object.keys(components)

  return (
    <ThemeSection id={`theme-${themeName}`} $background={background}>
      <GlobalStyles />

      <ThemeHeader $dark={isDark}>
        <ThemeName $dark={isDark}>
          {themeNames[themeName]}
          <span>{componentNames.length} Komponenten</span>
        </ThemeName>
        <ComponentList $dark={isDark}>
          {componentNames.map(name => (
            <ComponentBadge key={name} $dark={isDark}>{name}</ComponentBadge>
          ))}
        </ComponentList>
      </ThemeHeader>

      <WeddingProvider slug={DEMO_SLUG}>
        <Suspense fallback={<LoadingFallback>Lade {themeNames[themeName]}...</LoadingFallback>}>
          {/* Hero */}
          <components.Hero />

          {/* Countdown */}
          <Suspense fallback={null}>
            <components.Countdown />
          </Suspense>

          {/* LoveStory */}
          <Suspense fallback={null}>
            <components.LoveStory />
          </Suspense>

          {/* Timeline */}
          <Suspense fallback={null}>
            <components.Timeline />
          </Suspense>

          {/* Locations */}
          <Suspense fallback={null}>
            <components.Locations />
          </Suspense>

          {/* Gallery */}
          <Suspense fallback={null}>
            <components.Gallery />
          </Suspense>

          {/* RSVP */}
          <Suspense fallback={null}>
            <components.RSVP />
          </Suspense>

          {/* Dresscode */}
          <Suspense fallback={null}>
            <components.Dresscode />
          </Suspense>

          {/* Gifts */}
          <Suspense fallback={null}>
            <components.Gifts />
          </Suspense>

          {/* FAQ */}
          <Suspense fallback={null}>
            <components.FAQ />
          </Suspense>

          {/* Footer */}
          <Suspense fallback={null}>
            <components.Footer />
          </Suspense>
        </Suspense>
      </WeddingProvider>
    </ThemeSection>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

function DemoAllPage() {
  const [activeTheme, setActiveTheme] = useState(null)
  const themes = Object.keys(themeComponents)

  const scrollToTheme = (themeName) => {
    setActiveTheme(themeName)
    const element = document.getElementById(`theme-${themeName}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <PageWrapper>
      <Header>
        <HeaderTitle>S&I Component Showcase</HeaderTitle>
        <ThemeNav>
          {themes.map(themeName => (
            <ThemeButton
              key={themeName}
              $active={activeTheme === themeName}
              onClick={() => scrollToTheme(themeName)}
            >
              {themeNames[themeName]}
            </ThemeButton>
          ))}
        </ThemeNav>
      </Header>

      {themes.map(themeName => (
        <ThemeSectionRenderer
          key={themeName}
          themeName={themeName}
        />
      ))}
    </PageWrapper>
  )
}

export default DemoAllPage
