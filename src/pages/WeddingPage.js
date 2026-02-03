// src/pages/WeddingPage.js
// ZENTRALE WeddingPage für alle Themes
// Unterstützt component_order aus Supabase

import { lazy, Suspense, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useWedding } from "../context/WeddingContext"

// ============================================
// THEME-SPECIFIC IMPORTS
// ============================================

// GlobalStyles per Theme
import BotanicalGlobalStyles from "../themes/botanical/GlobalStyles"
import ContemporaryGlobalStyles from "../themes/contemporary/GlobalStyles"
import EditorialGlobalStyles from "../themes/editorial/GlobalStyles"
import LuxeGlobalStyles from "../themes/luxe/GlobalStyles"
import NeonGlobalStyles from "../themes/neon/GlobalStyles"
import VideoGlobalStyles from "../themes/video/GlobalStyles"

// LoadingScreens per Theme
import BotanicalLoadingScreen from "../themes/botanical/LoadingScreen"
import ContemporaryLoadingScreen from "../themes/contemporary/LoadingScreen"
import EditorialLoadingScreen from "../themes/editorial/LoadingScreen"
import LuxeLoadingScreen from "../themes/luxe/LoadingScreen"
import NeonLoadingScreen from "../themes/neon/LoadingScreen"

// Special Components
import BotanicalBackground from "../themes/botanical/BotanicalBackground"

// Video Theme special import
import VideoHorizontalScroll from "../themes/video/HorizontalScroll"

// ============================================
// COMPONENT IMPORTS PER THEME
// ============================================

