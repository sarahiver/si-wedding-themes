// Botanical Fruit Theme - Global Styles
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
  
  :root {
    --black: #1a1a1a;
    --dark: #2d2d2d;
    --medium: #666666;
    --light: #999999;
    --pale: #cccccc;
    --off-white: #f5f5f5;
    --cream: #faf9f7;
    --white: #ffffff;
    
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-in: cubic-bezier(0.5, 0, 0.75, 0);
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body, #root {
    height: 100%;
    overflow: hidden;
  }
  
  body {
    font-family: var(--font-sans);
    background: var(--cream);
    color: var(--dark);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  
  h1, h2, h3 {
    font-family: var(--font-serif);
    font-weight: 400;
    line-height: 1.15;
    color: var(--black);
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
    
    &:hover {
      filter: grayscale(50%);
    }
  }
  
  input, textarea, select {
    font-family: var(--font-sans);
    font-size: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--pale);
    background: var(--white);
    color: var(--dark);
    width: 100%;
    
    &:focus {
      outline: none;
      border-color: var(--dark);
    }
  }
  
  ::selection {
    background: var(--black);
    color: var(--white);
  }
`;

export default GlobalStyles;
