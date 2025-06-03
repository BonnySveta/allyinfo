import styled from 'styled-components';

export const PaymentMethodContainer = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  background: var(--card-background);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  overflow: visible;
`;

export const PaymentMethodTitle = styled.span`
  color: var(--text-color);
  margin-top: 1em;
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
  text-align: center;
`;

export const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const PaymentLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-color);
  border: 2px solid var(--accent-color);
  padding: 0.5rem 1rem;
  border-radius: 28px;
  text-decoration: none;
  font-weight: 500;
  min-width: 0;
  width: auto;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: var(--accent-color);
    color: #fff !important;
    border-color: var(--accent-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    color: #fff !important;
    background: var(--accent-color);
    border-color: var(--accent-color);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
    color: #fff !important;
    background: var(--accent-color);
    border-color: var(--accent-color);
  }
`;

export const QRCode = styled.img`
  width: 120px;
  height: 120px;
  padding: 0.5rem;
  background: white;
  border-radius: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`; 