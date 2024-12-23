import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const Title = styled.h1`
  margin-bottom: 2rem;
  color: var(--text-color);
`;

export const Section = styled.section`
  margin-bottom: 3rem;
`;

export const SectionTitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 1rem;
`;

export const Text = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

export const StyledLink = styled(Link)`
  color: var(--accent-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

// ... остальные базовые стили ... 