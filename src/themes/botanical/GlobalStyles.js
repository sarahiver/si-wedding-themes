// Botanical GlobalStyles - Black & White Tree Ring Concept
import { createGlobalStyle } from 'styled-components';

const BotanicalGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
  
  :root {
    /* === MONOCHROME PALETTE === */
    --black: #1a1a1a;
    --dark: #2d2d2d;
    --medium: #666666;
    --light: #999999;
    --pale: #cccccc;
    --off-white: #f5f5f5;
    --white: #ffffff;
    
    /* === TYPOGRAPHY === */
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* === SPACING === */
    --section-height: 100vh;
    --container-max: 1000px;
    --container-narrow: 600px;
    
    /* === TRANSITIONS === */
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: var(--font-sans);
    font-weight: 400;
    background: var(--white);
    color: var(--dark);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  
  /* === TYPOGRAPHY === */
  h1, h2, h3 {
    font-family: var(--font-serif);
    font-weight: 400;
    line-height: 1.15;
    color: var(--black);
    letter-spacing: -0.02em;
  }
  
  h1 { 
    font-size: clamp(3rem, 10vw, 7rem);
    font-weight: 300;
  }
  
  h2 { 
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 400;
  }
  
  h3 { 
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 500;
  }
  
  p {
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--medium);
  }
  
  /* Sublines - Bold Sans */
  .eyebrow {
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--light);
  }
  
  a {
    color: inherit;
    text-decoration: none;
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
    filter: grayscale(100%);
    transition: filter 0.5s ease;
    
    &:hover {
      filter: grayscale(50%);
    }
  }
  
  /* === SCROLL SECTIONS === */
  section {
    min-height: var(--section-height);
    scroll-snap-align: start;
    scroll-snap-stop: always;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
  }
  
  /* === SCROLLBAR === */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--off-white);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--pale);
    border-radius: 3px;
    
    &:hover {
      background: var(--light);
    }
  }
  
  /* === SELECTION === */
  ::selection {
    background: var(--black);
    color: var(--white);
  }
  
  /* === FORM ELEMENTS === */
  input, textarea, select {
    font-family: var(--font-sans);
    font-size: 1rem;
    padding: 1rem;
    border: 1px solid var(--pale);
    background: var(--white);
    color: var(--dark);
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: var(--dark);
    }
    
    &::placeholder {
      color: var(--light);
    }
  }
  
  /* === BUTTONS === */
  .btn {
    display: inline-block;
    padding: 1rem 2rem;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: var(--black);
    color: var(--white);
    border: 1px solid var(--black);
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--white);
      color: var(--black);
    }
  }
  
  .btn-outline {
    background: transparent;
    color: var(--black);
    
    &:hover {
      background: var(--black);
      color: var(--white);
    }
  }
`;

export default BotanicalGlobalStyles;
