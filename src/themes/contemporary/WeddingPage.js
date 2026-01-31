// WeddingPage.js - Contemporary Theme
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContemporaryGlobalStyles from './GlobalStyles';
import LoadingScreen from './LoadingScreen';

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
import ContactWitnesses from './ContactWitnesses';
import Footer from './Footer';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #faf8f5;
`;

const LOADING_DELAY = 500;

function WeddingPage() {
  const { isComponentActive, isLoading } = useWedding();
  const [showLoading, setShowLoading] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const loadingTimerRef = useRef(null);
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    if (isLoading && !dataLoadedRef.current) {
      loadingTimerRef.current = setTimeout(() => {
        if (!dataLoadedRef.current) {
          setShowLoading(true);
        }
      }, LOADING_DELAY);
    }

    if (!isLoading) {
      dataLoadedRef.current = true;
      setContentReady(true);
      
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    }

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [isLoading]);

  if (showLoading && !contentReady) {
    return (
      <>
        <ContemporaryGlobalStyles />
        <LoadingScreen 
          onLoadComplete={() => setShowLoading(false)}
          isDataReady={contentReady}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <ContemporaryGlobalStyles />
        <PageWrapper style={{ opacity: 0 }} />
      </>
    );
  }

  return (
    <>
      <ContemporaryGlobalStyles />
      <PageWrapper>
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
          {isComponentActive('weddingabc') && <WeddingABC />}
          {isComponentActive('witnesses') && <ContactWitnesses />}
          {isComponentActive('contact') && <Contact />}
        </main>
        <Footer />
      </PageWrapper>
    </>
  );
}

export default WeddingPage;
