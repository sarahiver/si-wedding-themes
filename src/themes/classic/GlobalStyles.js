import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Mrs+Saint+Delafield&display=swap');

  :root {
    --c-white: #FFFFFF;
    --c-cream: #FDFCFA;
    --c-cream-dark: #F5F2EE;
    --c-accent: #999999;
    --c-dark: #1A1A1A;
    --c-text: #1A1A1A;
    --c-text-sec: #555555;
    --c-text-muted: #999999;
    --c-border: rgba(0,0,0,0.06);
    --font-d: 'Cormorant Garamond', Georgia, serif;
    --font-b: 'Josefin Sans', sans-serif;
    --font-s: 'Mrs Saint Delafield', cursive;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    --content-w: 1200px;
    --section-pad: clamp(6rem, 10vh, 10rem);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  body {
    font-family: var(--font-b);
    font-weight: 300;
    font-size: 15px;
    color: var(--c-text-sec);
    line-height: 1.7;
    background: var(--c-white);
    overflow-x: hidden;
  }
  img { display: block; max-width: 100%; }
  a { color: inherit; text-decoration: none; }
  ::selection { background: var(--c-accent); color: white; }
  h1, h2, h3 { font-family: var(--font-d); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: scale(1); } }
`;

export default GlobalStyles;
