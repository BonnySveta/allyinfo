import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root[data-theme="light"] {
    --background-color: #ffffff;
    --text-color: #333333;
    --link-color: #007bff;
    --link-hover-color: #0056b3;
    --nav-background: #f8f9fa;
    --nav-hover-background: rgba(0, 0, 0, 0.05);
    --accent-color: #0070f3;
    --screen-reader-button-color: #0070f3;
    --hint-color: #252526;
    --button-hover-background: rgba(0, 0, 0, 0.05);
    --focus-ring-color: rgba(0, 123, 255, 0.5);
    --interactive-element-hover: #f0f0f0;
    --text-secondary-color: #666;
    --success-color: #4caf50;
    --error-color: #f44336;
    --input-border: #e0e0e0;
    --input-border-hover: #999999;
    --input-border-focus: var(--accent-color, #0066cc);
    --input-background: var(--background-color);
    --input-text: var(--text-color);
    --input-placeholder: var(--text-secondary-color);
    --input-shadow-focus: var(--accent-color-alpha, rgba(0, 102, 204, 0.2));
    --border-color: #e0e0e0;
    --border-hover-color: #999999;
    --border-focus-color: var(--accent-color);
    --banner-background: #ebf2ff;
    --accent-color-hover: #0056b3;
    --accent-color-rgb: 0, 122, 255;
    --card-background: #f8f9fa;
  }

  :root[data-theme="dark"] {
    --background-color: #1a1a1a;
    --text-color: #e2dddd;
    --link-color: #4dabf7;
    --link-hover-color: #74c0fc;
    --nav-background: #2d2d2d;
    --nav-hover-background: rgba(255, 255, 255, 0.1);
    --accent-color: #66b3ff;
    --screen-reader-button-color: #2671ba;
    --hint-color: rgb(38 38 38 / 85%);
    --button-hover-background: rgba(255, 255, 255, 0.1);
    --focus-ring-color: rgba(77, 171, 247, 0.5);
    --interactive-element-hover: #3d3d3d;
    --text-secondary-color: #999;
    --success-color: #4caf50;
    --error-color: #f44336;
    --input-border: #404040;
    --input-border-hover: #666666;
    --input-background: var(--background-color);
    --border-color: #404040;
    --border-hover-color: #666666;
    --border-focus-color: var(--accent-color);
    --banner-background: #323a49;
    --accent-color-hover: #0056b3;
    --accent-color-rgb: 10, 132, 255;
    --card-background: #242424;
  }

  body {
    min-height: 100vh;
    background-color: var(--background-color);
    display: flex;
    flex-direction: column;
    margin: 0;
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
  }

  a {
    color: var(--link-color);
    text-decoration: none;
    
    &:hover {
      color: var(--link-hover-color);
    }
  }

  * {
    box-sizing: border-box;
  }

  *:focus-visible {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 2px;
  }

  button, 
  input, 
  select, 
  textarea {
    font-family: inherit;
  }
`; 