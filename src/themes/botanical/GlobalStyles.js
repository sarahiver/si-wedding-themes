import { createGlobalStyle } from 'styled-components';

const BotanicalGlobalStyles = createGlobalStyle`
  /* 
   * Botanical Glass Theme
   * Dark, moody background with plant PNGs and Apple-style glassmorphism
   */
  
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

  :root {
    /* Apple-inspired glass */
    --glass-bg: rgba(255, 255, 255, 0.08);
    --glass-bg-hover: rgba(255, 255, 255, 0.12);
    --glass-border: rgba(255, 255, 255, 0.15);
    --glass-shadow: 
      0 0 0 1px rgba(255,255,255,0.05) inset,
      0 4px 6px rgba(0, 0, 0, 0.1),
      0 10px 40px rgba(0, 0, 0, 0.25);
    --glass-blur: 40px;
    
    /* Text colors */
    --text-light: rgba(255, 255, 255, 0.95);
    --text-muted: rgba(255, 255, 255, 0.55);
    --text-dim: rgba(255, 255, 255, 0.35);
    
    /* Dark botanical background */
    --bg-dark: #040604;
    --bg-gradient: linear-gradient(160deg, #030503 0%, #081208 40%, #050805 100%);
    
    /* Accent colors */
    --accent-green: rgba(45, 90, 60, 0.8);
    --accent-green-light: rgba(80, 140, 90, 0.6);
    --success: #4CAF50;
    --error: #C41E3A;
    
    /* Fonts */
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* Spacing */
    --section-padding: clamp(4rem, 10vh, 8rem);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    color: var(--text-light);
    background: var(--bg-dark);
    overflow-x: hidden;
  }

  /* Display font for headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 300;
    line-height: 1.1;
  }

  p { 
    margin-bottom: 1rem;
    font-weight: 300;
    letter-spacing: 0.02em;
  }

  a { 
    color: inherit; 
    text-decoration: none;
    transition: all 0.3s ease;
  }

  img { 
    max-width: 100%; 
    height: auto; 
    display: block; 
  }

  button { 
    font-family: var(--font-body);
    cursor: pointer;
  }

  input, textarea, select { 
    font-family: var(--font-body); 
    font-size: inherit; 
  }

  ul, ol { list-style: none; }

  /* Selection */
  ::selection { 
    background: var(--accent-green); 
    color: var(--text-light); 
  }

  :focus-visible { 
    outline: 2px solid var(--accent-green-light); 
    outline-offset: 2px; 
  }

  /* Scroll margin for anchors */
  [id] { 
    scroll-margin-top: 100px; 
  }

  /* Glass card utility class */
  .glass {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(180%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: 28px;
    box-shadow: var(--glass-shadow);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .glass::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.02;
    pointer-events: none;
    border-radius: inherit;
  }

  .glass::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255,255,255,0.2) 20%, 
      rgba(255,255,255,0.35) 50%, 
      rgba(255,255,255,0.2) 80%, 
      transparent 100%
    );
    pointer-events: none;
  }

  .glass:hover {
    background: var(--glass-bg-hover);
    border-color: rgba(255,255,255,0.2);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.2);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.25);
  }
`;

export default BotanicalGlobalStyles;
