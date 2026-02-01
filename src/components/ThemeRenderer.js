// src/components/ThemeRenderer.js
// Dynamically renders the correct theme based on project.theme from Supabase
// NEU: Nutzt component_order für dynamische Reihenfolge

import React from 'react';
import { useWedding } from '../context/WeddingContext';

// ============================================
// EDITORIAL THEME IMPORTS
// ============================================
import EditorialGlobalStyles from '../themes/editorial/GlobalStyles';
import EditorialNavigation from '../themes/editorial/Navigation';
import EditorialHero from '../themes/editorial/Hero';
import EditorialCountdown from '../themes/editorial/Countdown';
import EditorialLoveStory from '../themes/editorial/LoveStory';
import EditorialTimeline from '../themes/editorial/Timeline';
import EditorialLocations from '../themes/editorial/Locations';
import EditorialDirections from '../themes/editorial/Directions';
import EditorialRSVP from '../themes/editorial/RSVP';
import EditorialDresscode from '../themes/editorial/Dresscode';
import EditorialGifts from '../themes/editorial/Gifts';
import EditorialAccommodations from '../themes/editorial/Accommodations';
import EditorialContact from '../themes/editorial/Contact';
import EditorialGallery from '../themes/editorial/Gallery';
import EditorialMusicWishes from '../themes/editorial/MusicWishes';
import EditorialGuestbook from '../themes/editorial/Guestbook';
import EditorialFAQ from '../themes/editorial/FAQ';
import EditorialWeddingABC from '../themes/editorial/WeddingABC';
import EditorialPhotoUpload from '../themes/editorial/PhotoUpload';
import EditorialFooter from '../themes/editorial/Footer';
import EditorialSaveTheDate from '../themes/editorial/SaveTheDate';
import EditorialArchivePage from '../themes/editorial/ArchivePage';

// ============================================
// BOTANICAL THEME IMPORTS
// ============================================
import BotanicalGlobalStyles from '../themes/botanical/GlobalStyles';
import BotanicalNavigation from '../themes/botanical/Navigation';
import BotanicalHero from '../themes/botanical/Hero';
import BotanicalCountdown from '../themes/botanical/Countdown';
import BotanicalLoveStory from '../themes/botanical/LoveStory';
import BotanicalTimeline from '../themes/botanical/Timeline';
import BotanicalLocations from '../themes/botanical/Locations';
import BotanicalDirections from '../themes/botanical/Directions';
import BotanicalRSVP from '../themes/botanical/RSVP';
import BotanicalDresscode from '../themes/botanical/Dresscode';
import BotanicalGifts from '../themes/botanical/Gifts';
import BotanicalAccommodations from '../themes/botanical/Accommodations';
import BotanicalContact from '../themes/botanical/Contact';
import BotanicalGallery from '../themes/botanical/Gallery';
import BotanicalMusicWishes from '../themes/botanical/MusicWishes';
import BotanicalGuestbook from '../themes/botanical/Guestbook';
import BotanicalFAQ from '../themes/botanical/FAQ';
import BotanicalWeddingABC from '../themes/botanical/WeddingABC';
import BotanicalPhotoUpload from '../themes/botanical/PhotoUpload';
import BotanicalFooter from '../themes/botanical/Footer';

// ============================================
// CONTEMPORARY THEME IMPORTS
// ============================================
import ContemporaryGlobalStyles from '../themes/contemporary/GlobalStyles';
import ContemporaryNavigation from '../themes/contemporary/Navigation';
import ContemporaryHero from '../themes/contemporary/Hero';
import ContemporaryCountdown from '../themes/contemporary/Countdown';
import ContemporaryLoveStory from '../themes/contemporary/LoveStory';
import ContemporaryTimeline from '../themes/contemporary/Timeline';
import ContemporaryLocations from '../themes/contemporary/Locations';
import ContemporaryDirections from '../themes/contemporary/Directions';
import ContemporaryRSVP from '../themes/contemporary/RSVP';
import ContemporaryDresscode from '../themes/contemporary/Dresscode';
import ContemporaryGifts from '../themes/contemporary/Gifts';
import ContemporaryAccommodations from '../themes/contemporary/Accommodations';
import ContemporaryContact from '../themes/contemporary/Contact';
import ContemporaryGallery from '../themes/contemporary/Gallery';
import ContemporaryMusicWishes from '../themes/contemporary/MusicWishes';
import ContemporaryGuestbook from '../themes/contemporary/Guestbook';
import ContemporaryFAQ from '../themes/contemporary/FAQ';
import ContemporaryWeddingABC from '../themes/contemporary/WeddingABC';
import ContemporaryPhotoUpload from '../themes/contemporary/PhotoUpload';
import ContemporaryFooter from '../themes/contemporary/Footer';
import ContemporarySaveTheDate from '../themes/contemporary/SaveTheDate';
import ContemporaryArchivePage from '../themes/contemporary/ArchivePage';

