import styled from 'styled-components';

export const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  font-size: 1.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--nav-background);
  }

  &:focus {
    outline: 2px solid var(--link-color);
    outline-offset: 2px;
  }
`; 