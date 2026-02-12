// src/components/ThemeRenderer.js
// Dynamically renders the correct theme based on project.theme from Supabase
// NEU: Nutzt component_order für dynamische Reihenfolge
// NEU: Unterstützt component_config für individuelle Design-Varianten

import { useWedding } from "../context/WeddingContext"

// ============================================
// VARIANT IMPORTS
// ============================================
import SplitScreenHero from "../variants/hero/SplitScreenHero"

// ============================================
// EDITORIAL THEME IMPORTS
// ============================================
import EditorialAccommodations from "../themes/editorial/Accommodations"
import EditorialArchivePage from "../themes/editorial/ArchivePage"
import EditorialCountdown from "../themes/editorial/Countdown"
import EditorialDirections from "../themes/editorial/Directions"
import EditorialDresscode from "../themes/editorial/Dresscode"
import EditorialFAQ from "../themes/editorial/FAQ"
import EditorialFooter from "../themes/editorial/Footer"
import EditorialGallery from "../themes/editorial/Gallery"
import EditorialGifts from "../themes/editorial/Gifts"
import EditorialGlobalStyles from "../themes/editorial/GlobalStyles"
import EditorialGuestbook from "../themes/editorial/Guestbook"
import EditorialHero from "../themes/editorial/Hero"
import EditorialLocations from "../themes/editorial/Locations"
import EditorialLoveStory from "../themes/editorial/LoveStory"
import EditorialMusicWishes from "../themes/editorial/MusicWishes"
import EditorialNavigation from "../themes/editorial/Navigation"
import EditorialPhotoUpload from "../themes/editorial/PhotoUpload"
import EditorialRSVP from "../themes/editorial/RSVP"
import EditorialSaveTheDate from "../themes/editorial/SaveTheDate"
import EditorialTimeline from "../themes/editorial/Timeline"
import EditorialWeddingABC from "../themes/editorial/WeddingABC"

// ============================================
// BOTANICAL THEME IMPORTS
// ============================================
import BotanicalAccommodations from "../themes/botanical/Accommodations"
import BotanicalCountdown from "../themes/botanical/Countdown"
import BotanicalDirections from "../themes/botanical/Directions"
import BotanicalDresscode from "../themes/botanical/Dresscode"
import BotanicalFAQ from "../themes/botanical/FAQ"
import BotanicalFooter from "../themes/botanical/Footer"
import BotanicalGallery from "../themes/botanical/Gallery"
import BotanicalGifts from "../themes/botanical/Gifts"
import BotanicalGlobalStyles from "../themes/botanical/GlobalStyles"
import BotanicalGuestbook from "../themes/botanical/Guestbook"
import BotanicalHero from "../themes/botanical/Hero"
import BotanicalLocations from "../themes/botanical/Locations"
import BotanicalLoveStory from "../themes/botanical/LoveStory"
import BotanicalMusicWishes from "../themes/botanical/MusicWishes"
import BotanicalNavigation from "../themes/botanical/Navigation"
import BotanicalPhotoUpload from "../themes/botanical/PhotoUpload"
import BotanicalRSVP from "../themes/botanical/RSVP"
import BotanicalTimeline from "../themes/botanical/Timeline"
import BotanicalWeddingABC from "../themes/botanical/WeddingABC"