// ============================================
// LUXE THEME IMPORTS
// ============================================
import LuxeGlobalStyles from '../themes/luxe/GlobalStyles';
import LuxeNavigation from '../themes/luxe/Navigation';
import LuxeHero from '../themes/luxe/Hero';
import LuxeCountdown from '../themes/luxe/Countdown';
import LuxeLoveStory from '../themes/luxe/LoveStory';
import LuxeTimeline from '../themes/luxe/Timeline';
import LuxeLocations from '../themes/luxe/Locations';
import LuxeDirections from '../themes/luxe/Directions';
import LuxeRSVP from '../themes/luxe/RSVP';
import LuxeDresscode from '../themes/luxe/Dresscode';
import LuxeGifts from '../themes/luxe/Gifts';
import LuxeAccommodations from '../themes/luxe/Accommodations';
import LuxeContact from '../themes/luxe/Contact';
import LuxeGallery from '../themes/luxe/Gallery';
import LuxeMusicWishes from '../themes/luxe/MusicWishes';
import LuxeGuestbook from '../themes/luxe/Guestbook';
import LuxeFAQ from '../themes/luxe/FAQ';
import LuxeWeddingABC from '../themes/luxe/WeddingABC';
import LuxePhotoUpload from '../themes/luxe/PhotoUpload';
import LuxeFooter from '../themes/luxe/Footer';
import LuxeContactWitnesses from '../themes/luxe/ContactWitnesses';
import LuxeSaveTheDate from '../themes/luxe/SaveTheDate';
import LuxeArchivePage from '../themes/luxe/ArchivePage';

// ============================================
// NEON THEME IMPORTS
// ============================================
import NeonGlobalStyles from '../themes/neon/GlobalStyles';
import NeonNavigation from '../themes/neon/Navigation';
import NeonHero from '../themes/neon/Hero';
import NeonCountdown from '../themes/neon/Countdown';
import NeonLoveStory from '../themes/neon/LoveStory';
import NeonTimeline from '../themes/neon/Timeline';
import NeonLocations from '../themes/neon/Locations';
import NeonDirections from '../themes/neon/Directions';
import NeonRSVP from '../themes/neon/RSVP';
import NeonDresscode from '../themes/neon/Dresscode';
import NeonGifts from '../themes/neon/Gifts';
import NeonAccommodations from '../themes/neon/Accommodations';
import NeonContact from '../themes/neon/Contact';
import NeonGallery from '../themes/neon/Gallery';
import NeonMusicWishes from '../themes/neon/MusicWishes';
import NeonGuestbook from '../themes/neon/Guestbook';
import NeonFAQ from '../themes/neon/FAQ';
import NeonWeddingABC from '../themes/neon/WeddingABC';
import NeonPhotoUpload from '../themes/neon/PhotoUpload';
import NeonFooter from '../themes/neon/Footer';
import NeonContactWitnesses from '../themes/neon/ContactWitnesses';
import NeonSaveTheDate from '../themes/neon/SaveTheDate';
import NeonArchivePage from '../themes/neon/ArchivePage';

// ============================================
// VIDEO THEME IMPORTS
// ============================================
import VideoGlobalStyles from '../themes/video/GlobalStyles';
import VideoNavigation from '../themes/video/Navigation';
import VideoHero from '../themes/video/Hero';
import VideoCountdown from '../themes/video/Countdown';
import VideoLoveStory from '../themes/video/LoveStory';
import VideoTimeline from '../themes/video/Timeline';
import VideoLocations from '../themes/video/Locations';
import VideoRSVP from '../themes/video/RSVP';
import VideoDresscode from '../themes/video/Dresscode';
import VideoGifts from '../themes/video/Gifts';
import VideoAccommodations from '../themes/video/Accommodations';
import VideoContact from '../themes/video/Contact';
import VideoGallery from '../themes/video/Gallery';
import VideoMusicWishes from '../themes/video/MusicWishes';
import VideoGuestbook from '../themes/video/Guestbook';
import VideoFAQ from '../themes/video/FAQ';
import VideoWeddingABC from '../themes/video/WeddingABC';
import VideoPhotoUpload from '../themes/video/PhotoUpload';
import VideoFooter from '../themes/video/Footer';

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
    Contact: EditorialContact,
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
    Contact: BotanicalContact,
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
    Contact: ContemporaryContact,
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
    Contact: LuxeContact,
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
    Contact: NeonContact,
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
    Contact: VideoContact,
    Gallery: VideoGallery,
    MusicWishes: VideoMusicWishes,
    Guestbook: VideoGuestbook,
    FAQ: VideoFAQ,
    WeddingABC: VideoWeddingABC,
    PhotoUpload: VideoPhotoUpload,
    Footer: VideoFooter,
  },
};

