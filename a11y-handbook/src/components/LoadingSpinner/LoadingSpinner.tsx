import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: var(--text-color);
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--nav-background);
  border-top: 4px solid var(--accent-color);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingSpinner = () => (
  <SpinnerWrapper>
    <Spinner role="status">
      <span className="sr-only">Загрузка...</span>
    </Spinner>
  </SpinnerWrapper>
); 