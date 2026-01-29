// Video Theme GlobalStyles - Horizontal Scroll, S/W, Dusty Blue Accent
import { createGlobalStyle, keyframes } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeLeft = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

export const lineExpand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// ============================================
// GLOBAL STYLES
// ============================================
const VideoGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
  
  :root {
    /* Monochrome Palette */
    --video-black: #0A0A0A;
    --video-charcoal: #1A1A1A;
    --video-dark: #252525;
    --video-gray: #888888;
    --video-silver: #B0B0B0;
    --video-light: #E0E0E0;
    --video-white: #FFFFFF;
    
    /* Dusty Blue Accent */
    --video-accent: #6B8CAE;
    --video-accent-light: #8BA5C1;
    --video-accent-dark: #4A6A8A;
    --video-accent-muted: rgba(107, 140, 174, 0.3);
    
    /* Typography */
    --font-primary: 'Inter', -apple-system, sans-serif;
    --font-display: 'Manrope', sans-serif;
    --font-accent: 'Cormorant Garamond', Georgia, serif;
    
    /* Spacing */
    --nav-height: 80px;
    
    /* Transitions */
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --duration-fast: 0.3s;
    --duration-medium: 0.6s;
    --duration-slow: 1s;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    /* Disable vertical scroll on desktop */
    overflow-y: hidden;
    overflow-x: hidden;
    
    @media (max-width: 768px) {
      overflow-y: hidden;
      overflow-x: hidden;
    }
  }
  
  body {
    font-family: var(--font-primary);
    font-weight: 400;
    background: var(--video-black);
    color: var(--video-white);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }
  
  /* Custom Scrollbar - Hidden but functional */
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  
  /* Selection */
  ::selection {
    background: var(--video-accent);
    color: var(--video-white);
  }
  
  /* Typography */
  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--video-white);
  }
  
  h1 { font-size: clamp(2.5rem, 8vw, 5rem); }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); }
  h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); }
  
  p {
    font-family: var(--font-primary);
    font-weight: 400;
    color: var(--video-silver);
    line-height: 1.8;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    font-family: var(--font-primary);
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
    outline: 2px solid var(--video-accent);
    outline-offset: 3px;
  }
  
  /* Utility: Serif Accent Text */
  .accent-text {
    font-family: var(--font-accent);
    font-style: italic;
  }
  
  /* Utility: Grayscale for images/videos */
  .grayscale {
    filter: grayscale(100%);
    transition: filter 0.6s var(--ease-smooth);
  }
  
  .grayscale:hover {
    filter: grayscale(0%);
  }
`;

export default VideoGlobalStyles;
