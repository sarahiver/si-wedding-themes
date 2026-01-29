// Botanical GlobalStyles - Organic Nature Theme
// Concept: Looking through knotholes in a tree, bird's eye view, flowing rivers, organic shapes
import { createGlobalStyle, keyframes, css } from 'styled-components';

// ============================================
// ORGANIC ANIMATIONS - Slow & Natural
// ============================================
export const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

export const sway = keyframes`
  0%, 100% { transform: rotate(-1.5deg) translateX(0); }
  25% { transform: rotate(0.5deg) translateX(3px); }
  50% { transform: rotate(1.5deg) translateX(0); }
  75% { transform: rotate(-0.5deg) translateX(-3px); }
`;

export const drift = keyframes`
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-8px) translateX(4px); }
  50% { transform: translateY(-5px) translateX(0); }
  75% { transform: translateY(-10px) translateX(-4px); }
`;

export const ripple = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
`;

export const flow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const leafDance = keyframes`
  0%, 100% { transform: rotate(0deg) translateY(0); }
  20% { transform: rotate(5deg) translateY(-5px); }
  40% { transform: rotate(-3deg) translateY(-2px); }
  60% { transform: rotate(4deg) translateY(-8px); }
  80% { transform: rotate(-2deg) translateY(-3px); }
`;

export const morph = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%; }
  75% { border-radius: 40% 30% 60% 50% / 60% 50% 40% 30%; }
`;

export const fadeGrow = keyframes`
  from { opacity: 0; transform: scale(0.9) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ============================================
// ORGANIC SHAPE MASKS (SVG Clip Paths)
// ============================================
export const organicMasks = {
  knothole1: `path('M50,0 C80,10 100,40 95,70 C90,100 60,100 30,90 C0,80 0,50 10,25 C20,0 30,-5 50,0')`,
  knothole2: `path('M40,5 C70,0 100,20 98,55 C95,90 70,100 35,95 C5,90 0,60 5,30 C10,5 20,8 40,5')`,
  leaf: `path('M50,0 C80,20 90,50 80,80 C70,95 50,100 50,100 C50,100 30,95 20,80 C10,50 20,20 50,0')`,
  pebble: `ellipse(50% 45% at 50% 50%)`,
  river: `path('M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z')`,
};

// ============================================
// GLOBAL STYLES
// ============================================
const BotanicalGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
  
  :root {
    /* === NATURE COLOR PALETTE === */
    
    /* Backgrounds - Forest Floor */
    --bg-cream: #FAF8F3;
    --bg-moss: #F0EDE4;
    --bg-bark: #E8E4DA;
    --bg-fog: #F5F7F4;
    
    /* Greens - The Forest */
    --green-spring: #A8C69F;
    --green-leaf: #7BA05B;
    --green-fern: #5C8A4D;
    --green-forest: #3D5E36;
    --green-deep: #2C4A28;
    --green-moss: #4A6741;
    --green-sage: #9CAF88;
    --green-mint: #B8D4BE;
    
    /* Earth Tones */
    --earth-sand: #D4C5A9;
    --earth-clay: #C9A86C;
    --earth-bark: #8B7355;
    --earth-soil: #5C4D3C;
    
    /* Water & Sky */
    --water-stream: #7EB8C4;
    --water-pond: #5A9AA8;
    --water-deep: #3D7A8A;
    --sky-mist: #C5D5DC;
    
    /* Accents - Flowers & Light */
    --accent-sunlight: #E8D5A3;
    --accent-golden: #D4A853;
    --accent-blossom: #E0B8B0;
    --accent-berry: #9B6B7A;
    
    /* Text */
    --text-dark: #2D3B29;
    --text-medium: #4A5D43;
    --text-light: #6B7D64;
    --text-muted: #8A9884;
    
    /* === TYPOGRAPHY === */
    --font-handwritten: 'Caveat', cursive;
    --font-body: 'Quicksand', sans-serif;
    --font-serif: 'Playfair Display', Georgia, serif;
    
    /* === SPACING === */
    --section-padding: clamp(80px, 15vh, 150px);
    --container-max: 1200px;
    --container-narrow: 800px;
    --container-tight: 600px;
    
    /* === ORGANIC CURVES === */
    --radius-organic: 60% 40% 50% 50% / 50% 50% 40% 60%;
    --radius-leaf: 70% 30% 70% 30% / 30% 70% 30% 70%;
    --radius-pebble: 50% 50% 40% 60% / 60% 40% 50% 50%;
    --radius-soft: 30px;
    --radius-round: 9999px;
    
    /* === TRANSITIONS === */
    --ease-nature: cubic-bezier(0.34, 1.2, 0.64, 1);
    --ease-flow: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    --duration-slow: 1.2s;
    --duration-medium: 0.6s;
    --duration-fast: 0.3s;
    
    /* === SHADOWS === */
    --shadow-soft: 0 4px 20px rgba(45, 59, 41, 0.08);
    --shadow-medium: 0 8px 30px rgba(45, 59, 41, 0.12);
    --shadow-deep: 0 15px 50px rgba(45, 59, 41, 0.15);
    --shadow-glow: 0 0 40px rgba(168, 198, 159, 0.3);
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    scroll-behavior: smooth;
    font-size: 16px;
    /* Slower scroll for organic feel */
    scroll-padding-top: 80px;
  }
  
  body {
    font-family: var(--font-body);
    font-weight: 400;
    background: var(--bg-cream);
    color: var(--text-dark);
    line-height: 1.8;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* === ORGANIC SCROLLBAR === */
  ::-webkit-scrollbar {
    width: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--bg-moss);
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg, 
      var(--green-sage) 0%, 
      var(--green-fern) 50%,
      var(--green-moss) 100%
    );
    border-radius: 20px;
    border: 3px solid var(--bg-moss);
    
    &:hover {
      background: linear-gradient(
        180deg, 
        var(--green-leaf) 0%, 
        var(--green-forest) 100%
      );
    }
  }
  
  /* === SELECTION === */
  ::selection {
    background: var(--green-mint);
    color: var(--green-deep);
  }
  
  /* === TYPOGRAPHY === */
  h1, h2, h3 {
    font-family: var(--font-handwritten);
    font-weight: 600;
    line-height: 1.2;
    color: var(--green-forest);
  }
  
  h1 { 
    font-size: clamp(3.5rem, 12vw, 8rem);
    letter-spacing: -0.02em;
  }
  
  h2 { 
    font-size: clamp(2.5rem, 8vw, 5rem);
  }
  
  h3 { 
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.9;
    color: var(--text-medium);
  }
  
  a {
    color: inherit;
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-flow);
  }
  
  button {
    font-family: var(--font-body);
    cursor: pointer;
    border: none;
    background: none;
    transition: all var(--duration-medium) var(--ease-nature);
  }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  /* === FOCUS STATES === */
  *:focus-visible {
    outline: 3px dashed var(--green-sage);
    outline-offset: 4px;
  }
  
  /* === ORGANIC SHAPE UTILITIES === */
  .organic-shape {
    border-radius: var(--radius-organic);
  }
  
  .leaf-shape {
    border-radius: var(--radius-leaf);
  }
  
  .pebble-shape {
    border-radius: var(--radius-pebble);
  }
  
  /* === ANIMATION UTILITIES === */
  .animate-breathe {
    animation: ${breathe} 6s ease-in-out infinite;
  }
  
  .animate-sway {
    animation: ${sway} 8s ease-in-out infinite;
  }
  
  .animate-drift {
    animation: ${drift} 10s ease-in-out infinite;
  }
`;

export default BotanicalGlobalStyles;
