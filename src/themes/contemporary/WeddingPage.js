// Contemporary WeddingPage - Main Component
import React, { useState } from 'react';
import ContemporaryGlobalStyles from './GlobalStyles';
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
  const { project, loading } = useWedding();
  const [showAdmin, setShowAdmin] = useState(false);

  if (loading) {
    return (
      <>
        <ContemporaryGlobalStyles />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--white)',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--coral)',
            border: '4px solid var(--black)',
            boxShadow: '8px 8px 0 var(--black)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💍</div>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'var(--white)',
              textTransform: 'uppercase'
            }}>
              Loading...
            </div>
          </div>
        </div>
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
