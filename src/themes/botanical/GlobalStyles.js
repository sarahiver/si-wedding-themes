import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* ═══════════════════════════════════════════════════════════════════════════
     BOTANICAL THEME - CSS CUSTOM PROPERTIES
     ═══════════════════════════════════════════════════════════════════════════ */
  
  :root {
    /* Primary Palette - Nature Inspired */
    --sage: #8B9D83;
    --sage-dark: #6B7D63;
    --sage-light: #A8B8A0;
    --sage-muted: rgba(139, 157, 131, 0.15);
    
    /* Neutral Palette */
    --cream: #F5F1EB;
    --cream-dark: #E8E2D9;
    --cream-light: #FAF8F5;
    
    /* Accent Colors */
    --terracotta: #C4A484;
    --terracotta-light: #D4B494;
    --blush: #E8D5D5;
    --blush-light: #F2E5E5;
    
    /* Dark Greens */
    --forest: #2D3B2D;
    --forest-light: #3D4B3D;
    --forest-muted: rgba(45, 59, 45, 0.8);
    
    /* Text Colors */
    --text: #2D3B2D;
    --text-light: #5A6B5A;
    --text-muted: #7A8B7A;
    
    /* Functional */
    --success: #27ae60;
    --error: #C0392B;
    --warning: #d4a017;
    
    /* Shadows */
    --shadow-sm: 0 2px 8px rgba(45, 59, 45, 0.08);
    --shadow-md: 0 8px 25px rgba(45, 59, 45, 0.12);
    --shadow-lg: 0 15px 40px rgba(45, 59, 45, 0.15);
    --shadow-xl: 0 25px 60px rgba(45, 59, 45, 0.2);
    
    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.6s ease;
    --transition-bounce: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    /* Border Radius */
    --radius-sm: 10px;
    --radius-md: 15px;
    --radius-lg: 20px;
    --radius-xl: 30px;
    --radius-full: 50%;
    --radius-organic: 100px 100px 20px 20px;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESET & BASE STYLES
     ═══════════════════════════════════════════════════════════════════════════ */
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    
    @media (max-width: 768px) {
      font-size: 15px;
    }
  }

  body {
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.7;
    color: var(--text);
    background: var(--cream);
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     TYPOGRAPHY
     ═══════════════════════════════════════════════════════════════════════════ */
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 400;
    line-height: 1.3;
    color: var(--forest);
    letter-spacing: -0.01em;
  }

  h1 { font-size: clamp(2.5rem, 8vw, 5rem); }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); }
  h3 { font-size: clamp(1.5rem, 3vw, 2rem); }
  h4 { font-size: clamp(1.25rem, 2vw, 1.5rem); }

  p {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color var(--transition-normal);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     MEDIA
     ═══════════════════════════════════════════════════════════════════════════ */
  
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     FORM ELEMENTS
     ═══════════════════════════════════════════════════════════════════════════ */
  
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    
    &:focus {
      outline: none;
    }
  }

  ul, ol {
    list-style: none;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SCROLLBAR - ORGANIC STYLE
     ═══════════════════════════════════════════════════════════════════════════ */
  
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--cream-dark);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--sage);
    border-radius: 10px;
    border: 2px solid var(--cream-dark);
    
    &:hover {
      background: var(--sage-dark);
    }
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--sage) var(--cream-dark);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SELECTION
     ═══════════════════════════════════════════════════════════════════════════ */
  
  ::selection {
    background: var(--sage-light);
    color: var(--forest);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SCROLL OFFSET FOR FIXED NAV
     ═══════════════════════════════════════════════════════════════════════════ */
  
  [id] {
    scroll-margin-top: 100px;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     UTILITY CLASSES
     ═══════════════════════════════════════════════════════════════════════════ */
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     KEYFRAME ANIMATIONS - SHARED
     ═══════════════════════════════════════════════════════════════════════════ */
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
  }

  @keyframes floatSlow {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(15px, -20px) rotate(5deg); }
    50% { transform: translate(-10px, -35px) rotate(-3deg); }
    75% { transform: translate(-20px, -15px) rotate(2deg); }
  }

  @keyframes sway {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }

  @keyframes growLine {
    from { transform: scaleY(0); }
    to { transform: scaleY(1); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes leafFall {
    0% {
      transform: translateY(-10%) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
`;

export default GlobalStyles;
