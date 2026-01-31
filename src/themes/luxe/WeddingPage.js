import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import LuxeGlobalStyles from './GlobalStyles';
import LoadingScreen from './LoadingScreen';

import Navigation from './Navigation';
import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Timeline from './Timeline';
import Locations from './Locations';
import RSVP from './RSVP';
import Dresscode from './Dresscode';
import Gifts from './Gifts';
import Accommodations from './Accommodations';
import Directions from './Directions';
import Gallery from './Gallery';
import FAQ from './FAQ';
import WeddingABC from './WeddingABC';
import Guestbook from './Guestbook';
import MusicWishes from './MusicWishes';
import PhotoUpload from './PhotoUpload';
import Contact from './Contact';
import ContactWitnesses from './ContactWitnesses';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard';

function WeddingPage() {
  const { project, isLoading } = useWedding();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

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
        <LuxeGlobalStyles />
        <LoadingScreen 
          onLoadComplete={() => setShowLoading(false)}
          isDataReady={contentReady}
        />
      </>
    );
  }

  if (showAdmin) {
    return (<><LuxeGlobalStyles /><AdminDashboard onClose={() => setShowAdmin(false)} /></>);
  }

  return (
    <>
      <LuxeGlobalStyles />
      <Navigation />
      <main>
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
      </main>
      <Footer onAdminLogin={handleAdminLogin} />
    </>
  );
}

export default WeddingPage;
