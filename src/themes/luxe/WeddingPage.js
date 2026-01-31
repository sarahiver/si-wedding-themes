import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import LuxeGlobalStyles from './GlobalStyles';

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

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--luxe-void);
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-style: italic;
  color: var(--luxe-slate);
`;

function WeddingPage() {
  const { project, loading } = useWedding();
  const [showAdmin, setShowAdmin] = useState(false);

  const handleAdminLogin = (username, password) => {
    if (username && password) setShowAdmin(true);
  };

  if (loading) {
    return (<><LuxeGlobalStyles /><LoadingScreen>Wird geladen...</LoadingScreen></>);
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
