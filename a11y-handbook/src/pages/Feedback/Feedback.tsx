import styled from 'styled-components';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';

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

const Description = styled.div`
  margin: 0 auto 2rem;
  color: var(--text-color);
  line-height: 1.6;

  p {
    margin-bottom: 1rem;
  }
`;

export function Feedback() {
  return (
    <PageContainer>
      <Title>Обратная связь</Title>
      <Description>
        <p>
          Мы внимательно читаем каждое сообщение и учитываем ваши пожелания при развитии проекта.
        </p>
      </Description>
      <FeedbackForm />
    </PageContainer>
  );
} 