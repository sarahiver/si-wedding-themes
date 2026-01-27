import React, { useState } from 'react';

// Components
import Navigation from './Navigation';
import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Locations from './Locations';
import Timeline from './Timeline';
import Directions from './Directions';
import Gallery from './Gallery';
import RSVP from './RSVP';
import Dresscode from './Dresscode';
import Accommodations from './Accommodations';
import Contact from './Contact';
import Gifts from './Gifts';
import MusicWishes from './MusicWishes';
import Guestbook from './Guestbook';
import WeddingABC from './WeddingABC';
import PhotoUpload from './PhotoUpload';
import FAQ from './FAQ';
import AdminDashboard from './AdminDashboard';
import Footer from './Footer';

function WeddingPage({ config }) {
  const [isAdmin, setIsAdmin] = useState(false);
  
  const {
    coupleNames = { name1: 'Sophie', name2: 'Max' },
    weddingDate = '2025-08-15T14:00:00',
    displayDate = '15. August 2025',
    location = 'Schloss Heidelberg',
    navLinks = [],
    activeComponents = {},
  } = config || {};

  const handleRSVPSubmit = async (data) => {
    console.log('RSVP submitted:', data);
    // Hier Supabase Integration
  };

  const handlePhotoUpload = async (files) => {
    console.log('Photos uploaded:', files);
    // Hier Cloudinary Integration
  };

  const handleGuestbookSubmit = async (data) => {
    console.log('Guestbook entry:', data);
  };

  const handleMusicWishSubmit = async (data) => {
    console.log('Music wish:', data);
  };

  const handleLogin = () => setIsAdmin(true);
  const handleLogout = () => setIsAdmin(false);

  // Admin View
  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Wedding Page
  return (
    <>
      <Navigation 
        coupleNames={`${coupleNames.name1} & ${coupleNames.name2}`}
        links={navLinks}
      />
      
      {activeComponents.hero !== false && (
        <Hero 
          name1={coupleNames.name1}
          name2={coupleNames.name2}
          date={displayDate}
          location={location}
        />
      )}
      
      {activeComponents.countdown !== false && (
        <Countdown weddingDate={weddingDate} />
      )}
      
      {activeComponents.loveStory !== false && (
        <LoveStory />
      )}
      
      {activeComponents.locations !== false && (
        <Locations />
      )}
      
      {activeComponents.timeline !== false && (
        <Timeline />
      )}
      
      {activeComponents.directions !== false && (
        <Directions address={location} />
      )}
      
      {activeComponents.gallery !== false && (
        <Gallery />
      )}
      
      {activeComponents.rsvp !== false && (
        <RSVP onSubmit={handleRSVPSubmit} />
      )}
      
      {activeComponents.dresscode !== false && (
        <Dresscode />
      )}
      
      {activeComponents.accommodations !== false && (
        <Accommodations />
      )}
      
      {activeComponents.gifts !== false && (
        <Gifts />
      )}
      
      {activeComponents.musicWishes !== false && (
        <MusicWishes onSubmit={handleMusicWishSubmit} />
      )}
      
      {activeComponents.guestbook !== false && (
        <Guestbook onSubmit={handleGuestbookSubmit} />
      )}
      
      {activeComponents.weddingABC !== false && (
        <WeddingABC />
      )}
      
      {activeComponents.photoUpload !== false && (
        <PhotoUpload onUpload={handlePhotoUpload} />
      )}
      
      {activeComponents.faq !== false && (
        <FAQ />
      )}
      
      {activeComponents.contact !== false && (
        <Contact />
      )}
      
      <Footer 
        coupleNames={`${coupleNames.name1} & ${coupleNames.name2}`}
        onAdminLogin={handleLogin}
      />
    </>
  );
}

export default WeddingPage;