const themeComponents = {
  botanical: {
    Navigation: lazy(() => import("../themes/botanical/Navigation")),
    Hero: lazy(() => import("../themes/botanical/Hero")),
    Countdown: lazy(() => import("../themes/botanical/Countdown")),
    LoveStory: lazy(() => import("../themes/botanical/LoveStory")),
    Timeline: lazy(() => import("../themes/botanical/Timeline")),
    Locations: lazy(() => import("../themes/botanical/Locations")),
    Directions: lazy(() => import("../themes/botanical/Directions")),
    Accommodations: lazy(() => import("../themes/botanical/Accommodations")),
    RSVP: lazy(() => import("../themes/botanical/RSVP")),
    Gallery: lazy(() => import("../themes/botanical/Gallery")),
    Guestbook: lazy(() => import("../themes/botanical/Guestbook")),
    MusicWishes: lazy(() => import("../themes/botanical/MusicWishes")),
    PhotoUpload: lazy(() => import("../themes/botanical/PhotoUpload")),
    Gifts: lazy(() => import("../themes/botanical/Gifts")),
    Dresscode: lazy(() => import("../themes/botanical/Dresscode")),
    FAQ: lazy(() => import("../themes/botanical/FAQ")),
    WeddingABC: lazy(() => import("../themes/botanical/WeddingABC")),
    ContactWitnesses: lazy(
      () => import("../themes/botanical/ContactWitnesses"),
    ),
    Footer: lazy(() => import("../themes/botanical/Footer")),
  },
  editorial: {
    Navigation: lazy(() => import("../themes/editorial/Navigation")),
    Hero: lazy(() => import("../themes/editorial/Hero")),
    Countdown: lazy(() => import("../themes/editorial/Countdown")),
    LoveStory: lazy(() => import("../themes/editorial/LoveStory")),
    Timeline: lazy(() => import("../themes/editorial/Timeline")),
    Locations: lazy(() => import("../themes/editorial/Locations")),
    Directions: lazy(() => import("../themes/editorial/Directions")),
    Accommodations: lazy(() => import("../themes/editorial/Accommodations")),
    RSVP: lazy(() => import("../themes/editorial/RSVP")),
    Gallery: lazy(() => import("../themes/editorial/Gallery")),
    Guestbook: lazy(() => import("../themes/editorial/Guestbook")),
    MusicWishes: lazy(() => import("../themes/editorial/MusicWishes")),
    PhotoUpload: lazy(() => import("../themes/editorial/PhotoUpload")),
    Gifts: lazy(() => import("../themes/editorial/Gifts")),
    Dresscode: lazy(() => import("../themes/editorial/Dresscode")),
    FAQ: lazy(() => import("../themes/editorial/FAQ")),
    WeddingABC: lazy(() => import("../themes/editorial/WeddingABC")),
    ContactWitnesses: lazy(
      () => import("../themes/editorial/ContactWitnesses"),
    ),
    Footer: lazy(() => import("../themes/editorial/Footer")),
  },
  contemporary: {
    Navigation: lazy(() => import("../themes/contemporary/Navigation")),
    Hero: lazy(() => import("../themes/contemporary/Hero")),
    Countdown: lazy(() => import("../themes/contemporary/Countdown")),
    LoveStory: lazy(() => import("../themes/contemporary/LoveStory")),
    Timeline: lazy(() => import("../themes/contemporary/Timeline")),
    Locations: lazy(() => import("../themes/contemporary/Locations")),
    Directions: lazy(() => import("../themes/contemporary/Directions")),
    Accommodations: lazy(() => import("../themes/contemporary/Accommodations")),
    RSVP: lazy(() => import("../themes/contemporary/RSVP")),
    Gallery: lazy(() => import("../themes/contemporary/Gallery")),
    Guestbook: lazy(() => import("../themes/contemporary/Guestbook")),
    MusicWishes: lazy(() => import("../themes/contemporary/MusicWishes")),
    PhotoUpload: lazy(() => import("../themes/contemporary/PhotoUpload")),
    Gifts: lazy(() => import("../themes/contemporary/Gifts")),
    Dresscode: lazy(() => import("../themes/contemporary/Dresscode")),
    FAQ: lazy(() => import("../themes/contemporary/FAQ")),
    WeddingABC: lazy(() => import("../themes/contemporary/WeddingABC")),
    ContactWitnesses: lazy(
      () => import("../themes/contemporary/ContactWitnesses"),
    ),
    Footer: lazy(() => import("../themes/contemporary/Footer")),
  },
  luxe: {
    Navigation: lazy(() => import("../themes/luxe/Navigation")),
    Hero: lazy(() => import("../themes/luxe/Hero")),
    Countdown: lazy(() => import("../themes/luxe/Countdown")),
    LoveStory: lazy(() => import("../themes/luxe/LoveStory")),
    Timeline: lazy(() => import("../themes/luxe/Timeline")),
    Locations: lazy(() => import("../themes/luxe/Locations")),
    Directions: lazy(() => import("../themes/luxe/Directions")),
    Accommodations: lazy(() => import("../themes/luxe/Accommodations")),
    RSVP: lazy(() => import("../themes/luxe/RSVP")),
    Gallery: lazy(() => import("../themes/luxe/Gallery")),
    Guestbook: lazy(() => import("../themes/luxe/Guestbook")),
    MusicWishes: lazy(() => import("../themes/luxe/MusicWishes")),
    PhotoUpload: lazy(() => import("../themes/luxe/PhotoUpload")),
    Gifts: lazy(() => import("../themes/luxe/Gifts")),
    Dresscode: lazy(() => import("../themes/luxe/Dresscode")),
    FAQ: lazy(() => import("../themes/luxe/FAQ")),
    WeddingABC: lazy(() => import("../themes/luxe/WeddingABC")),
    ContactWitnesses: lazy(() => import("../themes/luxe/ContactWitnesses")),
    Footer: lazy(() => import("../themes/luxe/Footer")),
  },
  neon: {
    Navigation: lazy(() => import("../themes/neon/Navigation")),
    Hero: lazy(() => import("../themes/neon/Hero")),
    Countdown: lazy(() => import("../themes/neon/Countdown")),
    LoveStory: lazy(() => import("../themes/neon/LoveStory")),
    Timeline: lazy(() => import("../themes/neon/Timeline")),
    Locations: lazy(() => import("../themes/neon/Locations")),
    Directions: lazy(() => import("../themes/neon/Directions")),
    Accommodations: lazy(() => import("../themes/neon/Accommodations")),
    RSVP: lazy(() => import("../themes/neon/RSVP")),
    Gallery: lazy(() => import("../themes/neon/Gallery")),
    Guestbook: lazy(() => import("../themes/neon/Guestbook")),
    MusicWishes: lazy(() => import("../themes/neon/MusicWishes")),
    PhotoUpload: lazy(() => import("../themes/neon/PhotoUpload")),
    Gifts: lazy(() => import("../themes/neon/Gifts")),
    Dresscode: lazy(() => import("../themes/neon/Dresscode")),
    FAQ: lazy(() => import("../themes/neon/FAQ")),
    WeddingABC: lazy(() => import("../themes/neon/WeddingABC")),
    ContactWitnesses: lazy(() => import("../themes/neon/ContactWitnesses")),
    Footer: lazy(() => import("../themes/neon/Footer")),
  },
  video: {
    Navigation: lazy(() => import("../themes/video/Navigation")),
    Hero: lazy(() => import("../themes/video/Hero")),
    Countdown: lazy(() => import("../themes/video/Countdown")),
    LoveStory: lazy(() => import("../themes/video/LoveStory")),
    Timeline: lazy(() => import("../themes/video/Timeline")),
    Locations: lazy(() => import("../themes/video/Locations")),
    Directions: lazy(() => import("../themes/video/Directions")),
    Accommodations: lazy(() => import("../themes/video/Accommodations")),
    RSVP: lazy(() => import("../themes/video/RSVP")),
    Gallery: lazy(() => import("../themes/video/Gallery")),
    Guestbook: lazy(() => import("../themes/video/Guestbook")),
    MusicWishes: lazy(() => import("../themes/video/MusicWishes")),
    PhotoUpload: lazy(() => import("../themes/video/PhotoUpload")),
    Gifts: lazy(() => import("../themes/video/Gifts")),
    Dresscode: lazy(() => import("../themes/video/Dresscode")),
    FAQ: lazy(() => import("../themes/video/FAQ")),
    WeddingABC: lazy(() => import("../themes/video/WeddingABC")),
    ContactWitnesses: lazy(() => import("../themes/video/ContactWitnesses")),
    Footer: lazy(() => import("../themes/video/Footer")),
  },
}

