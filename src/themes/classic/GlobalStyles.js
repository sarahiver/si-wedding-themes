import { createGlobalStyle } from 'styled-components';

const ClassicGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Mrs+Saint+Delafield&display=swap');

  :root {
    --c-white: #FFFFFF;
    --c-cream: #F5F0EB;
    --c-cream-dark: #EDE6DD;
    --c-accent: #999999;
    --c-accent-light: #CCCCCC;
    --c-dark: #111111;
    --c-text: #1A1A1A;
    --c-text-sec: #555555;
    --c-text-muted: #999999;
    --c-border: rgba(0,0,0,0.08);
    --font-d: 'Cormorant Garamond', Georgia, serif;
    --font-b: 'Josefin Sans', -apple-system, sans-serif;
    --font-s: 'Mrs Saint Delafield', cursive;
    --section-pad: clamp(6rem, 12vh, 10rem);
    --content-w: 1200px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  body {
    font-family: var(--font-b); font-size: 15px; font-weight: 300;
    line-height: 1.7; color: var(--c-text-sec); background: var(--c-white); overflow-x: hidden;
  }
  h1,h2,h3,h4 { font-family: var(--font-d); font-weight: 300; line-height: 1.15; color: var(--c-text); }
  a { color: var(--c-text); text-decoration: none; }
  img { max-width: 100%; display: block; }
  button { font-family: var(--font-b); cursor: pointer; }
  input, textarea, select { font-family: var(--font-b); }
  ::selection { background: var(--c-dark); color: var(--c-white); }
  :focus-visible { outline: 2px solid var(--c-text-muted); outline-offset: 2px; }
  [id] { scroll-margin-top: 80px; }
`;

export default ClassicGlobalStyles;
