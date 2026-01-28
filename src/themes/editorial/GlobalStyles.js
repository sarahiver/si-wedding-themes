import { createGlobalStyle } from 'styled-components';

const EditorialGlobalStyles = createGlobalStyle`
  /* 
   * Editorial Theme - Magazine/Bold Style
   * Inspired by modern editorial design with strong typography
   */
  
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

  :root {
    /* Colors */
    --editorial-black: #0A0A0A;
    --editorial-white: #FAFAFA;
    --editorial-red: #C41E3A;
    --editorial-gray: #666666;
    --editorial-light-gray: #E5E5E5;
    
    /* Fonts */
    --font-headline: 'Oswald', 'Arial Narrow', sans-serif;
    --font-serif: 'Source Serif 4', Georgia, serif;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    
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
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    color: var(--editorial-black);
    background: var(--editorial-white);
    overflow-x: hidden;
  }

  /* Headlines - Bold, Condensed, Uppercase */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-headline);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 0.95;
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: none;
  }

  /* Serif for elegant text */
  .serif {
    font-family: var(--font-serif);
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    line-height: 1.4;
  }

  p { 
    margin-bottom: 1rem;
    font-weight: 300;
  }

  a { 
    color: inherit; 
    text-decoration: none;
    transition: color 0.2s ease;
  }

  img { 
    max-width: 100%; 
    height: auto; 
    display: block; 
  }

  button { 
    font-family: var(--font-headline);
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input, textarea, select { 
    font-family: var(--font-body); 
    font-size: inherit; 
  }

  ul, ol { list-style: none; }

  /* Selection */
  ::selection { 
    background: var(--editorial-red); 
    color: var(--editorial-white); 
  }

  :focus-visible { 
    outline: 2px solid var(--editorial-red); 
    outline-offset: 2px; 
  }

  /* Scroll margin for anchors */
  [id] { 
    scroll-margin-top: 80px; 
  }

  /* Accent color utility */
  .accent {
    color: var(--editorial-red);
  }

  /* Grayscale filter for images */
  .grayscale {
    filter: grayscale(100%);
    transition: filter 0.4s ease;
  }

  .grayscale:hover {
    filter: grayscale(0%);
  }
`;

export default EditorialGlobalStyles;
