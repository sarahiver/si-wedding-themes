// Contemporary WeddingPage - Main Component
import React, { useState, useEffect } from 'react';
import ContemporaryGlobalStyles from './GlobalStyles';
import LoadingScreen from './LoadingScreen';
import Navigation from './Navigation';
import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Timeline from './Timeline';
import Locations from './Locations';
import Directions from './Directions';
import RSVP from './RSVP';
import Dresscode from './Dresscode';
import Gifts from './Gifts';
import Accommodations from './Accommodations';
import Gallery from './Gallery';
import Guestbook from './Guestbook';
import MusicWishes from './MusicWishes';
import PhotoUpload from './PhotoUpload';
import FAQ from './FAQ';
import WeddingABC from './WeddingABC';
import Contact from './Contact';
import ContactWitnesses from './ContactWitnesses';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard';
import { useWedding } from '../../context/WeddingContext';

function WeddingPage() {
  const { project, isLoading } = useWedding();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

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
        <ContemporaryGlobalStyles />
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
        <ContemporaryGlobalStyles />
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      </>
    );
  }

  return (
    <>
      <ContemporaryGlobalStyles />
      <Navigation />
      <main>
        <Hero />
        <Countdown />
        <LoveStory />
        <Locations />
        <Timeline />
        <RSVP />
        <Dresscode />
        <Gifts />
        <Accommodations />
        <Directions />
        <Gallery />
        <FAQ />
        <WeddingABC />
        <Guestbook />
        <MusicWishes />
        <PhotoUpload />
        <ContactWitnesses />
        <Contact />
      </main>
      <Footer onAdminLogin={() => setShowAdmin(true)} />
    </>
  );
}

export default WeddingPage;
