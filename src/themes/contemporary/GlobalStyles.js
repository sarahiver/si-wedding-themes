import { createGlobalStyle, keyframes } from 'styled-components';

// ============================================
// EXPORTED KEYFRAMES für alle Komponenten
// ============================================
export const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -15px) rotate(5deg); }
  50% { transform: translate(-10px, -25px) rotate(-3deg); }
  75% { transform: translate(-15px, 10px) rotate(3deg); }
`;

export const float2 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(45deg); }
  25% { transform: translate(10px, -10px) rotate(50deg); }
  50% { transform: translate(-8px, -20px) rotate(42deg); }
  75% { transform: translate(-10px, 8px) rotate(48deg); }
`;

export const float3 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(12px, -12px); }
  66% { transform: translate(-8px, -18px); }
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

export const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const expand = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

export const marquee = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const pulseShadow = keyframes`
  0%, 100% { box-shadow: 6px 6px 0 var(--black); }
  50% { box-shadow: 10px 10px 0 var(--black); }
`;

export const wiggle = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

// ============================================
// GLOBAL STYLES
// ============================================
const ContemporaryGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

  :root {
    --black: #0D0D0D;
    --white: #FAFAFA;
    --coral: #FF6B6B;
    --coral-dark: #E85555;
    --electric: #4ECDC4;
    --electric-dark: #3DBDB5;
    --yellow: #FFE66D;
    --yellow-dark: #E5CC5A;
    --purple: #9B5DE5;
    --purple-dark: #8A4FD0;
    --pink: #F15BB5;
    --pink-dark: #D94DA0;
    
    --gray-100: #F5F5F5;
    --gray-200: #E5E5E5;
    --gray-300: #D4D4D4;
    --gray-400: #A3A3A3;
    --gray-500: #737373;
    --gray-600: #525252;
    --gray-700: #404040;
    --gray-800: #262626;
    --gray-900: #171717;
    
    --shadow-sm: 4px 4px 0 var(--black);
    --shadow-md: 6px 6px 0 var(--black);
    --shadow-lg: 8px 8px 0 var(--black);
    --shadow-xl: 12px 12px 0 var(--black);
    
    --section-padding: clamp(4rem, 10vh, 8rem);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--black);
    background: var(--white);
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    word-break: keep-all;
  }

  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; height: auto; display: block; }
  button { font-family: inherit; cursor: pointer; border: none; }
  input, textarea, select { font-family: inherit; }
  ul, ol { list-style: none; }

  ::-webkit-scrollbar { width: 12px; }
  ::-webkit-scrollbar-track { background: var(--gray-200); }
  ::-webkit-scrollbar-thumb {
    background: var(--coral);
    border: 3px solid var(--black);
  }

  ::selection {
    background: var(--yellow);
    color: var(--black);
  }

  :focus-visible {
    outline: 3px solid var(--coral);
    outline-offset: 2px;
  }

  [id] { scroll-margin-top: 100px; }
`;

export default ContemporaryGlobalStyles;
