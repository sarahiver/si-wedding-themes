import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&family=Pinyon+Script&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:   #0c0a08;
    --cream: #faf7f2;
    --gold:  #b8922a;
    --rose:  #c4614a;
    --font-d: 'Cormorant Garamond', serif;
    --font-b: 'DM Sans', sans-serif;
    --font-s: 'Pinyon Script', cursive;
  }

  html, body {
    background: var(--ink);
    color: var(--cream);
    font-family: var(--font-b);
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    height: 100%;
  }

  #root {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0; left: 0;
  }

  canvas { display: block; }
`

export default GlobalStyles
