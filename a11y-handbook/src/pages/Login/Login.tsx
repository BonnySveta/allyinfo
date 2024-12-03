import { LoginForm } from '../../components/LoginForm/LoginForm';
import styled from 'styled-components';

const LoginContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

export function Login() {
  return (
    <LoginContainer>
      <Title>Вход в админ-панель</Title>
      <LoginForm />
    </LoginContainer>
  );
} 