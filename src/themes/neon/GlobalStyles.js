import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    /* Neon Color Palette */
    --black: #0a0a0f;
    --dark: #12121a;
    --dark-purple: #1a1a2e;
    
    /* Neon Colors */
    --neon-cyan: #00ffff;
    --neon-pink: #ff00ff;
    --neon-purple: #b347ff;
    --neon-green: #00ff88;
    --neon-blue: #00d4ff;
    
    /* Grays */
    --gray-100: rgba(255,255,255,0.9);
    --gray-300: rgba(255,255,255,0.6);
    --gray-500: rgba(255,255,255,0.4);
    --gray-700: rgba(255,255,255,0.2);
    --gray-900: rgba(255,255,255,0.05);
    
    /* Glow Shadows */
    --glow-cyan: 0 0 10px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3);
    --glow-pink: 0 0 10px rgba(255, 0, 255, 0.5), 0 0 30px rgba(255, 0, 255, 0.3);
    --glow-green: 0 0 10px rgba(0, 255, 136, 0.5), 0 0 30px rgba(0, 255, 136, 0.3);
    
    /* Text Glow */
    --text-glow-cyan: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5);
    --text-glow-pink: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5);
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    /* scroll-snap-type removed - causes conflicts with horizontal scroll components */
  }

  body {
    animation: siPageFadeIn 0.5s ease forwards;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #ffffff;
    background: var(--black);
    overflow-x: hidden;
  }

  /* Animated Grid Background */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: -1;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    line-height: 1.1;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  button {
    font-family: 'Space Grotesk', sans-serif;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea, select {
    font-family: 'Space Grotesk', sans-serif;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(0,255,255,0.3);
    color: #fff;
    padding: 15px 20px;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: var(--neon-cyan);
      box-shadow: var(--glow-cyan);
    }
    
    &::placeholder {
      color: rgba(255,255,255,0.3);
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--black);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--neon-cyan);
    border-radius: 4px;
  }

  /* Selection */
  ::selection {
    background: var(--neon-pink);
    color: #000;
  }

  /* Scanline Effect for CRT Monitor Feel */
  @keyframes scanline {
    0% { top: -100%; }
    100% { top: 100%; }
  }

  /* Neon Flicker Animation */
  @keyframes neonFlicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.8; }
    94% { opacity: 1; }
    96% { opacity: 0.9; }
    97% { opacity: 1; }
  }

  /* Glow Pulse Animation */
  @keyframes glowPulse {
    0%, 100% { 
      filter: brightness(1);
      text-shadow: var(--text-glow-cyan);
    }
    50% { 
      filter: brightness(1.2);
      text-shadow: 0 0 20px rgba(0, 255, 255, 1), 0 0 40px rgba(0, 255, 255, 0.8);
    }
  }
`;

export default GlobalStyles;
