// src/context/WeddingContext.js
// Loads ALL data from Supabase - no hardcoded values
import React, { createContext, useContext } from 'react';
import { useWeddingData } from '../hooks/useWeddingData';

const WeddingContext = createContext(null);

export function WeddingProvider({ children, slug }) {
  const weddingData = useWeddingData(slug);

  return (
    <WeddingContext.Provider value={weddingData}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  
  return context;
}

export default WeddingContext;
