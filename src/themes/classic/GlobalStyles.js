import { createGlobalStyle } from 'styled-components';

const ClassicGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Josefin+Sans:wght@300;400;500;600;700&family=Great+Vibes&display=swap');

  :root {
    --c-white: #FFFFFF;
    --c-cream: #F5F0EB;
    --c-cream-dark: #EDE6DD;
    --c-sand: #D4C5B5;
    --c-gold: #C4A87C;
    --c-gold-dark: #A68B5B;
    --c-dark: #1A1A1A;
    --c-charcoal: #2C2C2C;
    --c-text: #1A1A1A;
    --c-text-sec: #666666;
    --c-text-muted: #999999;
    --c-border: rgba(196, 168, 124, 0.25);

    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Josefin Sans', -apple-system, sans-serif;
    --font-script: 'Great Vibes', cursive;

    --section-pad: clamp(6rem, 12vh, 10rem);
    --content-w: 1100px;
    --text-w: 600px;
    --nav-h: 80px;
    --overlap: 80px;
    --overlap-mobile: 40px;

    --ease: cubic-bezier(0.16, 1, 0.3, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  body {
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--c-text-sec);
    background: var(--c-white);
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 300;
    line-height: 1.15;
    color: var(--c-text);
    letter-spacing: 0.01em;
  }

  a { color: var(--c-gold-dark); text-decoration: none; }
  img { max-width: 100%; display: block; }
  button { font-family: var(--font-body); cursor: pointer; }
  input, textarea, select { font-family: var(--font-body); }
  ul, ol { list-style: none; }

  ::selection { background: var(--c-gold); color: var(--c-white); }
  :focus-visible { outline: 2px solid var(--c-gold); outline-offset: 2px; }
  [id] { scroll-margin-top: var(--nav-h); }
`;

export default ClassicGlobalStyles;
