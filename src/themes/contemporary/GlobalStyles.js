import { createGlobalStyle, keyframes } from 'styled-components';

// Exportierte Keyframes für alle Komponenten
export const float = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -15px) rotate(5deg); }
  50% { transform: translate(-10px, -25px) rotate(-3deg); }
  75% { transform: translate(-15px, 10px) rotate(3deg); }
`;

export const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const expand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const wiggle = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ContemporaryGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
  
  :root {
    --coral: #FF6B6B;
    --electric: #4ECDC4;
    --yellow: #FFE66D;
    --purple: #9B5DE5;
    --pink: #F15BB5;
    --black: #0D0D0D;
    --white: #FAFAFA;
    
    --gray-100: #F5F5F5;
    --gray-200: #E5E5E5;
    --gray-300: #D4D4D4;
    --gray-400: #A3A3A3;
    --gray-500: #737373;
    --gray-600: #525252;
    --gray-700: #404040;
    --gray-800: #262626;
    
    --shadow-sm: 4px 4px 0 var(--black);
    --shadow-md: 6px 6px 0 var(--black);
    --shadow-lg: 8px 8px 0 var(--black);
    --shadow-xl: 12px 12px 0 var(--black);
    
    --font-main: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html { scroll-behavior: smooth; }
  
    overflow-x: hidden;
  body {
    animation: siPageFadeIn 0.5s ease forwards;
    font-family: var(--font-main);
    background: var(--white);
    color: var(--black);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar { width: 12px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb {
    background: var(--coral);
    border: 2px solid var(--black);
  }
  
  ::selection {
    background: var(--yellow);
    color: var(--black);
  }
  
  a { color: inherit; text-decoration: none; }
  button { font-family: var(--font-main); cursor: pointer; border: none; background: none; }
  img { max-width: 100%; height: auto; display: block; }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.1;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }
`;

export default ContemporaryGlobalStyles;
