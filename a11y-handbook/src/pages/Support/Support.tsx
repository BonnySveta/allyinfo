import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: var(--text-primary);
`;

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

const SupportButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    opacity: 0.9;
  }
`;

export function Support() {
  return (
    <Container>
      <Title>Поддержать проект</Title>
      
      <Section>
        <Text>
          ALLY WIKI — это некоммерческий проект, 
          который развивается силами сообщества. Мы собираем и систематизируем 
          материалы, чтобы сделать веб доступнее для всех.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Как вы можете помочь</SectionTitle>
        <Text>
          • Предложить полезный материал через форму на сайте<br />
          • Рассказать о проекте коллегам и друзьям<br />
          • Поддержать проект финансово
        </Text>
      </Section>

      <Section>
        <SectionTitle>Финансовая поддержка</SectionTitle>
        <Text>
          Ваша поддержка поможет нам развивать проект, добавлять новые 
          материалы и улучшать функциональность сайта.
        </Text>
        <SupportButton 
          href="https://boosty.to/your-project" 
          target="_blank"
          rel="noopener noreferrer"
        >
          <span role="img" aria-hidden="true">❤️</span>
          Поддержать на Boosty
        </SupportButton>
      </Section>
    </Container>
  );
} 