// ============================================
// CONTEMPORARY THEME IMPORTS
// ============================================
import ContemporaryAccommodations from "../themes/contemporary/Accommodations"
import ContemporaryArchivePage from "../themes/contemporary/ArchivePage"
import ContemporaryCountdown from "../themes/contemporary/Countdown"
import ContemporaryDirections from "../themes/contemporary/Directions"
import ContemporaryDresscode from "../themes/contemporary/Dresscode"
import ContemporaryFAQ from "../themes/contemporary/FAQ"
import ContemporaryFooter from "../themes/contemporary/Footer"
import ContemporaryGallery from "../themes/contemporary/Gallery"
import ContemporaryGifts from "../themes/contemporary/Gifts"
import ContemporaryGlobalStyles from "../themes/contemporary/GlobalStyles"
import ContemporaryGuestbook from "../themes/contemporary/Guestbook"
import ContemporaryHero from "../themes/contemporary/Hero"
import ContemporaryLocations from "../themes/contemporary/Locations"
import ContemporaryLoveStory from "../themes/contemporary/LoveStory"
import ContemporaryMusicWishes from "../themes/contemporary/MusicWishes"
import ContemporaryNavigation from "../themes/contemporary/Navigation"
import ContemporaryPhotoUpload from "../themes/contemporary/PhotoUpload"
import ContemporaryRSVP from "../themes/contemporary/RSVP"
import ContemporarySaveTheDate from "../themes/contemporary/SaveTheDate"
import ContemporaryTimeline from "../themes/contemporary/Timeline"
import ContemporaryWeddingABC from "../themes/contemporary/WeddingABC"

// ============================================
// LUXE THEME IMPORTS
// ============================================
import LuxeAccommodations from "../themes/luxe/Accommodations"
import LuxeArchivePage from "../themes/luxe/ArchivePage"
import LuxeContactWitnesses from "../themes/luxe/ContactWitnesses"
import LuxeCountdown from "../themes/luxe/Countdown"
import LuxeDirections from "../themes/luxe/Directions"
import LuxeDresscode from "../themes/luxe/Dresscode"
import LuxeFAQ from "../themes/luxe/FAQ"
import LuxeFooter from "../themes/luxe/Footer"
import LuxeGallery from "../themes/luxe/Gallery"
import LuxeGifts from "../themes/luxe/Gifts"
import LuxeGlobalStyles from "../themes/luxe/GlobalStyles"
import LuxeGuestbook from "../themes/luxe/Guestbook"
import LuxeHero from "../themes/luxe/Hero"
import LuxeLocations from "../themes/luxe/Locations"
import LuxeLoveStory from "../themes/luxe/LoveStory"
import LuxeMusicWishes from "../themes/luxe/MusicWishes"
import LuxeNavigation from "../themes/luxe/Navigation"
import LuxePhotoUpload from "../themes/luxe/PhotoUpload"
import LuxeRSVP from "../themes/luxe/RSVP"
import LuxeSaveTheDate from "../themes/luxe/SaveTheDate"
import LuxeTimeline from "../themes/luxe/Timeline"
import LuxeWeddingABC from "../themes/luxe/WeddingABC"

// ============================================
// NEON THEME IMPORTS
// ============================================
import NeonAccommodations from "../themes/neon/Accommodations"
import NeonArchivePage from "../themes/neon/ArchivePage"
import NeonContactWitnesses from "../themes/neon/ContactWitnesses"
import NeonCountdown from "../themes/neon/Countdown"
import NeonDirections from "../themes/neon/Directions"
import NeonDresscode from "../themes/neon/Dresscode"
import NeonFAQ from "../themes/neon/FAQ"
import NeonFooter from "../themes/neon/Footer"
import NeonGallery from "../themes/neon/Gallery"
import NeonGifts from "../themes/neon/Gifts"
import NeonGlobalStyles from "../themes/neon/GlobalStyles"
import NeonGuestbook from "../themes/neon/Guestbook"
import NeonHero from "../themes/neon/Hero"
import NeonLocations from "../themes/neon/Locations"
import NeonLoveStory from "../themes/neon/LoveStory"
import NeonMusicWishes from "../themes/neon/MusicWishes"
import NeonNavigation from "../themes/neon/Navigation"
import NeonPhotoUpload from "../themes/neon/PhotoUpload"
import NeonRSVP from "../themes/neon/RSVP"
import NeonSaveTheDate from "../themes/neon/SaveTheDate"
import NeonTimeline from "../themes/neon/Timeline"
import NeonWeddingABC from "../themes/neon/WeddingABC"

