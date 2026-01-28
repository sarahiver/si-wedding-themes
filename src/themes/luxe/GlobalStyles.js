// Luxe GlobalStyles - Elegant, Fließend, Minimalistisch
import { createGlobalStyle, keyframes, css } from 'styled-components';

// ============================================
// SHARED ANIMATIONS - Slide-In von allen Seiten
// ============================================
export const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-80px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(80px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideInDown = keyframes`
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

export const lineExpand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// Utility für Slide-In basierend auf Index (alternierend links/rechts)
export const getSlideAnimation = (index) => {
  return index % 2 === 0 ? slideInLeft : slideInRight;
};

// ============================================
// GLOBAL STYLES
// ============================================
const LuxeGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
  
  :root {
    /* Luxe Farbpalette - Warm, Erdig, Elegant */
    --luxe-cream: #F5F1EB;
    --luxe-sand: #E8E0D5;
    --luxe-taupe: #C4B7A6;
    --luxe-olive: #8B8B6E;
    --luxe-sage: #A4A78B;
    --luxe-charcoal: #3D3D3D;
    --luxe-black: #1A1A1A;
    --luxe-white: #FFFFFF;
    --luxe-gold: #C9A962;
    
    /* Transparenzen */
    --luxe-overlay: rgba(26, 26, 26, 0.4);
    --luxe-overlay-light: rgba(245, 241, 235, 0.9);
    
    /* Typografie */
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* Spacing */
    --section-padding: clamp(4rem, 10vh, 8rem);
    --container-width: 1200px;
    --container-narrow: 800px;
    
    /* Transitions */
    --transition-slow: 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    --transition-medium: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    --transition-fast: 0.3s ease;
  }
  
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
    font-family: var(--font-sans);
    font-weight: 400;
    background: var(--luxe-cream);
    color: var(--luxe-charcoal);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  /* Eleganter Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--luxe-cream);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--luxe-taupe);
    border-radius: 4px;
    
    &:hover {
      background: var(--luxe-olive);
    }
  }
  
  /* Selection */
  ::selection {
    background: var(--luxe-sage);
    color: var(--luxe-white);
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    font-weight: 400;
    line-height: 1.2;
    color: var(--luxe-black);
  }
  
  p {
    font-family: var(--font-sans);
    font-weight: 300;
    line-height: 1.8;
  }
  
  a {
    color: inherit;
    text-decoration: none;
    transition: var(--transition-fast);
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
  
  /* Focus Styles */
  *:focus-visible {
    outline: 2px solid var(--luxe-olive);
    outline-offset: 3px;
  }
`;

export default LuxeGlobalStyles;
