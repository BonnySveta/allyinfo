import styled from 'styled-components';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { Link } from 'react-router-dom';

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  padding-left: 1.2em;
`;

const ListItem = styled.li`
  margin-bottom: 0.7em;
`;

export function GettingStarted() {
  return (
    <PageLayout title="Начинающим">
      <Section>
        <Text>
          Добро пожаловать! Если вы только начинаете знакомство с цифровой доступностью, начните с этих базовых материалов. Они помогут разобраться в основных понятиях, терминах и принципах доступности для всех пользователей.
        </Text>
        <SectionTitle>Базовые материалы по цифровой доступности</SectionTitle>
        <List>
          <ListItem>
            <a href="https://trends.rbc.ru/trends/social/63aa999c9a79471fb4e0c276" target="_blank" rel="noopener noreferrer">
            Полный доступ: что такое цифровая доступность и почему она нужна всем
            </a> — краткое введение и зачем это нужно.
          </ListItem>
          <ListItem>
            <a href="https://guides.kontur.ru/principles/accessibility/accessibility/" target="_blank" rel="noopener noreferrer">
              Принципы доступности
            </a> — виды ограничений и основные принципы.
          </ListItem>
        </List>
        <Text>
          Если у вас есть предложения по материалам для начинающих — напишите нам через страницу <Link to="/feedback">Обратная связь</Link>!
        </Text>
      </Section>
    </PageLayout>
  );
} 