// ============================================
// VIDEO THEME IMPORTS
// ============================================
import VideoAccommodations from "../themes/video/Accommodations"
import VideoCountdown from "../themes/video/Countdown"
import VideoDresscode from "../themes/video/Dresscode"
import VideoFAQ from "../themes/video/FAQ"
import VideoFooter from "../themes/video/Footer"
import VideoGallery from "../themes/video/Gallery"
import VideoGifts from "../themes/video/Gifts"
import VideoGlobalStyles from "../themes/video/GlobalStyles"
import VideoGuestbook from "../themes/video/Guestbook"
import VideoHero from "../themes/video/Hero"
import VideoLocations from "../themes/video/Locations"
import VideoLoveStory from "../themes/video/LoveStory"
import VideoMusicWishes from "../themes/video/MusicWishes"
import VideoNavigation from "../themes/video/Navigation"
import VideoPhotoUpload from "../themes/video/PhotoUpload"
import VideoRSVP from "../themes/video/RSVP"
import VideoTimeline from "../themes/video/Timeline"
import VideoWeddingABC from "../themes/video/WeddingABC"

// ============================================
// CLASSIC THEME IMPORTS
// ============================================
import ClassicAccommodations from "../themes/classic/Accommodations"
import ClassicArchivePage from "../themes/classic/ArchivePage"
import ClassicContactWitnesses from "../themes/classic/ContactWitnesses"
import ClassicCountdown from "../themes/classic/Countdown"
import ClassicDirections from "../themes/classic/Directions"
import ClassicDresscode from "../themes/classic/Dresscode"
import ClassicFAQ from "../themes/classic/FAQ"
import ClassicFooter from "../themes/classic/Footer"
import ClassicGallery from "../themes/classic/Gallery"
import ClassicGifts from "../themes/classic/Gifts"
import ClassicGlobalStyles from "../themes/classic/GlobalStyles"
import ClassicGuestbook from "../themes/classic/Guestbook"
import ClassicHero from "../themes/classic/Hero"
import ClassicLocations from "../themes/classic/Locations"
import ClassicLoveStory from "../themes/classic/LoveStory"
import ClassicMusicWishes from "../themes/classic/MusicWishes"
import ClassicNavigation from "../themes/classic/Navigation"
import ClassicPhotoUpload from "../themes/classic/PhotoUpload"
import ClassicRSVP from "../themes/classic/RSVP"
import ClassicSaveTheDate from "../themes/classic/SaveTheDate"
import ClassicTimeline from "../themes/classic/Timeline"
import ClassicWeddingABC from "../themes/classic/WeddingABC"

