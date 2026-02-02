// Contemporary SaveTheDate - Reuses Hero component with SaveTheDate content
import React from 'react';
import ContemporaryGlobalStyles from './GlobalStyles';
import Hero from './Hero';
import Footer from './Footer';
import { useWedding } from '../../context/WeddingContext';

function SaveTheDate() {
  return (
    <>
      <ContemporaryGlobalStyles />
      <Hero isSaveTheDate={true} />
      <Footer />
    </>
  );
}

export default SaveTheDate;