// ============================================
// THEME CONFIGURATIONS
// ============================================

const themeConfig = {
  botanical: {
    GlobalStyles: BotanicalGlobalStyles,
    LoadingScreen: BotanicalLoadingScreen,
    background: "#0a0a0a",
    hasSpecialBackground: true,
  },
  editorial: {
    GlobalStyles: EditorialGlobalStyles,
    LoadingScreen: EditorialLoadingScreen,
    background: "#ffffff",
    hasSpecialBackground: false,
  },
  contemporary: {
    GlobalStyles: ContemporaryGlobalStyles,
    LoadingScreen: ContemporaryLoadingScreen,
    background: "#faf8f5",
    hasSpecialBackground: false,
  },
  luxe: {
    GlobalStyles: LuxeGlobalStyles,
    LoadingScreen: LuxeLoadingScreen,
    background: "#0a0a0f",
    hasSpecialBackground: false,
  },
  neon: {
    GlobalStyles: NeonGlobalStyles,
    LoadingScreen: NeonLoadingScreen,
    background: "#0a0a0f",
    hasSpecialBackground: false,
  },
  video: {
    GlobalStyles: VideoGlobalStyles,
    LoadingScreen: null, // Video has inline loading
    background: "#0a0a0a",
    hasSpecialBackground: false,
    isHorizontalScroll: true,
  },
}

// ============================================
// DEFAULT COMPONENT ORDER
// ============================================

const DEFAULT_ORDER = [
  "hero",
  "countdown",
  "lovestory",
  "timeline",
  "locations",
  "directions",
  "accommodations",
  "dresscode",
  "rsvp",
  "gallery",
  "photoupload",
  "guestbook",
  "musicwishes",
  "gifts",
  "witnesses",
  "faq",
  "weddingabc",
]