// ============================================
// THEME REGISTRY
// ============================================
const themes = {
  editorial: {
    GlobalStyles: EditorialGlobalStyles,
    Navigation: EditorialNavigation,
    Hero: EditorialHero,
    Countdown: EditorialCountdown,
    LoveStory: EditorialLoveStory,
    Timeline: EditorialTimeline,
    Locations: EditorialLocations,
    Directions: EditorialDirections,
    RSVP: EditorialRSVP,
    Dresscode: EditorialDresscode,
    Gifts: EditorialGifts,
    Accommodations: EditorialAccommodations,
    Gallery: EditorialGallery,
    MusicWishes: EditorialMusicWishes,
    Guestbook: EditorialGuestbook,
    FAQ: EditorialFAQ,
    WeddingABC: EditorialWeddingABC,
    PhotoUpload: EditorialPhotoUpload,
    Footer: EditorialFooter,
    SaveTheDate: EditorialSaveTheDate,
    ArchivePage: EditorialArchivePage,
  },
  botanical: {
    GlobalStyles: BotanicalGlobalStyles,
    Navigation: BotanicalNavigation,
    Hero: BotanicalHero,
    Countdown: BotanicalCountdown,
    LoveStory: BotanicalLoveStory,
    Timeline: BotanicalTimeline,
    Locations: BotanicalLocations,
    Directions: BotanicalDirections,
    RSVP: BotanicalRSVP,
    Dresscode: BotanicalDresscode,
    Gifts: BotanicalGifts,
    Accommodations: BotanicalAccommodations,
    Gallery: BotanicalGallery,
    MusicWishes: BotanicalMusicWishes,
    Guestbook: BotanicalGuestbook,
    FAQ: BotanicalFAQ,
    WeddingABC: BotanicalWeddingABC,
    PhotoUpload: BotanicalPhotoUpload,
    Footer: BotanicalFooter,
  },
  contemporary: {
    GlobalStyles: ContemporaryGlobalStyles,
    Navigation: ContemporaryNavigation,
    Hero: ContemporaryHero,
    Countdown: ContemporaryCountdown,
    LoveStory: ContemporaryLoveStory,
    Timeline: ContemporaryTimeline,
    Locations: ContemporaryLocations,
    Directions: ContemporaryDirections,
    RSVP: ContemporaryRSVP,
    Dresscode: ContemporaryDresscode,
    Gifts: ContemporaryGifts,
    Accommodations: ContemporaryAccommodations,
    Gallery: ContemporaryGallery,
    MusicWishes: ContemporaryMusicWishes,
    Guestbook: ContemporaryGuestbook,
    FAQ: ContemporaryFAQ,
    WeddingABC: ContemporaryWeddingABC,
    PhotoUpload: ContemporaryPhotoUpload,
    Footer: ContemporaryFooter,
    SaveTheDate: ContemporarySaveTheDate,
    ArchivePage: ContemporaryArchivePage,
  },
  luxe: {
    GlobalStyles: LuxeGlobalStyles,
    Navigation: LuxeNavigation,
    Hero: LuxeHero,
    Countdown: LuxeCountdown,
    LoveStory: LuxeLoveStory,
    Timeline: LuxeTimeline,
    Locations: LuxeLocations,
    Directions: LuxeDirections,
    RSVP: LuxeRSVP,
    Dresscode: LuxeDresscode,
    Gifts: LuxeGifts,
    Accommodations: LuxeAccommodations,
    ContactWitnesses: LuxeContactWitnesses,
    Gallery: LuxeGallery,
    MusicWishes: LuxeMusicWishes,
    Guestbook: LuxeGuestbook,
    FAQ: LuxeFAQ,
    WeddingABC: LuxeWeddingABC,
    PhotoUpload: LuxePhotoUpload,
    Footer: LuxeFooter,
    SaveTheDate: LuxeSaveTheDate,
    ArchivePage: LuxeArchivePage,
  },
  neon: {
    GlobalStyles: NeonGlobalStyles,
    Navigation: NeonNavigation,
    Hero: NeonHero,
    Countdown: NeonCountdown,
    LoveStory: NeonLoveStory,
    Timeline: NeonTimeline,
    Locations: NeonLocations,
    Directions: NeonDirections,
    RSVP: NeonRSVP,
    Dresscode: NeonDresscode,
    Gifts: NeonGifts,
    Accommodations: NeonAccommodations,
    ContactWitnesses: NeonContactWitnesses,
    Gallery: NeonGallery,
    MusicWishes: NeonMusicWishes,
    Guestbook: NeonGuestbook,
    FAQ: NeonFAQ,
    WeddingABC: NeonWeddingABC,
    PhotoUpload: NeonPhotoUpload,
    Footer: NeonFooter,
    SaveTheDate: NeonSaveTheDate,
    ArchivePage: NeonArchivePage,
  },
  video: {
    GlobalStyles: VideoGlobalStyles,
    Navigation: VideoNavigation,
    Hero: VideoHero,
    Countdown: VideoCountdown,
    LoveStory: VideoLoveStory,
    Timeline: VideoTimeline,
    Locations: VideoLocations,
    RSVP: VideoRSVP,
    Dresscode: VideoDresscode,
    Gifts: VideoGifts,
    Accommodations: VideoAccommodations,
    Gallery: VideoGallery,
    MusicWishes: VideoMusicWishes,
    Guestbook: VideoGuestbook,
    FAQ: VideoFAQ,
    WeddingABC: VideoWeddingABC,
    PhotoUpload: VideoPhotoUpload,
    Footer: VideoFooter,
  },
  classic: {
    GlobalStyles: ClassicGlobalStyles,
    Navigation: ClassicNavigation,
    Hero: ClassicHero,
    Countdown: ClassicCountdown,
    LoveStory: ClassicLoveStory,
    Timeline: ClassicTimeline,
    Locations: ClassicLocations,
    Directions: ClassicDirections,
    RSVP: ClassicRSVP,
    Dresscode: ClassicDresscode,
    Gifts: ClassicGifts,
    Accommodations: ClassicAccommodations,
    ContactWitnesses: ClassicContactWitnesses,
    Gallery: ClassicGallery,
    MusicWishes: ClassicMusicWishes,
    Guestbook: ClassicGuestbook,
    FAQ: ClassicFAQ,
    WeddingABC: ClassicWeddingABC,
    PhotoUpload: ClassicPhotoUpload,
    Footer: ClassicFooter,
    SaveTheDate: ClassicSaveTheDate,
    ArchivePage: ClassicArchivePage,
  },
}

