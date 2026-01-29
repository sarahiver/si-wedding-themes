// Botanical WeddingPage - Knothole Overlay Concept
// Fixed wood frame with organic holes, content scrolls behind
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import BotanicalGlobalStyles from './GlobalStyles';
import KnotholeOverlay from './KnotholeOverlay';

// Components
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
import MobileMenu from './MobileMenu';

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bark-dark);
  
  span {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    color: var(--cream);
    letter-spacing: 0.1em;
  }
`;

// Main scrollable content container
const ContentScroller = styled.main`
  position: relative;
  z-index: 1;
`;

// Map section IDs to knothole configurations
const sectionMap = [
  'hero',
  'countdown', 
  'story',
  'timeline',
  'locations',
  'gallery',
  'rsvp',
  'dresscode',
  'gifts',
  'accommodations',
  'directions',
  'faq',
  'abc',
  'guestbook',
  'music',
  'photos',
  'witnesses',
  'contact',
  'footer'
];

function WeddingPage() {
  const { project, loading } = useWedding();
  const [currentSection, setCurrentSection] = useState('hero');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const observerRef = useRef(null);

  // Detect which section is in view
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.dataset.section;
          if (sectionId) {
            setCurrentSection(sectionId);
          }
        }
      });
    }, options);

    // Observe all sections
    const sections = document.querySelectorAll('section[id], section[data-section]');
    sections.forEach(section => {
      observerRef.current.observe(section);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading]);

  const handleMenuClick = useCallback(() => {
    setShowMenu(true);
  }, []);

  const handleAdminLogin = useCallback(() => {
    setShowMenu(false);
    setShowAdmin(true);
  }, []);

  if (loading) {
    return (
      <>
        <BotanicalGlobalStyles />
        <LoadingScreen>
          <span>Wird geladen...</span>
        </LoadingScreen>
      </>
    );
  }

  if (showAdmin) {
    return (
      <>
        <BotanicalGlobalStyles />
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      </>
    );
  }

  return (
    <>
      <BotanicalGlobalStyles />
      
      {/* Fixed knothole overlay */}
      <KnotholeOverlay 
        currentSection={currentSection} 
        onMenuClick={handleMenuClick}
      />
      
      {/* Mobile menu */}
      {showMenu && (
        <MobileMenu 
          onClose={() => setShowMenu(false)}
          onAdminLogin={handleAdminLogin}
        />
      )}
      
      {/* Scrollable content behind the overlay */}
      <ContentScroller>
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
        <Footer />
      </ContentScroller>
    </>
  );
}

export default WeddingPage;
