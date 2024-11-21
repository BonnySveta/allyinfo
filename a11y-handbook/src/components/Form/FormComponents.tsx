import styled, { keyframes } from 'styled-components';

export const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: var(--text-color);
  font-weight: 500;
`;

export const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color, #0066cc);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--primary-hover-color, #0052a3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2);
  }

  &:disabled {
    background-color: var(--disabled-color, #cccccc);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

export const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const RequiredMark = styled.span`
  color: var(--error-color);
  margin-left: 4px;
`;

export const HintText = styled.span`
  color: var(--text-secondary-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const LabelText = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const RequiredFieldsHint = styled.p`
  color: var(--text-secondary-color);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: ${spin} 1s linear infinite;
  margin-left: 0.5rem;
`; 