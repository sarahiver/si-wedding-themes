// Video Theme - WeddingPage with background from Hero section
import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import VideoGlobalStyles from './GlobalStyles';
import HorizontalScroll from './HorizontalScroll';
import LoadingScreen from './LoadingScreen';

import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Timeline from './Timeline';
import Locations from './Locations';
import Gallery from './Gallery';
import RSVP from './RSVP';
import Dresscode from './Dresscode';
import Gifts from './Gifts';
import Accommodations from './Accommodations';
import Directions from './Directions';
import FAQ from './FAQ';
import WeddingABC from './WeddingABC';
import Guestbook from './Guestbook';
import MusicWishes from './MusicWishes';
import PhotoUpload from './PhotoUpload';
import ContactWitnesses from './ContactWitnesses';
import Contact from './Contact';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard';

function WeddingPage() {
  const { project, content, isLoading } = useWedding();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // Get background from hero section (set via HeroEditor)
  const heroContent = content?.hero || {};
  const background = heroContent.background_media || null;
  const backgroundMobile = heroContent.background_media_mobile || null;

  const handleAdminLogin = (username, password) => {
    if (username && password) setShowAdmin(true);
  };

  // Track when data is loaded
  useEffect(() => {
    if (!isLoading) {
      setContentReady(true);
    }
  }, [isLoading]);

  // Show loading screen
  if (showLoading) {
    return (
      <>
        <VideoGlobalStyles />
        <LoadingScreen 
          onLoadComplete={() => setShowLoading(false)}
          isDataReady={contentReady}
        />
      </>
    );
  }

  if (showAdmin) {
    return (
      <>
        <VideoGlobalStyles />
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      </>
    );
  }

  // Define all sections for navigation
  const sections = [
    { id: 'hero', label: 'Start' },
    { id: 'countdown', label: 'Countdown' },
    { id: 'story', label: 'Geschichte' },
    { id: 'timeline', label: 'Ablauf' },
    { id: 'locations', label: 'Location' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'dresscode', label: 'Dresscode' },
    { id: 'gifts', label: 'Geschenke' },
    { id: 'accommodations', label: 'Hotels' },
    { id: 'directions', label: 'Anfahrt' },
    { id: 'faq', label: 'FAQ' },
    { id: 'abc', label: 'ABC' },
    { id: 'guestbook', label: 'Gaestebuch' },
    { id: 'music', label: 'Musik' },
    { id: 'photos', label: 'Fotos' },
    { id: 'witnesses', label: 'Trauzeugen' },
    { id: 'contact', label: 'Kontakt' },
    { id: 'footer', label: 'Ende' },
  ];

  return (
    <>
      <VideoGlobalStyles />
      <HorizontalScroll sections={sections} background={background} backgroundMobile={backgroundMobile}>
        <Hero />
        <Countdown />
        <LoveStory />
        <Timeline />
        <Locations />
        <Gallery />
        <RSVP />
        <Dresscode />
        <Gifts />
        <Accommodations />
        <Directions />
        <FAQ />
        <WeddingABC />
        <Guestbook />
        <MusicWishes />
        <PhotoUpload />
        <ContactWitnesses />
        <Contact />
        <Footer onAdminLogin={handleAdminLogin} />
      </HorizontalScroll>
    </>
  );
}

export default WeddingPage;
