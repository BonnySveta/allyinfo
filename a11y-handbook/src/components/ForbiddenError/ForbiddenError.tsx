import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 50vh;
`;

const ErrorCode = styled.h1`
  font-size: 4rem;
  color: var(--accent-color);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.5rem;
  color: var(--text-color);
  margin: 1rem 0 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const LoginLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

export function ForbiddenError() {
  return (
    <Container>
      <ErrorCode>403</ErrorCode>
      <ErrorMessage>
        Доступ запрещен. У вас нет прав для просмотра этой страницы.
      </ErrorMessage>
      <LoginLink to="/login">Войти в систему</LoginLink>
    </Container>
  );
} 