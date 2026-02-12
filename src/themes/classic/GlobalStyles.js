// Classic Theme GlobalStyles - Warm, Elegant, Timeless
// Inspired by: Festtagdesign aesthetic - soft beige, gold accents, serif typography
import { createGlobalStyle } from 'styled-components';

const ClassicGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Josefin+Sans:wght@300;400;500;600;700&family=Great+Vibes&display=swap');

  :root {
    /* Warm Palette */
    --classic-cream: #F5F0EB;
    --classic-white: #FFFDF9;
    --classic-beige: #E8E0D6;
    --classic-sand: #D4C5B5;
    --classic-gold: #C4A87C;
    --classic-gold-dark: #A68B5B;
    --classic-charcoal: #2C2C2C;
    --classic-text: #3A3A3A;
    --classic-text-light: #7A7A7A;
    --classic-text-muted: #A5A5A5;
    --classic-border: rgba(196, 168, 124, 0.25);

    /* Typography */
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Josefin Sans', -apple-system, sans-serif;
    --font-script: 'Great Vibes', cursive;

    /* Spacing */
    --section-padding: clamp(4rem, 10vh, 8rem);
    --content-width: 1200px;
    --nav-height: 80px;

    /* Transitions */
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
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
    font-weight: 300;
    line-height: 1.7;
    color: var(--classic-text);
    background: var(--classic-cream);
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 400;
    line-height: 1.2;
    color: var(--classic-charcoal);
    letter-spacing: 0.01em;
  }

  h1 { font-size: clamp(2.5rem, 6vw, 5rem); }
  h2 { font-size: clamp(2rem, 4vw, 3.5rem); }
  h3 { font-size: clamp(1.5rem, 3vw, 2rem); }

  p {
    margin-bottom: 1rem;
    font-weight: 300;
    color: var(--classic-text);
  }

  a {
    color: var(--classic-gold-dark);
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover { color: var(--classic-charcoal); }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: var(--font-body);
    cursor: pointer;
    letter-spacing: 0.1em;
  }

  input, textarea, select {
    font-family: var(--font-body);
    font-size: inherit;
  }

  ul, ol { list-style: none; }

  ::selection {
    background: var(--classic-gold);
    color: var(--classic-white);
  }

  :focus-visible {
    outline: 2px solid var(--classic-gold);
    outline-offset: 2px;
  }

  [id] {
    scroll-margin-top: var(--nav-height);
  }

  /* Script font utility */
  .script {
    font-family: var(--font-script);
    font-weight: 400;
  }
`;

export default ClassicGlobalStyles;
