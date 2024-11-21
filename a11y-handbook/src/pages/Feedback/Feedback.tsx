import styled from 'styled-components';
import { FeedbackForm } from '../../components/FeedbackForm/FeedbackForm';

const PageContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const Description = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem;
  color: var(--text-color);
  line-height: 1.6;

  p {
    margin-bottom: 1rem;
  }

  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

export function Feedback() {
  return (
    <PageContainer>
      <Title>Обратная связь</Title>
      <Description>
        <p>
          Мы стремимся сделать справочник максимально полезным и удобным для всех пользователей. 
          Ваше мнение поможет нам улучшить проект.
        </p>
        <p>Вы можете написать нам о:</p>
        <ul>
          <li>Найденных ошибках или неточностях</li>
          <li>Предложениях по улучшению функционала</li>
          <li>Идеях для новых разделов</li>
          <li>Любых других вопросах, связанных со справочником</li>
        </ul>
        <p>
          Мы внимательно читаем каждое сообщение и учитываем ваши пожелания при развитии проекта.
        </p>
      </Description>
      <FeedbackForm />
    </PageContainer>
  );
} 