// Luxe GlobalStyles - Phenomenon/Elyse Residence Inspired
// Deep dark luxury with cinematic transitions
import { createGlobalStyle, keyframes, css } from 'styled-components';

// ============================================
// CINEMATIC ANIMATIONS
// ============================================
export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(80px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const scaleReveal = keyframes`
  from { opacity: 0; transform: scale(1.1); }
  to { opacity: 1; transform: scale(1); }
`;

export const slideFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-100px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const slideFromRight = keyframes`
  from { opacity: 0; transform: translateX(100px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const clipReveal = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;

export const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

export const textReveal = keyframes`
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
`;

export const parallaxFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

// ============================================
// GLOBAL STYLES
// ============================================
const LuxeGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500&display=swap');
  
  :root {
    /* Deep Dark Luxury Palette - Phenomenon Style */
    --luxe-void: #0A0A0A;
    --luxe-anthracite: #0E0E11;
    --luxe-charcoal: #1A1A1D;
    --luxe-graphite: #2D2D30;
    --luxe-slate: #4A4A4D;
    
    /* Light Palette */
    --luxe-cream: #F8F6F3;
    --luxe-ivory: #FFFEF9;
    --luxe-pearl: #E8E6E1;
    
    /* Accent */
    --luxe-gold: #C9A962;
    --luxe-champagne: #D4AF37;
    --luxe-rose: #B76E79;
    
    /* Typography */
    --font-display: 'Cormorant', 'Didot', 'Playfair Display', Georgia, serif;
    --font-body: 'Outfit', 'Montserrat', -apple-system, sans-serif;
    
    /* Spacing */
    --section-padding-y: clamp(80px, 15vh, 160px);
    --section-padding-x: clamp(24px, 5vw, 80px);
    --container-max: 1400px;
    --container-narrow: 800px;
    
    /* Transitions - Cinematic */
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
    --duration-slow: 1.2s;
    --duration-medium: 0.8s;
    --duration-fast: 0.4s;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    scroll-behavior: smooth;
    font-size: 16px;
    
    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
  
  body {
    font-family: var(--font-body);
    font-weight: 300;
    background: var(--luxe-anthracite);
    color: var(--luxe-cream);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  /* Luxury Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--luxe-void);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--luxe-gold);
    border-radius: 3px;
  }
  
  /* Selection */
  ::selection {
    background: var(--luxe-gold);
    color: var(--luxe-void);
  }
  
  /* Display Typography */
  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  
  h1 { font-size: clamp(3rem, 10vw, 8rem); }
  h2 { font-size: clamp(2.5rem, 6vw, 5rem); }
  h3 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
  
  p {
    font-family: var(--font-body);
    font-weight: 300;
    font-size: clamp(0.9rem, 1.1vw, 1.1rem);
    line-height: 1.8;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    font-family: var(--font-body);
    cursor: pointer;
    border: none;
    background: none;
  }
  
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  /* Focus */
  *:focus-visible {
    outline: 1px solid var(--luxe-gold);
    outline-offset: 4px;
  }
  
  /* Utility Classes */
  .overflow-hidden {
    overflow: hidden;
  }
`;

export default LuxeGlobalStyles;
