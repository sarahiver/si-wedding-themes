import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* ═══════════════════════════════════════════════════════════════════════
     LUXE THEME - Pure Light & Understated Elegance
     Airy • Refined • Subtle • Timeless Luxury
     ═══════════════════════════════════════════════════════════════════════ */
  
  :root {
    /* Core Colors - PURE LIGHT Palette */
    --luxe-white: #FFFFFF;
    --luxe-cream: #FDFCFA;
    --luxe-cream-warm: #FAF8F5;
    --luxe-sand: #F5F3F0;
    --luxe-linen: #F0EEEB;
    
    /* Text Colors - Readable but Elegant */
    --luxe-text: #5A5A5A;
    --luxe-text-light: #7A7A7A;
    --luxe-text-muted: #9A9A9A;
    --luxe-text-heading: #4A4A4A;
    
    /* Accent - Very Subtle, Understated */
    --luxe-gold: #C8B88A;
    --luxe-gold-soft: #D8CCA0;
    --luxe-taupe: #C5B9A8;
    
    /* Borders - Barely There */
    --luxe-border: #ECEAE6;
    --luxe-border-light: #F5F3F0;
    
    /* Legacy compatibility - all lighter */
    --luxe-gray-100: #F7F6F4;
    --luxe-gray-200: #EFEEEC;
    --luxe-gray-300: #E0DFDD;
    --luxe-gray-400: #B5B5B5;
    --luxe-gray-500: #999999;
    --luxe-gray-600: #7A7A7A;
    --luxe-gray-700: #6A6A6A;
    --luxe-gray-800: #5A5A5A;
    --luxe-gray-900: #4A4A4A;
    
    /* Typography */
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'Montserrat', -apple-system, sans-serif;
    
    /* Spacing */
    --section-padding: clamp(6rem, 14vh, 12rem);
    --container-max: 1100px;
    --content-max: 750px;
    
    /* Transitions */
    --ease-luxe: cubic-bezier(0.23, 1, 0.32, 1);
    --ease-elegant: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: var(--font-sans);
    background: var(--luxe-white);
    color: var(--luxe-text);
    line-height: 1.8;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Typography Hierarchy - Light & Airy */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    font-weight: 300;
    font-style: italic;
    color: var(--luxe-text-heading);
    line-height: 1.3;
  }
  
  h1 { font-size: clamp(2.2rem, 6vw, 4rem); }
  h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); }
  h3 { font-size: clamp(1.4rem, 3vw, 1.8rem); }
  h4 { font-size: clamp(1.1rem, 2vw, 1.4rem); }
  
  p {
    font-family: var(--font-sans);
    font-weight: 300;
    font-size: 0.9rem;
    line-height: 1.9;
    color: var(--luxe-text-light);
  }
  
  a {
    color: var(--luxe-text);
    text-decoration: none;
    transition: all 0.3s var(--ease-elegant);
  }
  
  a:hover {
    color: var(--luxe-gold);
  }
  
  /* Luxe Buttons */
  button {
    font-family: var(--font-sans);
    cursor: pointer;
    border: none;
    background: none;
  }
  
  /* Form Elements */
  input, textarea, select {
    font-family: var(--font-sans);
    font-size: 0.9rem;
    border: none;
    outline: none;
    background: transparent;
  }
  
  input:focus, textarea:focus {
    outline: none;
  }
  
  /* Selection - Subtle */
  ::selection {
    background: var(--luxe-cream-warm);
    color: var(--luxe-text);
  }
  
  /* Scrollbar - Minimal */
  ::-webkit-scrollbar {
    width: 4px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--luxe-cream);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--luxe-taupe);
    border-radius: 2px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--luxe-gold);
  }
  
  /* Utility Classes */
  .container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  /* Hide scrollbar for some elements */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default GlobalStyles;
