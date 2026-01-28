// WeddingPage.js - editorial theme
import React from 'react';
import { useWedding } from '../../context/WeddingContext';

// Import components
import Navigation from './Navigation';
import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Timeline from './Timeline';
import Locations from './Locations';
import Directions from './Directions';
import Accommodations from './Accommodations';
import RSVP from './RSVP';
import Gallery from './Gallery';
import Guestbook from './Guestbook';
import MusicWishes from './MusicWishes';
import PhotoUpload from './PhotoUpload';
import Gifts from './Gifts';
import Dresscode from './Dresscode';
import FAQ from './FAQ';
import WeddingABC from './WeddingABC';
import Contact from './Contact';
import Footer from './Footer';

function WeddingPage() {
  const { isComponentActive, content } = useWedding();

  return (
    <>
      <Navigation />
      <main>
        <Hero />
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
        {isComponentActive('abc') && <WeddingABC />}
        {isComponentActive('contact') && <Contact />}
      </main>
      <Footer />
    </>
  );
}

export default WeddingPage;
