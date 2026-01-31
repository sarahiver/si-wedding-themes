// Neon Theme - WeddingPage
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import NeonGlobalStyles from './GlobalStyles';

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

const pulse = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 0 20px rgba(0,255,255,0.5); }
  50% { opacity: 0.7; box-shadow: 0 0 40px rgba(0,255,255,0.8); }
`;

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.5rem;
  background: #0a0a0f;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }
`;

const LoadingText = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0,255,255,0.5);
  animation: ${pulse} 2s ease-in-out infinite;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '>';
    margin-right: 10px;
    color: #ff00ff;
  }
`;

const LoadingBar = styled.div`
  width: 200px;
  height: 2px;
  background: rgba(255,255,255,0.1);
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 50%;
    background: linear-gradient(90deg, transparent, #00ffff, transparent);
    animation: loading 1.5s ease-in-out infinite;
  }
  
  @keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
`;

function WeddingPage() {
  const { 
    project, 
    content, 
    loading, 
    isComponentActive,
    coupleNames,
    weddingDate,
    projectId,
    slug
  } = useWedding();
  const [showAdmin, setShowAdmin] = useState(false);

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

  const handleAdminLogin = (username, password) => {
    if (username && password) setShowAdmin(true);
  };

  if (loading) {
    return (
      <>
        <NeonGlobalStyles />
        <LoadingScreen>
          <LoadingText>System loading...</LoadingText>
          <LoadingBar />
        </LoadingScreen>
      </>
    );
  }

  if (showAdmin) {
    return (
      <>
        <NeonGlobalStyles />
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      </>
    );
  }

  return (
    <>
      <NeonGlobalStyles />
      <Navigation 
        name1={name1} 
        name2={name2}
      />
      <main>
        <Hero 
          name1={name1}
          name2={name2}
          date={formattedDate}
          location={content?.hero?.location_short || ''}
          eyebrow={content?.hero?.tagline || 'The Wedding Of'}
        />
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
        {isComponentActive('gallery') && (
          <Gallery 
            images={content?.gallery?.images || []}
            title={content?.gallery?.title}
          />
        )}
        {isComponentActive('rsvp') && (
          <RSVP 
            projectId={projectId}
            title={content?.rsvp?.title}
            deadline={content?.rsvp?.deadline}
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
        {isComponentActive('gifts') && (
          <Gifts 
            items={content?.gifts?.items || []}
            title={content?.gifts?.title}
            description={content?.gifts?.description}
          />
        )}
        {isComponentActive('accommodations') && (
          <Accommodations 
            hotels={content?.accommodations?.hotels || []}
            title={content?.accommodations?.title}
          />
        )}
        {isComponentActive('directions') && (
          <Directions 
            options={content?.directions?.options || []}
            title={content?.directions?.title}
            address={content?.directions?.address}
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
        {isComponentActive('photoupload') && (
          <PhotoUpload 
            projectId={projectId}
            slug={slug}
            title={content?.photoupload?.title}
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
        onAdminLogin={handleAdminLogin}
      />
    </>
  );
}

export default WeddingPage;