// ============================================
// COMPONENT VARIANTS REGISTRY
// Hier werden alternative Designs pro Komponente registriert
// Format: variants[componentId][variantId] = Component
// ============================================
const variants = {
  hero: {
    'split': SplitScreenHero,
  },
  // countdown: {
  //   'round-clock': RoundClockCountdown,
  //   'flip-clock': FlipClockCountdown,
  //   'minimal': MinimalCountdown,
  // },
  // gallery: {
  //   'masonry': MasonryGallery,
  //   'carousel': CarouselGallery,
  //   'lightbox': LightboxGallery,
  // },
}

// Helper: Hole Komponente mit Variant-Fallback
const getComponentWithVariant = (themeComponents, componentName, componentConfig) => {
  const config = componentConfig || {}
  const variantId = config.variant

  // 1. Prüfe ob eine Variante konfiguriert und registriert ist
  if (variantId && variantId !== 'default') {
    const componentVariants = variants[componentName.toLowerCase()]
    if (componentVariants && componentVariants[variantId]) {
      return componentVariants[variantId]
    }
  }

  // 2. Fallback auf Theme-Standard
  return themeComponents[componentName]
}

// ============================================
// DEFAULT COMPONENT ORDER (Fallback)
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
// COMPONENT RENDER MAP
// Maps component IDs to their render functions
// NEU: Unterstützt component_config für Varianten
// ============================================
const getComponentRenderer = (
  componentId,
  themeComponents,
  config,
  content,
  isComponentActive,
  componentConfig = {},
) => {
  // Hole Komponenten mit Variant-Unterstützung
  const Hero = getComponentWithVariant(themeComponents, 'Hero', componentConfig.hero)
  const Countdown = getComponentWithVariant(themeComponents, 'Countdown', componentConfig.countdown)
  const LoveStory = getComponentWithVariant(themeComponents, 'LoveStory', componentConfig.lovestory)
  const Timeline = getComponentWithVariant(themeComponents, 'Timeline', componentConfig.timeline)
  const Locations = getComponentWithVariant(themeComponents, 'Locations', componentConfig.locations)
  const Directions = themeComponents.Directions
  const RSVP = getComponentWithVariant(themeComponents, 'RSVP', componentConfig.rsvp)
  const Dresscode = themeComponents.Dresscode
  const Gifts = themeComponents.Gifts
  const Accommodations = themeComponents.Accommodations
  const ContactWitnesses = themeComponents.ContactWitnesses
  const Gallery = getComponentWithVariant(themeComponents, 'Gallery', componentConfig.gallery)
  const MusicWishes = themeComponents.MusicWishes
  const Guestbook = themeComponents.Guestbook
  const FAQ = themeComponents.FAQ
  const WeddingABC = themeComponents.WeddingABC
  const PhotoUpload = themeComponents.PhotoUpload

  const renderers = {
    hero: () =>
      Hero && (
        <Hero
          key='hero'
          data={config}
          config={config}
          name1={config.name1}
          name2={config.name2}
          date={config.weddingDateDisplay}
          location={config.location}
          eyebrow={config.heroTagline}
          backgroundImage={config.heroImage}
        />
      ),

    countdown: () =>
      isComponentActive("countdown") &&
      Countdown && (
        <Countdown
          key='countdown'
          config={config}
          data={config}
          weddingDate={config.countdownDate}
          title={content.countdown?.title}
          showSeconds={content.countdown?.show_seconds}
        />
      ),

    lovestory: () =>
      isComponentActive("lovestory") &&
      LoveStory && (
        <LoveStory
          key='lovestory'
          config={config}
          data={config}
          content={content.lovestory}
          title={content.lovestory?.title}
          subtitle={content.lovestory?.subtitle}
          milestones={content.lovestory?.events}
          events={content.lovestory?.events}
        />
      ),

    timeline: () =>
      isComponentActive("timeline") &&
      Timeline && (
        <Timeline
          key='timeline'
          config={config}
          data={config}
          content={content.timeline}
          title={content.timeline?.title}
          events={content.timeline?.events}
        />
      ),

    locations: () =>
      isComponentActive("locations") &&
      Locations && (
        <Locations
          key='locations'
          config={config}
          data={config}
          content={content.locations}
          title={content.locations?.title}
          locations={content.locations?.locations}
        />
      ),

    directions: () =>
      isComponentActive("directions") &&
      Directions && (
        <Directions
          key='directions'
          config={config}
          data={config}
          content={content.directions}
          title={content.directions?.title}
          address={content.directions?.address}
          options={content.directions?.options}
        />
      ),

    accommodations: () =>
      isComponentActive("accommodations") &&
      Accommodations && (
        <Accommodations
          key='accommodations'
          config={config}
          data={config}
          content={content.accommodations}
          title={content.accommodations?.title}
          description={content.accommodations?.description}
          hotels={content.accommodations?.hotels}
        />
      ),

    dresscode: () =>
      isComponentActive("dresscode") &&
      Dresscode && (
        <Dresscode
          key='dresscode'
          config={config}
          data={config}
          content={content.dresscode}
          title={content.dresscode?.title}
          description={content.dresscode?.description}
          code={content.dresscode?.code}
          colors={content.dresscode?.colors}
        />
      ),

    rsvp: () =>
      isComponentActive("rsvp") &&
      RSVP && (
        <RSVP
          key='rsvp'
          config={config}
          data={config}
          content={content.rsvp}
          title={content.rsvp?.title}
          description={content.rsvp?.description}
          deadline={content.rsvp?.deadline}
        />
      ),

    gallery: () =>
      isComponentActive("gallery") &&
      Gallery && (
        <Gallery
          key='gallery'
          config={config}
          data={config}
          content={content.gallery}
          title={content.gallery?.title}
          images={content.gallery?.images}
        />
      ),

    photoupload: () =>
      isComponentActive("photoupload") &&
      PhotoUpload && (
        <PhotoUpload
          key='photoupload'
          config={config}
          data={config}
          content={content.photoupload}
          title={content.photoupload?.title}
          description={content.photoupload?.description}
        />
      ),

    guestbook: () =>
      isComponentActive("guestbook") &&
      Guestbook && (
        <Guestbook
          key='guestbook'
          config={config}
          data={config}
          content={content.guestbook}
          title={content.guestbook?.title}
          description={content.guestbook?.description}
        />
      ),

    musicwishes: () =>
      isComponentActive("musicwishes") &&
      MusicWishes && (
        <MusicWishes
          key='musicwishes'
          config={config}
          data={config}
          content={content.musicwishes}
          title={content.musicwishes?.title}
          description={content.musicwishes?.description}
        />
      ),

    gifts: () =>
      isComponentActive("gifts") &&
      Gifts && (
        <Gifts
          key='gifts'
          config={config}
          data={config}
          content={content.gifts}
          title={content.gifts?.title}
          description={content.gifts?.description}
          items={content.gifts?.items}
        />
      ),

    witnesses: () =>
      isComponentActive("witnesses") &&
      ContactWitnesses && (
        <ContactWitnesses
          key='witnesses'
          config={config}
          data={config}
          content={content.witnesses}
          witnesses={content.witnesses?.persons}
        />
      ),

    faq: () =>
      isComponentActive("faq") &&
      FAQ && (
        <FAQ
          key='faq'
          config={config}
          data={config}
          content={content.faq}
          title={content.faq?.title}
          items={content.faq?.questions}
          questions={content.faq?.questions}
        />
      ),

    weddingabc: () =>
      isComponentActive("weddingabc") &&
      WeddingABC && (
        <WeddingABC
          key='weddingabc'
          config={config}
          data={config}
          content={content.weddingabc}
          title={content.weddingabc?.title}
          entries={content.weddingabc?.entries}
        />
      ),

  }

  return renderers[componentId] || null
}