// ============================================
// DEFAULT COMPONENT ORDER (Fallback)
// ============================================
const DEFAULT_ORDER = [
  'hero', 'countdown', 'lovestory', 'timeline', 'locations',
  'directions', 'accommodations', 'dresscode', 'rsvp', 'gallery',
  'photoupload', 'guestbook', 'musicwishes', 'gifts', 'witnesses',
  'faq', 'weddingabc', 'contact'
];

// ============================================
// COMPONENT RENDER MAP
// Maps component IDs to their render functions
// ============================================
const getComponentRenderer = (componentId, themeComponents, config, content, isComponentActive) => {
  const {
    Hero, Countdown, LoveStory, Timeline, Locations, Directions,
    RSVP, Dresscode, Gifts, Accommodations, Contact, ContactWitnesses,
    Gallery, MusicWishes, Guestbook, FAQ, WeddingABC, PhotoUpload
  } = themeComponents;

  const renderers = {
    hero: () => Hero && (
      <Hero 
        key="hero"
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
    
    countdown: () => isComponentActive('countdown') && Countdown && (
      <Countdown 
        key="countdown"
        config={config} 
        data={config}
        weddingDate={config.countdownDate}
        title={content.countdown?.title}
        showSeconds={content.countdown?.show_seconds}
      />
    ),
    
    lovestory: () => isComponentActive('lovestory') && LoveStory && (
      <LoveStory 
        key="lovestory"
        config={config} 
        data={config} 
        content={content.lovestory}
        title={content.lovestory?.title}
        subtitle={content.lovestory?.subtitle}
        milestones={content.lovestory?.events}
        events={content.lovestory?.events}
      />
    ),
    
    timeline: () => isComponentActive('timeline') && Timeline && (
      <Timeline 
        key="timeline"
        config={config} 
        data={config} 
        content={content.timeline}
        title={content.timeline?.title}
        events={content.timeline?.events}
      />
    ),
    
    locations: () => isComponentActive('locations') && Locations && (
      <Locations 
        key="locations"
        config={config} 
        data={config} 
        content={content.locations}
        title={content.locations?.title}
        locations={content.locations?.locations}
      />
    ),
    
    directions: () => isComponentActive('directions') && Directions && (
      <Directions 
        key="directions"
        config={config} 
        data={config} 
        content={content.directions}
        title={content.directions?.title}
        address={content.directions?.address}
        options={content.directions?.options}
      />
    ),
    
    accommodations: () => isComponentActive('accommodations') && Accommodations && (
      <Accommodations 
        key="accommodations"
        config={config} 
        data={config} 
        content={content.accommodations}
        title={content.accommodations?.title}
        description={content.accommodations?.description}
        hotels={content.accommodations?.hotels}
      />
    ),
    
    dresscode: () => isComponentActive('dresscode') && Dresscode && (
      <Dresscode 
        key="dresscode"
        config={config} 
        data={config} 
        content={content.dresscode}
        title={content.dresscode?.title}
        description={content.dresscode?.description}
        code={content.dresscode?.code}
        colors={content.dresscode?.colors}
      />
    ),
    
    rsvp: () => isComponentActive('rsvp') && RSVP && (
      <RSVP 
        key="rsvp"
        config={config} 
        data={config} 
        content={content.rsvp}
        title={content.rsvp?.title}
        description={content.rsvp?.description}
        deadline={content.rsvp?.deadline}
      />
    ),
    
    gallery: () => isComponentActive('gallery') && Gallery && (
      <Gallery 
        key="gallery"
        config={config} 
        data={config} 
        content={content.gallery}
        title={content.gallery?.title}
        images={content.gallery?.images}
      />
    ),
    
    photoupload: () => isComponentActive('photoupload') && PhotoUpload && (
      <PhotoUpload 
        key="photoupload"
        config={config} 
        data={config} 
        content={content.photoupload}
        title={content.photoupload?.title}
        description={content.photoupload?.description}
      />
    ),
    
    guestbook: () => isComponentActive('guestbook') && Guestbook && (
      <Guestbook 
        key="guestbook"
        config={config} 
        data={config} 
        content={content.guestbook}
        title={content.guestbook?.title}
        description={content.guestbook?.description}
      />
    ),
    
    musicwishes: () => isComponentActive('musicwishes') && MusicWishes && (
      <MusicWishes 
        key="musicwishes"
        config={config} 
        data={config} 
        content={content.musicwishes}
        title={content.musicwishes?.title}
        description={content.musicwishes?.description}
      />
    ),
    
    gifts: () => isComponentActive('gifts') && Gifts && (
      <Gifts 
        key="gifts"
        config={config} 
        data={config} 
        content={content.gifts}
        title={content.gifts?.title}
        description={content.gifts?.description}
        items={content.gifts?.items}
      />
    ),
    
    witnesses: () => isComponentActive('witnesses') && (ContactWitnesses || Contact) && (
      ContactWitnesses 
        ? <ContactWitnesses key="witnesses" config={config} data={config} content={content.witnesses} witnesses={content.witnesses?.persons} />
        : <Contact key="witnesses" config={config} data={config} content={content.witnesses} />
    ),
    
    faq: () => isComponentActive('faq') && FAQ && (
      <FAQ 
        key="faq"
        config={config} 
        data={config} 
        content={content.faq}
        title={content.faq?.title}
        items={content.faq?.questions}
        questions={content.faq?.questions}
      />
    ),
    
    weddingabc: () => isComponentActive('weddingabc') && WeddingABC && (
      <WeddingABC 
        key="weddingabc"
        config={config} 
        data={config} 
        content={content.weddingabc}
        title={content.weddingabc?.title}
        entries={content.weddingabc?.entries}
      />
    ),
    
    contact: () => isComponentActive('contact') && Contact && (
      <Contact key="contact" config={config} data={config} content={content.contact} />
    ),
  };

  return renderers[componentId] || null;
};

// ============================================
// MAIN THEME RENDERER
// ============================================
function ThemeRenderer({ pageType = 'main' }) {
  const { project, content, isComponentActive } = useWedding();
  
  // Get theme name, fallback to editorial
  const themeName = project?.theme || 'editorial';
  const themeComponents = themes[themeName] || themes.editorial;
  
  // Extract GlobalStyles
  const GlobalStyles = themeComponents.GlobalStyles;
  
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
    heroTagline: content?.hero?.tagline || 'Wir heiraten',
    heroImage: content?.hero?.background_image,
    weddingDateDisplay: project?.wedding_date 
      ? new Date(project.wedding_date).toLocaleDateString('de-DE', { 
          day: 'numeric', month: 'long', year: 'numeric' 
        })
      : 'Datum folgt',
    navItems: project?.active_components || [],
  };

  // Handle Save The Date page
  if (pageType === 'std') {
    const SaveTheDate = themeComponents.SaveTheDate;
    if (!SaveTheDate) {
      return <div>Save The Date nicht verfügbar für dieses Theme</div>;
    }
    return (
      <>
        <GlobalStyles />
        <SaveTheDate config={config} data={config} />
      </>
    );
  }

  // Handle Archive page
  if (pageType === 'archive') {
    const ArchivePage = themeComponents.ArchivePage;
    if (!ArchivePage) {
      return <div>Archiv-Seite nicht verfügbar für dieses Theme</div>;
    }
    return (
      <>
        <GlobalStyles />
        <ArchivePage config={config} data={config} />
      </>
    );
  }

  // Main wedding page
  const { Navigation, Footer } = themeComponents;
  
  // NEU: Hole component_order aus project, Fallback auf DEFAULT_ORDER
  const componentOrder = project?.component_order || DEFAULT_ORDER;

  return (
    <>
      <GlobalStyles />
      <Navigation sections={config.navItems} config={config} data={config} />
      
      <main>
        {/* Render Komponenten in der Reihenfolge aus component_order */}
        {componentOrder.map(componentId => {
          const renderer = getComponentRenderer(
            componentId, 
            themeComponents, 
            config, 
            content, 
            isComponentActive
          );
          return renderer ? renderer() : null;
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
  );
}

// ============================================
// GET GLOBAL STYLES BY THEME NAME
// ============================================
export function getGlobalStylesByTheme(themeName) {
  return themes[themeName]?.GlobalStyles || themes.editorial.GlobalStyles;
}

export default ThemeRenderer;
