// WeddingPage.js - Botanical Glass Theme Main Page
import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';

// Core Components
import LoadingScreen from './LoadingScreen';
import BotanicalBackground from './BotanicalBackground';
import Navigation from './Navigation';

// Content Sections
import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Timeline from './Timeline';
import Locations from './Locations';
import Directions from './Directions';
import Accommodations from './Accommodations';
import Dresscode from './Dresscode';

// Interactive Sections
import RSVP from './RSVP';
import Gallery from './Gallery';
import Guestbook from './Guestbook';
import MusicWishes from './MusicWishes';
import PhotoUpload from './PhotoUpload';
import Gifts from './Gifts';

// Info Sections
import FAQ from './FAQ';
import WeddingABC from './WeddingABC';
import Contact from './Contact';
import ContactWitnesses from './ContactWitnesses';
import Footer from './Footer';

function WeddingPage() {
  const { isComponentActive, isLoading, error } = useWedding();
  const [showLoading, setShowLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // Handle data loading state
  useEffect(() => {
    if (!isLoading) {
      // Data is loaded, but keep loading screen for minimum time
      setContentReady(true);
    }
  }, [isLoading]);

  // Handle loading complete (called by LoadingScreen after minimum display time)
  const handleLoadComplete = () => {
    setShowLoading(false);
  };

  // Show error state if data failed to load
  if (error && !isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#040604',
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'Montserrat, sans-serif',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>
            Seite nicht gefunden
          </h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Loading Screen - shows for minimum 2 seconds */}
      {showLoading && (
        <LoadingScreen 
          onLoadComplete={handleLoadComplete}
          isDataReady={contentReady}
        />
      )}
      
      {/* Fixed botanical background with parallax leaves */}
      <BotanicalBackground />
      
      {/* Glass navigation pill */}
      <Navigation />
      
      {/* Main content - render even while loading for smooth transition */}
      <main style={{ 
        position: 'relative', 
        zIndex: 10,
        opacity: showLoading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: showLoading ? 'none' : 'auto'
      }}>
        {/* Hero is always shown */}
        <Hero />
        
        {/* Conditional sections based on admin settings */}
        {isComponentActive('countdown') && <Countdown />}
        {isComponentActive('lovestory') && <LoveStory />}
        {isComponentActive('timeline') && <Timeline />}
        {isComponentActive('locations') && <Locations />}
        {isComponentActive('directions') && <Directions />}
        {isComponentActive('accommodations') && <Accommodations />}
        {isComponentActive('dresscode') && <Dresscode />}
        {isComponentActive('rsvp') && <RSVP />}
        {isComponentActive('gallery') && <Gallery />}
        {isComponentActive('photoupload') && <PhotoUpload />}
        {isComponentActive('guestbook') && <Guestbook />}
        {isComponentActive('musicwishes') && <MusicWishes />}
        {isComponentActive('gifts') && <Gifts />}
        {isComponentActive('faq') && <FAQ />}
        {isComponentActive('weddingabc') && <WeddingABC />}
        {isComponentActive('witnesses') && <ContactWitnesses />}
        {isComponentActive('contact') && <Contact />}
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}

export default WeddingPage;