// ============================================
// MAIN THEME RENDERER
// ============================================
function ThemeRenderer({ pageType = "main" }) {
  const { project, content, isComponentActive } = useWedding()

  // Get theme name, fallback to editorial
  const themeName = project?.theme || "editorial"
  const themeComponents = themes[themeName] || themes.editorial

  // Extract GlobalStyles
  const GlobalStyles = themeComponents.GlobalStyles

  // Build config object from project data
  const config = {
    slug: project?.slug,
    coupleName: project?.couple_names,
    name1: project?.partner1_name,
    name2: project?.partner2_name,
    weddingDate: project?.wedding_date,
    countdownDate: project?.wedding_date,
    location: project?.location,
    hashtag: project?.hashtag,
    heroTagline: content?.hero?.tagline || "Wir heiraten",
    heroImage: content?.hero?.background_image,
    weddingDateDisplay: project?.wedding_date
      ? new Date(project.wedding_date).toLocaleDateString("de-DE", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Datum folgt",
    navItems: project?.active_components || [],
  }

  // Handle Save The Date page
  if (pageType === "std") {
    const SaveTheDate = themeComponents.SaveTheDate
    if (!SaveTheDate) {
      return <div>Save The Date nicht verfügbar für dieses Theme</div>
    }
    return (
      <>
        <GlobalStyles />
        <SaveTheDate config={config} data={config} />
      </>
    )
  }

  // Handle Archive page
  if (pageType === "archive") {
    const ArchivePage = themeComponents.ArchivePage
    if (!ArchivePage) {
      return <div>Archiv-Seite nicht verfügbar für dieses Theme</div>
    }
    return (
      <>
        <GlobalStyles />
        <ArchivePage config={config} data={config} />
      </>
    )
  }

  // Main wedding page
  const { Navigation, Footer } = themeComponents

  // NEU: Hole component_order aus project, Fallback auf DEFAULT_ORDER
  const componentOrder = project?.component_order || DEFAULT_ORDER

  // NEU: Hole component_config für individuelle Design-Varianten
  const componentConfig = project?.component_config || {}

  return (
    <>
      <GlobalStyles />
      <Navigation sections={config.navItems} config={config} data={config} />

      <main>
        {/* Render Komponenten in der Reihenfolge aus component_order */}
        {/* NEU: component_config wird für Varianten-Unterstützung übergeben */}
        {componentOrder.map((componentId) => {
          const renderer = getComponentRenderer(
            componentId,
            themeComponents,
            config,
            content,
            isComponentActive,
            componentConfig,
          )
          return renderer ? renderer() : null
        })}
      </main>

      <Footer
        config={config}
        data={config}
        coupleNames={config.coupleName}
        content={content.footer}
        slug={config.slug}
      />
    </>
  )
}

// ============================================
// GET GLOBAL STYLES BY THEME NAME
// ============================================
export function getGlobalStylesByTheme(themeName) {
  return themes[themeName]?.GlobalStyles || themes.editorial.GlobalStyles
}

export default ThemeRenderer
