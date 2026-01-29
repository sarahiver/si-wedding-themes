// Botanical Tree WeddingPage
// Main component that tracks scroll and renders tree + content
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import BotanicalGlobalStyles from './GlobalStyles';
import TreeOverlay from './TreeOverlay';
import MobileMenu from './MobileMenu';

// Sections
import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Timeline from './Timeline';
import Locations from './Locations';
import Gallery from './Gallery';
import RSVP from './RSVP';
import FAQ from './FAQ';
import WeddingABC from './WeddingABC';
import Guestbook from './Guestbook';
import MusicWishes from './MusicWishes';
import PhotoUpload from './PhotoUpload';
import Dresscode from './Dresscode';
import Gifts from './Gifts';
import Accommodations from './Accommodations';
import Directions from './Directions';
import Contact from './Contact';
import ContactWitnesses from './ContactWitnesses';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard';

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: var(--cream);
`;

const ContentLayer = styled.main`
  position: relative;
  z-index: 10;
`;

const Section = styled.section`
  position: relative;
  min-height: ${p => p.$minHeight || '100vh'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
    min-height: auto;
  }
`;

const MenuButton = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--white);
  border-radius: 50%;
  cursor: pointer;
  z-index: 100;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 1px solid var(--pale);
  
  &:hover { transform: scale(1.1); }
  
  span {
    width: 4px;
    height: 4px;
    background: var(--dark);
    border-radius: 50%;
  }
`;

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--medium);
`;

function WeddingPage() {
  const { project, loading } = useWedding();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const pageRef = useRef(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!pageRef.current) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollTop / docHeight));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <>
        <BotanicalGlobalStyles />
        <LoadingScreen>Laden...</LoadingScreen>
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
      
      <PageWrapper ref={pageRef}>
        {/* Tree illustration in background */}
        <TreeOverlay scrollProgress={scrollProgress} />
        
        {/* Menu button */}
        <MenuButton onClick={() => setShowMenu(true)}>
          <span /><span /><span />
        </MenuButton>
        
        {/* Mobile menu */}
        {showMenu && (
          <MobileMenu 
            onClose={() => setShowMenu(false)}
            onAdminLogin={() => { setShowMenu(false); setShowAdmin(true); }}
          />
        )}
        
        {/* Content sections */}
        <ContentLayer>
          <Section $minHeight="100vh" data-section="hero">
            <Hero />
          </Section>
          
          <Section data-section="countdown">
            <Countdown side="right" />
          </Section>
          
          <Section data-section="story">
            <LoveStory side="left" />
          </Section>
          
          <Section data-section="timeline">
            <Timeline side="right" />
          </Section>
          
          <Section data-section="locations">
            <Locations side="left" />
          </Section>
          
          <Section data-section="gallery">
            <Gallery side="center" />
          </Section>
          
          <Section data-section="rsvp">
            <RSVP side="right" />
          </Section>
          
          <Section data-section="dresscode">
            <Dresscode side="left" />
          </Section>
          
          <Section data-section="gifts">
            <Gifts side="right" />
          </Section>
          
          <Section data-section="faq">
            <FAQ side="left" />
          </Section>
          
          <Section data-section="abc">
            <WeddingABC side="right" />
          </Section>
          
          <Section data-section="accommodations">
            <Accommodations side="left" />
          </Section>
          
          <Section data-section="directions">
            <Directions side="right" />
          </Section>
          
          <Section data-section="guestbook">
            <Guestbook side="left" />
          </Section>
          
          <Section data-section="music">
            <MusicWishes side="right" />
          </Section>
          
          <Section data-section="photos">
            <PhotoUpload side="left" />
          </Section>
          
          <Section data-section="witnesses">
            <ContactWitnesses side="right" />
          </Section>
          
          <Section data-section="contact">
            <Contact side="left" />
          </Section>
          
          <Section $minHeight="60vh" data-section="footer">
            <Footer />
          </Section>
        </ContentLayer>
      </PageWrapper>
    </>
  );
}

export default WeddingPage;