// ============================================
// PAGE WRAPPER
// ============================================

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${(props) => props.$background || "#0a0a0a"};
`

const LOADING_DELAY = 500

// ============================================
// COMPONENT RENDERER
// ============================================

function ComponentRenderer({ componentId, components, isComponentActive }) {
  const componentMap = {
    hero: { Component: components.Hero, alwaysShow: true },
    countdown: { Component: components.Countdown },
    lovestory: { Component: components.LoveStory },
    timeline: { Component: components.Timeline },
    locations: { Component: components.Locations },
    directions: { Component: components.Directions },
    accommodations: { Component: components.Accommodations },
    dresscode: { Component: components.Dresscode },
    rsvp: { Component: components.RSVP },
    gallery: { Component: components.Gallery },
    photoupload: { Component: components.PhotoUpload },
    guestbook: { Component: components.Guestbook },
    musicwishes: { Component: components.MusicWishes },
    gifts: { Component: components.Gifts },
    witnesses: { Component: components.ContactWitnesses },
    faq: { Component: components.FAQ },
    weddingabc: { Component: components.WeddingABC },
  }

  const config = componentMap[componentId]
  if (!config || !config.Component) return null

  const { Component, alwaysShow } = config

  // Hero always shows, others check isComponentActive
  if (!alwaysShow && !isComponentActive(componentId)) return null

  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  )
}

// ============================================
// VIDEO THEME (Special horizontal scroll)
// ============================================

function VideoWeddingPage() {
  const { project, content, isLoading } = useWedding()
  const components = themeComponents.video

  const heroContent = content?.hero || {}
  const background = heroContent.background_media || null
  const backgroundMobile = heroContent.background_media_mobile || null

  // Video theme sections for navigation
  const sections = [
    { id: "hero", label: "Start" },
    { id: "countdown", label: "Countdown" },
    { id: "story", label: "Geschichte" },
    { id: "timeline", label: "Ablauf" },
    { id: "locations", label: "Location" },
    { id: "gallery", label: "Galerie" },
    { id: "rsvp", label: "RSVP" },
    { id: "dresscode", label: "Dresscode" },
    { id: "gifts", label: "Geschenke" },
    { id: "accommodations", label: "Hotels" },
    { id: "directions", label: "Anfahrt" },
    { id: "faq", label: "FAQ" },
    { id: "abc", label: "ABC" },
    { id: "guestbook", label: "Gaestebuch" },
    { id: "music", label: "Musik" },
    { id: "photos", label: "Fotos" },
    { id: "witnesses", label: "Trauzeugen" },
    { id: "footer", label: "Ende" },
  ]

  if (isLoading) {
    return (
      <>
        <VideoGlobalStyles />
        <PageWrapper
          $background='#0a0a0a'
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-primary)",
            fontSize: "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--video-gray)",
          }}
        >
          Laden...
        </PageWrapper>
      </>
    )
  }

  return (
    <>
      <VideoGlobalStyles />
      <Suspense fallback={null}>
        <VideoHorizontalScroll
          sections={sections}
          background={background}
          backgroundMobile={backgroundMobile}
        >
          <components.Hero />
          <components.Countdown />
          <components.LoveStory />
          <components.Timeline />
          <components.Locations />
          <components.Gallery />
          <components.RSVP />
          <components.Dresscode />
          <components.Gifts />
          <components.Accommodations />
          <components.Directions />
          <components.FAQ />
          <components.WeddingABC />
          <components.Guestbook />
          <components.MusicWishes />
          <components.PhotoUpload />
          <components.ContactWitnesses />
          <components.Footer />
        </VideoHorizontalScroll>
      </Suspense>
    </>
  )
}

// ============================================
// STANDARD WEDDING PAGE (All other themes)
// ============================================

function StandardWeddingPage() {
  const { project, isComponentActive, isLoading, theme } = useWedding()
  const [showLoading, setShowLoading] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  const loadingTimerRef = useRef(null)
  const dataLoadedRef = useRef(false)

  // Loading logic - MUSS vor early return sein (React Hooks Regel)
  useEffect(() => {
    if (isLoading && !dataLoadedRef.current) {
      loadingTimerRef.current = setTimeout(() => {
        if (!dataLoadedRef.current) {
          setShowLoading(true)
        }
      }, LOADING_DELAY)
    }

    if (!isLoading) {
      dataLoadedRef.current = true
      setContentReady(true)

      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
      }
    }

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
      }
    }
  }, [isLoading])

  // WICHTIG: Warte bis project geladen ist bevor Theme-Komponenten geladen werden
  // Sonst wird falsches Theme kurz angezeigt
  if (!project || isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          border: '2px solid rgba(255,255,255,0.1)', 
          borderTopColor: 'rgba(255,255,255,0.4)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Jetzt ist project garantiert geladen - Theme ist korrekt
  const themeName = project.theme || "botanical"
  const config = themeConfig[themeName] || themeConfig.botanical
  const components = themeComponents[themeName] || themeComponents.botanical

  const { GlobalStyles, LoadingScreen, background, hasSpecialBackground } =
    config
  const Navigation = components.Navigation
  const Footer = components.Footer

  // Get component order from Supabase, fallback to default
  const componentOrder = project?.component_order || DEFAULT_ORDER

  // Show loading screen
  if (showLoading && !contentReady && LoadingScreen) {
    return (
      <>
        <GlobalStyles />
        <LoadingScreen
          onLoadComplete={() => setShowLoading(false)}
          isDataReady={contentReady}
        />
      </>
    )
  }

  return (
    <>
      <GlobalStyles />

      {/* Botanical special background */}
      {hasSpecialBackground && themeName === "botanical" && (
        <BotanicalBackground />
      )}

      <PageWrapper $background={background}>
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>

        <main
          style={
            hasSpecialBackground
              ? { position: "relative", zIndex: 10 }
              : undefined
          }
        >
          {/* Render components in order from component_order */}
          {componentOrder.map((componentId) => (
            <ComponentRenderer
              key={componentId}
              componentId={componentId}
              components={components}
              isComponentActive={isComponentActive}
            />
          ))}
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </PageWrapper>
    </>
  )
}

// ============================================
// MAIN EXPORT
// ============================================

function WeddingPage() {
  const { theme } = useWedding()

  // Video theme has completely different layout
  if (theme === "video") {
    return <VideoWeddingPage />
  }

  return <StandardWeddingPage />
}

export default WeddingPage
