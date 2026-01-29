import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import BotanicalGlobalStyles from './GlobalStyles';

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
  flex-direction: column;
  gap: 1rem;
  background: var(--botanical-cream);
  font-family: var(--font-handwritten);
  font-size: 2rem;
  color: var(--botanical-sage);
`;

const LoadingEmoji = styled.span`
  font-size: 3rem;
  animation: bounce 1s ease infinite;
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

function WeddingPage() {
  const { project, loading } = useWedding();
  const [showAdmin, setShowAdmin] = useState(false);

  const handleAdminLogin = (username, password) => {
    if (username && password) setShowAdmin(true);
  };

  if (loading) {
    return (
      <>
        <BotanicalGlobalStyles />
        <LoadingScreen>
          <LoadingEmoji>🌿</LoadingEmoji>
          Wird geladen...
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
