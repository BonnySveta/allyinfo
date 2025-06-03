import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ThemeButton = styled.button`
  color: var(--text-color);
  background: var(--nav-hover-background);
  border: 2px solid transparent;
  padding: 0.625rem 1.375rem;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;
  box-shadow: 0 2px 0 rgba(25, 60, 95, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    background: var(--nav-hover-background);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 0 rgba(25, 60, 95, 0.3);
  }

  &[aria-pressed="true"] {
    transform: translateY(1px);
    box-shadow: 0 1px 0 rgba(25, 60, 95, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
    animation: ${rotate} 0.5s ease;
  }
`;

const ButtonText = styled.span`
  display: none;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    display: inline;
  }
`;

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonText = theme === 'light' ? 'тёмную тему' : 'светлую тему';
  const screenReaderText = `Переключить на ${buttonText}`;
  
  return (
    <ThemeButton 
      onClick={toggleTheme}
      aria-label={screenReaderText}
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      <ButtonText>{theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}</ButtonText>
    </ThemeButton>
  );
}; 