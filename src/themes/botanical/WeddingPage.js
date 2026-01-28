import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import Hero from './Hero';
import Navigation from './Navigation';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Timeline from './Timeline';
import Locations from './Locations';
import Directions from './Directions';
import RSVP from './RSVP';
import Dresscode from './Dresscode';
import Accommodations from './Accommodations';
import Contact from './Contact';
import Gallery from './Gallery';
import Gifts from './Gifts';
import Guestbook from './Guestbook';
import MusicWishes from './MusicWishes';
import PhotoUpload from './PhotoUpload';
import FAQ from './FAQ';
import WeddingABC from './WeddingABC';
import Footer from './Footer';

function WeddingPage() {
  const { 
    coupleNames, 
    weddingDate, 
    isComponentActive, 
    getContent,
    slug
  } = useWedding();

  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Olivia', 'Benjamin'];
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const heroContent = getContent('hero');
  const countdownContent = getContent('countdown');

  return (
    <>
      <Navigation 
        coupleNames={coupleNames} 
        weddingDate={formatDate(weddingDate)}
      />
      
      <Hero 
        name1={names[0]}
        name2={names[1]}
        date={formatDate(weddingDate)}
        location={heroContent.location_short || ''}
        eyebrow={heroContent.tagline || 'Wir heiraten'}
        backgroundImage={heroContent.background_image}
      />
      
      {isComponentActive('countdown') && (
        <Countdown 
          weddingDate={weddingDate}
          title={countdownContent.title}
          showSeconds={countdownContent.show_seconds}
        />
      )}
      
      {isComponentActive('lovestory') && <LoveStory content={getContent('lovestory')} />}
      {isComponentActive('timeline') && <Timeline content={getContent('timeline')} />}
      {isComponentActive('locations') && <Locations content={getContent('locations')} />}
      {isComponentActive('directions') && <Directions content={getContent('directions')} />}
      {isComponentActive('dresscode') && <Dresscode content={getContent('dresscode')} />}
      {isComponentActive('accommodations') && <Accommodations content={getContent('accommodations')} />}
      {isComponentActive('rsvp') && <RSVP content={getContent('rsvp')} />}
      {isComponentActive('gallery') && <Gallery content={getContent('gallery')} />}
      {isComponentActive('gifts') && <Gifts content={getContent('gifts')} />}
      {isComponentActive('guestbook') && <Guestbook content={getContent('guestbook')} />}
      {isComponentActive('musicwishes') && <MusicWishes content={getContent('musicwishes')} />}
      {isComponentActive('photoupload') && <PhotoUpload content={getContent('photoupload')} />}
      {isComponentActive('faq') && <FAQ content={getContent('faq')} />}
      {isComponentActive('weddingabc') && <WeddingABC content={getContent('weddingabc')} />}
      {isComponentActive('contact') && <Contact content={getContent('contact')} />}
      
      <Footer coupleNames={coupleNames} content={getContent('footer')} slug={slug} />
    </>
  );
}

export default WeddingPage;
