// Botanical GlobalStyles - Watercolor Garden Illustration Style
import { createGlobalStyle, keyframes, css } from 'styled-components';

// ============================================
// ORGANIC ANIMATIONS
// ============================================
export const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

export const swayGentle = keyframes`
  0%, 100% { transform: rotate(-1deg) translateX(0); }
  50% { transform: rotate(1deg) translateX(5px); }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

export const floatSlow = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(2deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
`;

export const grow = keyframes`
  from { transform: scale(0) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
`;

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const leafFall = keyframes`
  0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

export const drawLine = keyframes`
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
`;

export const colorShift = keyframes`
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(10deg); }
`;

export const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// ============================================
// GLOBAL STYLES
// ============================================
const BotanicalGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
  
  :root {
    /* Botanical Watercolor Palette */
    --botanical-cream: #FAF8F5;
    --botanical-paper: #F5F2ED;
    --botanical-warm: #FDF9F3;
    
    /* Greens - inspired by watercolor trees */
    --botanical-sage: #9CAF88;
    --botanical-olive: #6B7F5E;
    --botanical-forest: #4A5D41;
    --botanical-emerald: #2D5A4A;
    --botanical-mint: #B8D4BE;
    --botanical-lime: #C5D86D;
    --botanical-teal: #5B8A72;
    
    /* Accent Colors */
    --botanical-gold: #D4A853;
    --botanical-terracotta: #C17F59;
    --botanical-blush: #E8C4B8;
    --botanical-sky: #87CEEB;
    
    /* Neutrals */
    --botanical-charcoal: #3D4739;
    --botanical-brown: #5C4D3C;
    --botanical-gray: #7A7A6E;
    
    /* Typography */
    --font-handwritten: 'Caveat', cursive;
    --font-body: 'Quicksand', sans-serif;
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    
    /* Spacing */
    --section-padding: clamp(60px, 12vh, 120px);
    --container-width: 1200px;
    --container-narrow: 800px;
    
    /* Transitions */
    --ease-organic: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --duration-slow: 1s;
    --duration-medium: 0.6s;
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
    font-family: var(--font-body);
    font-weight: 400;
    background: var(--botanical-cream);
    color: var(--botanical-charcoal);
    line-height: 1.7;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  
  /* Fun Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--botanical-paper);
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--botanical-sage), var(--botanical-olive));
    border-radius: 10px;
    border: 2px solid var(--botanical-paper);
  }
  
  /* Selection */
  ::selection {
    background: var(--botanical-mint);
    color: var(--botanical-forest);
  }
  
  /* Typography */
  h1, h2, h3 {
    font-family: var(--font-handwritten);
    font-weight: 600;
    line-height: 1.2;
    color: var(--botanical-forest);
  }
  
  h1 { font-size: clamp(3rem, 10vw, 7rem); }
  h2 { font-size: clamp(2.5rem, 7vw, 5rem); }
  h3 { font-size: clamp(1.5rem, 4vw, 2.5rem); }
  
  p {
    font-family: var(--font-body);
    font-weight: 400;
    line-height: 1.8;
    color: var(--botanical-brown);
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
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  /* Focus */
  *:focus-visible {
    outline: 3px dashed var(--botanical-sage);
    outline-offset: 3px;
  }
`;

export default BotanicalGlobalStyles;
