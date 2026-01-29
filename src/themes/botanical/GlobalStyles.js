// Botanical Tree Theme - Global Styles
// Black & White, hand-drawn illustration style
import { createGlobalStyle } from 'styled-components';

const BotanicalGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
  
  :root {
    /* Monochrome Palette */
    --black: #1a1a1a;
    --dark: #2d2d2d;
    --medium: #666666;
    --light: #999999;
    --pale: #cccccc;
    --off-white: #f5f5f5;
    --white: #ffffff;
    --cream: #faf9f7;
    
    /* Tree colors */
    --bark: #2d2d2d;
    --bark-light: #4a4a4a;
    --leaf: #3d3d3d;
    
    /* Typography */
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* Transitions */
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
    scroll-behavior: smooth;
  }
  
  body {
    font-family: var(--font-sans);
    font-weight: 400;
    background: var(--cream);
    color: var(--dark);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  
  /* Typography */
  h1, h2, h3 {
    font-family: var(--font-serif);
    font-weight: 400;
    line-height: 1.15;
    color: var(--black);
  }
  
  h1 { font-size: clamp(2.5rem, 8vw, 5rem); font-weight: 300; }
  h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); }
  h3 { font-size: clamp(1.25rem, 2.5vw, 1.5rem); font-weight: 500; }
  
  p {
    font-size: 1rem;
    color: var(--medium);
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
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { 
    background: var(--pale); 
    border-radius: 4px;
  }
  
  /* Selection */
  ::selection {
    background: var(--black);
    color: var(--white);
  }
  
  /* Form elements */
  input, textarea, select {
    font-family: var(--font-sans);
    font-size: 1rem;
    padding: 0.875rem 1rem;
    border: 1px solid var(--pale);
    background: var(--white);
    color: var(--dark);
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: var(--dark);
    }
  }
`;

export default BotanicalGlobalStyles;
