// Botanical ArchivePage - Hero (Danke) + Gallery + PhotoUpload + Footer
import React from 'react';
import BotanicalGlobalStyles from './GlobalStyles';
import BotanicalBackground from './BotanicalBackground';
import Hero from './Hero';
import Gallery from './Gallery';
import PhotoUpload from './PhotoUpload';
import Footer from './Footer';

function ArchivePage() {
  return (
    <>
      <BotanicalGlobalStyles />
      <BotanicalBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Hero isArchive={true} />
        <Gallery />
        <PhotoUpload />
        <Footer />
      </div>
    </>
  );
}

export default ArchivePage;
