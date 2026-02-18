import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Dancing+Script:wght@400;500&display=swap');

  @keyframes siPageFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes parallaxFloat { from { transform: translateY(0px); } to { transform: translateY(-20px); } }

  :root {
    /* Farben — Boho Jewel Tones */
    --c-bg: #FAF6F0;
    --c-bg-warm: #F5EDE0;
    --c-bg-card: #F5EDE0;
    --c-cream: #FDFAF6;
    --c-text: #2C2416;
    --c-text-sec: #6B5744;
    --c-text-muted: #A08672;
    --c-accent: #C1392B;
    --c-accent-hover: #A02E22;
    --c-gold: #C17F24;
    --c-gold-dark: #8B6914;
    --c-border: rgba(44, 36, 22, 0.08);
    --c-border-warm: rgba(193, 57, 43, 0.15);

    /* Fonts */
    --font-d: 'Playfair Display', Georgia, serif;
    --font-b: 'DM Sans', system-ui, sans-serif;
    --font-s: 'Dancing Script', cursive;

    /* Layout */
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    --content-w: 1200px;
    --section-pad: clamp(5rem, 8vh, 8rem);
    --radius-sm: 0px 8px 0px 8px;  /* nur diagonal gerundet — Boho-Charakter */
    --radius-md: 0px 16px 0px 16px;
    --radius-lg: 0px 24px 0px 24px;
    --radius-full: 100px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  body {
    animation: siPageFadeIn 0.6s ease forwards;
    font-family: var(--font-b);
    font-weight: 400;
    font-size: 16px;
    color: var(--c-text-sec);
    line-height: 1.75;
    background: var(--c-bg);
    overflow-x: hidden;
  }

  img { display: block; max-width: 100%; }
  a { color: inherit; text-decoration: none; }
  ::selection { background: var(--c-accent); color: white; }

  h1, h2, h3 {
    font-family: var(--font-d);
    color: var(--c-text);
    line-height: 1.2;
  }

  /* Globale Section-Styles */
  section {
    position: relative;
  }
`;

export default GlobalStyles;
