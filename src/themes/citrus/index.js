// src/themes/citrus/index.js
// Citrus Theme - Summer, Fresh, 3D Elements
// Export all components

// Global Styles
export { default as GlobalStyles, colors, fonts } from './GlobalStyles';

// Main Components
export { default as CitrusHero } from './CitrusHero';
export { default as CitrusCountdown } from './CitrusCountdown';
export { default as CitrusLoveStory } from './CitrusLoveStory';
export { default as CitrusRSVP } from './CitrusRSVP';
export { default as CitrusLocation } from './CitrusLocation';
export { default as CitrusTimeline } from './CitrusTimeline';
export { default as CitrusFooter } from './CitrusFooter';

// 3D Components
export { CitrusFruit, LimeSlice, Bubbles, Leaf } from './components/Citrus3D';

// Animation Components
export { default as LottieAnimation, BouncingCitrus, SpinningSlice } from './components/LottieAnimation';

// Theme Info
export const themeInfo = {
  id: 'citrus',
  name: 'Citrus',
  description: 'Ein sommerlich-frisches Theme mit 3D-Elementen und Zitrusfrüchten',
  tags: ['sommer', 'frisch', '3d', 'modern', 'verspielt'],
  colors: {
    primary: '#A4D233',
    secondary: '#FFE135',
    accent: '#FF9F1C',
    background: '#FFFEF0',
    text: '#2A2A2A'
  }
};
