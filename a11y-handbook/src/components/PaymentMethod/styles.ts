import styled from 'styled-components';

export const PaymentMethodContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--background-secondary);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  overflow: visible;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const PaymentMethodTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  text-align: center;
`;

export const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

export const PaymentLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--accent-color);
  color: white !important;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  width: 330px;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: var(--accent-color-hover, #0056b3);
    color: white !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    color: white !important;
  }

  &:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
    color: white !important;
  }
`;

export const QRCode = styled.img`
  width: 220px;
  height: 220px;
  padding: 1rem;
  background: white;
  border-radius: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`; 