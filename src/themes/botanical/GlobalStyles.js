// Botanical GlobalStyles - Knothole/Astloch Concept
// Content scrolls behind fixed organic bubble overlay
import { createGlobalStyle, keyframes } from 'styled-components';

// ============================================
// ORGANIC MORPH ANIMATIONS - Slow & Subtle
// ============================================
export const morph1 = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%; }
  75% { border-radius: 40% 30% 60% 50% / 60% 50% 40% 30%; }
`;

export const morph2 = keyframes`
  0%, 100% { border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%; }
  33% { border-radius: 70% 30% 30% 70% / 40% 60% 40% 60%; }
  66% { border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%; }
`;

export const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// GLOBAL STYLES
// ============================================
const BotanicalGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');
  
  :root {
    /* === COLOR PALETTE === */
    
    /* Bark/Wood Frame */
    --bark-dark: #3D3229;
    --bark-medium: #5C4D3C;
    --bark-light: #7A6B5A;
    --bark-highlight: #9C8B78;
    
    /* Forest Greens */
    --forest-deep: #2C3E2D;
    --forest-main: #3D5E3D;
    --forest-light: #5A7A5A;
    --forest-pale: #8BA888;
    --forest-mist: #B8C9B5;
    
    /* Neutrals */
    --cream: #FAF8F5;
    --cream-dark: #F0EDE6;
    --warm-white: #FEFDFB;
    --soft-black: #2D2D2D;
    
    /* Accents */
    --gold: #B8956B;
    --gold-light: #D4B896;
    
    /* === TYPOGRAPHY === */
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'DM Sans', -apple-system, sans-serif;
    
    /* === SPACING === */
    --section-height: 100vh;
    
    /* === TRANSITIONS === */
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --duration-slow: 1.5s;
    --duration-medium: 0.8s;
    
    /* === SHADOWS === */
    --shadow-inset: inset 0 0 60px rgba(61, 50, 41, 0.4);
    --shadow-hole: inset 0 4px 30px rgba(0,0,0,0.3), inset 0 0 80px rgba(61, 50, 41, 0.2);
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: var(--font-sans);
    font-weight: 400;
    background: var(--forest-deep);
    color: var(--soft-black);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  
  /* === TYPOGRAPHY === */
  h1, h2, h3 {
    font-family: var(--font-serif);
    font-weight: 400;
    line-height: 1.15;
    color: var(--forest-deep);
    letter-spacing: -0.02em;
  }
  
  h1 { 
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 300;
  }
  
  h2 { 
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 400;
  }
  
  h3 { 
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 500;
  }
  
  p {
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--bark-medium);
  }
  
  /* Sublines - Bold Sans */
  .subline {
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--forest-light);
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    font-family: var(--font-sans);
    cursor: pointer;
    border: none;
    background: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  /* === SCROLL SECTIONS === */
  section {
    min-height: var(--section-height);
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  
  /* === SCROLLBAR === */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--bark-dark);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--bark-light);
    border-radius: 4px;
  }
  
  /* === SELECTION === */
  ::selection {
    background: var(--forest-mist);
    color: var(--forest-deep);
  }
`;

export default BotanicalGlobalStyles;
