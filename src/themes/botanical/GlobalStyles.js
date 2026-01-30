import { createGlobalStyle } from 'styled-components';

const ZenGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --zen-bg: #FAFAF8;
    --zen-bg-alt: #F5F4F0;
    --zen-text: #1a1a1a;
    --zen-text-light: #888888;
    --zen-text-muted: #aaaaaa;
    --zen-line: #e0e0e0;
    --zen-line-light: #eeeeee;
    
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    
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
    font-family: var(--font-sans);
    font-size: 16px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--zen-text);
    background: var(--zen-bg);
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    font-weight: 300;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.3s ease;
  }

  a:hover {
    opacity: 0.7;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: var(--font-sans);
    cursor: pointer;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 300;
  }

  ul, ol {
    list-style: none;
  }

  ::selection {
    background: var(--zen-text);
    color: var(--zen-bg);
  }

  :focus-visible {
    outline: 1px solid var(--zen-text);
    outline-offset: 2px;
  }

  [id] {
    scroll-margin-top: 80px;
  }

  /* Reveal animation utility */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default ZenGlobalStyles;
