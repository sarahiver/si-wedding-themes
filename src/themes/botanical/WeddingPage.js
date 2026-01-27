import React, { useEffect } from 'react';
import styled from 'styled-components';

// Import all components
import Navigation from './Navigation';
import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Timeline from './Timeline';
import Locations from './Locations';
import Directions from './Directions';
import Accommodations from './Accommodations';
import Dresscode from './Dresscode';
import Gallery from './Gallery';
import Gifts from './Gifts';
import RSVP from './RSVP';
import MusicWishes from './MusicWishes';
import PhotoUpload from './PhotoUpload';
import Guestbook from './Guestbook';
import WeddingABC from './WeddingABC';
import FAQ from './FAQ';
import Contact from './Contact';
import Footer from './Footer';

/* ═══════════════════════════════════════════════════════════════════════════
   WEDDING PAGE - BOTANICAL THEME
   Hauptseite die alle Komponenten zusammenfasst
   ═══════════════════════════════════════════════════════════════════════════ */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--cream);
  overflow-x: hidden;
`;

const SmoothScrollAnchor = styled.div`
  scroll-margin-top: 80px;
`;

const WeddingPage = () => {
  // Smooth scroll behavior
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle hash links for smooth scroll
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Initial check for hash in URL
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Navigation items for the menu
  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'Unsere Geschichte' },
    { id: 'timeline', label: 'Tagesablauf' },
    { id: 'locations', label: 'Locations' },
    { id: 'directions', label: 'Anfahrt' },
    { id: 'accommodations', label: 'Unterkünfte' },
    { id: 'dresscode', label: 'Dresscode' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'gifts', label: 'Geschenke' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'music', label: 'Musikwünsche' },
    { id: 'photos', label: 'Fotos hochladen' },
    { id: 'guestbook', label: 'Gästebuch' },
    { id: 'abc', label: 'Hochzeits-ABC' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Kontakt' }
  ];

  return (
    <PageWrapper>
      {/* Navigation */}
      <Navigation items={navigationItems} />

      {/* Hero Section */}
      <SmoothScrollAnchor id="home">
        <Hero />
      </SmoothScrollAnchor>

      {/* Countdown */}
      <Countdown />

      {/* Love Story */}
      <SmoothScrollAnchor id="story">
        <LoveStory />
      </SmoothScrollAnchor>

      {/* Timeline / Tagesablauf */}
      <SmoothScrollAnchor id="timeline">
        <Timeline />
      </SmoothScrollAnchor>

      {/* Locations */}
      <SmoothScrollAnchor id="locations">
        <Locations />
      </SmoothScrollAnchor>

      {/* Directions / Anfahrt */}
      <SmoothScrollAnchor id="directions">
        <Directions />
      </SmoothScrollAnchor>

      {/* Accommodations / Unterkünfte */}
      <SmoothScrollAnchor id="accommodations">
        <Accommodations />
      </SmoothScrollAnchor>

      {/* Dresscode */}
      <SmoothScrollAnchor id="dresscode">
        <Dresscode />
      </SmoothScrollAnchor>

      {/* Gallery */}
      <SmoothScrollAnchor id="gallery">
        <Gallery />
      </SmoothScrollAnchor>

      {/* Gifts / Geschenke */}
      <SmoothScrollAnchor id="gifts">
        <Gifts />
      </SmoothScrollAnchor>

      {/* RSVP */}
      <SmoothScrollAnchor id="rsvp">
        <RSVP />
      </SmoothScrollAnchor>

      {/* Music Wishes */}
      <SmoothScrollAnchor id="music">
        <MusicWishes />
      </SmoothScrollAnchor>

      {/* Photo Upload */}
      <SmoothScrollAnchor id="photos">
        <PhotoUpload />
      </SmoothScrollAnchor>

      {/* Guestbook */}
      <SmoothScrollAnchor id="guestbook">
        <Guestbook />
      </SmoothScrollAnchor>

      {/* Wedding ABC */}
      <SmoothScrollAnchor id="abc">
        <WeddingABC />
      </SmoothScrollAnchor>

      {/* FAQ */}
      <SmoothScrollAnchor id="faq">
        <FAQ />
      </SmoothScrollAnchor>

      {/* Contact */}
      <SmoothScrollAnchor id="contact">
        <Contact />
      </SmoothScrollAnchor>

      {/* Footer */}
      <Footer />
    </PageWrapper>
  );
};

export default WeddingPage;
