// Video ArchivePage - Hero (Danke) + Gallery + PhotoUpload + Footer
import React from 'react';
import VideoGlobalStyles from './GlobalStyles';
import Hero from './Hero';
import Gallery from './Gallery';
import PhotoUpload from './PhotoUpload';
import Footer from './Footer';

function ArchivePage() {
  return (
    <>
      <VideoGlobalStyles />
      <Hero isArchive={true} />
      <Gallery />
      <PhotoUpload />
      <Footer />
    </>
  );
}

export default ArchivePage;
