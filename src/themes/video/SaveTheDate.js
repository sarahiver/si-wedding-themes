// Video SaveTheDate - Reuses Hero component with SaveTheDate content
import React from 'react';
import VideoGlobalStyles from './GlobalStyles';
import Hero from './Hero';
import Footer from './Footer';

function SaveTheDate() {
  return (
    <>
      <VideoGlobalStyles />
      <Hero isSaveTheDate={true} />
      <Footer />
    </>
  );
}

export default SaveTheDate;
