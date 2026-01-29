// Botanical WeddingPage - S/W Tree Cross-Section Concept
// Content renders inside the holes, overlay provides context
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
  background: #fafafa;
  
  span {
    font-family: var(--font-serif), Georgia, serif;
    font-size: 1.25rem;
    color: #666;
    letter-spacing: 0.1em;
  }
`;

// Scrollable content - sits behind the overlay
const ContentScroller = styled.main`
  position: relative;
  z-index: 1;
  background: #fff;
`;

function WeddingPage() {
  const { project, loading } = useWedding();
  const [currentSection, setCurrentSection] = useState('hero');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const observerRef = useRef(null);

  // Detect which section is in view
  useEffect(() => {
    if (loading) return;
    
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.dataset.section || entry.target.id;
          if (sectionId) {
            setCurrentSection(sectionId);
          }
        }
      });
    }, options);

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const sections = document.querySelectorAll('section[data-section]');
      sections.forEach(section => {
        observerRef.current?.observe(section);
      });
    }, 100);

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
          <span>Laden...</span>
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
      
      {/* Knothole overlay with context provider */}
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
      
      {/* Scrollable content */}
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
