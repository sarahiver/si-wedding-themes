import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white: #ffffff;
    --black: #000000;
    --font-b: 'DM Sans', sans-serif;
  }

  html, body {
    background: var(--white);
    color: var(--black);
    font-family: var(--font-b);
    font-weight: 500;
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
