import styled from 'styled-components';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { Link } from 'react-router-dom';

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export function GettingStarted() {
  return (
    <PageLayout title="Начинающим">
      <Section>
        <Text>
          Этот раздел находится в разработке. <br />
          Пожалуйста предложите ваши варианты материалов, которые могут быть полезны начинающим на странице <Link to="/feedback">Обратная связь</Link>.
        </Text>
      </Section>
    </PageLayout>
  );
} 