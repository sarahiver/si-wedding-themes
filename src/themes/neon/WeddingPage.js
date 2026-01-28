// WeddingPage.js - neon Theme (Supabase integrated)
import React from 'react';
import { useWedding } from '../../context/WeddingContext';

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

function WeddingPage() {
  const { 
    isComponentActive, 
    content, 
    coupleNames, 
    weddingDate, 
    projectId, 
    slug 
  } = useWedding();
  
  // Parse couple names
  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Name', 'Name'];
  const name1 = names[0];
  const name2 = names[1];
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('de-DE', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });
  };
  const formattedDate = formatDate(weddingDate);
  
  // Props for components
  const heroProps = {
    name1, name2,
    date: formattedDate,
    location: content?.hero?.location_short || '',
    tagline: content?.hero?.tagline || 'Wir heiraten',
    backgroundImage: content?.hero?.background_image || null,
  };

  return (
    <>
      <Navigation name1={name1} name2={name2} date={formattedDate} />
      <main>
        <Hero {...heroProps} />
        {isComponentActive('countdown') && (
          <Countdown 
            targetDate={content?.countdown?.target_date || weddingDate} 
            title={content?.countdown?.title}
          />
        )}
        {isComponentActive('lovestory') && (
          <LoveStory 
            events={content?.lovestory?.events || []} 
            title={content?.lovestory?.title}
          />
        )}
        {isComponentActive('timeline') && (
          <Timeline 
            events={content?.timeline?.events || []} 
            title={content?.timeline?.title}
          />
        )}
        {isComponentActive('locations') && (
          <Locations 
            locations={content?.locations?.locations || []} 
            title={content?.locations?.title}
          />
        )}
        {isComponentActive('directions') && (
          <Directions 
            options={content?.directions?.options || []}
            title={content?.directions?.title}
            address={content?.directions?.address}
          />
        )}
        {isComponentActive('accommodations') && (
          <Accommodations 
            hotels={content?.accommodations?.hotels || []} 
            title={content?.accommodations?.title}
          />
        )}
        {isComponentActive('dresscode') && (
          <Dresscode 
            title={content?.dresscode?.title}
            code={content?.dresscode?.code}
            description={content?.dresscode?.description}
            colors={content?.dresscode?.colors || []}
          />
        )}
        {isComponentActive('rsvp') && (
          <RSVP 
            projectId={projectId}
            title={content?.rsvp?.title}
            deadline={content?.rsvp?.deadline}
          />
        )}
        {isComponentActive('gallery') && (
          <Gallery 
            images={content?.gallery?.images || []} 
            title={content?.gallery?.title}
          />
        )}
        {isComponentActive('photoupload') && (
          <PhotoUpload 
            projectId={projectId} 
            slug={slug}
            title={content?.photoupload?.title}
          />
        )}
        {isComponentActive('guestbook') && (
          <Guestbook 
            projectId={projectId}
            title={content?.guestbook?.title}
          />
        )}
        {isComponentActive('musicwishes') && (
          <MusicWishes 
            projectId={projectId}
            title={content?.musicwishes?.title}
          />
        )}
        {isComponentActive('gifts') && (
          <Gifts 
            items={content?.gifts?.items || []}
            title={content?.gifts?.title}
            description={content?.gifts?.description}
          />
        )}
        {isComponentActive('faq') && (
          <FAQ 
            items={content?.faq?.items || []} 
            title={content?.faq?.title}
          />
        )}
        {isComponentActive('weddingabc') && (
          <WeddingABC 
            entries={content?.weddingabc?.entries || []} 
            title={content?.weddingabc?.title}
          />
        )}
        {isComponentActive('witnesses') && (
          <ContactWitnesses 
            witnesses={content?.witnesses?.witnesses || []}
            title={content?.witnesses?.title}
          />
        )}
        {isComponentActive('contact') && (
          <Contact />
        )}
      </main>
      <Footer 
        name1={name1} 
        name2={name2}
        hashtag={content?.footer?.hashtag}
      />
    </>
  );
}

export default WeddingPage;
