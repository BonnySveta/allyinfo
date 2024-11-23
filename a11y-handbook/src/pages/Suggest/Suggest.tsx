import styled from 'styled-components';
import { SuggestForm } from '../../components/SuggestForm/SuggestForm';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Title = styled.h1`
  color: var(--text-color);
  margin-bottom: 2rem;
`;

export function Suggest() {
  return (
    <PageContainer>
      <Title>Предложить материал</Title>
      <SuggestForm />
    </PageContainer>
  );
}