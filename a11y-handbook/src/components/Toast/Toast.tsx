import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background-color: ${({ $type }) => 
    $type === 'success' ? 'var(--success-color, #4caf50)' : 'var(--error-color, #f44336)'};
  color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.3s ease;
  z-index: 1000;
`;

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  // Автоматически закрываем через 3 секунды
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastContainer 
      $type={type} 
      role="alert" 
      aria-live="polite"
    >
      {message}
    </ToastContainer>
  );
} 