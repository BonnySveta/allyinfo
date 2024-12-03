import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-left: 8px;
  vertical-align: middle;
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <Spinner aria-hidden="true" />
    </SpinnerContainer>
  );
} 