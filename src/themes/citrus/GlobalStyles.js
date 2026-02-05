// src/themes/citrus/GlobalStyles.js
// Citrus Theme - Sommerlich, frisch, 3D Elements
import { createGlobalStyle } from 'styled-components';

// ============================================
// CITRUS COLOR PALETTE
// ============================================
export const colors = {
  // Primary Citrus Colors
  lime: '#A4D233',
  lemon: '#FFE135',
  orange: '#FF9F1C',
  grapefruit: '#FF6B6B',

  // Greens
  leafGreen: '#4A7C23',
  mintGreen: '#98D7C2',
  deepGreen: '#2D5016',

  // Neutrals
  cream: '#FFFEF0',
  warmWhite: '#FDFCF7',
  sand: '#F5F0E1',
  charcoal: '#2A2A2A',

  // Accents
  zest: '#CDFF00',
  tropical: '#00D4AA',
  sunset: '#FF7B54',

  // Gradients
  citrusGradient: 'linear-gradient(135deg, #A4D233 0%, #FFE135 50%, #FF9F1C 100%)',
  summerGradient: 'linear-gradient(180deg, #FFFEF0 0%, #F5F0E1 100%)',
  freshGradient: 'linear-gradient(135deg, #98D7C2 0%, #A4D233 100%)',
};

// ============================================
// TYPOGRAPHY
// ============================================
export const fonts = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'Nunito', 'Segoe UI', sans-serif",
  accent: "'Pacifico', cursive",
  mono: "'JetBrains Mono', monospace",
};

// ============================================
// GLOBAL STYLES
// ============================================
const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: ${fonts.body};
    background: ${colors.cream};
    color: ${colors.charcoal};
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background: ${colors.lime};
    color: ${colors.deepGreen};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${fonts.heading};
    font-weight: 500;
    line-height: 1.2;
  }

  a {
    color: ${colors.leafGreen};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${colors.lime};
    }
  }

  /* Smooth scrolling for anchor links */
  [id] {
    scroll-margin-top: 80px;
  }

  /* Custom Scrollbar - Citrus Style */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.sand};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.lime};
    border-radius: 5px;

    &:hover {
      background: ${colors.leafGreen};
    }
  }

  /* Canvas for Three.js */
  canvas {
    display: block;
  }
`;

export default GlobalStyles;
