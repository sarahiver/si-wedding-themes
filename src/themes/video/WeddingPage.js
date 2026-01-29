// Video Theme - WeddingPage with background from Hero section
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import VideoGlobalStyles from './GlobalStyles';
import HorizontalScroll from './HorizontalScroll';

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

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--video-black);
  font-family: var(--font-primary);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--video-gray);
`;

function WeddingPage() {
  const { project, content, loading } = useWedding();
  const [showAdmin, setShowAdmin] = useState(false);

  // Get background from hero section (set via HeroEditor)
  const heroContent = content?.hero || {};
  const background = heroContent.background_media || null;

  const handleAdminLogin = (username, password) => {
    if (username && password) setShowAdmin(true);
  };

  if (loading) {
    return (
      <>
        <VideoGlobalStyles />
        <LoadingScreen>Laden...</LoadingScreen>
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
      <HorizontalScroll sections={sections} background={background}>
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
